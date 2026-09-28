import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProcessTimeline } from '@/features/process/ProcessTimeline';
import { processSteps } from '@/data/company';

export function ProcessSection({ tone = 'white' }: { tone?: 'white' | 'darker' }) {
  const dark = tone === 'darker';
  return (
    <Section tone={tone} id="how-it-works" aria-labelledby="process-title">
      <Container>
        <SectionHeading
          id="process-title"
          tone={dark ? 'dark' : 'light'}
          eyebrow="How it works"
          index="05"
          align="center"
          title={
            <>
              From first call to <em>long-term support.</em>
            </>
          }
          description="A clear, six-step path, the same whether you need four cameras or a complete building."
          className="mb-14 lg:mb-20"
        />
        <ProcessTimeline steps={processSteps} tone={dark ? 'dark' : 'light'} />
      </Container>
    </Section>
  );
}
