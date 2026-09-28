import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqSchema } from '@/lib/seo/schema';
import type { Division } from '@/types/content';

export function SolutionFaq({ division }: { division: Division }) {
  return (
    <Section tone="white" aria-labelledby={`${division.id}-faq`}>
      <JsonLd data={faqSchema(division.faqs)} />
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <SectionHeading
          id={`${division.id}-faq`}
          eyebrow="FAQ"
          title={
            <>
              {division.short} <em>questions.</em>
            </>
          }
          className="lg:col-span-4"
        />
        <div data-reveal="up" className="lg:col-span-8">
          <Accordion items={division.faqs} defaultOpenId={division.faqs[0]?.id} />
        </div>
      </Container>
    </Section>
  );
}
