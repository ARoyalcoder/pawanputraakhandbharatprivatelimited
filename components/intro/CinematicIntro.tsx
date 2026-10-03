'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { IntroFallback } from './IntroFallback';
import { announceIntroComplete } from '@/lib/animations/heroCue';

const IntroController = dynamic(
  () => import('./IntroController').then((mod) => mod.IntroController),
  {
    ssr: false,
    loading: () => <IntroFallback onDismiss={() => {}} isLoading={true} />,
  }
);

export interface CinematicIntroProps {
  forceShow?: boolean;
}

/**
 * First-visit Cinematic 3D Intro Container.
 * Manages localStorage / session detection for first-time visitors vs returning visitors.
 * Renders the 3D Intro experience once on first visit, or allows testing via forceShow.
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
      const hasSeen = localStorage.getItem('ppab_intro_seen');
      if (!hasSeen) {
        setShouldShow(true);
      }
    } catch {
      // Default to false if cookies/storage blocked
      setShouldShow(false);
    }
  }, [forceShow]);

  if (!mounted || !shouldShow) return null;

  return (
    <IntroController
      onComplete={() => {
        setShouldShow(false);
        // Lets the hero start its 3D assembly as the intro hands over (lib/animations/heroCue.ts).
        announceIntroComplete();
      }}
    />
  );
}
