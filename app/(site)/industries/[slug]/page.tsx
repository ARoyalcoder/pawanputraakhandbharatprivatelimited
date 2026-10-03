import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tagline } from '@/components/ui/Typography';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { Icon } from '@/components/ui/Icon';
import { AIImage } from '@/components/media/AIImage';
import { QuoteButton } from '@/components/forms/QuoteButton';
import { GeneralLeadForm } from '@/components/forms/GeneralLeadForm';
import { SolutionLead } from '@/features/solutions/SolutionLead';
import { FinalCta } from '@/sections/shared/FinalCta';
import { industries, isIndustryId } from '@/data/industries';
import { divisionAccent, getDivision } from '@/data/divisions';
import { buildMetadata } from '@/lib/seo/metadata';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.id === slug);
  if (!industry) return {};
  return buildMetadata({ ...industry.seo, path: `/industries/${industry.id}` });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  if (!isIndustryId(slug)) notFound();
  const industry = industries.find((i) => i.id === slug)!;

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Industries', href: '/industries' },
          { label: industry.name, href: `/industries/${industry.id}` },
        ]}
        eyebrow={`${industry.name} · ${industry.audience}`}
        title={industry.headline}
        description={industry.summary}
        actions={
          <QuoteButton size="lg" withArrow source={`industry-${industry.id}`}>
            Discuss your requirement
          </QuoteButton>
        }
        visual={
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-white/10">
            <AIImage id={industry.imageId} priority sizes="(min-width: 1024px) 45vw, 100vw" />
            <CornerFrame inset={16} />
          </div>
        }
      />

      <Section tone="white" aria-labelledby="needs-title">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
           
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {industry.needs.map((need) => (
              <li key={need} data-reveal="up" className="flex items-start gap-3 rounded-card border border-line bg-surface p-5 type-body text-ink-soft">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-gold-600" />
                {need}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="light" aria-labelledby="industry-solutions-title">
        <Container>
          <SectionHeading
            id="industry-solutions-title"
            eyebrow="Relevant solutions"
            title={
              <>
                How PPAB can help <em>{industry.audience.split(',')[0].toLowerCase()}.</em>
              </>
            }
            className="mb-12"
          />
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {industry.solutions.map((s) => {
              const division = getDivision(s.division);
              const accent = divisionAccent[s.division].hex;
              return (
                <li key={s.division} data-reveal="up" className="group relative flex flex-col rounded-panel bg-white p-7 shadow-card">
                  <span aria-hidden="true" className="absolute inset-x-7 top-0 h-0.5" style={{ backgroundColor: accent }} />
                  <span className="grid size-11 place-items-center rounded-full bg-navy-900" style={{ color: accent }}>
                    <Icon name={division.icon} size={20} />
                  </span>
                  <h3 className="mt-5 type-h4 text-navy-900">
                    <Link href={division.href} className="after:absolute after:inset-0">
                      {division.name}
                    </Link>
                  </h3>
                  <Tagline division={s.division} surface="light" size="sm" className="mt-1">
                    {division.tagline}
                  </Tagline>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.services.map((service) => (
                      <li key={service} className="rounded-full bg-surface px-3 py-1 type-caption text-ink-soft">
                        {service}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-small font-semibold text-navy-900">
                    View {division.short} <ArrowUpRight aria-hidden="true" className="size-4 text-gold-600" />
                  </span>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <SolutionLead
        id="enquiry"
        eyebrow={`${industry.name} enquiry`}
        title={
          <>
            Let&apos;s plan the right <em>solution together.</em>
          </>
        }
        description="Tell us about your property and what you need. We'll recommend the right combination of services."
        points={['Free consultation', 'One partner across divisions', 'Clear quotation before work begins', 'Support and AMC after handover']}
        formTitle="Tell us your requirement"
        form={<GeneralLeadForm source={`industry-${industry.id}`} />}
      />

      <FinalCta source={`industry-${industry.id}-final`} />
    </>
  );
}
