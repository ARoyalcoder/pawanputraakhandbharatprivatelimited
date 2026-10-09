'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { qualitySettings, type QualitySettings, type QualityTier } from './DeviceCapability';
import { ReducedMotionFallback } from './ReducedMotionFallback';
import { ThreeErrorBoundary } from './ThreeErrorBoundary';
import { useQualityTier } from './useQualityTier';

export interface SceneContext {
  tier: Exclude<QualityTier, 'OFF'>;
  settings: QualitySettings;
  /** False while the canvas is scrolled out of view — scenes should stop their render loop. */
  visible: boolean;
}

interface CanvasWrapperProps {
  fallback: ReactNode;
  render: (ctx: SceneContext) => ReactNode;
  className?: string;
  /** How far outside the viewport to start loading the scene. */
  rootMargin?: string;
  /** Hold the scene back (showing the fallback) until this is true. */
  enabled?: boolean;
}

/**
 * Mounts a 3D scene only when it is near the viewport and the device can handle it,
 * pauses it off screen, and falls back to static content on OFF tier or any error.
 */
export function CanvasWrapper({ fallback, render, className, rootMargin = '300px', enabled = true }: CanvasWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useQualityTier();
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearObserver = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin });
    const visibleObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
    nearObserver.observe(el);
    visibleObserver.observe(el);
    // GPUs can drop WebGL contexts (memory pressure, too many contexts). The event does not
    // bubble, but a capture listener on the wrapper still sees it; show the fallback instead.
    const onContextLost = () => setContextLost(true);
    el.addEventListener('webglcontextlost', onContextLost, true);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
      el.removeEventListener('webglcontextlost', onContextLost, true);
    };
  }, [rootMargin]);

  const active = enabled && tier && tier !== 'OFF' && near && !contextLost;

  return (
    <div ref={ref} className={cn('relative size-full', className)}>
      {active ? (
        <ThreeErrorBoundary fallback={<ReducedMotionFallback>{fallback}</ReducedMotionFallback>}>
          {render({ tier, settings: qualitySettings[tier], visible })}
        </ThreeErrorBoundary>
      ) : (
        <ReducedMotionFallback>{fallback}</ReducedMotionFallback>
      )}
    </div>
  );
}
