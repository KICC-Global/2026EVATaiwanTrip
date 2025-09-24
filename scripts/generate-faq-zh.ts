import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { FaqItem } from '../types'; // Using relative path for robustness in scripts

const SRC: string = resolve('Doc', '2026_shs_taiwan_trip｜faq（english_台灣繁體中文）.md');
const OUT: string = resolve('lib', 'faq_from_doc_zh_tw.ts'); // Making name more specific

type FaqCategory = 'trip' | 'general';

function categorize(n: string): FaqCategory {
  const num = Number(n);
  return num >= 1 && num <= 6 ? 'trip' : 'general';
}

const text: string = readFileSync(SRC, 'utf8');
const lines: string[] = text.split(/\r?\n/);

const qReZh = /^\*\*Q(\d+)[^*]*\*\*[:：]\s*(.*)$/;
const aReZh = /^\*\*A(\d+)[^*]*\*\*[:：]\s*(.*)$/;

const zhMap = new Map<string, { q: string; a: string }>();

for (let i = 0; i < lines.length; i++) {
  const l: string = lines[i].trim();
  const qm: RegExpMatchArray | null = l.match(qReZh);
  if (qm) {
    const n: string = qm[1];
    const q: string = qm[2].trim();
    let a: string = '';
    for (let j = i + 1; j < Math.min(lines.length, i + 15); j++) {
      const am: RegExpMatchArray | null = lines[j].trim().match(aReZh);
      if (am && am[1] === n) {
        a = am[2].trim();
        break;
      }
    }
    zhMap.set(n, { q, a });
  }
}

const items: FaqItem[] = [];
for (let n = 1; n <= 29; n++) {
  const hit = zhMap.get(String(n));
  if (!hit) continue;
  const { q, a } = hit;
  if (!q || !a) continue;
  items.push({ q, a, category: categorize(String(n)) });
}

// The generated file will use the path alias, which is fine
const header = "import type { FaqItem } from '@/types';\n\n";
const body = `export const faqZhTwFromDoc: FaqItem[] = ${JSON.stringify(items, null, 2)} as const;\n`; // Renamed exported const

writeFileSync(OUT, header + body, 'utf8');
console.log(`Wrote ${items.length} zh-TW FAQ items to ${OUT}`);
