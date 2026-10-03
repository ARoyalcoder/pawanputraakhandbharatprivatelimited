'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import {
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  type MeshPhysicalMaterial,
} from 'three';

export interface IntroObjectProps {
  approachProgress?: number; // 0 (far away) to 1 (center impact)
  rotationSpeed?: number;
  glowIntensity?: number;
}

/**
 * SCENE 03 & 04 — MYSTERIOUS GOLDEN OBJECT
 * A premium metallic gold 3D object inspired by the central emblem of PPAB.
 * Polished gold, subtle roughness variations, authentic depth, and lighting reaction.
 * Approaches camera with GSAP/frame control.
 */
export function IntroObject({
  approachProgress = 0,
  rotationSpeed = 0.4,
  glowIntensity = 1,
}: IntroObjectProps) {
  const groupRef = useRef<Group>(null);
  const ringRefA = useRef<Mesh>(null);
  const ringRefB = useRef<Mesh>(null);

  // Load PPAB official brand mark texture for central medallion
  const texture = useTexture('/brand/ppab-mark.png');

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Orbital ring rotations
    if (ringRefA.current) {
      ringRefA.current.rotation.z += delta * 0.7;
      ringRefA.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
    if (ringRefB.current) {
      ringRefB.current.rotation.z -= delta * 0.5;
      ringRefB.current.rotation.y = Math.cos(time * 0.4) * 0.2;
    }

    // Slow, dramatic emblem rotation
    groupRef.current.rotation.y = Math.sin(time * 0.6) * 0.15;
    groupRef.current.rotation.x = 0.05 + Math.cos(time * 0.4) * 0.08;

    // Camera approach translation: starts back at z = -7, reaches center at z = 0
    const targetZ = MathUtils.lerp(-7, 0.4, approachProgress);
    const targetScale = MathUtils.lerp(0.35, 1.1, approachProgress);

    groupRef.current.position.z = MathUtils.damp(
      groupRef.current.position.z,
      targetZ,
      3.5,
      delta
    );
    groupRef.current.scale.setScalar(
      MathUtils.damp(groupRef.current.scale.x, targetScale, 3.5, delta)
    );
  });

  const radius = 1.35;

  return (
    <group ref={groupRef} position={[0, 0, -7]}>
      {/* 1. Deep Navy Ceramic Emblem Backplate */}
      <mesh position={[0, 0, -0.08]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.05, radius * 1.08, 0.1, 64]} />
        <meshStandardMaterial
          color="#06152f"
          roughness={0.35}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Outer 24K Polished Gold Stepped Chamfered Rim */}
      <mesh position={[0, 0, -0.02]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.08, radius * 1.04, 0.08, 64]} />
        <meshStandardMaterial
          color="#d8a62a"
          metalness={0.94}
          roughness={0.18}
          emissive="#78530f"
          emissiveIntensity={0.35 * glowIntensity}
        />
      </mesh>

      {/* 3. Golden PPAB Front Face Medallion with brand texture */}
      <mesh position={[0, 0, 0.05]} castShadow receiveShadow>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial
          map={texture}
          color="#ffffff"
          metalness={0.82}
          roughness={0.22}
          transparent
          alphaTest={0.05}
          emissive="#d8a62a"
          emissiveIntensity={0.25 * glowIntensity}
        />
      </mesh>

      {/* 4. Concentric Orbital Gold Energy Rings */}
      <mesh ref={ringRefA} position={[0, 0, 0]}>
        <torusGeometry args={[radius * 1.32, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#f4c95d"
          metalness={0.96}
          roughness={0.12}
          emissive="#c4921e"
          emissiveIntensity={0.5 * glowIntensity}
        />
      </mesh>

      <mesh ref={ringRefB} position={[0, 0, 0]}>
        <torusGeometry args={[radius * 1.52, 0.018, 16, 100]} />
        <meshStandardMaterial
          color="#e2b23a"
          metalness={0.92}
          roughness={0.2}
          emissive="#8a6109"
          emissiveIntensity={0.4 * glowIntensity}
        />
      </mesh>

      {/* 5. Center Gold Spark Anchor */}
      <pointLight
        position={[0, 0, 0.4]}
        intensity={3.5 * glowIntensity}
        color="#ffe699"
        distance={4.5}
      />
    </group>
  );
}
