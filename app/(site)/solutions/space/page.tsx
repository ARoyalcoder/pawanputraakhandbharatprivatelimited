import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { JsonLd } from '@/components/seo/JsonLd';
import { AIImage } from '@/components/media/AIImage';
import { SpaceLeadForm } from '@/components/forms/SpaceLeadForm';
import { ServiceGrid } from '@/features/solutions/ServiceGrid';
import { SolutionOverview } from '@/features/solutions/SolutionOverview';
import { SolutionFaq } from '@/features/solutions/SolutionFaq';
import { SolutionLead } from '@/features/solutions/SolutionLead';
import { SpaceJourney } from '@/features/solutions/space/SpaceJourney';
import { FinalCta } from '@/sections/shared/FinalCta';
import { divisionAccent, space, spaceJourney } from '@/data/divisions';
import { buildMetadata } from '@/lib/seo/metadata';
import { serviceSchema } from '@/lib/seo/schema';
import { whatsappHref } from '@/lib/contact';

export const metadata: Metadata = buildMetadata({ ...space.seo, path: space.href });

const accent = divisionAccent.space.hex;

export default function SpacePage() {
  return (
    <>
      <JsonLd data={serviceSchema(space)} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: space.short, href: space.href },
        ]}
        eyebrow={space.name}
        accent={accent}
        title={
          <>
            Har Space Ka <em>Bharosa.</em>
          </>
        }
        description={space.summary}
        actions={
          <>
            <ButtonLink href="#enquiry" size="lg" withArrow>
              Talk to Our Space Team
            </ButtonLink>
            <ButtonLink href={whatsappHref('Hello PPAB, I have a property / construction requirement.')} size="lg" variant="outline-light" icon={<WhatsAppIcon size={18} className="text-gold-300" />}>
              WhatsApp Us
            </ButtonLink>
          </>
        }
        visual={
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-white/10">
            <AIImage id="space-overview" priority sizes="(min-width: 1024px) 45vw, 100vw" />
            <CornerFrame inset={16} className="text-space/70" />
          </div>
        }
      />

      <Section tone="darker" aria-labelledby="journey-title" className="overflow-hidden">
        <Container>
          <SectionHeading
            id="journey-title"
            tone="dark"
            eyebrow="From plot to finished space"
            title={
              <>
                One partner for <em>every stage.</em>
              </>
            }
            description="Most property projects pass between several firms. With Pawan Putra Space, land, design, construction and interiors stay with one team."
            className="mb-12"
          />
          <div data-reveal="up">
            <SpaceJourney stages={spaceJourney} />
          </div>
        </Container>
      </Section>

      <SolutionOverview division={space} accent={accent} />

      <Section tone="white" aria-labelledby="space-services">
        <Container>
          <SectionHeading
            id="space-services"
            eyebrow="Services"
            title={
              <>
                Property, design <em>and construction.</em>
              </>
            }
            description="Property listings are not published on this website. Tell us what you are looking for and our team will get in touch."
            className="mb-12"
          />
          <ServiceGrid services={space.services} accent={accent} />
        </Container>
      </Section>

      <SolutionFaq division={space} />
      <SolutionLead
        id="enquiry"
        eyebrow="Start your project"
        title={
          <>
            Tell us about <em>your space.</em>
          </>
        }
        description="Buying, building, designing or renovating: share the basics and our team will call you."
        points={['Real estate and property consultation', 'Architecture and interior design', 'Construction and renovation', 'One team from plot to finished space']}
        formTitle="Property & construction enquiry"
        form={<SpaceLeadForm source="space-page" />}
      />
      <FinalCta division="space" source="space-final" />
    </>
  );
}
