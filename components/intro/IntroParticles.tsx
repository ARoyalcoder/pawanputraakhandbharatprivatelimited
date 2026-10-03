'use client';

import React from 'react';
import { ParticleField } from '@/components/3d/ParticleField';

export interface IntroParticlesProps {
  count?: number;
  burstProgress?: number;
  energy?: number;
}

export function IntroParticles({
  count = 600,
  burstProgress = 0,
  energy = 1,
}: IntroParticlesProps) {
  return (
    <ParticleField
      count={count}
      burstProgress={burstProgress}
      energy={energy}
      color="#e2b23a"
      spread={15}
    />
  );
}
