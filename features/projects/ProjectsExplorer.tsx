'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import type { DivisionId } from '@/types/content';
import { cn } from '@/lib/utils';

export interface ProjectFilter {
  id: 'all' | DivisionId;
  label: string;
}

interface ProjectsExplorerProps {
  filters: ProjectFilter[];
  /** Pre-rendered grid (or empty state) per filter id, rendered on the server. */
  panels: Record<string, ReactNode>;
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};

/** Division filter for the projects directory; keeps `?division=` in sync for shareable links. */
export function ProjectsExplorer({ filters, panels }: ProjectsExplorerProps) {
  const urlDivision = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get('division'),
    () => null
  );
  const [chosen, setChosen] = useState<ProjectFilter['id'] | null>(null);
  const fromUrl = filters.find((f) => f.id === urlDivision)?.id;
  const active = chosen ?? fromUrl ?? 'all';

  const choose = (id: ProjectFilter['id']) => {
    setChosen(id);
    const url = new URL(window.location.href);
    if (id === 'all') url.searchParams.delete('division');
    else url.searchParams.set('division', id);
    window.history.replaceState(null, '', url);
  };

  return (
    <div>
      <div role="group" aria-label="Filter projects by division" className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={f.id === active}
            onClick={() => choose(f.id)}
            className={cn(
              'h-11 shrink-0 rounded-full border px-5 text-small font-semibold transition-colors',
              f.id === active ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-900/15 text-navy-900/70 hover:border-navy-900/40 hover:text-navy-900'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      {filters.map((f) => (
        <div key={f.id} hidden={f.id !== active}>
          {panels[f.id]}
        </div>
      ))}
    </div>
  );
}
