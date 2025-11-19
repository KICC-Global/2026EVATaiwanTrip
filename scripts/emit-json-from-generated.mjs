import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const genPath = path.join(root, 'generated', 'html-content.ts');
const outDir = path.join(root, 'content');

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function extractConst(source, name) {
  const re = new RegExp(`export const\\s+${name}\\s*=\\s*` + '`' + `([\\s\\S]*?)` + '`' + `;`, 'm');
  const m = source.match(re);
  if (!m) throw new Error(`Cannot find constant ${name}`);
  return m[1];
}

function sanitizeHtml(html) {
  return html
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/?(html|head|body)[^>]*>/gi, '')
    .trim();
}

function writeJson(filename, title, html) {
  const obj = {
    title,
    blocks: [
      { type: 'html', content: html }
    ]
  };
  const p = path.join(outDir, filename);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
  console.log('Wrote', filename);
}

const src = readFile(genPath);

// Agreement
const ag_en = sanitizeHtml(extractConst(src, 'agreement_en'));
const ag_zh_tw = sanitizeHtml(extractConst(src, 'agreement_zh_tw'));
const ag_zh_cn = sanitizeHtml(extractConst(src, 'agreement_zh_cn'));

writeJson('agreement.en.json', 'Agreement & Release', ag_en);
writeJson('agreement.zh-TW.json', 'Agreement & Release', ag_zh_tw);
writeJson('agreement.zh-CN.json', 'Agreement & Release', ag_zh_cn);

// Notes & Remarks
const nt_en = sanitizeHtml(extractConst(src, 'notes_en'));
const nt_zh_tw = sanitizeHtml(extractConst(src, 'notes_zh_tw'));
const nt_zh_cn = sanitizeHtml(extractConst(src, 'notes_zh_cn'));

writeJson('noteRemarks.en.json', 'Notes & Remarks', nt_en);
writeJson('noteRemarks.zh-TW.json', '注意事項與備註', nt_zh_tw);
writeJson('noteRemarks.zh-CN.json', '注意事项与备注', nt_zh_cn);

console.log('All done.');

