import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import * as OpenCC from 'opencc-js';

// Usage: npx ts-node scripts/convert-tw-to-cn.ts <file1> [file2 ...]
// Converts Traditional Chinese in given files to Simplified Chinese in-place.

const files: string[] = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: npx ts-node scripts/convert-tw-to-cn.ts <file1> [file2 ...]');
  process.exit(1);
}

const convert: (text: string) => string = OpenCC.Converter({ from: 'tw', to: 'cn' });

for (const f of files) {
  const p: string = path.resolve(f);
  const src: string = fs.readFileSync(p, 'utf8');
  const out: string = convert(src);
  if (out !== src) {
    fs.writeFileSync(p, out, 'utf8');
    console.log(`Converted (TW→CN): ${f}`);
  } else {
    console.log(`No changes: ${f}`);
  }
}
