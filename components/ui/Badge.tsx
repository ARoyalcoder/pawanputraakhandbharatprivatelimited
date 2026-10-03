import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  tone?: 'light' | 'dark' | 'gold';
  icon?: ReactNode;
  className?: string;
}

const tones = {
  light: 'border-navy-900/10 bg-white text-navy-800',
  dark: 'border-white/12 bg-white/[0.04] text-white/80',
  gold: 'border-gold-500/30 bg-gold-500/10 text-gold-700',
};

export function Badge({ children, tone = 'light', icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 type-caption font-medium leading-5',
        tones[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** Small label that marks AI concept imagery so it is never mistaken for real project media. */
export function IllustrativeLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'pointer-events-none inline-flex items-center gap-1.5 rounded-full bg-navy-950/70 px-2.5 py-1 type-caption font-semibold text-white/85 backdrop-blur-sm',
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-300" />
      Illustrative concept
    </span>
  );
}
