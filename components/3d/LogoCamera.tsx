'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3, type Camera } from 'three';

interface LogoCameraProps {
  interactive?: boolean;
  intensity?: number;
  baseZ?: number;
}

/**
 * Camera controller for the 3D PPAB logo.
 * Implements subtle, luxurious pointer tracking (1–3 degrees tilt)
 * with smooth mathematical damping for organic responsiveness.
 */
export function LogoCamera({
  interactive = true,
  intensity = 1.0,
  baseZ = 4.2,
}: LogoCameraProps) {
  const { camera, pointer } = useThree();
  const targetLookAt = useRef(new Vector3(0, 0, 0));
  const currentPos = useRef(new Vector3(0, 0, baseZ));

  useFrame((_, delta) => {
    if (!interactive) return;

    // Smoothly constrain pointer input to subtle tilt angles (±1.5 to 3 degrees max)
    const targetX = MathUtils.clamp(pointer.x * 0.45 * intensity, -0.6, 0.6);
    const targetY = MathUtils.clamp(pointer.y * 0.35 * intensity, -0.5, 0.5);

    // Apply gentle damping (smooth deceleration)
    currentPos.current.x = MathUtils.damp(currentPos.current.x, targetX, 5.0, delta);
    currentPos.current.y = MathUtils.damp(currentPos.current.y, targetY, 5.0, delta);
    currentPos.current.z = baseZ;

    camera.position.copy(currentPos.current);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
