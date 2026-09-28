import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { Icon } from '@/components/ui/Icon';
import { AIImage } from '@/components/media/AIImage';
import { ProcessSection } from '@/sections/home/ProcessSection';
import { FinalCta } from '@/sections/shared/FinalCta';
import { aboutPillars } from '@/data/company';
import { divisions, divisionAccent } from '@/data/divisions';
import { siteConfig } from '@/config/site.config';
import { buildMetadata } from '@/lib/seo/metadata';
import { mapsHref } from '@/lib/contact';

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
        eyebrow="About PPAB"
        title={
          <>
            Complete Solutions. <em>One Trusted Partner.</em>
          </>
        }
        description={`${siteConfig.companyName} is one company with five specialist divisions: security, connectivity, solar, digital and infrastructure, working as one team for homes, businesses, institutions and industries.`}
        visual={
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-white/10">
            <AIImage id="hero-integrated" priority sizes="(min-width: 1024px) 45vw, 100vw" />
            <CornerFrame inset={16} />
          </div>
        }
      />

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
                <span className="font-serif text-[2.2rem] italic leading-none text-gold-600">0{i + 1}</span>
                <div>
                  <h3 className="text-h4 text-navy-900">{pillar.title}</h3>
                  <p className="mt-2 text-body text-muted">{pillar.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="darker" aria-labelledby="divisions-title">
        <Container>
          <SectionHeading
            id="divisions-title"
            tone="dark"
            eyebrow="Five divisions"
            title={
              <>
                Specialists, <em>working as one.</em>
              </>
            }
            className="mb-12"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {divisions.map((d) => {
              const accent = divisionAccent[d.id].hex;
              return (
                <li key={d.id} data-reveal="up" className="group relative flex flex-col rounded-card border border-white/10 bg-navy-900 p-6 transition-colors hover:border-white/25">
                  <span className="grid size-11 place-items-center rounded-full" style={{ backgroundColor: `${accent}22`, color: accent }}>
                    <Icon name={d.icon} size={20} />
                  </span>
                  <h3 className="mt-6 text-h4 text-white">
                    <Link href={d.href} className="after:absolute after:inset-0">
                      {d.name}
                    </Link>
                  </h3>
                  <p className="mt-1 font-serif italic" style={{ color: accent }}>
                    {d.tagline}
                  </p>
                  <p className="mt-3 text-small text-white/60">{d.services.map((s) => s.name).join(' · ')}</p>
                  <ArrowUpRight aria-hidden="true" className="mt-auto size-5 pt-1 text-white/40 transition-colors group-hover:text-gold-300" />
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

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
                <p className="font-mono text-caption uppercase text-gold-700">{office.type}</p>
                <h3 className="mt-2 text-h3 text-navy-900">{office.city}</h3>
                <address className="mt-3 text-body not-italic text-muted">
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
