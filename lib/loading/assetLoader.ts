'use client';

/**
 * Intelligent asset loader that obeys device and network conditions.
 * Never stalls the main thread or saturates bandwidth on slow connections.
 */

export function canPreloadHeavyAssets(): boolean {
  if (typeof navigator === 'undefined') return false;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };

  // Do not preload heavy assets if Save-Data is enabled
  if (nav.connection?.saveData) return false;

  // Do not preload on 2G or slow connections
  const effectiveType = nav.connection?.effectiveType;
  if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
    return false;
  }

  // Check low memory devices (e.g. <= 2GB RAM)
  if (nav.deviceMemory && nav.deviceMemory <= 2) {
    return false;
  }

  return true;
}

/**
 * Safely preloads an image without throwing uncaught exceptions.
 */
export function preloadImage(src: string): Promise<boolean> {
  if (typeof window === 'undefined' || !src) return Promise.resolve(false);

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}

/**
 * Preload critical media list in priority order with concurrency limits.
 */
export async function preloadCriticalMedia(urls: string[], maxConcurrent = 3): Promise<void> {
  if (!canPreloadHeavyAssets() || !urls.length) return;

  const queue = [...urls];
  const workers = Array(Math.min(queue.length, maxConcurrent))
    .fill(null)
    .map(async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        if (url) {
          await preloadImage(url);
        }
      }
    });

  await Promise.all(workers);
}
