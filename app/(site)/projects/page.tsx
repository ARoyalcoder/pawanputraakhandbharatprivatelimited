import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { ProjectsEmptyState } from '@/features/projects/ProjectsEmptyState';
import { ProjectsExplorer, type ProjectFilter } from '@/features/projects/ProjectsExplorer';
import { FinalCta } from '@/sections/shared/FinalCta';
import { divisions } from '@/data/divisions';
import { getProjectsByDivision } from '@/data/projects';
import { buildMetadata } from '@/lib/seo/metadata';
import type { DivisionId } from '@/types/content';

export const metadata: Metadata = buildMetadata({
  title: 'Projects',
  description: 'Verified PPAB projects across security, networking, solar, digital and infrastructure, published with client approval and real photography.',
  path: '/projects',
});

const filters: ProjectFilter[] = [{ id: 'all', label: 'All' }, ...divisions.map((d) => ({ id: d.id, label: d.short }))];

function Panel({ division }: { division?: DivisionId }) {
  const list = getProjectsByDivision(division);
  if (!list.length) {
    const label = division ? divisions.find((d) => d.id === division)?.short : undefined;
    return <ProjectsEmptyState divisionLabel={label} />;
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}

export default function ProjectsPage() {
  const panels = Object.fromEntries(filters.map((f) => [f.id, <Panel key={f.id} division={f.id === 'all' ? undefined : f.id} />]));

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Projects', href: '/projects' },
        ]}
        eyebrow="Projects"
        title={
          <>
            Verified work, <em>real photographs.</em>
          </>
        }
        description="Every project here is published with the client's approval and photographs from site. Each case study lists the project type, industry, solution, scope and completion status."
        size="compact"
      />
      <Section tone="light" aria-labelledby="project-directory-title">
        <Container>
          <h2 id="project-directory-title" className="sr-only">
            Project directory
          </h2>
          <ProjectsExplorer filters={filters} panels={panels} />
        </Container>
      </Section>
      <FinalCta source="projects-final" />
    </>
  );
}
