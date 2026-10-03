import React from 'react';
import { ThreeLoader } from '@/components/loading/ThreeLoader';

/**
 * Global App Router Root Loading State.
 * Shown during initial route transitions and root Suspense boundaries.
 */
export default function GlobalRouteLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020b1d]">
      <ThreeLoader label="Loading PPAB Infrastructure" />
    </div>
  );
}
