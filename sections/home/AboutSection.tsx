import { ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { AIImage } from '@/components/media/AIImage';
import { aboutPillars } from '@/data/company';
import { divisions } from '@/data/divisions';
import { siteConfig } from '@/config/site.config';

export function AboutSection() {
  return (
    <Section tone="light" id="about" aria-labelledby="about-title">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading
            id="about-title"
            eyebrow="About PPAB"
            index="01"
            title={
              <>
                Complete Solutions. <em>One Trusted Partner.</em>
              </>
            }
            description="Pawan Putra Akhand Bharat brings security, connectivity, solar, digital technology and infrastructure under one roof, so homes, businesses, institutions and industries can plan, build and maintain with a single partner."
          />

          <div data-reveal="up" className="mt-8 space-y-4 text-body text-ink-soft">
            <p>
              Most requirements do not stop at one service. A new office needs cameras, a network to carry them, reliable
              power, and a website to be found. A new home needs design, construction, security and solar. PPAB&apos;s
              five divisions are built to work together on exactly these requirements.
            </p>
          </div>

          <ul className="mt-10 border-t border-navy-900/10">
            {aboutPillars.map((pillar, i) => (
              <li key={pillar.id} data-reveal="up" className="grid gap-1.5 border-b border-navy-900/10 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                <h3 className="flex items-baseline gap-3 text-[1rem] font-semibold text-navy-900">
                  <span className="font-mono text-[0.7rem] text-gold-700">0{i + 1}</span>
                  {pillar.title}
                </h3>
                <p className="text-small text-muted">{pillar.description}</p>
              </li>
            ))}
          </ul>

          <Link href="/about" data-reveal="fade" className="group mt-9 inline-flex items-center gap-2 font-semibold text-navy-900">
            <span className="link-underline">More about PPAB</span>
            <ArrowUpRight aria-hidden="true" className="size-4 text-gold-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="relative lg:col-span-6">
          <div data-reveal="mask" className="relative aspect-[4/5] overflow-hidden rounded-panel sm:aspect-[5/4] lg:aspect-[4/5]">
            <div data-parallax="0.12" className="absolute -inset-y-[8%] inset-x-0">
              <AIImage id="hero-integrated" sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
            <CornerFrame inset={18} />
          </div>

          {/* Division index card */}
          <div
            data-reveal="up"
            className="relative -mt-24 ml-auto w-[88%] rounded-card border border-white/10 bg-navy-900 p-6 text-white shadow-lift sm:w-80 lg:absolute lg:-bottom-10 lg:-left-10 lg:mt-0"
          >
            <p className="font-mono text-caption uppercase text-gold-300">Five divisions</p>
            <ol className="mt-4 space-y-2.5">
              {divisions.map((d, i) => (
                <li key={d.id} className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-2.5 last:border-0 last:pb-0">
                  <Link href={d.href} className="font-semibold hover:text-gold-300">
                    <span className="mr-3 font-mono text-[0.7rem] text-white/40">0{i + 1}</span>
                    {d.short}
                  </Link>
                  <span className="truncate text-right font-serif text-[0.92rem] italic text-white/55">{d.tagline}</span>
                </li>
              ))}
            </ol>
          </div>

          <p data-reveal="fade" className="mt-6 flex items-center gap-2 text-small text-muted lg:mt-16 lg:justify-end">
            <MapPin aria-hidden="true" className="size-4 text-gold-600" />
            {siteConfig.offices.map((o) => `${o.city} (${o.type.replace(' Office', '').toLowerCase()})`).join(' · ')}
          </p>
        </div>
      </Container>
    </Section>
  );
}
