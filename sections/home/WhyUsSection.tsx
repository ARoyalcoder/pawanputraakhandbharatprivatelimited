import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { QuoteButton } from '@/components/forms/QuoteButton';
import { WhyUsList } from '@/features/why-us/WhyUsList';
import { whyUs } from '@/data/company';

export function WhyUsSection() {
  return (
    <Section tone="darker" id="why-us" aria-labelledby="why-title">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_15%_20%,rgb(216_166_42/0.12),transparent)]" />
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              id="why-title"
              tone="dark"
              eyebrow="Why PPAB"
              index="04"
              title={
                <>
                  One partner. <em>Fewer handovers.</em> Better outcomes.
                </>
              }
              description="When one team understands your whole requirement, nothing falls between vendors. Here is what that means in practice."
            />
            <div data-reveal="fade" className="mt-9">
              <QuoteButton withArrow source="why-us">
                Get Free Consultation
              </QuoteButton>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <WhyUsList items={whyUs} />
        </div>
      </Container>
    </Section>
  );
}
