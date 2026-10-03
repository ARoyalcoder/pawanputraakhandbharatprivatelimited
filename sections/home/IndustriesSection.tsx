import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IndustrySelector } from '@/features/industries/IndustrySelector';
import { getIndustryCards } from '@/features/industries/industry-cards';

export function IndustriesSection() {
  return (
    <Section tone="light" id="industries" aria-labelledby="industries-title">
      <Container>
        <SectionHeading
          id="industries-title"
          eyebrow="Industries"
          index="03"
          align="center"
          title={
            <>
              Built around <em>where you work.</em>
            </>
          }
          description="Homes, campuses, hospitals, offices, hotels, factories and shops each need a different mix. Choose a sector to see how PPAB's divisions come together for it."
          className="mb-8 lg:mb-10"
        />
        <div data-reveal="up">
          <IndustrySelector items={getIndustryCards()} />
        </div>
      </Container>
    </Section>
  );
}
