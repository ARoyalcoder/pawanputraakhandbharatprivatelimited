'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { announceIntroComplete, INTRO_SEEN_KEY, INTRO_SESSION_KEY } from '@/lib/animations/heroCue';

const IntroController = dynamic(
  () => import('./IntroController').then((mod) => mod.IntroController),
  {
    ssr: false,
    loading: () => null,
  }
);

export interface CinematicIntroProps {
  forceShow?: boolean;
}

/**
 * First-visit Cinematic Executive Intro & Smooth Loading Experience.
 * Manages session/local detection for seamless first-time visitor onboarding.
 * Automatically hands over to the hero section at 60 FPS.
 */
export function CinematicIntro({ forceShow = false }: CinematicIntroProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (forceShow) {
      setShouldShow(true);
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('intro') === 'true' || urlParams.get('replay') === 'true') {
        setShouldShow(true);
        return;
      }

      const sessionSeen = sessionStorage.getItem(INTRO_SESSION_KEY);
      const localSeen = localStorage.getItem(INTRO_SEEN_KEY);

      if (!sessionSeen && !localSeen) {
        setShouldShow(true);
      } else {
        // If already seen, immediately release the hero without delay
        announceIntroComplete();
      }
    } catch {
      // Storage blocked (strict sandbox/cookies): release hero immediately
      setShouldShow(false);
      announceIntroComplete();
    }
  }, [forceShow]);

  if (!mounted || !shouldShow) return null;

  return (
    <IntroController
      onComplete={() => {
        setShouldShow(false);
        announceIntroComplete();
      }}
    />
  );
}
