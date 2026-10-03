import 'server-only';
import { divisions } from '@/data/divisions';
import { industries } from '@/data/industries';
import { resolveAIImage, type ResolvedAIImage } from './ai-assets';

/** Preview imagery for the desktop menus, keyed by the link each image belongs to. */
export type NavMedia = Record<string, ResolvedAIImage>;

/**
 * Resolved on the server so the menu never points at a file that is not on disk: entries
 * without a generated image fall back to their built-in illustration.
 */
export function getNavMedia(): NavMedia {
  return Object.fromEntries([
    ...divisions.map((d) => [d.href, resolveAIImage(d.imageId)] as const),
    ...industries.map((i) => [`/industries/${i.id}`, resolveAIImage(i.imageId)] as const),
  ]);
}
