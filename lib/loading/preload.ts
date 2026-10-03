'use client';

import { preloadImage, canPreloadHeavyAssets } from './assetLoader';

/**
 * Preload critical brand logo and hero visual assets on initial load.
 */
export function preloadCriticalBrandAssets(): void {
  if (typeof window === 'undefined') return;

  // Preload primary PPAB mark
  preloadImage('/brand/ppab-mark.png');
}

/**
 * Preload next likely solution background when hovering or near section.
 */
export function preloadNextSolution(solutionId: string): void {
  if (!canPreloadHeavyAssets()) return;
  preloadImage(`/images/solutions/${solutionId}.jpg`);
}

/**
 * Preload next likely industry photography.
 */
export function preloadNextIndustry(industryImageSrc: string): void {
  if (!canPreloadHeavyAssets() || !industryImageSrc) return;
  preloadImage(industryImageSrc);
}
