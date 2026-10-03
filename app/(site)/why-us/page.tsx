import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { QuoteButton } from '@/components/forms/QuoteButton';
import { WhyUsList } from '@/features/why-us/WhyUsList';
import { ProcessSection } from '@/sections/home/ProcessSection';
import { whyUs } from '@/data/company';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Why Choose PPAB',
  description:
    'One partner for multiple solutions, professional execution, a transparent process, after-sales support and solutions that scale.',
  path: '/why-us',
});

export default function WhyUsPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Why Us', href: '/why-us' },
        ]}
        eyebrow="Why PPAB"
        title={
          <>
            One partner. <em>Fewer handovers.</em> Better outcomes.
          </>
        }
        description="When the team that plans your cameras also plans the network, the power and the software, nothing falls between vendors."
        actions={
          <QuoteButton size="lg" withArrow source="why-us-hero">
            Get Free Consultation
          </QuoteButton>
        }
        size="compact"
      />
      <Section tone="darker" aria-labelledby="pillars-title">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                id="pillars-title"
                tone="dark"
                eyebrow="What we stand for"
                title={
                  <>
                    Five reasons, <em>in practice.</em>
                  </>
                }
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <WhyUsList items={whyUs} />
          </div>
        </Container>
      </Section>
      <ProcessSection />
    </>
  );
}
