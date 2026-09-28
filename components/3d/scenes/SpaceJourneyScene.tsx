'use client';

import { useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, Environment, Lightformer } from '@react-three/drei';
import { MathUtils, type Group, type Mesh, type MeshStandardMaterial } from 'three';
import { CameraController } from '../CameraController';
import type { SceneContext } from '../CanvasWrapper';

export interface SpaceJourneySceneProps extends SceneContext {
  /** 0 Plot · 1 Design · 2 Construction · 3 Interior · 4 Finished */
  stage: number;
  pointer: boolean;
}

const GOLD = '#d8a62a';
const CONCRETE = '#9aa6b8';
const WHITE = '#eef2f8';
const NAVY = '#12305c';

interface Volume {
  size: [number, number, number];
  position: [number, number, number];
  finish: string;
}

const volumes: Volume[] = [
  { size: [2.2, 0.8, 1.6], position: [0, 0.4, 0], finish: WHITE },
  { size: [2.6, 0.75, 1.4], position: [0.35, 1.175, -0.05], finish: NAVY },
  { size: [0.6, 2.3, 0.6], position: [-1.25, 1.15, -0.4], finish: '#dfe6f1' },
];

export default function SpaceJourneyScene({ settings, visible, stage, pointer }: SpaceJourneySceneProps) {
  return (
    <Canvas
      dpr={settings.dpr}
      gl={{ antialias: settings.antialias, alpha: true }}
      camera={{ position: [4.2, 3.2, 6.2], fov: 32 }}
      frameloop={visible ? 'always' : 'never'}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} color="#fff3d6" />
      <pointLight position={[-4, 2, 3]} intensity={10} color="#c9925e" distance={12} />
      {settings.environment && (
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2.5} position={[0, 5, 5]} scale={[10, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#c9925e" />
        </Environment>
      )}
      <CameraController base={[4.2, 3.2, 6.2]} lookAt={[0, 0.8, 0]} sway={[0.8, 0.4]} pointer={pointer} />
      <Turntable>
        <Plot stage={stage} />
        {volumes.map((v, i) => (
          <BuildingVolume key={i} volume={v} stage={stage} delay={i * 0.12} />
        ))}
        <Windows stage={stage} />
        <Crane stage={stage} />
        <Landscape stage={stage} />
      </Turntable>
    </Canvas>
  );
}

function Turntable({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.35 - 0.2;
  });
  return <group ref={ref}>{children}</group>;
}

/** Ground slab with a gold survey boundary and corner pegs. */
function Plot({ stage }: { stage: number }) {
  const pegs: [number, number, number][] = [
    [-2, 0.12, -1.5],
    [2, 0.12, -1.5],
    [2, 0.12, 1.5],
    [-2, 0.12, 1.5],
  ];
  return (
    <group>
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <boxGeometry args={[5, 0.06, 4]} />
        <meshStandardMaterial color={stage >= 4 ? '#1d3b2a' : '#1a2c47'} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[4, 0.01, 3]} />
        <meshBasicMaterial color={GOLD} transparent opacity={stage === 0 ? 0.18 : 0.06} />
        <Edges color={GOLD} />
      </mesh>
      {pegs.map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.03, 0.03, 0.24, 8]} />
          <meshBasicMaterial color={GOLD} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Wireframe at the design stage, rising concrete during construction, finished cladding at the end. */
function BuildingVolume({ volume, stage, delay }: { volume: Volume; stage: number; delay: number }) {
  const solid = useRef<Mesh>(null);
  const frame = useRef<Mesh>(null);
  const progress = useRef(0);

  useFrame((_, dt) => {
    const target = stage >= 2 ? 1 : 0;
    progress.current = MathUtils.damp(progress.current, target, 2.6 - delay * 4, dt);
    const p = progress.current;
    if (solid.current) {
      solid.current.scale.y = Math.max(0.0001, p);
      solid.current.position.y = volume.position[1] - (volume.size[1] * (1 - p)) / 2;
      solid.current.visible = p > 0.01;
      const material = solid.current.material as MeshStandardMaterial;
      material.color.set(stage >= 4 ? volume.finish : CONCRETE);
      material.roughness = stage >= 4 ? 0.35 : 0.85;
    }
    if (frame.current) frame.current.visible = stage >= 1 && stage < 4;
  });

  return (
    <group>
      <mesh ref={frame} position={volume.position}>
        <boxGeometry args={volume.size} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges color={GOLD} />
      </mesh>
      <mesh ref={solid} position={volume.position} castShadow>
        <boxGeometry args={volume.size} />
        <meshStandardMaterial color={CONCRETE} roughness={0.85} />
      </mesh>
    </group>
  );
}

/** Window panes that glow warm once interiors are done. */
function Windows({ stage }: { stage: number }) {
  const group = useRef<Group>(null);
  const panes = useMemo(() => {
    const list: { position: [number, number, number]; size: [number, number] }[] = [];
    for (let i = 0; i < 4; i++) list.push({ position: [-0.75 + i * 0.5, 0.42, 0.805], size: [0.38, 0.5] });
    for (let i = 0; i < 5; i++) list.push({ position: [-0.65 + i * 0.5, 1.18, 0.655], size: [0.36, 0.46] });
    return list;
  }, []);

  useFrame((_, dt) => {
    group.current?.children.forEach((child) => {
      const material = (child as Mesh).material as MeshStandardMaterial;
      material.opacity = MathUtils.damp(material.opacity, stage >= 3 ? 1 : 0, 3, dt);
      material.emissiveIntensity = stage >= 3 ? (stage >= 4 ? 0.9 : 1.4) : 0;
    });
  });

  return (
    <group ref={group}>
      {panes.map((pane, i) => (
        <mesh key={i} position={pane.position}>
          <planeGeometry args={pane.size} />
          <meshStandardMaterial color="#f4c95d" emissive="#f4c95d" emissiveIntensity={0} transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Tower crane visible only while building. */
function Crane({ stage }: { stage: number }) {
  const ref = useRef<Group>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const s = MathUtils.damp(ref.current.scale.y, stage === 2 ? 1 : 0.0001, 3, dt);
    ref.current.scale.set(1, s, 1);
    ref.current.visible = s > 0.02;
    ref.current.children[1].rotation.y = state.clock.elapsedTime * 0.3;
  });
  return (
    <group ref={ref} position={[1.7, 0, -1.1]}>
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[0.1, 3.2, 0.1]} />
        <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.5} />
      </mesh>
      <group position={[0, 3.2, 0]}>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[2.2, 0.08, 0.08]} />
          <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[-1.4, -0.4, 0]}>
          <boxGeometry args={[0.02, 0.8, 0.02]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

/** Trees that grow in once the space is finished. */
function Landscape({ stage }: { stage: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    ref.current?.children.forEach((tree) => {
      const s = MathUtils.damp(tree.scale.x, stage >= 4 ? 1 : 0.0001, 3, dt);
      tree.scale.setScalar(s);
      tree.visible = s > 0.02;
    });
  });
  const spots: [number, number, number][] = [
    [-2.0, 0, 1.1],
    [2.0, 0, 1.2],
    [1.6, 0, -1.3],
    [-1.9, 0, -1.2],
  ];
  return (
    <group ref={ref}>
      {spots.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
            <meshStandardMaterial color="#6b4f33" />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <icosahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color="#2f6b45" flatShading roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
