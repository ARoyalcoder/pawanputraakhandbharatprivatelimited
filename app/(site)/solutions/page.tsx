import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { Icon } from '@/components/ui/Icon';
import { AIImage } from '@/components/media/AIImage';
import { FinalCta } from '@/sections/shared/FinalCta';
import { divisions, divisionAccent } from '@/data/divisions';
import { buildMetadata } from '@/lib/seo/metadata';
import { cn } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Solutions: Security, Connectivity, Solar, Digital & Space',
  description:
    "PPAB's five divisions: Pawan Putra Secure, Connect, Solar, Digital and Space. CCTV, networking, solar, software and marketing, real estate and construction.",
  path: '/solutions',
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
        ]}
        eyebrow="Solutions"
        title={
          <>
            Five divisions. <em>One trusted partner.</em>
          </>
        }
        description="Security, connectivity, solar, digital technology and infrastructure, each run by a specialist team and planned together when your requirement spans more than one."
        size="compact"
      />

      <Section tone="light" aria-label="PPAB divisions">
        <Container className="space-y-20 lg:space-y-28">
          {divisions.map((division, i) => {
            const { hex: accent, ink } = divisionAccent[division.id];
            const flip = i % 2 === 1;
            return (
              <article key={division.id} id={division.id} className="grid scroll-mt-32 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <div className={cn('lg:col-span-6', flip && 'lg:order-2')}>
                  <div data-reveal="mask" className="relative aspect-[4/3] overflow-hidden rounded-panel">
                    <div data-parallax="0.1" className="absolute -inset-y-[6%] inset-x-0">
                      <AIImage id={division.imageId} sizes="(min-width: 1024px) 45vw, 100vw" />
                    </div>
                    <CornerFrame inset={16} />
                  </div>
                </div>
                <div className={cn('lg:col-span-6', flip && 'lg:order-1')}>
                  <p data-reveal="fade" className="flex items-center gap-3 type-eyebrow" style={{ color: ink }}>
                    <span className="grid size-9 place-items-center rounded-full bg-navy-900" style={{ color: accent }}>
                      <Icon name={division.icon} size={17} />
                    </span>
                    0{i + 1} · {division.short}
                  </p>
                  <h2 data-split suppressHydrationWarning className="mt-5 type-h2 text-navy-900">
                    {division.name}
                  </h2>
                  <p data-reveal="up" className="mt-2 type-tagline-lg" style={{ color: ink }}>
                    {division.tagline}
                  </p>
                  <p data-reveal="up" className="mt-5 type-lead text-muted">
                    {division.summary}
                  </p>
                  <ul data-reveal="up" className="mt-6 flex flex-wrap gap-2">
                    {division.services.map((s) => (
                      <li key={s.id} className="rounded-full border border-navy-900/12 bg-white px-3.5 py-1.5 type-caption text-ink-soft">
                        {s.name}
                      </li>
                    ))}
                  </ul>
                  <div data-reveal="fade" className="mt-8">
                    <ButtonLink href={division.href} withArrow>
                      Explore {division.short}
                    </ButtonLink>
                  </div>
                </div>
              </article>
            );
          })}
        </Container>
      </Section>
      <FinalCta source="solutions-final" />
    </>
  );
}
