import type { ReactNode } from 'react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AIImage } from '@/components/media/AIImage';
import { CornerFrame } from '@/components/ui/CornerFrame';
import type { Division } from '@/types/content';

interface SolutionOverviewProps {
  division: Division;
  accent: string;
  title?: ReactNode;
  description?: ReactNode;
}

/** Division overview: narrative, poster tagline, and the extra offerings from PPAB collateral. */
export function SolutionOverview({ division, accent, title, description }: SolutionOverviewProps) {
  return (
    <Section tone="light" aria-labelledby={`${division.id}-overview`}>
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading
            id={`${division.id}-overview`}
            eyebrow="Overview"
            title={
              title ?? (
                <>
                  {division.name.replace('Pawan Putra ', '')}, <em>done properly.</em>
                </>
              )
            }
            description={
              description ?? (
                <div className="space-y-4">
                  {division.overview.split('\n\n').map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              )
            }
          />
          {division.subTagline && (
            <p data-reveal="up" className="mt-8 border-l-2 pl-5 type-quote text-navy-900" style={{ borderColor: accent }}>
              {division.subTagline}
            </p>
          )}
          {division.additionalServices.length > 0 && (
            <div data-reveal="up" className="mt-9">
              <p className="text-small font-semibold text-navy-900">Also available</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {division.additionalServices.map((s) => (
                  <li key={s} className="rounded-full border border-navy-900/12 bg-white px-3.5 py-1.5 type-caption text-ink-soft">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="lg:col-span-6">
          <div data-reveal="mask" className="relative aspect-[4/3] overflow-hidden rounded-panel">
            <div data-parallax="0.1" className="absolute -inset-y-[6%] inset-x-0">
              <AIImage id={division.imageId} sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
            <CornerFrame inset={16} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
