'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import type { SolutionCardData } from './types';

interface VerticalSolutionTabProps {
  item: SolutionCardData;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
  onHover?: (index: number) => void;
  onHoverLeave?: () => void;
  className?: string;
}

export const VerticalSolutionTab: React.FC<VerticalSolutionTabProps> = ({
  item,
  index,
  isActive,
  onSelect,
  onHover,
  onHoverLeave,
  className = '',
}) => {
  const imageSrc =
    item.imageUrl ||
    (item.image.src ? item.image.src : `/images/solutions/${item.id}.jpg`);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={`Switch to ${item.name}`}
      onClick={() => onSelect(index)}
      onMouseEnter={() => {
        if (onHover) onHover(index);
        else onSelect(index);
      }}
      onMouseLeave={() => {
        onHoverLeave?.();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(index);
        }
      }}
      className={cn(
        'group relative isolate flex flex-col items-center justify-between overflow-hidden rounded-3xl border text-center cursor-pointer transition-all duration-500 ease-out select-none',
        'p-3.5 sm:p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400',
        'bg-[#051124]/90 border-white/10 hover:border-white/35 hover:bg-[#071731]/95 shadow-xl hover:shadow-2xl',
        className
      )}
      style={{
        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)',
      }}
    >
      {/* 1. Environmental Visual Preview */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="220px"
          className="object-cover object-center filter brightness-[0.3] contrast-[1.15] opacity-40 transition-all duration-700 ease-out group-hover:opacity-75 group-hover:scale-105 group-hover:brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020b1d] via-[#020b1d]/85 to-[#020b1d]/55" />
      </div>

      {/* 2. Top Glowing Accent Bar */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 transition-all duration-500 group-hover:h-1.5"
        style={{
          backgroundColor: item.accent,
          boxShadow: `0 0 15px ${item.accent}`,
        }}
      />

      {/* Top: Index & Glowing Icon */}
      <div className="flex flex-col items-center gap-2.5 z-10 w-full pt-1">
        <span
          className="font-mono text-xs font-bold text-white/70 group-hover:text-white transition-colors px-2.5 py-0.5 rounded-full border border-white/10 group-hover:border-white/30 backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          {item.index}
        </span>

        <div
          className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-all duration-300 shadow-md backdrop-blur-sm group-hover:scale-110"
          style={{
            borderColor: `${item.accent}60`,
            color: item.accent,
            boxShadow: `0 0 14px ${item.accent}25`,
          }}
        >
          <Icon name={item.icon} size={18} />
        </div>
      </div>

      {/* Center: Balanced Medium Card Title & Metrics */}
      <div className="my-auto py-3 z-10 flex flex-col items-center justify-center w-full px-1">
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/45 group-hover:text-white/70 transition-colors line-clamp-1">
          {item.category || 'Division'}
        </span>
        <h3 className="font-heading text-base font-extrabold tracking-wide text-white/90 group-hover:text-white transition-colors uppercase mt-0.5">
          {item.short}
        </h3>

        {/* Live Key Stat Pill */}
        {item.stat && (
          <div className="mt-2.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm group-hover:border-white/20 transition-all">
            <div className="font-mono text-[11px] font-bold" style={{ color: item.accent }}>
              {item.stat.value}
            </div>
            <div className="font-mono text-[8.5px] uppercase tracking-wider text-white/50 leading-none mt-0.5">
              {item.stat.label}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Accent Indicator Dot & Expand Action */}
      <div className="flex flex-col items-center gap-1.5 z-10 w-full pb-1">
        <span
          className="size-1.5 rounded-full transition-all duration-300 group-hover:scale-125"
          style={{
            backgroundColor: item.accent,
            boxShadow: `0 0 8px ${item.accent}`,
          }}
        />
        <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/40 group-hover:text-white/90 transition-colors inline-flex items-center gap-1">
          <span>EXPAND</span>
          <ChevronRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
};
