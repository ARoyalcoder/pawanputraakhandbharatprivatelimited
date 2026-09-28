'use client';

import { Line, RoundedBox } from '@react-three/drei';
import { DoubleSide } from 'three';

const WHITE = '#eef2f8';
const NAVY = '#0f2b55';
const GOLD = '#d8a62a';

interface ModuleProps {
  accent: string;
}

/** Wall-mounted bullet CCTV camera. */
export function CameraModule({ accent }: ModuleProps) {
  return (
    <group rotation={[0, -0.85, 0]} scale={0.95}>
      <mesh position={[-0.46, 0.05, 0]}>
        <boxGeometry args={[0.06, 0.42, 0.3]} />
        <meshStandardMaterial color={WHITE} roughness={0.5} />
      </mesh>
      <mesh position={[-0.3, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 12]} />
        <meshStandardMaterial color="#bfcde3" metalness={0.5} roughness={0.35} />
      </mesh>
      <group rotation={[0, 0, -0.15]}>
        <RoundedBox args={[0.78, 0.28, 0.3]} radius={0.06} position={[0.1, 0.12, 0]}>
          <meshStandardMaterial color={WHITE} roughness={0.32} metalness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.86, 0.05, 0.36]} radius={0.02} position={[0.14, 0.29, 0]}>
          <meshStandardMaterial color="#dfe6f1" roughness={0.4} />
        </RoundedBox>
        <mesh position={[0.5, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.05, 32]} />
          <meshStandardMaterial color="#020b1d" metalness={0.8} roughness={0.15} />
        </mesh>
        <mesh position={[0.53, 0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.05, 0.08, 32]} />
          <meshBasicMaterial color={accent} side={DoubleSide} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

const NODES: [number, number, number][] = [
  [0, 0, 0],
  [0.48, 0.3, 0.12],
  [-0.42, 0.36, -0.08],
  [0.36, -0.38, 0.16],
  [-0.46, -0.26, 0.06],
  [0.02, 0.58, -0.2],
  [0.06, -0.54, -0.24],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 5], [2, 5], [3, 6], [4, 6], [1, 3], [2, 4],
];

/** Network topology: hub and connected nodes. */
export function NetworkModule({ accent }: ModuleProps) {
  const segments = EDGES.flatMap(([a, b]) => [NODES[a], NODES[b]]);
  return (
    <group>
      <Line points={segments} segments color={accent} lineWidth={1.4} transparent opacity={0.85} />
      {NODES.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i === 0 ? 0.13 : 0.07, 24, 24]} />
          {i === 0 ? (
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} toneMapped={false} />
          ) : (
            <meshStandardMaterial color={WHITE} roughness={0.3} metalness={0.2} />
          )}
        </mesh>
      ))}
    </group>
  );
}

/** Tilted solar array on a stand. */
export function SolarModule({ accent }: ModuleProps) {
  const cells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      cells.push(
        <mesh key={`${r}-${c}`} position={[-0.36 + c * 0.24, 0.025, -0.21 + r * 0.21]}>
          <boxGeometry args={[0.22, 0.02, 0.19]} />
          <meshStandardMaterial color="#1b4d8f" metalness={0.75} roughness={0.22} />
        </mesh>
      );
    }
  }
  return (
    <group>
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.5, 12]} />
        <meshStandardMaterial color="#bfcde3" metalness={0.5} roughness={0.35} />
      </mesh>
      <group rotation={[0.95, 0, 0]} position={[0, 0.02, 0]}>
        <RoundedBox args={[1.02, 0.04, 0.7]} radius={0.015}>
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.3} />
        </RoundedBox>
        {cells}
        <mesh position={[0.46, 0.04, -0.3]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Stacked application screens with a small chart. */
export function DigitalModule({ accent }: ModuleProps) {
  return (
    <group rotation={[0, -0.35, 0]}>
      {[-0.22, 0, 0.22].map((z, i) => (
        <group key={z} position={[i * 0.12 - 0.12, i * 0.1 - 0.1, z]} rotation={[0, 0, 0]}>
          <RoundedBox args={[0.82, 0.52, 0.03]} radius={0.04}>
            <meshStandardMaterial color={i === 2 ? '#123260' : NAVY} roughness={0.4} metalness={0.2} transparent opacity={i === 2 ? 1 : 0.85} />
          </RoundedBox>
          {i === 2 &&
            [0.12, 0.2, 0.15, 0.28, 0.22].map((h, b) => (
              <mesh key={b} position={[-0.24 + b * 0.12, -0.18 + h / 2, 0.02]}>
                <boxGeometry args={[0.07, h, 0.01]} />
                <meshBasicMaterial color={b === 3 ? GOLD : accent} toneMapped={false} />
              </mesh>
            ))}
          {i === 2 && (
            <mesh position={[0, 0.18, 0.02]}>
              <boxGeometry args={[0.62, 0.035, 0.01]} />
              <meshBasicMaterial color={WHITE} transparent opacity={0.6} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

/** Contemporary building blocks with lit windows. */
export function SpaceModule({ accent }: ModuleProps) {
  const windows = (x: number, z: number, cols: number, rows: number, y0: number) =>
    Array.from({ length: cols * rows }, (_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      return (
        <mesh key={`${x}-${i}`} position={[x + c * 0.09, y0 + r * 0.12, z]}>
          <boxGeometry args={[0.055, 0.07, 0.005]} />
          <meshBasicMaterial color={(c + r) % 3 === 0 ? '#0b2347' : '#f4c95d'} toneMapped={false} />
        </mesh>
      );
    });
  return (
    <group rotation={[0, -0.5, 0]}>
      <mesh position={[0, -0.36, 0]}>
        <boxGeometry args={[1, 0.05, 0.7]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
      <mesh position={[-0.2, 0.02, 0]}>
        <boxGeometry args={[0.36, 0.72, 0.36]} />
        <meshStandardMaterial color={WHITE} roughness={0.45} />
      </mesh>
      {windows(-0.29, 0.182, 3, 5, -0.24)}
      <mesh position={[0.2, -0.11, 0.06]}>
        <boxGeometry args={[0.34, 0.46, 0.42]} />
        <meshStandardMaterial color={NAVY} roughness={0.5} />
      </mesh>
      {windows(0.11, 0.272, 3, 3, -0.25)}
      <mesh position={[0.06, 0.2, -0.22]}>
        <boxGeometry args={[0.2, 1.08, 0.2]} />
        <meshStandardMaterial color="#dfe6f1" roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}
