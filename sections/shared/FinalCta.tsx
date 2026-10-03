import type { DivisionId } from '@/types/content';

export interface FinalCtaProps {
  title?: React.ReactNode;
  description?: string;
  division?: DivisionId;
  source?: string;
}

/**
 * Legacy closing call-to-action.
 * The website now uses the high-conversion pre-footer CTA banner inside SiteFooter.
 */
export function FinalCta(_props: FinalCtaProps) {
  return null;
}
