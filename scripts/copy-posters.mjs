import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'C:\\Users\\PANKAJ SINGH\\.gemini\\antigravity\\brain\\5dbdd827-fa21-4cf1-b328-d5c737dc2cc3\\.user_uploaded';
const destDir = path.resolve(process.cwd(), 'public/images/posters');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = {
  'media_1790221920375.jpg': 'ppab-7-services-hero.jpg',
  'media_1790155183867.jpg': 'ppab-secure.jpg',
  'media_1790221932202.jpg': 'ppab-connect.jpg',
  'media_1790221939599.jpg': 'ppab-solar.jpg',
  'media_1790221949036.png': 'ppab-spaces.png',
  'media_1790221955926.png': 'ppab-digital.png',
};

for (const [srcName, destName] of Object.entries(fileMap)) {
  const src = path.join(srcDir, srcName);
  const dest = path.join(destDir, destName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${srcName} -> ${destName}`);
  } else {
    console.warn(`File not found: ${src}`);
  }
}
