'use client';

import React from 'react';
import { FastForward } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IntroSkipButtonProps {
  onSkip: () => void;
  className?: string;
  visible?: boolean;
}

export function IntroSkipButton({ onSkip, className, visible = true }: IntroSkipButtonProps) {
  return (
    <button
      type="button"
      onClick={onSkip}
      aria-label="Skip cinematic introduction"
      className={cn(
        'group absolute bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-gold-400/30 bg-[#06152f]/70 px-4 py-2 text-xs font-mono uppercase tracking-widest text-gold-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:border-gold-400 hover:bg-[#0b1d3d] hover:text-gold-100 hover:shadow-[0_0_15px_rgba(216,166,42,0.4)] focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-[#020b1d]',
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        className
      )}
    >
      <span>Skip Intro</span>
      <FastForward className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  );
}
