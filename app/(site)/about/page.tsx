import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { AIImage } from '@/components/media/AIImage';
import { ProcessSection } from '@/sections/home/ProcessSection';
import { FinalCta } from '@/sections/shared/FinalCta';
import { aboutPillars } from '@/data/company';
import { siteConfig } from '@/config/site.config';
import { buildMetadata } from '@/lib/seo/metadata';
import { mapsHref } from '@/lib/contact';
import { AboutDivisionsSection } from '@/components/about/AboutDivisionsSection';
import { AboutIdentity, AboutVisionMission, AboutWhoWeAre, AboutWhyChoose } from '@/components/about/AboutCompanyProfile';
import { getNavMedia } from '@/lib/media/nav-media';

import { InteractiveEcosystemHub } from '@/components/about/InteractiveEcosystemHub';
import { QuoteButton } from '@/components/forms/QuoteButton';
import { ButtonLink } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/animation/AnimatedCounter';

export const metadata: Metadata = buildMetadata({
  title: 'About Pawan Putra Akhand Bharat Pvt. Ltd.',
  description:
    'PPAB brings security, connectivity, solar, digital technology and infrastructure together under one roof, with a head office in Lucknow and a branch in New Delhi.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
        ]}
        eyebrow="About Us"
        title={
          <>
            Building Solutions. <em>Creating Growth.</em>
          </>
        }
        description={
          <>
            <p>
              Pawan Putra Akhand Bharat Pvt. Ltd. is a multi-vertical Indian business solutions company delivering trusted services across Security, Connectivity, Solar, Digital Solutions and Real Estate & Projects.
            </p>
            <p className="mt-3">
              We combine technology, quality and professional service to help businesses, institutions and individuals build safer, smarter and more connected environments.
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-gold-300 font-semibold">
              One Vision. Multiple Solutions. Trusted Service.
            </p>
            {/* Interactive Live Metrics Strip */}
            <div className="mt-7 grid grid-cols-3 gap-3 border-y border-white/10 py-4">
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-gold-300">
                  <AnimatedCounter value={5} suffix=" Divisions" />
                </span>
                <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-white/50">
                  Single Roof
                </p>
              </div>
              <div className="border-x border-white/10 px-3">
                <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                  <AnimatedCounter value={1} suffix=" Contract" />
                </span>
                <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-white/50">
                  Unified SLA
                </p>
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">
                  <AnimatedCounter value={100} suffix="%" />
                </span>
                <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-white/50">
                  In-House Team
                </p>
              </div>
            </div>
          </>
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <QuoteButton size="md" withArrow source="about-hero">
              Get Free Consultation
            </QuoteButton>
            <ButtonLink href="#divisions" variant="outline-light" size="md">
              Explore 5 Divisions
            </ButtonLink>
          </div>
        }
        visual={<InteractiveEcosystemHub />}
      />

      <AboutWhoWeAre />
      <AboutVisionMission />
      <AboutIdentity />

      <Section tone="white" aria-labelledby="model-title">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="model-title"
              eyebrow="Our model"
              title={
                <>
                  Why one partner <em>works better.</em>
                </>
              }
              description="Requirements rarely fit neatly into one trade. PPAB is organised so that the teams who secure, connect, power and digitise a property can plan it together."
            />
          </div>
          <ol className="grid gap-4 lg:col-span-7">
            {aboutPillars.map((pillar, i) => (
              <li key={pillar.id} data-reveal="up" className="grid gap-2 rounded-card border border-line p-6 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span className="type-ordinal text-gold-600">0{i + 1}</span>
                <div>
                  <h3 className="type-h4 text-navy-900">{pillar.title}</h3>
                  <p className="mt-2 type-body text-muted">{pillar.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <AboutDivisionsSection media={getNavMedia()} />
      <AboutWhyChoose />

      <Section tone="light" aria-labelledby="offices-title">
        <Container>
          <SectionHeading
            id="offices-title"
            eyebrow="Where we are"
            title={
              <>
                Lucknow <em>&amp; New Delhi.</em>
              </>
            }
            className="mb-12"
          />
          <ul className="grid gap-5 md:grid-cols-2">
            {siteConfig.offices.map((office) => (
              <li key={office.id} data-reveal="up" className="rounded-panel bg-white p-8 shadow-card">
                <p className="type-eyebrow text-gold-700">{office.type}</p>
                <h3 className="mt-2 type-h3 text-navy-900">{office.city}</h3>
                <address className="mt-3 type-body not-italic text-muted">
                  {office.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={mapsHref(office.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-small font-semibold text-navy-900 hover:text-gold-700"
                >
                  <MapPin aria-hidden="true" className="size-4 text-gold-600" /> Open in Google Maps
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ProcessSection />
      <FinalCta source="about-final" />
    </>
  );
}
