'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import {
  DoubleSide,
  MathUtils,
  Vector3,
  type Group,
  type Mesh,
} from 'three';
import { LogoCamera } from './LogoCamera';
import { LogoLighting } from './LogoLighting';

export interface PPABLogoSceneProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  variant?: 'header' | 'hero' | 'footer' | 'intro';
  interactive?: boolean;
  reducedMotion?: boolean;
  onLoaded?: () => void;
}

/**
 * Star glint sparkle mesh that gleams at the apex of the gold rim.
 */
function StarGlint({ radius }: { radius: number }) {
  const glintRef = useRef<Group>(null);

  useFrame((state) => {
    if (!glintRef.current) return;
    const t = state.clock.getElapsedTime();
    // Pulse and rotate the star glint periodically
    const cycle = (t * 0.8) % Math.PI;
    const scale = Math.max(0, Math.sin(cycle * 2.0)) * 1.2;
    glintRef.current.scale.setScalar(scale);
    glintRef.current.rotation.z = t * 1.5;
  });

  return (
    <group ref={glintRef} position={[0.02 * radius, 0.98 * radius, 0.1]}>
      {/* Horizontal ray */}
      <mesh>
        <planeGeometry args={[0.18, 0.02]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} side={DoubleSide} />
      </mesh>
      {/* Vertical ray */}
      <mesh>
        <planeGeometry args={[0.02, 0.18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} side={DoubleSide} />
      </mesh>
      {/* Center glowing core */}
      <mesh>
        <circleGeometry args={[0.035, 16]} />
        <meshBasicMaterial color="#ffeaa7" transparent opacity={0.95} side={DoubleSide} />
      </mesh>
    </group>
  );
}

/** Width over height of /brand/ppab-mark.png. */
const MARK_ASPECT = 331 / 320;
/** Thickness of the mark, and where the layers that fill it sit. */
const DEPTH = 0.14;
const EDGE_LAYERS = Array.from({ length: 6 }, (_, i) => -DEPTH / 2 + ((i + 0.5) * DEPTH) / 6);

/**
 * 3D gold PPAB mark: the official artwork on its own, with no disc behind it, given thickness
 * by stacked layers so it reads as solid metal as it sways, tilts to the pointer and spins.
 */
function EmblemMesh({
  variant = 'header',
  interactive = true,
  reducedMotion = false,
  onLoaded,
}: {
  variant?: 'header' | 'hero' | 'footer' | 'intro';
  interactive?: boolean;
  reducedMotion?: boolean;
  onLoaded?: () => void;
}) {
  const groupRef = useRef<Group>(null);
  const spinAngleRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { pointer } = useThree();

  // Load official PPAB mark texture
  const texture = useTexture('/brand/ppab-mark.png', () => {
    onLoaded?.();
  });

  // Hover 360-degree celebratory spin trigger
  const handlePointerOver = () => {
    setHovered(true);
    if (!reducedMotion) {
      // Add a full 360-degree rotation (2 * PI) on each hover entrance
      spinAngleRef.current += Math.PI * 2;
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  const handlePointerDown = () => {
    setClicked(true);
    if (!reducedMotion) {
      spinAngleRef.current += Math.PI * 2;
    }
    setTimeout(() => setClicked(false), 260);
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const t = state.clock.getElapsedTime();

      // 1. Hypnotic Continuous 3D Precession Motion:
      // Rhythmic yaw oscillation (±20 degrees) showing off the gold rim facets
      const idleYaw = Math.sin(t * 1.1) * 0.35;
      // Gentle pitch nodding (±8 degrees) catching top/bottom specular gleams
      const idlePitch = Math.cos(t * 0.9) * 0.14;
      // Slight bank roll (±4 degrees)
      const idleRoll = Math.sin(t * 0.7) * 0.07;

      // 2. Pointer parallax tracking
      const pointerYaw = interactive ? pointer.x * 0.28 : 0;
      const pointerPitch = interactive ? -pointer.y * 0.22 : 0;

      // 3. Combine idle precession + hover 360 spins + pointer tracking
      const targetRotY = spinAngleRef.current + idleYaw + pointerYaw;
      const targetRotX = idlePitch + pointerPitch;
      const targetRotZ = idleRoll;

      // Silky-smooth mathematical damping
      groupRef.current.rotation.y = MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4.5, delta);
      groupRef.current.rotation.x = MathUtils.damp(groupRef.current.rotation.x, targetRotX, 5.0, delta);
      groupRef.current.rotation.z = MathUtils.damp(groupRef.current.rotation.z, targetRotZ, 5.0, delta);

      // Levitation floating on Y
      groupRef.current.position.y = Math.sin(t * 1.8) * 0.04;

      // Scale bounce on hover / click
      const targetScale = clicked ? 0.92 : hovered ? 1.08 : 1.0;
      groupRef.current.scale.setScalar(
        MathUtils.damp(groupRef.current.scale.x, targetScale, 6.0, delta)
      );
    }
  });

  const isHero = variant === 'hero' || variant === 'intro';
  const radius = isHero ? 1.55 : 1.08;
  // The mark fills the frame, at the artwork's own proportions.
  const width = radius * (isHero ? 1.85 : 2);
  const height = width / MARK_ASPECT;

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
    >
      {/* Edge: copies of the mark stacked behind the face, in deeper gold, give it thickness */}
      {EDGE_LAYERS.map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={texture} alphaTest={0.5} color="#a8791c" roughness={0.35} metalness={0.9} side={DoubleSide} />
        </mesh>
      ))}

      {/* Front face: the official gold mark */}
      <mesh position={[0, 0, DEPTH / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          alphaTest={0.5}
          roughness={0.16}
          metalness={0.8}
          bumpMap={texture}
          bumpScale={0.035}
          emissive="#ffcc44"
          emissiveMap={texture}
          emissiveIntensity={0.95}
        />
      </mesh>

      {/* Back face: the same mark turned round, so it reads correctly mid-spin */}
      <mesh position={[0, 0, -DEPTH / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          alphaTest={0.5}
          roughness={0.16}
          metalness={0.8}
          emissive="#ffcc44"
          emissiveMap={texture}
          emissiveIntensity={0.95}
        />
      </mesh>

      {/* 7. Rotating Apex Star Glint Sparkle */}
      {!reducedMotion && <StarGlint radius={radius} />}
    </group>
  );
}

export function PPABLogoScene({
  size = 'md',
  variant = 'header',
  interactive = true,
  reducedMotion = false,
  onLoaded,
}: PPABLogoSceneProps) {
  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  const isHero = variant === 'hero' || variant === 'intro';
  const cameraZ = isHero ? 4.6 : 3.8;

  return (
    <>
      <LogoLighting enableShineSweep={!reducedMotion} intensity={isHero ? 1.3 : 1.1} />
      <LogoCamera interactive={interactive && !reducedMotion} baseZ={cameraZ} intensity={isHero ? 1.1 : 0.8} />

      <EmblemMesh
        variant={variant}
        interactive={interactive}
        reducedMotion={reducedMotion}
        onLoaded={onLoaded}
      />
    </>
  );
}

export default PPABLogoScene;
