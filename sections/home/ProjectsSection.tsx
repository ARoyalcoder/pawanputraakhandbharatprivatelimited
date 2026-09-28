import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { ProjectsEmptyState } from '@/features/projects/ProjectsEmptyState';
import { projects } from '@/data/projects';

export function ProjectsSection() {
  const featured = projects.slice(0, 3);
  return (
    <Section tone="white" id="projects" aria-labelledby="projects-title">
      <Container>
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="projects-title"
            eyebrow="Featured projects"
            index="06"
            title={
              <>
                Work we can <em>put our name to.</em>
              </>
            }
            description="Real installations, real photographs, and client approval before anything is published."
          />
          <div data-reveal="fade" className="shrink-0">
            <ButtonLink href="/projects" variant="outline-dark" withArrow>
              View projects
            </ButtonLink>
          </div>
        </div>
        {featured.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <li key={project.slug} data-reveal="up">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <div data-reveal="up">
            <ProjectsEmptyState />
          </div>
        )}
      </Container>
    </Section>
  );
}
