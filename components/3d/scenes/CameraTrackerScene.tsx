'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import {
  MathUtils,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type MeshBasicMaterial,
  type PointLight,
} from 'three';
import type { SceneContext } from '../CanvasWrapper';

const CHASSIS_WHITE = '#edf2f9';
const TITANIUM_DARK = '#141c28';
const GOLD_ACCENT = '#d4af37';
const TEAL_ACCENT = '#2fb5a7';
const LENS_COATING = '#0d5c75';

export interface CameraTrackerSceneProps extends SceneContext {
  pointer: boolean;
}

/**
 * High-End Industrial 4K CCTV Bullet Camera with PPAB Corporate Branding,
 * Realistic Optical Lens Elements, Infrared Array, and Intelligent PTZ Tracking.
 */
export default function CameraTrackerScene({ settings, visible, pointer }: CameraTrackerSceneProps) {
  return (
    <Canvas
      dpr={settings.dpr}
      gl={{ antialias: settings.antialias, alpha: true }}
      camera={{ position: [0, 0.4, 5.8], fov: 32 }}
      frameloop={visible ? 'always' : 'never'}
      aria-hidden="true"
    >
      {/* Studio Surveillance Key Lighting */}
      <ambientLight intensity={0.85} color="#0c182c" />
      <directionalLight position={[4, 6, 6]} intensity={2.8} color="#fff6e5" />
      <directionalLight position={[-4, 3, -2]} intensity={1.4} color="#89b4f8" />
      <pointLight position={[0, -1, 3]} intensity={12} color={TEAL_ACCENT} distance={8} />

      {settings.environment && (
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3.5} position={[0, 4, 3]} scale={[8, 2, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.5} position={[-4, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color={TEAL_ACCENT} />
          <Lightformer form="rect" intensity={1.8} position={[4, 0, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color={GOLD_ACCENT} />
        </Environment>
      )}

      <TrackingCamera pointer={pointer} />
    </Canvas>
  );
}

function TrackingCamera({ pointer }: { pointer: boolean }) {
  const headGroup = useRef<Group>(null);
  const lensGroup = useRef<Group>(null);
  const recLedRef = useRef<Mesh>(null);
  const recLightRef = useRef<PointLight>(null);
  const linkLedRef = useRef<Mesh>(null);
  const scanConeRef = useRef<Mesh>(null);
  const scanRingRef = useRef<Mesh>(null);

  const target = useRef({ x: 0, y: 0, active: false });

  // Load PPAB official logo texture safely without blocking suspense
  const logoTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/brand/ppab-mark.png');
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Pointer tracking listener
  useEffect(() => {
    if (!pointer) return;
    const onMove = (e: PointerEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
        active: true,
      };
    };

    const onLeave = () => {
      target.current.active = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', onLeave);
    };
  }, [pointer]);

  // Animation Loop (Mechanical PTZ Tracking, Pulse, Autofocus micro-zoom)
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const isTracking = target.current.active;

    // Yaw & Pitch: autonomous patrol sweep when idle, responsive lock-on when tracking
    const sweepYaw = Math.sin(t * 0.45) * 0.85;
    const sweepPitch = -0.22 + Math.sin(t * 0.3) * 0.1;

    const targetYaw = isTracking ? target.current.x * 0.95 : sweepYaw;
    const targetPitch = isTracking ? target.current.y * 0.5 - 0.15 : sweepPitch;

    if (headGroup.current) {
      // Smooth robotic damped pan & tilt
      headGroup.current.rotation.y = MathUtils.damp(headGroup.current.rotation.y, targetYaw, 4.5, delta);
      headGroup.current.rotation.x = MathUtils.damp(headGroup.current.rotation.x, -targetPitch, 4.5, delta);
    }

    // Lens autofocus micro-movement
    if (lensGroup.current) {
      lensGroup.current.position.z = 0.72 + Math.sin(t * 2) * 0.008;
    }

    // Recording status LED blink (Heartbeat cadence)
    const recPulse = Math.sin(t * 5) > 0.1 ? 1 : 0.2;
    if (recLedRef.current) {
      (recLedRef.current.material as MeshBasicMaterial).opacity = recPulse;
    }
    if (recLightRef.current) {
      recLightRef.current.intensity = recPulse * 0.8;
    }

    // Link status LED micro-flicker
    if (linkLedRef.current) {
      (linkLedRef.current.material as MeshBasicMaterial).opacity = Math.sin(t * 8) > -0.7 ? 0.9 : 0.3;
    }

    // Dynamic scanning volumetric beam & target ring pulse
    if (scanConeRef.current) {
      const coneMat = scanConeRef.current.material as MeshBasicMaterial;
      coneMat.opacity = 0.06 + Math.sin(t * 2.5) * 0.03;
    }

    if (scanRingRef.current) {
      scanRingRef.current.position.z = 0.75 + ((t * 0.8) % 2.5);
      const ringScale = 0.4 + (scanRingRef.current.position.z - 0.75) * 0.6;
      scanRingRef.current.scale.set(ringScale, ringScale, 1);
      const ringMat = scanRingRef.current.material as MeshBasicMaterial;
      ringMat.opacity = Math.max(0, 1 - (scanRingRef.current.position.z - 0.75) / 2.5) * 0.35;
    }
  });

  // Generate 12 Infrared LEDs around the camera lens ring
  const irLeds = useMemo(() => {
    const count = 12;
    const radius = 0.21;
    const leds = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      leds.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    }
    return leds;
  }, []);

  return (
    <group position={[0, 0.15, 0]}>
      {/* ============================================================== */}
      {/* 1. SOLID CEILING FLANGE & WEATHERPROOF MOUNT                   */}
      {/* ============================================================== */}
      {/* Base mounting flange */}
      <mesh position={[0, 1.52, -0.3]}>
        <cylinderGeometry args={[0.42, 0.45, 0.08, 48]} />
        <meshStandardMaterial color={CHASSIS_WHITE} roughness={0.3} metalness={0.15} />
      </mesh>
      {/* Weather seal gasket */}
      <mesh position={[0, 1.48, -0.3]}>
        <cylinderGeometry args={[0.39, 0.39, 0.02, 48]} />
        <meshStandardMaterial color="#0b1019" roughness={0.7} />
      </mesh>
      {/* 4 Mounting Bolt Studs */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.32, 1.47, -0.3 + Math.sin(angle) * 0.32]}
        >
          <cylinderGeometry args={[0.022, 0.022, 0.03, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Heavy-duty Downrod Stem */}
      <mesh position={[0, 1.15, -0.3]}>
        <cylinderGeometry args={[0.075, 0.075, 0.65, 32]} />
        <meshStandardMaterial color="#c5d1e4" metalness={0.65} roughness={0.25} />
      </mesh>
      {/* Stem Cable Conduit Collar */}
      <mesh position={[0, 1.42, -0.3]}>
        <cylinderGeometry args={[0.11, 0.11, 0.06, 32]} />
        <meshStandardMaterial color={TITANIUM_DARK} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Articulated Swivel Locking Collar Knuckle */}
      <mesh position={[0, 0.82, -0.3]}>
        <cylinderGeometry args={[0.12, 0.12, 0.14, 32]} />
        <meshStandardMaterial color={TITANIUM_DARK} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Stainless Tightening Lever Bolt */}
      <mesh position={[0.14, 0.82, -0.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.1, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* ============================================================== */}
      {/* 2. ARTICULATED PTZ CAMERA HEAD ASSEMBLY                        */}
      {/* ============================================================== */}
      <group ref={headGroup} position={[0, 0.72, -0.3]}>
        {/* Pivot Ball Swivel Joint */}
        <mesh>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshStandardMaterial color="#b2c2d8" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Camera Bracket Hinge Arm */}
        <group position={[0, -0.22, 0.32]}>
          <mesh position={[0, 0.14, -0.2]} rotation={[Math.PI / 8, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.28, 24]} />
            <meshStandardMaterial color={TITANIUM_DARK} metalness={0.8} roughness={0.3} />
          </mesh>

          {/* -------------------------------------------------------- */}
          {/* Main Cylindrical Bullet Housing Body                     */}
          {/* -------------------------------------------------------- */}
          <group position={[0, -0.05, 0]}>
            {/* Primary Powder-Coated White Chassis Box */}
            <RoundedBox args={[0.68, 0.54, 1.38]} radius={0.14} smoothness={4}>
              <meshStandardMaterial color={CHASSIS_WHITE} roughness={0.28} metalness={0.12} />
            </RoundedBox>

            {/* Rear Housing Heatsink Fins (Cooling vents) */}
            <mesh position={[0, 0, -0.66]}>
              <cylinderGeometry args={[0.26, 0.28, 0.14, 32]} />
              <meshStandardMaterial color={TITANIUM_DARK} metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Rear Threaded Waterproof Cable Gland */}
            <mesh position={[0, 0, -0.74]}>
              <cylinderGeometry args={[0.09, 0.11, 0.09, 24]} />
              <meshStandardMaterial color="#0f172a" roughness={0.6} />
            </mesh>

            {/* -------------------------------------------------------- */}
            {/* PPAB COMPANY LOGO BADGE EMBLEMS (Left & Right Sides)     */}
            {/* -------------------------------------------------------- */}
            {/* Left Side Corporate Emblem */}
            <group position={[-0.345, 0.02, 0.02]} rotation={[0, -Math.PI / 2, 0]}>
              {/* Gold Metal Base Coin */}
              <mesh>
                <cylinderGeometry args={[0.14, 0.14, 0.012, 36]} />
                <meshStandardMaterial color={GOLD_ACCENT} metalness={0.9} roughness={0.18} />
              </mesh>
              {/* Dark Inner Shield */}
              <mesh position={[0, 0.007, 0]}>
                <cylinderGeometry args={[0.125, 0.125, 0.005, 36]} />
                <meshStandardMaterial color="#030b1c" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Official PPAB Mark Texture */}
              {logoTexture && (
                <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[0.22, 0.22]} />
                  <meshBasicMaterial map={logoTexture} transparent alphaTest={0.05} toneMapped={false} />
                </mesh>
              )}
            </group>

            {/* Right Side Corporate Emblem */}
            <group position={[0.345, 0.02, 0.02]} rotation={[0, Math.PI / 2, 0]}>
              <mesh>
                <cylinderGeometry args={[0.14, 0.14, 0.012, 36]} />
                <meshStandardMaterial color={GOLD_ACCENT} metalness={0.9} roughness={0.18} />
              </mesh>
              <mesh position={[0, 0.007, 0]}>
                <cylinderGeometry args={[0.125, 0.125, 0.005, 36]} />
                <meshStandardMaterial color="#030b1c" metalness={0.8} roughness={0.2} />
              </mesh>
              {logoTexture && (
                <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[0.22, 0.22]} />
                  <meshBasicMaterial map={logoTexture} transparent alphaTest={0.05} toneMapped={false} />
                </mesh>
              )}
            </group>

            {/* -------------------------------------------------------- */}
            {/* Weatherproof Sunshade / Protective Hood                  */}
            {/* -------------------------------------------------------- */}
            <group position={[0, 0.32, 0.08]}>
              <RoundedBox args={[0.82, 0.05, 1.54]} radius={0.025} smoothness={2}>
                <meshStandardMaterial color="#dbe5f3" roughness={0.32} metalness={0.15} />
              </RoundedBox>
              {/* Visor Mounting Screw Accents */}
              <mesh position={[0.35, -0.03, -0.1]}>
                <cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[-0.35, -0.03, -0.1]}>
                <cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>

            {/* -------------------------------------------------------- */}
            {/* Front Bezel & High-Tech Optical Lens Assembly             */}
            {/* -------------------------------------------------------- */}
            <group position={[0, 0, 0.69]}>
              {/* Heavy Anodized Titanium Bezel Ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.265, 0.28, 0.06, 48]} />
                <meshStandardMaterial color={TITANIUM_DARK} metalness={0.92} roughness={0.18} />
              </mesh>

              {/* Optical Dark Tempered Face Glass */}
              <mesh position={[0, 0, 0.032]}>
                <circleGeometry args={[0.255, 48]} />
                <meshStandardMaterial
                  color="#020814"
                  metalness={0.95}
                  roughness={0.04}
                  envMapIntensity={2.5}
                />
              </mesh>

              {/* High-Precision 12-Unit Infrared Night-Vision Array */}
              {irLeds.map((led, i) => (
                <mesh key={i} position={[led.x, led.y, 0.035]}>
                  <sphereGeometry args={[0.015, 12, 12]} />
                  <meshStandardMaterial color="#3b0f1a" emissive="#ff1a40" emissiveIntensity={0.25} roughness={0.4} />
                </mesh>
              ))}

              {/* Recessed Mechanical Lens Barrel */}
              <group ref={lensGroup} position={[0, 0, 0.036]}>
                {/* Stepped Knurled Lens Collar */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.18, 0.185, 0.05, 48]} />
                  <meshStandardMaterial color="#091322" metalness={0.9} roughness={0.15} />
                </mesh>

                {/* Inner Gold Aperture Ring */}
                <mesh position={[0, 0, 0.02]}>
                  <ringGeometry args={[0.145, 0.165, 48]} />
                  <meshStandardMaterial color={GOLD_ACCENT} metalness={0.95} roughness={0.1} />
                </mesh>

                {/* Optical Multi-Coated Curvature Glass Lens */}
                <mesh position={[0, 0, 0.015]}>
                  <sphereGeometry args={[0.14, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.3]} />
                  <meshStandardMaterial
                    color="#041b33"
                    metalness={0.98}
                    roughness={0.02}
                    emissive={TEAL_ACCENT}
                    emissiveIntensity={0.45}
                    envMapIntensity={3}
                  />
                </mesh>

                {/* Anti-Reflective Optical Cyan Halo Ring */}
                <mesh position={[0, 0, 0.03]}>
                  <ringGeometry args={[0.13, 0.138, 48]} />
                  <meshBasicMaterial color={TEAL_ACCENT} toneMapped={false} />
                </mesh>
              </group>

              {/* Dual Activity Status LEDs */}
              {/* 1. Pulsing Red Recording LED */}
              <group position={[0.2, 0.16, 0.036]}>
                <mesh ref={recLedRef}>
                  <sphereGeometry args={[0.024, 16, 16]} />
                  <meshBasicMaterial color="#ff2d2d" transparent toneMapped={false} />
                </mesh>
                <pointLight ref={recLightRef} color="#ff2d2d" intensity={0.8} distance={0.8} />
              </group>

              {/* 2. Micro Green/Cyan Data-Link LED */}
              <mesh ref={linkLedRef} position={[-0.2, 0.16, 0.036]}>
                <sphereGeometry args={[0.016, 12, 12]} />
                <meshBasicMaterial color="#10b981" transparent toneMapped={false} />
              </mesh>

              {/* ---------------------------------------------------- */}
              {/* Volumetric Surveillance Scan Beam & Radar Ring       */}
              {/* ---------------------------------------------------- */}
              {/* Wide Forward Surveillance Cone */}
              <mesh
                ref={scanConeRef}
                position={[0, 0, 1.8]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <coneGeometry args={[1.5, 3.6, 48, 1, true]} />
                <meshBasicMaterial
                  color={TEAL_ACCENT}
                  transparent
                  opacity={0.07}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>

              {/* Forward Expanding Optical Radar Target Ring */}
              <mesh ref={scanRingRef} position={[0, 0, 0.8]}>
                <ringGeometry args={[0.3, 0.33, 48]} />
                <meshBasicMaterial
                  color={TEAL_ACCENT}
                  transparent
                  opacity={0.3}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
