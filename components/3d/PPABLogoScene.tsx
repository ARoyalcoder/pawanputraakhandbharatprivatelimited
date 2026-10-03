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
    <group ref={glintRef} position={[0.62 * radius, 0.62 * radius, 0.09]}>
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

/**
 * 3D Metallic Gold PPAB Medallion
 * True sculpted 3D emblem with 24K gold alloy bezel, ceramic core,
 * double-sided minted medallion structure, and continuous precession animation.
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

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
    >
      {/* 1. Deep Midnight Navy Ceramic Core Medallion */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.0, radius * 1.0, 0.12, 64]} />
        <meshStandardMaterial
          color="#041228"
          roughness={0.25}
          metalness={0.8}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* 2. Outer Heavy 24K Polished Gold Beveled Bezel Ring */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[radius * 0.99, 0.058, 24, 64]} />
        <meshStandardMaterial
          color="#f5cc66"
          roughness={0.12}
          metalness={0.96}
          emissive="#66470c"
          emissiveIntensity={0.25}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* 3. Concentric Inner Stepped Gold Rim (Front) */}
      <mesh position={[0, 0, 0.035]}>
        <ringGeometry args={[radius * 0.88, radius * 0.92, 64]} />
        <meshStandardMaterial
          color="#d8a62a"
          roughness={0.2}
          metalness={0.95}
          side={DoubleSide}
        />
      </mesh>

      {/* 4. Deep Midnight-Navy Ceramic Cavity Disc (Front) */}
      <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.89, radius * 0.91, 0.04, 64]} />
        <meshStandardMaterial
          color="#030c1e"
          roughness={0.4}
          metalness={0.5}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* 5. FRONT FACE: Sculpted 3D Gold Emblem Relief with High Letter Clarity */}
      <mesh position={[0, 0, 0.078]}>
        <planeGeometry args={[radius * 1.7, radius * 1.65]} />
        <meshStandardMaterial
          map={texture}
          alphaMap={texture}
          transparent
          alphaTest={0.04}
          color="#ffffff"
          roughness={0.14}
          metalness={0.82}
          bumpMap={texture}
          bumpScale={0.035}
          emissive="#ffcc44"
          emissiveMap={texture}
          emissiveIntensity={0.65}
          side={DoubleSide}
        />
      </mesh>

      {/* 6. BACK FACE: Minted Royal Gold Coin Reverse Relief */}
      <group position={[0, 0, -0.065]} rotation={[0, Math.PI, 0]}>
        {/* Concentric guilloche rings on the back */}
        <mesh position={[0, 0, 0.005]}>
          <ringGeometry args={[radius * 0.72, radius * 0.76, 64]} />
          <meshStandardMaterial color="#f4c95d" roughness={0.18} metalness={0.95} side={DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <ringGeometry args={[radius * 0.5, radius * 0.54, 64]} />
          <meshStandardMaterial color="#e2b23a" roughness={0.2} metalness={0.92} side={DoubleSide} />
        </mesh>
        {/* Central golden royal emblem on the reverse side */}
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[radius * 1.45, radius * 1.4]} />
          <meshStandardMaterial
            map={texture}
            alphaMap={texture}
            transparent
            alphaTest={0.04}
            color="#f7d478"
            roughness={0.15}
            metalness={0.94}
            emissive="#523608"
            emissiveIntensity={0.2}
            side={DoubleSide}
          />
        </mesh>
      </group>

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
