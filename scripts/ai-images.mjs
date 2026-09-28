/**
 * Lists the AI concept images the site expects, and which ones are still missing.
 *
 * Usage:
 *   node scripts/ai-images.mjs            # table of all images and their status
 *   node scripts/ai-images.mjs --missing  # JSON of missing images with prompts, ready for an image tool
 *
 * Generate each image with any image model, export it at (or above) the listed size as
 * WebP, and save it to public/images/ai/<filename>. The site switches from its built-in
 * illustration to the image automatically on the next build.
 *
 * Every image is an ILLUSTRATIVE concept. Never use these files for project pages.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { aiImages } from '../content/image-prompts.ts';

const root = path.join(process.cwd(), 'public', 'images', 'ai');
const rows = aiImages.map((image) => ({ ...image, present: existsSync(path.join(root, image.filename)) }));

if (process.argv.includes('--missing')) {
  const missing = rows
    .filter((r) => !r.present)
    .map(({ id, filename, width, height, prompt, alt }) => ({ id, output: `public/images/ai/${filename}`, width, height, prompt, alt }));
  console.log(JSON.stringify(missing, null, 2));
} else {
  for (const r of rows) console.log(`${r.present ? '✓' : '·'} ${r.id.padEnd(24)} ${r.width}×${r.height}  public/images/ai/${r.filename}`);
  const done = rows.filter((r) => r.present).length;
  console.log(`\n${done}/${rows.length} generated. Missing images use the built-in concept illustrations.`);
}
