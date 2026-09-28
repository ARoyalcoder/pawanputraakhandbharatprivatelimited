import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { JsonLd } from '@/components/seo/JsonLd';
import { AIImage } from '@/components/media/AIImage';
import { ConnectLeadForm } from '@/components/forms/ConnectLeadForm';
import { ServiceGrid } from '@/features/solutions/ServiceGrid';
import { SolutionOverview } from '@/features/solutions/SolutionOverview';
import { SolutionFaq } from '@/features/solutions/SolutionFaq';
import { SolutionLead } from '@/features/solutions/SolutionLead';
import { NetworkFlow } from '@/features/solutions/connect/NetworkFlow';
import { FinalCta } from '@/sections/shared/FinalCta';
import { connect, divisionAccent, networkFlow } from '@/data/divisions';
import { buildMetadata } from '@/lib/seo/metadata';
import { serviceSchema } from '@/lib/seo/schema';
import { whatsappHref } from '@/lib/contact';

export const metadata: Metadata = buildMetadata({ ...connect.seo, path: connect.href });

const accent = divisionAccent.connect.hex;

export default function ConnectPage() {
  return (
    <>
      <JsonLd data={serviceSchema(connect)} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: connect.short, href: connect.href },
        ]}
        eyebrow={connect.name}
        accent={accent}
        title={
          <>
            Har Connection Mein <em>Bharosa.</em>
          </>
        }
        description={connect.summary}
        actions={
          <>
            <ButtonLink href="#plan" size="lg" withArrow>
              Plan My Network
            </ButtonLink>
            <ButtonLink href={whatsappHref('Hello PPAB, I need help with networking / Wi-Fi.')} size="lg" variant="outline-light" icon={<WhatsAppIcon size={18} className="text-gold-300" />}>
              WhatsApp Us
            </ButtonLink>
          </>
        }
        visual={
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-white/10">
            <AIImage id="connect-overview" priority sizes="(min-width: 1024px) 45vw, 100vw" />
            <CornerFrame inset={16} className="text-connect/70" />
          </div>
        }
      />

      <Section tone="darker" aria-labelledby="network-flow-title" className="overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgb(74_144_255/0.16),transparent)]" />
        <Container>
          <SectionHeading
            id="network-flow-title"
            tone="dark"
            eyebrow="How it fits together"
            align="center"
            title={
              <>
                From the internet <em>to every device.</em>
              </>
            }
            description="A network is only as strong as its weakest link. We plan every step of the path, from where connectivity enters your building to the devices your team uses."
            className="mb-12"
          />
          <div data-reveal="up">
            <NetworkFlow nodes={networkFlow} />
          </div>
        </Container>
      </Section>

      <SolutionOverview division={connect} accent={accent} />

      <Section tone="white" aria-labelledby="connect-services">
        <Container>
          <SectionHeading
            id="connect-services"
            eyebrow="Services"
            title={
              <>
                Networks built as <em>one system.</em>
              </>
            }
            className="mb-12"
          />
          <ServiceGrid services={connect.services} accent={accent} columns={4} />
        </Container>
      </Section>

      <SolutionFaq division={connect} />
      <SolutionLead
        id="plan"
        eyebrow="Plan your network"
        title={
          <>
            Tell us what <em>needs connecting.</em>
          </>
        }
        description="Share your property and requirement. We'll suggest the right mix of fiber, cabling, Wi-Fi and equipment."
        points={['Fiber, LAN/CAN and Wi-Fi planning', 'Routers, switches and server racks', 'Neat, organised installation', 'IT support after go-live']}
        formTitle="Networking requirement"
        form={<ConnectLeadForm source="connect-page" />}
      />
      <FinalCta division="connect" source="connect-final" />
    </>
  );
}
