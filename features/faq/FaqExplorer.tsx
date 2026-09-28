'use client';

import { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import type { CategorisedFaq, FaqCategory } from '@/types/content';
import { cn } from '@/lib/utils';

/** Category filter + accordion. All answers stay in the server HTML for search engines. */
export function FaqExplorer({ faqs, categories }: { faqs: CategorisedFaq[]; categories: FaqCategory[] }) {
  const [category, setCategory] = useState<FaqCategory>(categories[0]);

  return (
    <div>
      <div role="group" aria-label="FAQ categories" className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
            className={cn(
              'h-10 shrink-0 rounded-full border px-5 text-small font-semibold transition-colors',
              c === category ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-900/15 text-navy-900/70 hover:border-navy-900/40 hover:text-navy-900'
            )}
          >
            {c}
          </button>
        ))}
      </div>
      {categories.map((c) => {
        const items = faqs.filter((f) => f.category === c);
        return (
          <div key={c} hidden={c !== category}>
            <Accordion items={items} defaultOpenId={items[0]?.id} />
          </div>
        );
      })}
    </div>
  );
}
