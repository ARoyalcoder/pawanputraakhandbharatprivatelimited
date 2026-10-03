import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, MapPin } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { OptimizedImage } from '@/components/media/images';
import { FinalCta } from '@/sections/shared/FinalCta';
import { getDivision } from '@/data/divisions';
import { getIndustry } from '@/data/industries';
import { getProject, projects } from '@/data/projects';
import { buildMetadata } from '@/lib/seo/metadata';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({ title: project.title, description: project.summary, path: `/projects/${project.slug}` });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const division = getDivision(project.division);
  const industry = getIndustry(project.industry);
  const details = [
    { label: 'Project type', value: division.name },
    { label: 'Industry', value: industry.name },
    ...(project.location ? [{ label: 'Location', value: project.location }] : []),
    { label: 'Solution', value: project.solution },
    { label: 'Status', value: project.status },
  ];

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: project.title, href: `/projects/${project.slug}` },
        ]}
        eyebrow={`${division.short} · ${industry.name}`}
        title={project.title}
        description={project.summary}
        size="compact"
      >
        {project.location && (
          <p className="mt-6 inline-flex items-center gap-2 text-small text-white/70">
            <MapPin aria-hidden="true" className="size-4 text-gold-300" /> {project.location}
          </p>
        )}
      </PageHero>

      <Section tone="light" aria-label="Project details">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            {project.media.map((m) => (
              <div key={m.src} className="relative overflow-hidden rounded-panel" style={{ aspectRatio: `${m.width} / ${m.height}` }}>
                <OptimizedImage src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" />
              </div>
            ))}
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-panel bg-white p-7 shadow-card lg:sticky lg:top-32">
              <dl className="space-y-4">
                {details.map((d) => (
                  <div key={d.label} className="border-b border-line pb-4 last:border-0 last:pb-0">
                    <dt className="type-eyebrow text-gold-700">{d.label}</dt>
                    <dd className="mt-1 font-semibold text-navy-900">{d.value}</dd>
                  </div>
                ))}
              </dl>
              <h2 className="mt-8 type-h4 text-navy-900">Scope</h2>
              <ul className="mt-3 space-y-2">
                {project.scope.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-small text-ink-soft">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </Section>
      <FinalCta division={project.division} source={`project-${project.slug}`} />
    </>
  );
}
