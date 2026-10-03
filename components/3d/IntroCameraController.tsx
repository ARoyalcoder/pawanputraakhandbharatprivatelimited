'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

export interface IntroCameraControllerProps {
  progress?: number; // 0 (start) to 1 (impact & beyond)
  shake?: number; // 0 to 1 intensity
  pointerParallax?: boolean;
}

export function IntroCameraController({
  progress = 0,
  shake = 0,
  pointerParallax = true,
}: IntroCameraControllerProps) {
  const currentPos = useRef(new Vector3(0, 0, 8.5));
  const lookAtTarget = useRef(new Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const cam = state.camera;
    const pointer = state.pointer;

    // Base position starts at z = 8.5, slowly dollies forward to z = 5.2
    const baseZ = MathUtils.lerp(8.5, 5.2, Math.min(1, progress * 1.1));

    // Subtle pointer parallax (cinematic sway)
    const swayX = pointerParallax ? pointer.x * 0.35 : 0;
    const swayY = pointerParallax ? pointer.y * 0.25 : 0;

    // Controlled dramatic impact shake
    let shakeOffsetX = 0;
    let shakeOffsetY = 0;
    if (shake > 0) {
      shakeOffsetX = (Math.random() - 0.5) * 0.18 * shake;
      shakeOffsetY = (Math.random() - 0.5) * 0.18 * shake;
    }

    const targetX = swayX + shakeOffsetX;
    const targetY = swayY + shakeOffsetY;
    const targetZ = baseZ;

    currentPos.current.x = MathUtils.damp(currentPos.current.x, targetX, 4.0, delta);
    currentPos.current.y = MathUtils.damp(currentPos.current.y, targetY, 4.0, delta);
    currentPos.current.z = MathUtils.damp(currentPos.current.z, targetZ, 4.0, delta);

    cam.position.copy(currentPos.current);
    cam.lookAt(lookAtTarget.current);
  });

  return null;
}
