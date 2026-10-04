import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { SolutionsShowcase } from '@/features/solutions/SolutionsShowcase';
import { getSolutionCards } from '@/features/solutions/solution-cards';

export function SolutionsSection() {
  return (
    <Section tone="dark" id="solutions" aria-labelledby="solutions-title" className="overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint mask-fade-radial opacity-60" />
      <Container>
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="solutions-title"
            tone="dark"
            eyebrow="Company Divisions"
            index="02"
            title={
              <>
                Specialist team. <em>Complete solutions.</em>
              </>
            }
            description="Each division is managed by a specialist team with expertise in its field. Together, we provide complete solutions to help businesses and properties stay secure, connected, powered and online."
          />
          <div data-reveal="fade" className="shrink-0">
            <ButtonLink href="/solutions" variant="outline-light" withArrow>
              All solutions
            </ButtonLink>
          </div>
        </div>
        <div data-reveal="up">
          <SolutionsShowcase items={getSolutionCards()} />
        </div>
      </Container>
    </Section>
  );
}
