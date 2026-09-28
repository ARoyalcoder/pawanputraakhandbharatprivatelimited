import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AIImage } from '@/components/media/AIImage';
import { SolarLeadForm } from '@/components/forms/SolarLeadForm';
import { solarSystems } from '@/data/divisions';

export function SolarLeadSection() {
  return (
    <Section tone="light" id="solar" aria-labelledby="solar-title" className="overflow-hidden bg-gold-50">
      <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(244_201_93/0.45),transparent_65%)]" />
      <Container className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-7" data-reveal="up">
          <div className="rounded-panel bg-white p-6 shadow-lift sm:p-10">
            <p className="font-mono text-caption uppercase text-gold-700">Solar requirement</p>
            <h3 className="mb-8 mt-2 text-h3 text-navy-900">Start with your electricity bill</h3>
            <SolarLeadForm source="home-solar" />
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5">
          <SectionHeading
            id="solar-title"
            eyebrow="Pawan Putra Solar"
            title={
              <>
                Reduce your electricity bill <em>with solar.</em>
              </>
            }
            description="Share your monthly bill, property type and location. Our team works out the system that fits: on-grid, off-grid or hybrid."
          />
          <div data-reveal="mask" className="relative mt-9 aspect-[16/9] overflow-hidden rounded-card">
            <AIImage id="solar-overview" sizes="(min-width: 1024px) 35vw, 100vw" />
          </div>
          <ul className="mt-6 grid gap-3">
            {solarSystems.map((system) => (
              <li key={system.id} data-reveal="up" className="flex gap-4 rounded-xl border border-gold-600/15 bg-white/70 p-4">
                <span className="font-display text-h4 text-gold-600">{system.name}</span>
                <span className="text-small text-muted">{system.suitedFor}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.8rem] text-muted">
            Savings depend on your consumption and property, so we assess each requirement individually rather than quoting generic figures.
          </p>
        </div>
      </Container>
    </Section>
  );
}
