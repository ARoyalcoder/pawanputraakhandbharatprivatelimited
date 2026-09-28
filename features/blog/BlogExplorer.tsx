'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Category filter over server-rendered cards; every article stays in the HTML. */
export function BlogExplorer({ categories, items }: { categories: string[]; items: { category: string; node: ReactNode; key: string }[] }) {
  const [category, setCategory] = useState('All');
  return (
    <div>
      <div role="group" aria-label="Filter articles by category" className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
            className={cn(
              'h-11 shrink-0 rounded-full border px-5 text-small font-semibold transition-colors',
              c === category ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-900/15 text-navy-900/70 hover:border-navy-900/40 hover:text-navy-900'
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.key} hidden={category !== 'All' && item.category !== category}>
            {item.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
