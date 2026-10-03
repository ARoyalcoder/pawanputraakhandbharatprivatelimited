'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useMediaQuery';

export interface LoadingTransitionProps {
  children: React.ReactNode;
  show?: boolean;
  className?: string;
  duration?: number; // ms
}

/**
 * Soft route or component transition wrapper.
 * Prevents abrupt white flashes or harsh jumps.
 */
export function LoadingTransition({
  children,
  show = true,
  className,
  duration = 300,
}: LoadingTransitionProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      style={{ transitionDuration: `${duration}ms` }}
      className={cn(
        'transition-all ease-[cubic-bezier(0.16,1,0.3,1)]',
        show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.99] pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
}
