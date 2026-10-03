'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import type { SolutionCardData } from './types';

interface MobileSolutionNavProps {
  items: SolutionCardData[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export const MobileSolutionNav: React.FC<MobileSolutionNavProps> = ({
  items,
  activeIndex,
  onSelect,
  className = '',
}) => {
  return (
    <div className={cn('w-full', className)}>
      {/* Category Navigation Pills */}
      <div
        role="tablist"
        aria-label="PPAB Solutions Navigation"
        className="no-scrollbar flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-[#051124]/90 border border-white/10 shadow-lg backdrop-blur-md"
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;

          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-label={item.name}
              onClick={() => onSelect(idx)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-heading text-xs font-bold transition-all duration-300 shrink-0 select-none cursor-pointer',
                isActive
                  ? 'text-[#06152f] shadow-lg scale-[1.02]'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              )}
              style={
                isActive
                  ? {
                      backgroundColor: item.accent,
                      boxShadow: `0 4px 15px ${item.accent}40`,
                    }
                  : undefined
              }
            >
              <span className="font-mono text-[10px] opacity-75">{item.index}</span>
              <Icon name={item.icon} size={14} />
              <span>{item.short}</span>
            </button>
          );
        })}
      </div>

      {/* Touch swipe indicator dots */}
      <div className="mt-3 flex items-center justify-center gap-1.5 sm:hidden" aria-hidden="true">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              idx === activeIndex ? 'w-6' : 'w-1.5 bg-white/20'
            )}
            style={idx === activeIndex ? { backgroundColor: item.accent } : undefined}
          />
        ))}
      </div>
    </div>
  );
};
