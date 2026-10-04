import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IndustrySelector } from '@/features/industries/IndustrySelector';
import { IndustrySectorsGrid } from '@/features/industries/IndustrySectorsGrid';
import { getIndustryCards } from '@/features/industries/industry-cards';

export function IndustriesSection() {
  return (
    <Section tone="light" id="industries" aria-labelledby="industries-title">
      <Container>
        <SectionHeading
          id="industries-title"
          eyebrow="Industries We Serve"
          index="03"
          align="center"
          title={
            <>
              <em>Where we work.</em>
            </>
          }
          className="mb-8 lg:mb-10"
        />
        <IndustrySectorsGrid />
        <div data-reveal="up">
          <IndustrySelector items={getIndustryCards()} />
        </div>
      </Container>
    </Section>
  );
}
