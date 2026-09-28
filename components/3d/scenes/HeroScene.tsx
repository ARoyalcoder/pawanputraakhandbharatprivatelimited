'use client';

import { useEffect, useMemo, useRef, type ComponentRef, type ComponentType, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, QuadraticBezierLine } from '@react-three/drei';
import { BufferAttribute, BufferGeometry, DoubleSide, MathUtils, type Group, type Mesh, type MeshBasicMaterial } from 'three';
import { CameraController } from '../CameraController';
import type { SceneContext } from '../CanvasWrapper';
import { CameraModule, DigitalModule, NetworkModule, SolarModule, SpaceModule } from './hero-modules';

const RADIUS = 2.9;

const MODULES: { Component: ComponentType<{ accent: string }>; accent: string }[] = [
  { Component: CameraModule, accent: '#2fb5a7' },
  { Component: NetworkModule, accent: '#4a90ff' },
  { Component: SolarModule, accent: '#f2a516' },
  { Component: DigitalModule, accent: '#8c73f7' },
  { Component: SpaceModule, accent: '#c9925e' },
];

export interface HeroSceneProps extends SceneContext {
  active: number;
  progressRef: RefObject<number>;
  pointer: boolean;
}

export default function HeroScene({ settings, visible, active, progressRef, pointer }: HeroSceneProps) {
  return (
    <Canvas
      dpr={settings.dpr}
      gl={{ antialias: settings.antialias, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.9, 10.2], fov: 34, near: 0.1, far: 60 }}
      frameloop={visible ? 'always' : 'never'}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 6, 6]} intensity={2.2} color="#fff3d6" />
      <pointLight position={[-5, -1, 3]} intensity={30} color="#4a90ff" distance={20} />
      <pointLight position={[0, 0.2, 0]} intensity={6} color="#f4c95d" distance={5} />
      {settings.environment && (
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, -6]} scale={[12, 2, 1]} color="#fff6e0" />
          <Lightformer form="rect" intensity={1.4} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#4a90ff" />
          <Lightformer form="ring" intensity={2} position={[4, 2, 4]} scale={2} color="#f4c95d" />
        </Environment>
      )}
      <CameraController base={[0, 0.9, 10.2]} lookAt={[-0.3, 0.3, 0]} progressRef={progressRef} pointer={pointer} />
      <group rotation={[0.26, 0, 0]} position={[0.2, 0.35, 0]}>
        <Core />
        <Orbit active={active} />
      </group>
      <Particles count={settings.particles} />
    </Canvas>
  );
}

/** The PPAB core: faceted gold form inside a wireframe shell and two orbital rings. */
function Core() {
  const shell = useRef<Group>(null);
  const ringA = useRef<Mesh>(null);
  const ringB = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (shell.current) {
      shell.current.rotation.y += delta * 0.25;
      shell.current.rotation.x += delta * 0.08;
    }
    if (ringA.current) ringA.current.rotation.z += delta * 0.3;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.2;
  });

  return (
    <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.35}>
      <group ref={shell}>
        <mesh>
          <icosahedronGeometry args={[0.82, 0]} />
          <meshStandardMaterial color="#e2b23a" metalness={0.85} roughness={0.3} emissive="#5a3d08" emissiveIntensity={0.55} flatShading />
        </mesh>
        <mesh scale={1.42}>
          <icosahedronGeometry args={[0.82, 1]} />
          <meshBasicMaterial color="#f4c95d" wireframe transparent opacity={0.16} />
        </mesh>
      </group>
      <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.012, 8, 160]} />
        <meshBasicMaterial color="#f4c95d" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.6, 0.5, 0]}>
        <torusGeometry args={[1.72, 0.006, 8, 160]} />
        <meshBasicMaterial color="#f4c95d" transparent opacity={0.35} />
      </mesh>
    </Float>
  );
}

/** Rotates the division ring so the active division comes to the front. */
function Orbit({ active }: { active: number }) {
  const group = useRef<Group>(null);
  const rotation = useRef(0);
  const angles = useMemo(() => MODULES.map((_, i) => (i / MODULES.length) * Math.PI * 2), []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = -angles[active];
    const diff = Math.atan2(Math.sin(target - rotation.current), Math.cos(target - rotation.current));
    rotation.current += diff * (1 - Math.exp(-3.2 * delta));
    group.current.rotation.y = rotation.current;
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS, 0.005, 6, 220]} />
        <meshBasicMaterial color="#d8a62a" transparent opacity={0.35} />
      </mesh>
      {MODULES.map(({ Component, accent }, i) => (
        <ModuleSlot key={accent} angle={angles[i]} accent={accent} isActive={i === active}>
          <Component accent={accent} />
        </ModuleSlot>
      ))}
    </group>
  );
}

function ModuleSlot({ angle, accent, isActive, children }: { angle: number; accent: string; isActive: boolean; children: React.ReactNode }) {
  const slot = useRef<Group>(null);
  const halo = useRef<Mesh>(null);
  const line = useRef<ComponentRef<typeof QuadraticBezierLine>>(null);
  const x = Math.sin(angle) * RADIUS;
  const z = Math.cos(angle) * RADIUS;

  useFrame((state, delta) => {
    const scale = isActive ? 1.1 : 0.78;
    if (slot.current) {
      const s = MathUtils.damp(slot.current.scale.x, scale, 4, delta);
      slot.current.scale.setScalar(s);
      slot.current.position.y = Math.sin(state.clock.elapsedTime * 0.9 + angle * 2) * 0.08;
    }
    if (halo.current) {
      const material = halo.current.material as MeshBasicMaterial;
      material.opacity = MathUtils.damp(material.opacity, isActive ? 0.32 : 0.08, 4, delta);
    }
    if (line.current) {
      line.current.material.dashOffset -= delta * (isActive ? 1.2 : 0.35);
      line.current.material.opacity = MathUtils.damp(line.current.material.opacity, isActive ? 0.95 : 0.3, 4, delta);
    }
  });

  return (
    <>
      <QuadraticBezierLine
        ref={line}
        start={[0, 0, 0]}
        end={[x, 0, z]}
        mid={[x / 2, 0.9, z / 2]}
        color={accent}
        lineWidth={1.2}
        dashed
        dashSize={0.18}
        gapSize={0.12}
        transparent
        opacity={0.3}
        toneMapped={false}
      />
      <group ref={slot} position={[x, 0, z]} rotation={[0, angle, 0]}>
        {children}
        <mesh ref={halo} position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.52, 0.575, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.12} side={DoubleSide} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

/** Slow-drifting gold dust. Deterministic positions keep renders stable. */
function Particles({ count }: { count: number }) {
  const points = useRef<Group>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < count; i++) {
      const r = 4 + rand() * 7;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={points}>
      <points geometry={geometry}>
        <pointsMaterial size={0.035} color="#f4c95d" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}
