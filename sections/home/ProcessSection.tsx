import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProcessTimeline } from '@/features/process/ProcessTimeline';
import { processSteps } from '@/data/company';
import { cn } from '@/lib/utils';

export function ProcessSection({ tone = 'white' }: { tone?: 'white' | 'darker' }) {
  const dark = tone === 'darker';
  return (
    <Section tone={tone} id="how-it-works" aria-labelledby="process-title">
      <Container>
        <SectionHeading
          id="process-title"
          tone={dark ? 'dark' : 'light'}
          eyebrow="How It Works"
          index="05"
          align="center"
          title={
            <>
              A Simple, Transparent <em>6-Step Process.</em>
            </>
          }
          description="Whether you need a few CCTV cameras or a complete building solution, PPAB follows a clear and straightforward process from the first conversation to ongoing support."
          className="mb-14 lg:mb-20"
        />
        <ProcessTimeline steps={processSteps} tone={dark ? 'dark' : 'light'} />
        <div data-reveal="fade" className="mt-12 text-center">
          <p className={cn('font-mono text-xs uppercase tracking-widest font-semibold', dark ? 'text-gold-400' : 'text-gold-700')}>
            From Requirement to Support — One Clear Process.
          </p>
        </div>
      </Container>
    </Section>
  );
}
