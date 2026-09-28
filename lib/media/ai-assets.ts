import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { aiImages, type AIImageEntry } from '@/content/image-prompts';

export interface ResolvedAIImage {
  id: string;
  alt: string;
  width: number;
  height: number;
  /** Public URL when the generated file exists on disk; otherwise the concept art is used. */
  src: string | null;
  fallbackArt: AIImageEntry['fallbackArt'];
  illustrative: true;
}

const publicDir = path.join(process.cwd(), 'public', 'images', 'ai');
const cache = new Map<string, ResolvedAIImage>();

/**
 * Resolve an AI concept image by id. Runs on the server only (build or request time), so
 * adding a generated file to public/images/ai switches the site from illustration to image.
 */
export function resolveAIImage(id: string): ResolvedAIImage {
  const cached = cache.get(id);
  if (cached) return cached;

  const entry = aiImages.find((image) => image.id === id);
  if (!entry) {
    throw new Error(`Unknown AI image id "${id}". Add it to content/image-prompts.ts.`);
  }

  const exists = fs.existsSync(path.join(publicDir, entry.filename));
  const resolved: ResolvedAIImage = {
    id: entry.id,
    alt: entry.alt,
    width: entry.width,
    height: entry.height,
    src: exists ? `/images/ai/${entry.filename}` : null,
    fallbackArt: entry.fallbackArt,
    illustrative: true,
  };

  if (process.env.NODE_ENV === 'production') cache.set(id, resolved);
  return resolved;
}
