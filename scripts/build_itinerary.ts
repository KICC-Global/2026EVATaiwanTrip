/*
  Build Day1-9 itinerary details from Doc markdown files into JSON.
  - Converts Markdown to simple HTML (headings, lists, bold/italic, paragraphs)
  - For UI alignment: Docs Day1..Day7 map to UI Day3..Day9 (Day1=Departure, Day2=In-flight)
  - Ensures each language has keys "1".."9" (string) present; empty string for days without doc content
  - Output: generated/itinerary_by_lang.json
*/
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

type LangKey = 'en' | 'zh-TW' | 'zh-CN';

function loadDoc(path: string): string {
  const full = resolve(path);
  return readFileSync(full, 'utf8');
}

function mdToHtml(md: string): string {
  // Very lightweight Markdown -> HTML for headings, lists, bold/italic, paragraphs
  let s = md.replace(/\r\n?/g, '\n');
  // Drop top-level title
  s = s.replace(/^#\s+.*$/gm, '').trim();
  // Remove leading '---' separators
  s = s.replace(/^---+\s*$/gm, '');

  const lines = s.split('\n');
  const out: string[] = [];
  let inUl = false;
  let para: string[] = [];

  function flushPara() {
    if (para.length) {
      const text = para.join(' ').trim();
      if (text) out.push(`<p>${inline(text)}</p>`);
      para = [];
    }
  }

  function inline(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      if (inUl) {
        // Keep blank lines inside list as breaks in last <li>
        continue;
      }
      flushPara();
      continue;
    }

    // Headings
    if (/^###\s+/.test(line)) {
      flushPara();
      if (inUl) { out.push('</ul>'); inUl = false; }
      out.push(`<h3>${inline(line.replace(/^###\s+/, ''))}</h3>`);
      continue;
    }
    if (/^##\s+/.test(line)) {
      flushPara();
      if (inUl) { out.push('</ul>'); inUl = false; }
      out.push(`<h2>${inline(line.replace(/^##\s+/, ''))}</h2>`);
      continue;
    }

    // List item
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara();
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ''))}</li>`);
      continue;
    }

    // Normal text -> paragraph accumulation
    para.push(line.trim());
  }

  flushPara();
  if (inUl) out.push('</ul>');

  return out.join('\n');
}

function extractDocDays(md: string): string[] {
  // Find H2 headings that look like day headers:
  // - English: "## Day N ..."
  // - Chinese: lines containing both "第" and "天" (e.g., "## 第N天 ...")
  const indices: number[] = [];
  const linesRegex = /^##[^\n]*$/gm;
  let match: RegExpExecArray | null;
  while ((match = linesRegex.exec(md)) !== null) {
    const line = match[0];
    const isDay = /\bDay\s+\d+\b/.test(line) || (line.includes('第') && line.includes('天'));
    if (isDay) {
      indices.push(match.index);
    }
  }
  if (!indices.length) return [];

  const sections: string[] = [];
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i];
    const end = i + 1 < indices.length ? indices[i + 1] : md.length;
    const section = md.slice(start, end);
    const body = section.replace(/^##[^\n]*\n?/, '');
    sections.push(mdToHtml(body));
  }
  return sections;
}

function buildNineDayMapFromDoc(md: string): Record<string, string> {
  // Initialize keys "1".."9" to empty strings
  const out: Record<string, string> = {};
  for (let d = 1; d <= 9; d++) out[String(d)] = '';

  // Docs usually cover 7 activity days -> map to UI Day3..Day9
  const days = extractDocDays(md);
  const take = Math.min(7, days.length);
  for (let i = 0; i < take; i++) {
    const uiDay = i + 3; // shift by +2: doc Day1 -> UI Day3
    out[String(uiDay)] = days[i];
  }
  return out;
}

function build() {
  const enMd = loadDoc('Doc/taiwan-lunar-new-year-english.md');
  const twMd = loadDoc('Doc/taiwan-lunar-new-year-traditional-chinese.md');
  const cnMd = loadDoc('Doc/taiwan-lunar-new-year-itinerary.md');

  const result: Record<LangKey, Record<string, string>> = {
    en: buildNineDayMapFromDoc(enMd),
    'zh-TW': buildNineDayMapFromDoc(twMd),
    'zh-CN': buildNineDayMapFromDoc(cnMd),
  };

  // Ensure output folder exists
  mkdirSync('generated', { recursive: true });
  writeFileSync(
    resolve('generated/itinerary_by_lang.json'),
    JSON.stringify(result, null, 2),
    'utf8'
  );
}

build();

