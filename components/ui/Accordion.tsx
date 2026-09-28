'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  tone?: 'light' | 'dark';
  defaultOpenId?: string;
  className?: string;
}

/** WAI-ARIA accordion. Multiple panels may be open; arrow keys move between headers. */
export function Accordion({ items, tone = 'light', defaultOpenId, className }: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpenId ? [defaultOpenId] : []));
  const headers = useRef<(HTMLButtonElement | null)[]>([]);
  const dark = tone === 'dark';

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const target =
      event.key === 'ArrowDown' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowUp' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    headers.current[target]?.focus();
  };

  return (
    <div className={cn('divide-y border-y', dark ? 'divide-white/10 border-white/10' : 'divide-navy-900/10 border-navy-900/10', className)}>
      {items.map((item, index) => {
        const isOpen = open.has(item.id);
        const headerId = `${baseId}-h-${item.id}`;
        const panelId = `${baseId}-p-${item.id}`;
        return (
          <div key={item.id}>
            <h3>
              <button
                ref={(el) => {
                  headers.current[index] = el;
                }}
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={cn(
                  'group flex w-full items-start justify-between gap-6 py-6 text-left text-h4 transition-colors',
                  dark ? 'text-white hover:text-gold-300' : 'text-navy-900 hover:text-gold-700'
                )}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out-expo',
                    dark ? 'border-white/20' : 'border-navy-900/15',
                    isOpen && 'rotate-45 border-gold-500 bg-gold-500 text-navy-950'
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              inert={!isOpen}
              className="grid transition-[grid-template-rows] duration-500 ease-out-expo"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className={cn('max-w-3xl pb-7 pr-14 text-body', dark ? 'text-white/70' : 'text-muted')}>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
