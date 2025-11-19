import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const genPath = path.join(root, 'generated', 'html-content.ts');
const outDir = path.join(root, 'content');

function readFile(p) { return fs.readFileSync(p, 'utf8'); }

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
    .replace(/\n+/g, '\n')
    .trim();
}

function stripTags(s) {
  return s
    .replace(/<br\s*\/?>(\s*)/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .replace(/\u00A0/g, ' ')
    .trim();
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseBlocks(html, options={}) {
  // Extract signature lines block
  let signatureItems = [];
  const sigMatch = html.match(/<div[^>]*class=["'][^"']*signature-section[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (sigMatch) {
    const sigInner = sigMatch[1];
    const lire = /<div[^>]*class=["'][^"']*signature-line[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
    let m;
    while ((m = lire.exec(sigInner)) !== null) {
      const line = decodeEntities(stripTags(m[1]));
      if (line) signatureItems.push(line);
    }
    // remove the entire signature section from html
    html = html.replace(sigMatch[0], '');
  }
  // debug: show signature items count for visibility during conversion
  // console.log('signatureItems count:', signatureItems.length);

  // Extract footer block as list
  let footerItems = [];
  const footMatch = html.match(/<div[^>]*class=["'][^"']*footer[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (footMatch) {
    const footInner = footMatch[1]
      .replace(/<br\s*\/?>(\s*)/gi, '\n');
    const lines = decodeEntities(stripTags(footInner)).split(/\n+/).map(s => s.trim()).filter(Boolean);
    footerItems = lines;
    html = html.replace(footMatch[0], '');
  }

  // remove other wrapper divs
  html = html.replace(/<div[^>]*>/gi, '').replace(/<\/div>/gi, '');
  const blocks = [];
  let title = options.defaultTitle || '';

  // extract first h1 as title (if present)
  const h1re = /<h1[^>]*>([\s\S]*?)<\/h1>/i;
  const m = html.match(h1re);
  if (m) {
    title = decodeEntities(stripTags(m[1]));
    html = html.replace(h1re, '');
  }

  // Combined matcher to preserve order: h2, h3, h4, p, ul, ol
  const re = /<(h2|h3|h4|p|ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2];
    if (tag === 'p') {
      const text = decodeEntities(stripTags(inner));
      if (text) blocks.push({ type: 'paragraph', content: text });
    } else if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const text = decodeEntities(stripTags(inner));
      if (text) blocks.push({ type: 'heading', content: text });
    } else if (tag === 'ul' || tag === 'ol') {
      const items = [];
      const lire = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let mli;
      while ((mli = lire.exec(inner)) !== null) {
        const itemText = decodeEntities(stripTags(mli[1]));
        if (itemText) items.push(itemText);
      }
      if (items.length) blocks.push({ type: 'list', content: items });
    }
  }

  // Apply fallbacks if needed
  if (!signatureItems.length && options.signatureFallback && Array.isArray(options.signatureFallback)) {
    signatureItems = options.signatureFallback;
  }
  if (!footerItems.length && options.footerFallback && Array.isArray(options.footerFallback)) {
    footerItems = options.footerFallback;
  }

  // Append signature lines as paragraphs (no list)
  if (signatureItems.length) {
    signatureItems.forEach(line => blocks.push({ type: 'paragraph', content: line }));
  }

  // Append footer lines as paragraphs (no list)
  if (footerItems.length) {
    footerItems.forEach(line => blocks.push({ type: 'paragraph', content: line }));
  }

  // fallback: if nothing parsed at all, keep as single html block
  if (!blocks.length) {
    blocks.push({ type: 'html', content: html.trim() });
  }

  return { title, blocks };
}

function writeJson(filename, content) {
  const p = path.join(outDir, filename);
  fs.writeFileSync(p, JSON.stringify(content, null, 2), 'utf8');
  console.log('Wrote', filename, 'with', content.blocks.length, 'blocks');
}

const src = readFile(genPath);

// Agreement
const ag_en = sanitizeHtml(extractConst(src, 'agreement_en'));
const ag_zh_tw = sanitizeHtml(extractConst(src, 'agreement_zh_tw'));
const ag_zh_cn = sanitizeHtml(extractConst(src, 'agreement_zh_cn'));

writeJson('agreement.en.json', parseBlocks(ag_en, {
  defaultTitle: 'Agreement & Release',
  signatureFallback: [
    'Participant Name (Print): ____________________________',
    'Signature: ____________________________',
    'Date: _______',
    'Parent/Guardian Name (if applicable): ____________________________',
    'Signature: ____________________________',
    'Date: _______'
  ],
  footerFallback: [
    'KICC',
    'Office of Global Elite Program',
    '18031 Irvine Blvd Unit 209, Tustin CA 92780, USA',
    '1F., No.238, Sec. 2, Linghang N. Rd., Zhongli Dist., Taoyuan City 320014, Taiwan'
  ]
}));
writeJson('agreement.zh-TW.json', parseBlocks(ag_zh_tw, {
  defaultTitle: 'Agreement & Release',
  signatureFallback: [
    '參加者姓名（正楷）：____________________________',
    '簽名：____________________________',
    '日期：_______',
    '家長／監護人姓名（如適用）：____________________________',
    '簽名：____________________________',
    '日期：_______'
  ],
  footerFallback: [
    'KICC',
    '全球英才計畫辦公室',
    '18031 Irvine Blvd Unit 209, Tustin CA 92780, USA',
    '1F., No.238, Sec. 2, Linghang N. Rd., Zhongli Dist., Taoyuan City 320014, Taiwan'
  ]
}));

writeJson('agreement.zh-CN.json', parseBlocks(ag_zh_cn, {
  defaultTitle: 'Agreement & Release',
  signatureFallback: [
    '参与者姓名（正楷）：____________________________',
    '签名：____________________________',
    '日期：_______',
    '家长／监护人姓名（如适用）：____________________________',
    '签名：____________________________',
    '日期：_______'
  ],
  footerFallback: [
    'KICC',
    '全球英才项目办公室',
    '18031 Irvine Blvd Unit 209, Tustin CA 92780, USA',
    '1F., No.238, Sec. 2, Linghang N. Rd., Zhongli Dist., Taoyuan City 320014, Taiwan'
  ]
}));

// Notes & Remarks
const nt_en = sanitizeHtml(extractConst(src, 'notes_en'));
const nt_zh_tw = sanitizeHtml(extractConst(src, 'notes_zh_tw'));
const nt_zh_cn = sanitizeHtml(extractConst(src, 'notes_zh_cn'));

writeJson('noteRemarks.en.json', parseBlocks(nt_en, { defaultTitle: 'Notes & Remarks' }));
writeJson('noteRemarks.zh-TW.json', parseBlocks(nt_zh_tw, { defaultTitle: '注意事項與備註' }));
writeJson('noteRemarks.zh-CN.json', parseBlocks(nt_zh_cn, { defaultTitle: '注意事项与备注' }));

console.log('All done.');
