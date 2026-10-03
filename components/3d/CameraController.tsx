'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

interface CameraControllerProps {
  /** Resting camera position. */
  base: [number, number, number];
  /** How far the camera sways with the pointer. */
  sway?: [number, number];
  /** 0–1 scroll progress through the section; pulls the camera back and orbits slightly. */
  progressRef?: RefObject<number>;
  lookAt?: [number, number, number];
  pointer?: boolean;
}

/**
 * Cinematic Camera Controller
 * Combines GSAP ScrollTrigger-linked camera dolly & arc with
 * ultra-smooth inertia-damped mouse parallax and gentle organic breathing.
 */
export function CameraController({
  base,
  sway = [0.45, 0.28],
  progressRef,
  lookAt = [0, 0, 0],
  pointer = true,
}: CameraControllerProps) {
  const target = useRef({ x: 0, y: 0 });
  const look = useRef(new Vector3(...lookAt));

  useEffect(() => {
    if (!pointer) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointer]);

  useFrame((state, delta) => {
    const progress = progressRef?.current ?? 0;
    const cam = state.camera;
    const t = state.clock.getElapsedTime();

    // Subtle organic breathing motion (alive at 60fps even without mouse movement)
    const breatheX = Math.sin(t * 0.4) * 0.04;
    const breatheY = Math.cos(t * 0.3) * 0.03;

    // Scroll-linked cinematic crane dolly & perspective widening
    const scrollAngle = progress * 0.42;
    const distance = base[2] + progress * 2.4;

    // Smooth target calculation
    const tx = base[0] + target.current.x * sway[0] + Math.sin(scrollAngle) * distance * 0.32 + breatheX;
    const ty = base[1] + target.current.y * sway[1] + progress * 0.75 + breatheY;
    const tz = Math.cos(scrollAngle) * distance;

    // Inertia damping for buttery smoothness
    cam.position.x = MathUtils.damp(cam.position.x, tx, 3.2, delta);
    cam.position.y = MathUtils.damp(cam.position.y, ty, 3.2, delta);
    cam.position.z = MathUtils.damp(cam.position.z, tz, 3.2, delta);

    // LookAt follows with gentle offset
    const lookTarget = new Vector3(
      lookAt[0] + target.current.x * 0.08,
      lookAt[1] + target.current.y * 0.06 - progress * 0.3,
      lookAt[2]
    );
    look.current.lerp(lookTarget, 0.08);
    cam.lookAt(look.current);
  });

  return null;
}
