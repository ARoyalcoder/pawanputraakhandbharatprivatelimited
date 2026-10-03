'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { DoubleSide, MathUtils, type Group, type Mesh } from 'three';

const WHITE = '#f0f4fa';
const NAVY_DARK = '#07152b';
const NAVY_MID = '#0f2444';
const GOLD = '#f4c95d';

export interface ModuleProps {
  accent: string;
  isActive?: boolean;
}

/**
 * 1. PAWAN PUTRA SECURE
 * Next-Gen Precision Optical LiDAR Surveillance Pod
 * Matte dark titanium body, sapphire optical lens, and pulsing laser aperture ring.
 */
export function CameraModule({ accent, isActive = false }: ModuleProps) {
  const headRef = useRef<Group>(null);
  const pulseRingRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (headRef.current) {
      // Subtle organic surveillance pan
      const t = state.clock.getElapsedTime();
      const pan = Math.sin(t * 0.8) * 0.12;
      headRef.current.rotation.y = MathUtils.damp(headRef.current.rotation.y, pan - 0.45, 3.5, delta);
    }
    if (pulseRingRef.current) {
      const scale = isActive ? 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.08 : 1;
      pulseRingRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group scale={0.9}>
      {/* Precision Gimbal Mounting Arm */}
      <mesh position={[-0.32, -0.15, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.35, 16]} />
        <meshStandardMaterial color="#334766" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-0.32, 0.04, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#476085" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Sensor Head Group */}
      <group ref={headRef} position={[-0.1, 0.06, 0]}>
        {/* Aerodynamic Titanium Main Housing */}
        <RoundedBox args={[0.62, 0.28, 0.28]} radius={0.06} position={[0, 0, 0]}>
          <meshStandardMaterial color={NAVY_DARK} metalness={0.7} roughness={0.3} />
        </RoundedBox>

        {/* Top Protective Heat Shield Cowling */}
        <RoundedBox args={[0.66, 0.04, 0.3]} radius={0.015} position={[0.02, 0.15, 0]}>
          <meshStandardMaterial color={WHITE} metalness={0.4} roughness={0.2} />
        </RoundedBox>

        {/* Front Optical Bevel Collar */}
        <mesh position={[0.32, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.125, 0.135, 0.05, 32]} />
          <meshStandardMaterial color="#1a2e4c" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Front Sapphire Convex Camera Lens */}
        <mesh position={[0.345, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <sphereGeometry args={[0.115, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#020813"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={2.5}
          />
        </mesh>

        {/* Active Teal LiDAR Laser Aperture Ring */}
        <mesh ref={pulseRingRef} position={[0.35, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.085, 0.115, 32]} />
          <meshBasicMaterial color={accent} side={DoubleSide} toneMapped={false} />
        </mesh>

        {/* Status LED Telemetry Dot */}
        <mesh position={[0.18, 0.1, 0.145]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

const NETWORK_NODES: [number, number, number][] = [
  [0, 0, 0],
  [0.42, 0.26, 0.12],
  [-0.38, 0.3, -0.1],
  [0.32, -0.32, 0.14],
  [-0.4, -0.22, 0.08],
  [0.04, 0.52, -0.16],
  [0.08, -0.48, -0.2],
];

/**
 * 2. PAWAN PUTRA CONNECT
 * High-Throughput Quantum Network Nexus
 * Crystalline data octahedron with orbiting satellite nodes and laser pulse links.
 */
export function NetworkModule({ accent, isActive = false }: ModuleProps) {
  const coreRef = useRef<Mesh>(null);
  const ringRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * (isActive ? 1.4 : 0.6);
      coreRef.current.rotation.x += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * (isActive ? 0.8 : 0.35);
    }
  });

  return (
    <group scale={0.92}>
      {/* Central Pulsing Data Core Octahedron */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={isActive ? 1.8 : 0.9}
          roughness={0.15}
          metalness={0.85}
          toneMapped={false}
        />
      </mesh>

      {/* Orbiting Laser Data Wave Ring */}
      <group ref={ringRef} rotation={[Math.PI / 3, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[0.48, 0.012, 16, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.65} toneMapped={false} />
        </mesh>
        <mesh position={[0.48, 0, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>

      {/* Satellite Connected Micro-Nodes */}
      {NETWORK_NODES.slice(1).map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? accent : WHITE}
              emissive={i % 2 === 0 ? accent : '#000000'}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 3. PAWAN PUTRA SOLAR
 * Precision Photovoltaic Energy Wing
 * Monocrystalline silicon cells, polished 24K gold busbars, and radiant solar corona ring.
 */
export function SolarModule({ accent, isActive = false }: ModuleProps) {
  const panelRef = useRef<Group>(null);
  const coronaRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (panelRef.current) {
      // Gentle sun-tracking inclination sway
      const t = state.clock.getElapsedTime();
      panelRef.current.rotation.x = 0.85 + Math.sin(t * 0.6) * 0.05;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z += delta * 0.2;
      const s = isActive ? 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.06 : 1;
      coronaRef.current.scale.setScalar(s);
    }
  });

  const cells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      cells.push(
        <mesh key={`${r}-${c}`} position={[-0.33 + c * 0.22, 0.022, -0.18 + r * 0.18]}>
          <boxGeometry args={[0.19, 0.015, 0.15]} />
          <meshStandardMaterial
            color="#09254d"
            metalness={0.88}
            roughness={0.16}
            envMapIntensity={2.0}
          />
        </mesh>
      );
    }
  }

  return (
    <group scale={0.92}>
      {/* Aerospace Stand / Pivot */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.45, 16]} />
        <meshStandardMaterial color="#476085" metalness={0.85} roughness={0.25} />
      </mesh>

      <group ref={panelRef} position={[0, 0.05, 0]}>
        {/* Polished Gold Chassis Frame */}
        <RoundedBox args={[0.96, 0.03, 0.66]} radius={0.02}>
          <meshStandardMaterial
            color={GOLD}
            metalness={0.94}
            roughness={0.2}
            emissive="#5a3d08"
            emissiveIntensity={0.2}
          />
        </RoundedBox>

        {/* Monocrystalline Silicon Photovoltaic Cells */}
        {cells}

        {/* Radiant Solar Corona Energy Ring */}
        <mesh ref={coronaRef} position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.56, 0.014, 16, 64]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={isActive ? 0.75 : 0.35}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 4. PAWAN PUTRA DIGITAL
 * Holographic Glassmorphic Cloud Platform
 * Floating translucent glass deck with illuminated telemetry spline and glowing cybernetic matrices.
 */
export function DigitalModule({ accent, isActive = false }: ModuleProps) {
  const waveRef = useRef<Group>(null);
  const deckRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (waveRef.current) {
      waveRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.04;
    }
    if (deckRef.current) {
      const t = state.clock.getElapsedTime();
      deckRef.current.rotation.y = MathUtils.damp(
        deckRef.current.rotation.y,
        -0.25 + Math.sin(t * 0.7) * 0.06,
        3.0,
        delta
      );
    }
  });

  return (
    <group ref={deckRef} scale={0.92}>
      {/* 1. Primary Frosted Obsidian Glass Display Slab */}
      <RoundedBox args={[0.82, 0.54, 0.035]} radius={0.03} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={NAVY_DARK}
          roughness={0.15}
          metalness={0.6}
          transparent
          opacity={0.88}
        />
      </RoundedBox>

      {/* 2. Chamfer Gold/Purple Accent Rim */}
      <mesh position={[0, 0, -0.018]}>
        <planeGeometry args={[0.84, 0.56]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} side={DoubleSide} />
      </mesh>

      {/* 3. Holographic Header Telemetry Bar */}
      <mesh position={[0, 0.19, 0.024]}>
        <boxGeometry args={[0.68, 0.025, 0.005]} />
        <meshBasicMaterial color={WHITE} transparent opacity={0.7} />
      </mesh>

      {/* 4. Dynamic Digital Metric Bars with High-Tech Glow */}
      <group ref={waveRef}>
        {[0.14, 0.24, 0.18, 0.32, 0.26, 0.38].map((h, i) => (
          <mesh key={i} position={[-0.26 + i * 0.105, -0.06 + h / 2, 0.025]}>
            <boxGeometry args={[0.065, h, 0.01]} />
            <meshStandardMaterial
              color={i === 4 ? GOLD : accent}
              emissive={i === 4 ? GOLD : accent}
              emissiveIntensity={isActive ? 1.6 : 0.8}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* 5. Floating Holographic Cybernetic Node Marker */}
      <mesh position={[0.25, 0.19, 0.035]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * 5. PAWAN PUTRA SPACE
 * Modernist Architectural Monolith & Smart Infrastructure Pavilion
 * Clean cantilevered architectural slabs with warm golden atrium lighting and rooftop communications spire.
 */
export function SpaceModule({ accent, isActive = false }: ModuleProps) {
  const spireRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (spireRef.current) {
      const scale = isActive ? 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.12 : 1;
      spireRef.current.scale.setScalar(scale);
    }
  });

  const windows = (x: number, z: number, cols: number, rows: number, y0: number) =>
    Array.from({ length: cols * rows }, (_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      return (
        <mesh key={`${x}-${i}`} position={[x + c * 0.075, y0 + r * 0.09, z]}>
          <boxGeometry args={[0.045, 0.055, 0.005]} />
          <meshBasicMaterial
            color={(c + r) % 2 === 0 ? GOLD : '#476085'}
            toneMapped={false}
          />
        </mesh>
      );
    });

  return (
    <group rotation={[0, -0.4, 0]} scale={0.9}>
      {/* Plinth Base Slab */}
      <mesh position={[0, -0.32, 0]}>
        <boxGeometry args={[0.95, 0.04, 0.68]} />
        <meshStandardMaterial color="#1a2e4c" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Main Architectural Tower Monolith */}
      <mesh position={[-0.18, 0.02, 0]}>
        <boxGeometry args={[0.34, 0.65, 0.34]} />
        <meshStandardMaterial color={WHITE} roughness={0.3} metalness={0.2} />
      </mesh>
      {windows(-0.25, 0.175, 3, 5, -0.21)}

      {/* Secondary Cantilevered Smart Facility Wing */}
      <mesh position={[0.18, -0.08, 0.05]}>
        <boxGeometry args={[0.32, 0.42, 0.38]} />
        <meshStandardMaterial color={NAVY_MID} roughness={0.35} metalness={0.6} />
      </mesh>
      {windows(0.1, 0.245, 3, 3, -0.21)}

      {/* Precision Rooftop Infrastructure Spire */}
      <mesh position={[-0.18, 0.44, 0]}>
        <cylinderGeometry args={[0.008, 0.016, 0.22, 12]} />
        <meshStandardMaterial color="#bfcde3" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Beacon Light on Spire Tip */}
      <mesh ref={spireRef} position={[-0.18, 0.56, 0]}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
    </group>
  );
}
