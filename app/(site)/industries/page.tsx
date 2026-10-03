import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { IndustryCard } from '@/features/industries/IndustryCard';
import { FinalCta } from '@/sections/shared/FinalCta';
import { industries } from '@/data/industries';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Industries We Serve',
  description:
    'Security, networking, solar, digital and infrastructure solutions for residential, education, healthcare, corporate, hospitality, manufacturing and commercial sectors.',
  path: '/industries',
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Industries', href: '/industries' },
        ]}
        eyebrow="Industries"
        title={
          <>
            The right mix <em>for every sector.</em>
          </>
        }
        description="A school, a hospital and a factory need very different things from the same five divisions. Explore how PPAB brings them together for your sector."
        size="compact"
      />
      <Section tone="light" aria-labelledby="industries-list-title">
        <Container>
          <h2 id="industries-list-title" className="sr-only">
            Industries we serve
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => (
              <li key={industry.id} data-reveal="up">
                <IndustryCard industry={industry} index={i} />
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center type-caption text-muted">Imagery on this page is illustrative.</p>
        </Container>
      </Section>
      <FinalCta source="industries-final" />
    </>
  );
}
