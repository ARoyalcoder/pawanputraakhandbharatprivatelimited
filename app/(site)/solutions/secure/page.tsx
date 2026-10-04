import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/seo/JsonLd';
import { CCTVLeadForm } from '@/components/forms/CCTVLeadForm';
import { ServiceGrid } from '@/features/solutions/ServiceGrid';
import { SolutionOverview } from '@/features/solutions/SolutionOverview';
import { SolutionFaq } from '@/features/solutions/SolutionFaq';
import { SolutionLead } from '@/features/solutions/SolutionLead';
import { SecureHeroVisual } from '@/features/solutions/secure/SecureHeroVisual';
import { CctvSectors, SecureAmc, SecureFeatures, SecureInstallation, SecureProducts } from '@/features/solutions/secure/SecureSections';
import { FinalCta } from '@/sections/shared/FinalCta';
import { divisionAccent, secure } from '@/data/divisions';
import { buildMetadata } from '@/lib/seo/metadata';
import { serviceSchema } from '@/lib/seo/schema';
import { whatsappHref } from '@/lib/contact';

export const metadata: Metadata = buildMetadata({ ...secure.seo, path: secure.href });

const accent = divisionAccent.secure.hex;

export default function SecurePage() {
  return (
    <>
      <JsonLd data={serviceSchema(secure)} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: secure.short, href: secure.href },
        ]}
        eyebrow={secure.name}
        accent={accent}
        title={
          <>
            Smart Security <em>Solutions.</em>
          </>
        }
        description={
          <>
            <p>
              CCTV cameras, video door phones, and biometric attendance systems{' '}
              <strong className="text-white font-semibold">
                planned, installed, configured, and maintained
              </strong>{' '}
              for homes, businesses, institutions, and commercial properties.
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Reliable Security. Professional Installation. Ongoing Support.
            </p>
          </>
        }
        actions={
          <>
            <ButtonLink href="#survey" size="lg" withArrow>
              Get FREE CCTV Site Survey
            </ButtonLink>
            <ButtonLink href={whatsappHref('Hello PPAB, I need CCTV / security for my property.')} size="lg" variant="outline-light" icon={<WhatsAppIcon size={18} className="text-gold-300" />}>
              WhatsApp Us
            </ButtonLink>
          </>
        }
        visual={<SecureHeroVisual />}
      />

      <SolutionOverview
        division={secure}
        accent={accent}
        title={
          <>
            Pawan Putra <em>Secure.</em>
          </>
        }
        description={
          <div className="space-y-4">
            <p>
              Pawan Putra Secure brings{' '}
              <strong className="text-navy-950 font-semibold">
                security, surveillance, and access-control solutions together in one integrated system
              </strong>
              . We begin by understanding your property and security concerns, then recommend the right combination of cameras, recording systems, video door phones, and attendance solutions.
            </p>
            <p>
              Our team handles{' '}
              <strong className="text-navy-950 font-semibold">
                installation, configuration, testing, and handover
              </strong>
              , with ongoing maintenance and AMC support to keep your security systems working reliably.
            </p>
          </div>
        }
      />

      <Section tone="white" aria-labelledby="secure-services">
        <Container>
          <SectionHeading
            id="secure-services"
            eyebrow="Services"
            title={
              <>
                Our Security <em>Services.</em>
              </>
            }
            className="mb-12"
          />
          <ServiceGrid services={secure.services} accent={accent} />
        </Container>
      </Section>

      <CctvSectors />
      <SecureFeatures />
      <SecureProducts />
      <SecureInstallation />
      <SecureAmc />
      <SolutionFaq division={secure} />
      <SolutionLead
        id="survey"
        eyebrow="Free CCTV site survey"
        title={
          <>
            Need CCTV for your <em>home or business?</em>
          </>
        }
        description="Share a few details and our team will arrange a survey of your property."
        points={['Free site survey', 'Camera plan and clear quotation', 'Installation, configuration and handover', 'Maintenance and AMC available']}
        formTitle="Request your free site survey"
        form={<CCTVLeadForm source="secure-page" />}
      />
      <FinalCta division="secure" source="secure-final" />
    </>
  );
}
