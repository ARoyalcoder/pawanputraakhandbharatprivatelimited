'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accordion } from '@/components/ui/Accordion';
import type { CategorisedFaq, FaqCategory } from '@/types/content';
import { cn } from '@/lib/utils';

/** Category filter + accordion with Framer Motion fluid tab transitions. */
export function FaqExplorer({ faqs, categories }: { faqs: CategorisedFaq[]; categories: FaqCategory[] }) {
  const [category, setCategory] = useState<FaqCategory>(categories[0]);

  return (
    <div>
      <div role="group" aria-label="FAQ categories" className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((c) => {
          const isActive = c === category;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={isActive}
              onClick={() => setCategory(c)}
              className={cn(
                'relative h-10 shrink-0 rounded-full border px-5 text-small font-semibold transition-colors duration-200',
                isActive
                  ? 'border-navy-900 text-white'
                  : 'border-navy-900/15 text-navy-900/70 hover:border-navy-900/40 hover:text-navy-900'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="active-faq-category"
                  className="absolute inset-0 rounded-full bg-navy-900"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {(() => {
            const items = faqs.filter((f) => f.category === category);
            return <Accordion items={items} defaultOpenId={items[0]?.id} />;
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
