'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  MathUtils,
  Points,
  ShaderMaterial,
  Vector3,
} from 'three';

export interface ParticleFieldProps {
  count?: number;
  burstProgress?: number; // 0 to 1
  energy?: number;
  color?: string;
  spread?: number;
}

export function ParticleField({
  count = 600,
  burstProgress = 0,
  energy = 1,
  color = '#e2b23a',
  spread = 14,
}: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);

  const { positions, velocities, phases, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Golden spiral / spherical distribution with depth
      const radius = MathUtils.randFloat(1.2, spread);
      const theta = MathUtils.randFloat(0, Math.PI * 2);
      const phi = MathUtils.randFloat(-Math.PI / 2, Math.PI / 2);

      const x = radius * Math.cos(phi) * Math.sin(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.cos(theta) - 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Radial velocities for dramatic shockwave / burst effect
      const dir = new Vector3(x, y, z).normalize();
      const speed = MathUtils.randFloat(3.5, 9.0);
      vel[i * 3] = dir.x * speed;
      vel[i * 3 + 1] = dir.y * speed;
      vel[i * 3 + 2] = dir.z * speed;

      ph[i] = MathUtils.randFloat(0, Math.PI * 2);
      sc[i] = MathUtils.randFloat(0.6, 2.4);
    }

    return { positions: pos, velocities: vel, phases: ph, scales: sc };
  }, [count, spread]);

  const initialPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as BufferAttribute;
    const array = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ph = phases[i];
      const sc = scales[i];

      if (burstProgress > 0) {
        // Explode outward along velocity vector
        const easeBurst = Math.min(1, burstProgress * 1.4);
        array[idx] = initialPositions[idx] + velocities[idx] * easeBurst * 1.8;
        array[idx + 1] = initialPositions[idx + 1] + velocities[idx + 1] * easeBurst * 1.8;
        array[idx + 2] = initialPositions[idx + 2] + velocities[idx + 2] * easeBurst * 1.8;
      } else {
        // Floating cinematic dust & spark dynamics
        const floatY = Math.sin(time * 0.8 + ph) * 0.15 * energy;
        const driftX = Math.cos(time * 0.5 + ph) * 0.08 * energy;

        array[idx] = initialPositions[idx] + driftX;
        array[idx + 1] = initialPositions[idx + 1] + floatY;
        array[idx + 2] = initialPositions[idx + 2] + Math.sin(time * 0.4 + ph) * 0.1;
      }
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.03 * energy;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color={color}
        transparent
        opacity={0.85}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
