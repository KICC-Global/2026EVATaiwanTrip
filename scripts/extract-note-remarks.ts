#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import pdf from 'pdf-parse';

const pdfPath: string = path.resolve('Doc', '2026 SHS  Note Remarks.pdf');
const outDir: string = path.resolve('generated');

async function main(): Promise<void> {
  if (!fs.existsSync(pdfPath)) {
    console.error(`PDF not found at: ${pdfPath}`);
    process.exit(1);
  }
  const dataBuffer: Buffer = fs.readFileSync(pdfPath);
  const result = await pdf(dataBuffer);
  const text: string = result.text || '';

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Save raw text
  const txtOut: string = path.join(outDir, 'note-remarks.en.txt');
  fs.writeFileSync(txtOut, text, 'utf8');

  // Naive HTML conversion: split paragraphs by blank lines
  const paras: string[] = text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((s: string) => s.trim())
    .filter(Boolean);

  const htmlBody: string = paras
    .map((p: string) => `<p>${escapeHtml(p.replace(/\n/g, ' '))}</p>`) // collapse linewraps
    .join('\n');

  const htmlDoc = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>Notes & Remarks (Extracted)</title></head><body>\n${htmlBody}\n</body></html>`;
  const htmlOut: string = path.join(outDir, 'note-remarks.en.html');
  fs.writeFileSync(htmlOut, htmlDoc, 'utf8');

  console.log('Extraction complete.');
  console.log('Text:', txtOut);
  console.log('HTML:', htmlOut);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

main().catch((err: any) => {
  console.error(err);
  process.exit(1);
});
