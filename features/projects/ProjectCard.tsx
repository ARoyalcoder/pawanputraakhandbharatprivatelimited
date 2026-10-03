import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { OptimizedImage } from '@/components/media/images';
import { InteractiveTiltCard } from '@/components/animation/InteractiveTiltCard';
import { getDivision, divisionAccent } from '@/data/divisions';
import { getIndustry } from '@/data/industries';
import type { Project } from '@/types/content';

/** Card for a verified project with interactive 3D tilt and specular lighting. */
export function ProjectCard({ project }: { project: Project }) {
  const division = getDivision(project.division);
  const industry = getIndustry(project.industry);
  const cover = project.media[0];

  return (
    <InteractiveTiltCard maxTilt={5} glareOpacity={0.15} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-shadow duration-500 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
        {cover && (
          <OptimizedImage
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 type-caption font-semibold text-navy-900">
          {project.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 type-caption text-muted">
          <span className="inline-flex items-center gap-1.5 font-semibold text-navy-900">
            <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: divisionAccent[division.id].hex }} />
            {division.short}
          </span>
          <span>{industry.name}</span>
          {project.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3.5" />
              {project.location}
            </span>
          )}
        </p>
        <h3 className="mt-3 type-h4 text-navy-900">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-small text-muted">{project.solution}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.scope.slice(0, 3).map((item) => (
            <li key={item} className="rounded-full bg-surface px-2.5 py-1 type-caption text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-small font-semibold text-navy-900">
          View project <ArrowUpRight aria-hidden="true" className="size-4 text-gold-600" />
        </span>
      </div>
    </article>
    </InteractiveTiltCard>
  );
}
