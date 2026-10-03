'use client';

import React from 'react';
import { GlobalLoader } from '@/components/loading/GlobalLoader';

export interface CinematicIntroProps {
  forceShow?: boolean;
}

/**
 * First-visit Cinematic Executive Intro & Smooth Loading Experience.
 * Powered by centralized GlobalLoader system.
 */
export function CinematicIntro({ forceShow = false }: CinematicIntroProps) {
  return <GlobalLoader forceShow={forceShow} />;
}
