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
 * Smooth pointer parallax and scroll-linked dolly. Reads the window pointer, so it
 * works even when DOM content sits on top of the canvas.
 */
export function CameraController({ base, sway = [0.6, 0.35], progressRef, lookAt = [0, 0, 0], pointer = true }: CameraControllerProps) {
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
    const angle = progress * 0.5;
    const distance = base[2] + progress * 2.2;
    const tx = base[0] + target.current.x * sway[0] + Math.sin(angle) * distance * 0.35;
    const ty = base[1] + target.current.y * sway[1] + progress * 0.8;
    const tz = Math.cos(angle) * distance;
    cam.position.x = MathUtils.damp(cam.position.x, tx, 3, delta);
    cam.position.y = MathUtils.damp(cam.position.y, ty, 3, delta);
    cam.position.z = MathUtils.damp(cam.position.z, tz, 3, delta);
    cam.lookAt(look.current);
  });

  return null;
}
