'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { AdditiveBlending, DoubleSide, MathUtils, type Group, type Mesh, type MeshBasicMaterial } from 'three';
import type { SceneContext } from '../CanvasWrapper';

const WHITE = '#eef2f8';
const TEAL = '#2fb5a7';

export interface CameraTrackerSceneProps extends SceneContext {
  pointer: boolean;
}

/** A CCTV camera that turns to follow the visitor's pointer (auto-sweeps on touch). */
export default function CameraTrackerScene({ settings, visible, pointer }: CameraTrackerSceneProps) {
  return (
    <Canvas
      dpr={settings.dpr}
      gl={{ antialias: settings.antialias, alpha: true }}
      camera={{ position: [0, 0.5, 6], fov: 32 }}
      frameloop={visible ? 'always' : 'never'}
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 5]} intensity={2.4} color="#fff3d6" />
      <pointLight position={[-3, -1, 2]} intensity={18} color={TEAL} distance={10} />
      {settings.environment && (
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 3, 4]} scale={[8, 2, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.2} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color={TEAL} />
        </Environment>
      )}
      <TrackingCamera pointer={pointer} />
    </Canvas>
  );
}

function TrackingCamera({ pointer }: { pointer: boolean }) {
  const head = useRef<Group>(null);
  const led = useRef<Mesh>(null);
  const target = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (!pointer) return;
    const onMove = (e: PointerEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
        active: true,
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointer]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const sweep = !target.current.active;
    const yaw = sweep ? Math.sin(t * 0.45) * 0.75 : target.current.x * 0.85;
    const pitch = sweep ? -0.18 + Math.sin(t * 0.3) * 0.08 : target.current.y * 0.45 - 0.1;
    if (head.current) {
      head.current.rotation.y = MathUtils.damp(head.current.rotation.y, yaw, 4, delta);
      head.current.rotation.x = MathUtils.damp(head.current.rotation.x, -pitch, 4, delta);
    }
    if (led.current) {
      (led.current.material as MeshBasicMaterial).opacity = Math.sin(t * 4) > 0 ? 1 : 0.25;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Ceiling mount */}
      <mesh position={[0, 1.45, -0.2]}>
        <cylinderGeometry args={[0.36, 0.36, 0.08, 48]} />
        <meshStandardMaterial color={WHITE} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.08, -0.2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 16]} />
        <meshStandardMaterial color="#bfcde3" metalness={0.5} roughness={0.3} />
      </mesh>

      <group ref={head} position={[0, 0.7, -0.2]}>
        <mesh>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial color="#bfcde3" metalness={0.5} roughness={0.3} />
        </mesh>
        <group position={[0, -0.28, 0.35]}>
          <RoundedBox args={[0.64, 0.5, 1.35]} radius={0.12}>
            <meshStandardMaterial color={WHITE} roughness={0.28} metalness={0.05} />
          </RoundedBox>
          <RoundedBox args={[0.76, 0.07, 1.52]} radius={0.03} position={[0, 0.3, 0.06]}>
            <meshStandardMaterial color="#dfe6f1" roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, 0, 0.69]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 48]} />
            <meshStandardMaterial color="#020b1d" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.725]}>
            <circleGeometry args={[0.15, 48]} />
            <meshStandardMaterial color="#0b2347" metalness={1} roughness={0.05} emissive={TEAL} emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.73]}>
            <ringGeometry args={[0.165, 0.19, 48]} />
            <meshBasicMaterial color={TEAL} toneMapped={false} />
          </mesh>
          <mesh ref={led} position={[0.22, 0.15, 0.69]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial color="#ff5a5a" transparent toneMapped={false} />
          </mesh>
          {/* Coverage cone: apex at the lens, widening forward */}
          <mesh position={[0, 0, 0.73 + 1.7]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1.15, 3.4, 48, 1, true]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0.08} side={DoubleSide} depthWrite={false} blending={AdditiveBlending} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
