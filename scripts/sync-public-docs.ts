import fs from 'node:fs';
import path from 'node:path';

const DOC_DIR = path.resolve('Doc');
const PUBLIC_DOC_DIR = path.resolve('public', 'docs');

// Defines which files to sync from Doc/ to public/docs/
// Key: source filename in Doc/, Value: destination filename in public/docs/
const filesToSync = {
  '2026 The Meadows School  AGREEMENT AND RELEASE.pdf': '2026-The-Meadows-School-AGREEMENT-AND-RELEASE.pdf',
  '2026 The Meadows School Note Remarks.pdf': '2026-The-Meadows-School-Note-Remarks.pdf',
  '2026 Taiwan Trip - Registration Form & Payment Instructions.pdf': '2026-Taiwan-Trip-Registration-Form-Payment-Instructions.pdf',
};

function syncPublicDocs(): void {
  console.log('Syncing public documents from Doc/ directory...');

  if (!fs.existsSync(DOC_DIR)) {
    console.error(`Source directory not found: ${DOC_DIR}`);
    process.exit(1);
  }

  // Ensure the destination directory exists
  if (!fs.existsSync(PUBLIC_DOC_DIR)) {
    fs.mkdirSync(PUBLIC_DOC_DIR, { recursive: true });
    console.log(`Created destination directory: ${PUBLIC_DOC_DIR}`);
  }

  for (const [sourceName, destName] of Object.entries(filesToSync)) {
    const sourcePath = path.join(DOC_DIR, sourceName);
    const destPath = path.join(PUBLIC_DOC_DIR, destName);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`  Copied: ${sourceName} -> ${destName}`);
    } else {
      console.warn(`  Warning: Source file not found, skipped: ${sourceName}`);
    }
  }

  console.log('Document sync complete.');
}

syncPublicDocs();
