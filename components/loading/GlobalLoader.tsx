'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { loadingManager } from '@/lib/loading/loadingManager';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { announceIntroComplete, INTRO_SEEN_KEY, INTRO_SESSION_KEY } from '@/lib/animations/heroCue';

// Dynamic import of the executive intro controller
const IntroController = dynamic(
  () => import('@/components/intro/IntroController').then((mod) => mod.IntroController),
  {
    ssr: false,
    loading: () => null,
  }
);

export interface GlobalLoaderProps {
  forceShow?: boolean;
}

/**
 * PPAB Global Loading Coordinator.
 * Unifies initial application shell loading and the cinematic brand reveal into ONE experience.
 *
 * Flow:
 * 1. First Visit:
 *    - Minimal branded shell
 *    - Critical assets ready
 *    - Executive ~1.85s brand intro
 *    - 60fps handover to homepage hero
 * 2. Returning Visit:
 *    - Instant bypass or 200ms soft transition (never blocks returning visitors)
 * 3. Supports manual preview via `?intro=true` or `forceShow` prop.
 */
export function GlobalLoader({ forceShow = false }: GlobalLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldShowIntro, setShouldShowIntro] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleComplete = useCallback(() => {
    loadingManager.completeIntro();
    setShouldShowIntro(false);
    announceIntroComplete();
  }, []);

  useEffect(() => {
    setMounted(true);

    if (forceShow) {
      setShouldShowIntro(true);
      return;
    }

    if (reducedMotion) {
      handleComplete();
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('intro') === 'true' || urlParams.get('replay') === 'true') {
        setShouldShowIntro(true);
        return;
      }

      const sessionSeen = sessionStorage.getItem(INTRO_SESSION_KEY) || sessionStorage.getItem('ppab_intro_completed');
      const localSeen = localStorage.getItem(INTRO_SEEN_KEY);

      if (!sessionSeen && !localSeen) {
        setShouldShowIntro(true);
      } else {
        // Returning visitor: immediate handover
        handleComplete();
      }
    } catch {
      handleComplete();
    }
  }, [forceShow, reducedMotion, handleComplete]);

  if (!mounted || !shouldShowIntro) return null;

  return <IntroController onComplete={handleComplete} />;
}
