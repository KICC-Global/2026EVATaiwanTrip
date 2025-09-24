import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// Simple background removal: turns near-white pixels transparent
// Usage: npx ts-node scripts/remove-bg.ts <input> <output> [threshold]
// threshold: 0-255 (default 245) — higher removes more light pixels

const [, , inPathArg, outPathArg, thresholdArg] = process.argv;
if (!inPathArg || !outPathArg) {
  console.error('Usage: npx ts-node scripts/remove-bg.ts <input> <output> [threshold]');
  process.exit(1);
}

const inPath: string = path.resolve(inPathArg);
const outPath: string = path.resolve(outPathArg);
const THRESH: number = Math.max(0, Math.min(255, Number.isFinite(+thresholdArg) ? +thresholdArg : 245));

const buf: Buffer = fs.readFileSync(inPath);
const png: PNG = PNG.sync.read(buf);
const { data, width, height } = png;

// Convert near-white pixels (and near-white with light color cast) to transparent
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;
    const r = data[idx + 0];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (a === 0) continue;

    // Treat pixels as background if all channels are above threshold
    if (r >= THRESH && g >= THRESH && b >= THRESH) {
      data[idx + 3] = 0; // transparent
      continue;
    }

    // Optional: handle near-white with slight tint by checking brightness
    const brightness = (r + g + b) / 3;
    if (brightness >= THRESH + 5 && Math.max(r, g, b) - Math.min(r, g, b) < 12) {
      data[idx + 3] = 0;
    }
  }
}

const outBuf: Buffer = PNG.sync.write(png);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, outBuf);
console.log(`Wrote transparent PNG: ${outPath}`);
