import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { JsonLd } from '@/components/seo/JsonLd';
import { AIImage } from '@/components/media/AIImage';
import { DigitalLeadForm } from '@/components/forms/DigitalLeadForm';
import { ServiceGrid } from '@/features/solutions/ServiceGrid';
import { SolutionOverview } from '@/features/solutions/SolutionOverview';
import { SolutionFaq } from '@/features/solutions/SolutionFaq';
import { SolutionLead } from '@/features/solutions/SolutionLead';
import { DigitalEcosystem } from '@/features/solutions/digital/DigitalEcosystem';
import { FinalCta } from '@/sections/shared/FinalCta';
import { digital, digitalClusters, divisionAccent } from '@/data/divisions';
import { buildMetadata } from '@/lib/seo/metadata';
import { serviceSchema } from '@/lib/seo/schema';
import { whatsappHref } from '@/lib/contact';

export const metadata: Metadata = buildMetadata({ ...digital.seo, path: digital.href });

const accent = divisionAccent.digital.hex;

export default function DigitalPage() {
  return (
    <>
      <JsonLd data={serviceSchema(digital)} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: digital.short, href: digital.href },
        ]}
        eyebrow={digital.name}
        accent={accent}
        title={
          <>
            Har Business Ki <em>Digital Pehchaan.</em>
          </>
        }
        description={digital.summary}
        actions={
          <>
            <ButtonLink href="#project" size="lg" withArrow>
              Discuss Your Project
            </ButtonLink>
            <ButtonLink href={whatsappHref('Hello PPAB, I want to discuss a digital project.')} size="lg" variant="outline-light" icon={<WhatsAppIcon size={18} className="text-gold-300" />}>
              WhatsApp Us
            </ButtonLink>
          </>
        }
        visual={
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-white/10">
            <AIImage id="digital-overview" priority sizes="(min-width: 1024px) 45vw, 100vw" />
            <CornerFrame inset={16} className="text-digital/70" />
          </div>
        }
      />

      <Section tone="darker" aria-labelledby="ecosystem-title" className="overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_70%_50%,rgb(140_115_247/0.16),transparent)]" />
        <Container>
          <SectionHeading
            id="ecosystem-title"
            tone="dark"
            eyebrow="The digital ecosystem"
            title={
              <>
                Build, operate, grow <em>and brand.</em>
              </>
            }
            description="Your website, apps, business software and marketing work best when they are planned together. Pick a group to see how the pieces connect."
            className="mb-12 lg:mb-16"
          />
          <div data-reveal="up">
            <DigitalEcosystem clusters={digitalClusters} services={digital.services} />
          </div>
        </Container>
      </Section>

      <SolutionOverview division={digital} accent={accent} />

      <Section tone="white" aria-labelledby="digital-services">
        <Container>
          <SectionHeading
            id="digital-services"
            eyebrow="Services"
            title={
              <>
                All you need, <em>under one roof.</em>
              </>
            }
            className="mb-12"
          />
          <ServiceGrid services={digital.services} accent={accent} columns={4} />
        </Container>
      </Section>

      <SolutionFaq division={digital} />
      <SolutionLead
        id="project"
        eyebrow="Start a project"
        title={
          <>
            Take your business <em>digital.</em>
          </>
        }
        description="Website, app, software, ERP, CRM and digital marketing solutions designed around your business."
        points={['Scope discussed before any recommendation', 'Design, development and launch', 'SEO, ads and social media after launch', 'Maintenance and support available']}
        formTitle="Tell us about your project"
        form={<DigitalLeadForm source="digital-page" />}
      />
      <FinalCta division="digital" source="digital-final" />
    </>
  );
}
