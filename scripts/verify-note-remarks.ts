#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import pdf from 'pdf-parse';

const pdfPath: string = path.resolve('Doc', '2026 SHS  Note Remarks.pdf');
const htmlTsPath: string = path.resolve('lib', 'note_remarks_html.ts');

async function main(): Promise<void> {
  // 1) Extract text from PDF (English source)
  if (!fs.existsSync(pdfPath)) {
    fail(`PDF not found at ${pdfPath}`);
  }
  const dataBuffer: Buffer = fs.readFileSync(pdfPath);
  const result = await pdf(dataBuffer);
  const pdfText: string = normalizeText(result.text || '');

  // 2) Load the in-site HTML (English)
  if (!fs.existsSync(htmlTsPath)) {
    fail(`HTML source file not found at ${htmlTsPath}`);
  }
  const ts: string = fs.readFileSync(htmlTsPath, 'utf8');
  const htmlEn: string = extractBacktickBlock(ts, /en:\s*`([\s\S]*?)`/);
  if (!htmlEn) fail('Could not locate English HTML block in lib/note_remarks_html.ts');

  const siteText: string = normalizeText(stripHtml(htmlEn));

  // 3) Compare (whitespace-insensitive)
  if (pdfText === '') fail('Extracted PDF text is empty');
  if (siteText === '') fail('Site HTML text (en) is empty');

  const equal: boolean = pdfText === siteText;
  if (equal) {
    console.log('SUCCESS: Site HTML (EN) matches the PDF text after normalization.');
    process.exit(0);
  }

  // Find first mismatch index
  const max: number = Math.min(pdfText.length, siteText.length);
  let idx = -1;
  for (let i = 0; i < max; i++) {
    if (pdfText[i] !== siteText[i]) { idx = i; break; }
  }
  const context = 60;
  const pdfSeg: string = snippet(pdfText, idx, context);
  const siteSeg: string = snippet(siteText, idx, context);

  console.error('MISMATCH: HTML does not exactly match PDF text.');
  console.error(`PDF length:  ${pdfText.length}`);
  console.error(`HTML length: ${siteText.length}`);
  if (idx >= 0) {
    console.error(`First diff at index ${idx}`);
    console.error('PDF  ->', pdfSeg);
    console.error('HTML ->', siteSeg);
  }
  process.exit(2);
}

function extractBacktickBlock(source: string, regex: RegExp): string {
  const m = source.match(regex);
  return m ? m[1] : '';
}

function stripHtml(html: string): string {
  // Remove tags
  let text = html.replace(/<[^>]*>/g, ' ');
  // Decode common entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text;
}

function normalizeText(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/[\u00A0\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function snippet(s: string, i: number, ctx: number): string {
  if (i < 0) return s.slice(0, Math.min(2*ctx, s.length));
  const start = Math.max(0, i - ctx);
  const end = Math.min(s.length, i + ctx);
  return s.slice(start, end);
}

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

main().catch((err: any) => {
  console.error(err);
  process.exit(1);
});
