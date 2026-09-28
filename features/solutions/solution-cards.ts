import 'server-only';
import { divisions, divisionAccent } from '@/data/divisions';
import { resolveAIImage } from '@/lib/media/ai-assets';
import type { SolutionCardData } from './types';

/** Division card data with AI imagery resolved on the server. */
export function getSolutionCards(): SolutionCardData[] {
  return divisions.map((d, i) => ({
    id: d.id,
    index: String(i + 1).padStart(2, '0'),
    name: d.name,
    short: d.short,
    tagline: d.tagline,
    summary: d.summary,
    services: d.services.slice(0, 5).map((s) => s.name),
    href: d.href,
    accent: divisionAccent[d.id].hex,
    icon: d.icon,
    image: resolveAIImage(d.imageId),
  }));
}
