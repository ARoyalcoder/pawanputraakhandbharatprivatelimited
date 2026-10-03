'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CinematicBackground } from './CinematicBackground';
import { ActiveSolutionCard } from './ActiveSolutionCard';
import { VerticalSolutionTab } from './VerticalSolutionTab';
import { MobileSolutionNav } from './MobileSolutionNav';
import { cn } from '@/lib/utils';
import type { SolutionCardData } from './types';

interface SolutionsShowcaseProps {
  items: SolutionCardData[];
}

export function SolutionsShowcase({ items }: SolutionsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ultra-responsive hover intent: 35ms micro-buffer gives instantaneous expansion while guarding against random cursor crossing
  const handleTabHover = useCallback((idx: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev !== idx ? idx : prev));
    }, 35);
  }, []);

  const handleTabHoverLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  // Instant switch on direct click
  const handleTabSelect = useCallback((idx: number) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setActiveIndex(idx);
  }, []);

  // Auto-advance showcase every 8.5 seconds when not hovering
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 8500);

    return () => clearInterval(timer);
  }, [isHovered, items.length]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Keyboard navigation across solutions (ArrowLeft / ArrowRight)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveIndex(items.length - 1);
      }
    },
    [items.length]
  );

  const activeItem = items[activeIndex] || items[0];

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
      }}
      role="region"
      aria-label="PPAB Business Divisions Interactive Showcase"
      className="relative isolate w-full focus:outline-none"
    >
      {/* 1. Cinematic Environment & 3D Depth Layer */}
      <CinematicBackground items={items} activeIndex={activeIndex} />

      {/* 2. Desktop Accordion: All 5 Cards in Sequential Order with In-Place Fluid Expansion */}
      <div
        role="tablist"
        aria-label="PPAB Divisions Accordion"
        className="hidden lg:flex lg:h-[28.5rem] lg:gap-3 xl:gap-3.5 w-full items-stretch"
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={item.id}
              onMouseEnter={() => handleTabHover(idx)}
              onMouseLeave={handleTabHoverLeave}
              className={cn(
                'h-full transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden motion-reduce:transition-none will-change-[flex,min-width]',
                isActive
                  ? 'flex-[3.2] min-w-[370px] xl:min-w-[430px]'
                  : 'flex-1 min-w-[110px] sm:min-w-[125px] xl:min-w-[140px]'
              )}
            >
              {isActive ? (
                <ActiveSolutionCard item={item} className="h-full w-full" />
              ) : (
                <VerticalSolutionTab
                  item={item}
                  index={idx}
                  isActive={false}
                  onSelect={handleTabSelect}
                  onHover={handleTabHover}
                  onHoverLeave={handleTabHoverLeave}
                  className="h-full w-full"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Mobile & Tablet Composition (Responsive Stack + Pill Navigator) */}
      <div className="flex flex-col gap-5 lg:hidden w-full">
        {/* Mobile Horizontal Pill Selector */}
        <MobileSolutionNav
          items={items}
          activeIndex={activeIndex}
          onSelect={(newIdx) => setActiveIndex(newIdx)}
        />

        {/* Active Solution Card */}
        <div className="min-h-[25rem] sm:min-h-[27rem] w-full">
          <ActiveSolutionCard item={activeItem} />
        </div>

        {/* Mobile Prev / Next Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-white/80 text-xs font-mono"
          >
            <ChevronLeft className="size-3.5" />
            <span>Prev</span>
          </button>

          <span className="font-mono text-xs text-white/60">
            {String(activeIndex + 1).padStart(2, '0')} of {String(items.length).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-white/80 text-xs font-mono"
          >
            <span>Next</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
