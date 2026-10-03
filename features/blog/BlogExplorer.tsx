'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Category filter over server-rendered cards with fluid Framer Motion pill animation. */
export function BlogExplorer({ categories, items }: { categories: string[]; items: { category: string; node: ReactNode; key: string }[] }) {
  const [category, setCategory] = useState('All');

  const visibleItems = items.filter((item) => category === 'All' || item.category === category);

  return (
    <div>
      <div role="group" aria-label="Filter articles by category" className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {['All', ...categories].map((c) => {
          const isActive = c === category;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={isActive}
              onClick={() => setCategory(c)}
              className={cn(
                'relative h-11 shrink-0 rounded-full border px-5 text-small font-semibold transition-colors duration-300',
                isActive ? 'border-navy-900 text-white' : 'border-navy-900/15 text-navy-900/70 hover:border-navy-900/40 hover:text-navy-900'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="active-blog-tab"
                  className="absolute inset-0 rounded-full bg-navy-900"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item) => (
            <motion.li
              layout
              key={item.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {item.node}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
