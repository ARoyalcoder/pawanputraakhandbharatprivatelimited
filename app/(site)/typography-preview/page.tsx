import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Section';
import { Display, Eyebrow, Text } from '@/components/ui/Typography';
import { Specimen } from '@/features/typography/Specimen';
import { TypeScale } from '@/features/typography/TypeScale';

export const metadata: Metadata = {
  title: 'Typography preview',
  robots: { index: false, follow: false },
};

/**
 * Development reference for the approved PPAB type system (docs/typography.md).
 * Hidden in production unless NEXT_PUBLIC_TYPOGRAPHY_PREVIEW=true.
 */
export default function TypographyPreviewPage() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_TYPOGRAPHY_PREVIEW !== 'true') notFound();

  return (
    <div className="bg-surface pb-24 pt-36">
      <Container>
        <Eyebrow>Development reference</Eyebrow>
        <Display tone="light" size="md" className="mt-5 text-navy-900">
          PPAB <em>typography</em>
        </Display>
        <Text size="lead" className="mt-4 max-w-2xl text-muted">
          Manrope for display and headings, Inter for reading and interface, Instrument Serif italic for gold accents and division
          taglines. Every sample below uses the production role utilities.
        </Text>

        <section aria-labelledby="scale-title" className="mt-16">
          <h2 id="scale-title" className="mb-6 type-h3 text-navy-900">
            Type scale
          </h2>
          <TypeScale />
        </section>

        <section aria-labelledby="specimen-title" className="mt-20">
          <h2 id="specimen-title" className="mb-6 type-h3 text-navy-900">
            Components in context
          </h2>
          <Specimen />
        </section>
      </Container>
    </div>
  );
}
