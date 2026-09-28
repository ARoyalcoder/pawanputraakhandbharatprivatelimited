import type { DivisionId, Project } from '@/types/content';

/**
 * Verified PPAB project records.
 *
 * Intentionally empty: no project has yet been supplied with client-approved details
 * and real photography. Add entries only when both exist — never with AI imagery.
 */
export const projects: Project[] = [];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByDivision(division?: DivisionId): Project[] {
  return division ? projects.filter((p) => p.division === division) : projects;
}
