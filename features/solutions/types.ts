import type { ResolvedAIImage } from '@/lib/media/ai-assets';
import type { DivisionId, IconName } from '@/types/content';

/** Plain, serialisable division data for client components. */
export interface SolutionCardData {
  id: DivisionId;
  index: string;
  name: string;
  short: string;
  tagline: string;
  summary: string;
  services: string[];
  href: string;
  accent: string;
  icon: IconName;
  image: ResolvedAIImage;
}
