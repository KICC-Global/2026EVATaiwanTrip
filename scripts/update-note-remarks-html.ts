#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const txtPath: string = path.resolve('generated', 'note-remarks.en.txt');
const tsPath: string = path.resolve('lib', 'note_remarks_html.ts');

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeTemplate(s: string): string {
  return s
    .replace(/`/g, '\`')
    .replace(/\$\{/g, '\${');
}

function toHtmlParas(text: string): string {
  const paras: string[] = text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((s: string) => s.trim())
    .filter(Boolean);
  const html: string = paras.map((p: string) => `<p>${escapeHtml(p.replace(/\n/g, ' '))}</p>`).join('\n');
  return html;
}

function main(): void {
  if (!fs.existsSync(txtPath)) {
    console.error(`Missing extracted text at ${txtPath}. Run npm run extract:notes first.`);
    process.exit(1);
  }
  if (!fs.existsSync(tsPath)) {
    console.error(`Missing target TS at ${tsPath}`);
    process.exit(1);
  }
  const raw: string = fs.readFileSync(txtPath, 'utf8');
  const htmlInner: string = toHtmlParas(raw);
  const escaped: string = escapeTemplate(htmlInner);

  let ts: string = fs.readFileSync(tsPath, 'utf8');
  const re = /(en:\s*`)\s*[\s\S]*?(`\s*,)/m;
  if (!re.test(ts)) {
    console.error('Could not locate en: `...` block to replace.');
    process.exit(1);
  }
  ts = ts.replace(re, `$1\n${escaped}\n$2`);
  fs.writeFileSync(tsPath, ts, 'utf8');
  console.log('Updated lib/note_remarks_html.ts [en] with extracted HTML.');
}

main();
