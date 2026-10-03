import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { JsonLd } from '@/components/seo/JsonLd';
import { AIImage } from '@/components/media/AIImage';
import { SolarLeadForm } from '@/components/forms/SolarLeadForm';
import { ServiceGrid } from '@/features/solutions/ServiceGrid';
import { SolutionFaq } from '@/features/solutions/SolutionFaq';
import { SolutionLead } from '@/features/solutions/SolutionLead';
import { EnergyFlow } from '@/features/solutions/solar/EnergyFlow';
import { ProcessTimeline } from '@/features/process/ProcessTimeline';
import { FinalCta } from '@/sections/shared/FinalCta';
import { divisionAccent, solar, solarBenefits, solarSegments, solarSystems } from '@/data/divisions';
import { buildMetadata } from '@/lib/seo/metadata';
import { serviceSchema } from '@/lib/seo/schema';
import { whatsappHref } from '@/lib/contact';
import type { NumberedPoint } from '@/types/content';

export const metadata: Metadata = buildMetadata({ ...solar.seo, path: solar.href });

const accent = divisionAccent.solar.hex;

const installation: NumberedPoint[] = [
  { id: 'assess', index: '01', title: 'Requirement', description: 'Your bill, property and usage tell us what size and type of system to consider.', icon: 'meter' },
  { id: 'survey', index: '02', title: 'Site survey', description: 'We check the roof or ground area, orientation and where equipment will go.', icon: 'map-pin' },
  { id: 'design', index: '03', title: 'System & quotation', description: 'On-grid, off-grid or hybrid, with panels, inverter and battery as needed.', icon: 'clipboard' },
  { id: 'install', index: '04', title: 'Installation', description: 'Mounting, panels, inverter, wiring and batteries installed by our team.', icon: 'wrench' },
  { id: 'metering', index: '05', title: 'Net metering', description: 'Support with the net metering process for grid-connected systems.', icon: 'on-grid' },
  { id: 'care', index: '06', title: 'Cleaning & AMC', description: 'Panel cleaning and annual maintenance options after commissioning.', icon: 'cleaning' },
];

export default function SolarPage() {
  return (
    <>
      <JsonLd data={serviceSchema(solar)} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: solar.short, href: solar.href },
        ]}
        eyebrow={solar.name}
        accent={accent}
        title={
          <>
            Suraj Ki Shakti, <em>Aapki Bachat.</em>
          </>
        }
        description={solar.summary}
        actions={
          <>
            <ButtonLink href="#consultation" size="lg" withArrow>
              Calculate My Solar Requirement
            </ButtonLink>
            <ButtonLink href={whatsappHref('Hello PPAB, I want to know about solar for my property.')} size="lg" variant="outline-light" icon={<WhatsAppIcon size={18} className="text-gold-300" />}>
              WhatsApp Us
            </ButtonLink>
          </>
        }
        visual={
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-white/10">
            <AIImage id="solar-overview" priority sizes="(min-width: 1024px) 45vw, 100vw" />
            <CornerFrame inset={16} className="text-solar/70" />
          </div>
        }
      />

      {/* Segments */}
      <Section tone="white" aria-labelledby="solar-segments">
        <Container>
          <SectionHeading
            id="solar-segments"
            eyebrow="Who it's for"
            title={
              <>
                Solar for homes, businesses <em>and industry.</em>
              </>
            }
            description={solar.overview}
            className="mb-12"
          />
          <ul className="grid gap-5 lg:grid-cols-3">
            {solarSegments.map((segment) => (
              <li key={segment.id} id={segment.id} data-reveal="up" className="scroll-mt-32 rounded-panel border border-line bg-surface p-7 sm:p-8">
                <span className="grid size-12 place-items-center rounded-xl bg-solar/15 text-navy-900">
                  <Icon name={segment.icon} size={22} />
                </span>
                <h3 className="mt-6 type-h3 text-navy-900">{segment.name}</h3>
                <p className="mt-2 type-body text-muted">{segment.description}</p>
                <ul className="mt-6 space-y-2">
                  {segment.fits.map((fit) => (
                    <li key={fit} className="flex items-center gap-2.5 text-small text-ink-soft">
                      <Check aria-hidden="true" className="size-4 text-solar" />
                      {fit}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* System types */}
      <Section tone="light" id="system-types" aria-labelledby="system-types-title" className="bg-gold-50">
        <Container>
          <SectionHeading
            id="system-types-title"
            eyebrow="System types"
            title={
              <>
                On-grid, off-grid <em>or hybrid?</em>
              </>
            }
            description="Choose a system to see how energy flows from your panels to your property, the grid and batteries."
            className="mb-12"
          />
          <div data-reveal="up">
            <EnergyFlow systems={solarSystems} />
          </div>
        </Container>
      </Section>

      {/* Products & services */}
      <Section tone="white" aria-labelledby="solar-products">
        <Container>
          <SectionHeading
            id="solar-products"
            eyebrow="Products & services"
            title={
              <>
                Everything a solar system <em>needs.</em>
              </>
            }
            className="mb-12"
          />
          <ServiceGrid services={solar.services} accent={accent} columns={4} />
        </Container>
      </Section>

      {/* Installation */}
      <Section tone="darker" aria-labelledby="solar-installation">
        <Container>
          <SectionHeading
            id="solar-installation"
            tone="dark"
            eyebrow="Installation"
            align="center"
            title={
              <>
                From your bill <em>to a working system.</em>
              </>
            }
            className="mb-14 lg:mb-20"
          />
          <ProcessTimeline steps={installation} tone="dark" />
        </Container>
      </Section>

      {/* Benefits */}
      <Section tone="light" aria-labelledby="solar-benefits">
        <Container>
          <SectionHeading
            id="solar-benefits"
            eyebrow="Benefits"
            title={
              <>
                Why property owners <em>choose solar.</em>
              </>
            }
            description="Every property is different, so we assess your requirement individually rather than promising generic savings figures."
            className="mb-12"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solarBenefits.map((benefit) => (
              <li key={benefit.id} data-reveal="up" className="rounded-card bg-white p-6 shadow-card">
                <Icon name={benefit.icon} size={24} className="text-solar" />
                <h3 className="mt-5 type-h4 text-navy-900">{benefit.title}</h3>
                <p className="mt-2 text-small text-muted">{benefit.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <SolutionFaq division={solar} />
      <SolutionLead
        id="consultation"
        eyebrow="Solar consultation"
        title={
          <>
            Reduce your electricity bill <em>with solar.</em>
          </>
        }
        description="Share your monthly bill, property type and location. Our team works out the right system and calls you back."
        points={['Requirement assessed from your actual bill', 'On-grid, off-grid or hybrid recommendation', 'Installation and net metering support', 'Cleaning and AMC available']}
        formTitle="Start with your electricity bill"
        form={<SolarLeadForm source="solar-page" />}
      />
      <FinalCta division="solar" source="solar-final" />
    </>
  );
}
