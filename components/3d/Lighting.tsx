'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight, type DirectionalLight } from 'three';

export interface IntroLightingProps {
  energy?: number; // 0 (darkness) to 1.5 (peak buildup/impact)
  flash?: boolean;
}

export function Lighting({ energy = 1, flash = false }: IntroLightingProps) {
  const flashLightRef = useRef<PointLight>(null);
  const keyLightRef = useRef<DirectionalLight>(null);

  useFrame((_, delta) => {
    if (flashLightRef.current) {
      if (flash) {
        flashLightRef.current.intensity = Math.min(
          80,
          flashLightRef.current.intensity + delta * 200
        );
      } else {
        flashLightRef.current.intensity = Math.max(
          0,
          flashLightRef.current.intensity - delta * 40
        );
      }
    }
  });

  return (
    <>
      {/* Base soft ambient fill */}
      <ambientLight intensity={0.25 * energy} color="#8da6ce" />

      {/* Warm Golden Key Light */}
      <directionalLight
        ref={keyLightRef}
        position={[4, 5, 5]}
        intensity={2.4 * energy}
        color="#fff1c4"
        castShadow
      />

      {/* Deep Navy Rim / Counter Light */}
      <directionalLight
        position={[-5, -2, -3]}
        intensity={1.2 * energy}
        color="#1e3a8a"
      />

      {/* Central Core Gold Radiance Point */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={6 * energy}
        color="#d8a62a"
        distance={8}
      />

      {/* Dramatic Impact Flash Point Light */}
      <pointLight
        ref={flashLightRef}
        position={[0, 0, 2]}
        intensity={flash ? 60 : 0}
        color="#ffffff"
        distance={15}
      />
    </>
  );
}
