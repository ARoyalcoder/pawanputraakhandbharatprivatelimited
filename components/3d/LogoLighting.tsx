'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type PointLight, type DirectionalLight } from 'three';

interface LogoLightingProps {
  enableShineSweep?: boolean;
  intensity?: number;
}

/**
 * Cinematic multi-point lighting + traveling specular shine sweep for the 3D PPAB Logo.
 * Designed to accentuate the polished metallic 24K gold contours against deep navy environments.
 */
export function LogoLighting({ enableShineSweep = true, intensity = 1.0 }: LogoLightingProps) {
  const sweepLightRef = useRef<PointLight>(null);
  const orbitalLightRef = useRef<PointLight>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // 1. Orbital warm rim light orbiting smoothly around the gold edge
    if (orbitalLightRef.current) {
      const angle = t * 1.2;
      orbitalLightRef.current.position.set(
        Math.cos(angle) * 2.8,
        Math.sin(angle) * 2.8,
        1.8
      );
    }

    // 2. Animate a periodic gold shine sweep every 4.5 seconds
    if (enableShineSweep && sweepLightRef.current) {
      const cycle = t % 4.5;
      const isSweeping = cycle < 1.4;

      if (isSweeping) {
        const progress = cycle / 1.4; // 0 -> 1
        const x = MathUtils.lerp(-2.8, 2.8, progress);
        const y = MathUtils.lerp(-0.5, 0.8, progress);
        const sweepIntensity = Math.sin(progress * Math.PI) * 5.5 * intensity;

        sweepLightRef.current.position.set(x, y, 2.0);
        sweepLightRef.current.intensity = sweepIntensity;
      } else {
        sweepLightRef.current.intensity = MathUtils.damp(sweepLightRef.current.intensity, 0, 5.0, delta);
      }
    }
  });

  return (
    <group>
      {/* 1. Ambient Navy Deep Fill */}
      <ambientLight color="#081836" intensity={1.1 * intensity} />

      {/* 2. Primary Warm Golden Key Light (Sculpts the metallic relief) */}
      <directionalLight
        position={[3.2, 3.8, 4.2]}
        color="#fff2d1"
        intensity={3.2 * intensity}
        castShadow
      />

      {/* 3. Cool Navy/Cyan Edge Rim Light (Sharp contrast against dark navy) */}
      <directionalLight
        position={[-3.8, -2.4, -2.2]}
        color="#3b78cf"
        intensity={1.6 * intensity}
      />

      {/* 4. Bottom Warm Gold Ground Bounce Light */}
      <pointLight
        position={[0, -2.8, 2.2]}
        color="#f4c95d"
        intensity={2.4 * intensity}
        distance={9}
      />

      {/* 5. Orbital Rim Glint Light */}
      <pointLight
        ref={orbitalLightRef}
        position={[2.0, 2.0, 1.8]}
        color="#ffe8a8"
        intensity={2.2 * intensity}
        distance={6}
        decay={2}
      />

      {/* 6. Dedicated PPAB Letter Fill Light (Ensures crystal-clear legibility) */}
      <pointLight
        position={[0, -0.4, 1.8]}
        color="#fff4cc"
        intensity={2.0 * intensity}
        distance={5}
        decay={2}
      />

      {/* 7. Traveling Specular Shine Sweep Light */}
      <pointLight
        ref={sweepLightRef}
        position={[-2.8, 0, 2.0]}
        color="#ffffff"
        intensity={0}
        distance={7}
        decay={2}
      />
    </group>
  );
}
