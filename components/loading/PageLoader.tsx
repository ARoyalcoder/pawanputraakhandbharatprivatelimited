'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingProgress } from './LoadingProgress';

/**
 * Top Route Navigation Loading Bar.
 * Listens to pathname changes and paints a discrete, luxurious gold progress line.
 * Eliminates sudden blank screens or unresponsive link clicks.
 *
 * `useSearchParams` opts everything up to the nearest Suspense boundary out of server rendering,
 * so the bar gets a boundary of its own; without it the whole site shell renders in the browser only.
 */
export function PageLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationProgress />
    </Suspense>
  );
}

function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // When route changes, briefly pulse and reset
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isNavigating) return null;

  return (
    <div
      role="progressbar"
      aria-label="Navigating page"
      className="fixed inset-x-0 top-0 z-[999] pointer-events-none"
    >
      <LoadingProgress height="h-[2.5px]" />
    </div>
  );
}
