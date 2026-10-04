import type { ResolvedAIImage } from '@/lib/media/ai-assets';
import type { DivisionId, IconName, IndustryId } from '@/types/content';

export interface IndustryCardData {
  id: IndustryId;
  index: string;
  name: string;
  icon: IconName;
  audience: string;
  headline: string;
  summary: string;
  tagline?: string;
  needs: string[];
  solutions: { division: DivisionId; divisionName: string; href: string; accent: string; services: string[] }[];
  href: string;
  image: ResolvedAIImage;
}
