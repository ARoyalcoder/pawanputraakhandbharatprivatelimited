'use client';

import { Suspense, useEffect, useMemo, useRef, type ComponentType, type MutableRefObject, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer, useTexture } from '@react-three/drei';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  MathUtils,
  PlaneGeometry,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type PointLight,
  type PointsMaterial,
  type Sprite,
  type SpriteMaterial,
  type Texture,
} from 'three';
import type { SceneContext } from '../CanvasWrapper';
import { CameraModule, DigitalModule, NetworkModule, SolarModule, SpaceModule } from './hero-modules';

/*
 * PPAB hero: a full-frame cinematic scene.
 *
 *   backdrop    nebula glow, shafts of light falling on the core, a perspective floor grid
 *   subject     the gold PPAB medallion, its gyroscopic rings and the five division modules
 *               on a tilted orbit that sweeps diagonally across the frame
 *   foreground  far dust and near bokeh for depth
 *
 * Choreography: the camera flies in while the medallion rises and the orbit unfolds (the
 * "assembly"); changing division rotates the orbit and sends a pulse in that division's
 * colour; scrolling pushes the camera into the medallion; the pointer adds parallax.
 * There is no post-processing pass. Glow comes from additive halos, so it stays cheap.
 */

const MODULES: { Component: ComponentType<{ accent: string; isActive?: boolean }>; accent: string }[] = [
  { Component: CameraModule, accent: '#2fb5a7' },
  { Component: NetworkModule, accent: '#4a90ff' },
  { Component: SolarModule, accent: '#f2a516' },
  { Component: DigitalModule, accent: '#8c73f7' },
  { Component: SpaceModule, accent: '#c9925e' },
];

const FOV = 30;
/** Resting camera position. */
const BASE = { x: 0, y: 0.55, z: 12 };
/** Where the fly-in starts, relative to BASE: high, left and far. */
const FLY_FROM = { x: -3.2, y: 2.6, z: 9 };
const ORBIT_RADIUS = 2.95;
/** Half-width the orbit needs on screen: its widest modules sit at ±0.95 R, plus their own size. */
const ORBIT_REACH = ORBIT_RADIUS * 0.95 + 0.4;
/** Orbit angle the active division settles at: front-left spot on the orbit ring (marked as position 1). */
const ACTIVE_ANGLE = -Math.PI / 5;

/**
 * Per-module fine-tuning to ensure objects frame the central PPAB emblem
 * with generous clearance without overlapping the gold letters or central mace.
 */
const MODULE_OFFSETS = [
  // 0: Camera (Secure) - clean surveillance posture
  { yOffset: 0.02, radialOffset: 0.02, scaleMult: 0.96 },
  // 1: Router (Connect) - antennas clear, compact footprint
  { yOffset: -0.06, radialOffset: 0.06, scaleMult: 0.92 },
  // 2: Solar (Solar) - grounded mount
  { yOffset: -0.04, radialOffset: 0.04, scaleMult: 0.92 },
  // 3: Digital (Laptop) - crisp screen visibility
  { yOffset: -0.02, radialOffset: 0.05, scaleMult: 0.95 },
  // 4: Space (Building) - architectural terrace elevation
  { yOffset: 0.06, radialOffset: 0.05, scaleMult: 0.95 },
];
/** Small screens: height of the division rail, and of the spacer HeroStage keeps free above it (h-[19rem] sm:h-[23rem]). */
const RAIL_PX = 186;
const SPACER_PX = { base: 304, sm: 368 };
/** World height of the medallion with its gyroscopic rings, at scale 1. */
const SUBJECT_HEIGHT = 3.7;
const ASSEMBLY_SECONDS = 2.9;
const GOLD = '#f4c95d';

export interface HeroSceneProps extends SceneContext {
  active: number;
  progressRef: RefObject<number>;
  pointer: boolean;
  /** False while the site intro is still on screen; the assembly waits for it. */
  play?: boolean;
}

interface Rig {
  start: number;
  /** 0 → 1 over the assembly. */
  t: number;
}
type RigRef = MutableRefObject<Rig>;

/** Where the subject sits for the current canvas shape. */
interface Framing {
  x: number;
  y: number;
  scale: number;
  wide: boolean;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const clamp01 = (v: number) => MathUtils.clamp(v, 0, 1);
const segment = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Overshoots slightly, then settles: used for things that "arrive". */
const backOut = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);

/** Deterministic random stream so the scene looks the same on every load. */
function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  draw(canvas.getContext('2d')!, size);
  return new CanvasTexture(canvas);
}

/** Soft round glow shared by halos, nebula, dust and bokeh. */
function useGlowTexture() {
  const texture = useMemo(
    () =>
      canvasTexture(128, (ctx, s) => {
        const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
        g.addColorStop(0.6, 'rgba(255,255,255,0.12)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
      }),
    []
  );
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/**
 * Frames the subject for the canvas shape: the right third on wide screens (the copy sits
 * on the left), below the copy on tall ones. Measured at the resting camera distance so it
 * does not shift while the camera moves.
 */
function useFraming(): Framing {
  const size = useThree((s) => s.size);
  return useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const h = 2 * Math.tan(MathUtils.degToRad(FOV / 2)) * BASE.z;
    const w = h * aspect;
    if (aspect >= 1.05) {
      // Centre the subject at ~71% of the width and size the orbit to span 46%–97% of it:
      // clear of the copy on the left, inside the frame on the right.
      return { x: w * 0.215, y: 0.08, scale: MathUtils.clamp(Math.min(h / 6.3, (w * 0.255) / ORBIT_REACH), 0.6, 1.1), wide: true };
    }
    // Tall screens: the copy fills the top, so the subject sits in the space HeroStage keeps
    // free above the division rail, sized so the whole orbit fits the width.
    const spacer = size.width >= 640 ? SPACER_PX.sm : SPACER_PX.base;
    const centreFromBottom = Math.min((RAIL_PX + spacer / 2) / Math.max(size.height, 1), 0.45);
    const fitWidth = (w * 0.5 - 0.03) / ORBIT_REACH;
    const fitHeight = ((spacer / Math.max(size.height, 1)) * h) / SUBJECT_HEIGHT;
    return { x: 0, y: h * (centreFromBottom - 0.5), scale: MathUtils.clamp(Math.min(fitWidth, fitHeight), 0.3, 0.86), wide: false };
  }, [size.width, size.height]);
}

/* ------------------------------------------------------------------ */
/* Scene                                                              */
/* ------------------------------------------------------------------ */

export default function HeroScene(props: HeroSceneProps) {
  const { settings, visible } = props;
  return (
    <Canvas
      dpr={settings.dpr}
      gl={{ antialias: settings.antialias, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [BASE.x + FLY_FROM.x, BASE.y + FLY_FROM.y, BASE.z + FLY_FROM.z], fov: FOV, near: 0.1, far: 90 }}
      frameloop={visible ? 'always' : 'never'}
      aria-hidden="true"
    >
      <Stage {...props} />
    </Canvas>
  );
}

function Stage({ settings, tier, active, progressRef, pointer, play = true }: HeroSceneProps) {
  const frame = useFraming();
  const rig = useRef<Rig>({ start: -1, t: 0 });
  const accent = MODULES[active]?.accent ?? MODULES[0].accent;
  const glow = useGlowTexture();
  const rich = tier !== 'LOW';

  return (
    <>
      <Director rig={rig} play={play} />
      <fog attach="fog" args={['#020b1d', 10, 34]} />

      {/* Lighting: warm key, cool rim, division accent */}
      <ambientLight intensity={0.6} color="#0a1d3a" />
      <directionalLight position={[5, 6, 6]} intensity={2.6} color="#fff3dc" />
      <directionalLight position={[-6, -1.5, -4]} intensity={1.3} color="#2563eb" />
      <AccentLight accent={accent} frame={frame} />
      {settings.environment && (
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3.4} position={[0, 4, -6]} scale={[12, 2, 1]} color="#fff4de" />
          <Lightformer form="rect" intensity={1.4} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#4a90ff" />
          <Lightformer form="ring" intensity={2.2} position={[4, 2, 4]} scale={2} color={GOLD} />
        </Environment>
      )}

      <CameraRig rig={rig} frame={frame} progressRef={progressRef} pointer={pointer} />

      <Nebula glow={glow} frame={frame} rig={rig} />
      <GodRays frame={frame} rig={rig} />
      <Floor frame={frame} rig={rig} glow={glow} accent={accent} />

      <group position={[frame.x, frame.y, 0]} scale={frame.scale}>
        <Halo glow={glow} accent={accent} rig={rig} />
        {/* The medallion turns slightly towards the headline */}
        <group rotation={[0.04, frame.wide ? -0.2 : 0, 0]}>
          <Suspense fallback={null}>
            <Core rig={rig} />
          </Suspense>
        </group>
        {/* Tilted, rolled orbit: reads as a diagonal sweep across the frame */}
        <group rotation={[0.34, 0, -0.16]} position={[0, -0.15, 0]}>
          <Orbit active={active} rig={rig} tails={rich} />
          <PulseWaves active={active} />
        </group>
      </group>

      <Dust count={settings.particles} glow={glow} rig={rig} />
      {rich && <Bokeh count={tier === 'HIGH' ? 22 : 12} glow={glow} frame={frame} rig={rig} />}
    </>
  );
}

/**
 * Runs the assembly clock once the scene is allowed to play. It is mounted first, so every
 * other frame callback reads the current value.
 */
function Director({ rig, play }: { rig: RigRef; play: boolean }) {
  useFrame(({ clock }) => {
    const r = rig.current;
    if (play && r.start < 0) r.start = clock.elapsedTime;
    r.t = r.start < 0 ? 0 : clamp01((clock.elapsedTime - r.start) / ASSEMBLY_SECONDS);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Camera                                                             */
/* ------------------------------------------------------------------ */

function CameraRig({ rig, frame, progressRef, pointer }: { rig: RigRef; frame: Framing; progressRef: RefObject<number>; pointer: boolean }) {
  const mouse = useRef({ x: 0, y: 0 });
  const look = useRef(new Vector3(0, 0, 0));
  const lookTarget = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (!pointer) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointer]);

  useFrame((state, delta) => {
    const cam = state.camera;
    const t = state.clock.elapsedTime;
    const fly = 1 - easeOut(rig.current.t);
    const push = easeInOut(clamp01(progressRef.current ?? 0));
    const m = mouse.current;

    // Fly in from high and left, then rest; scrolling pushes in towards the medallion.
    const tx = BASE.x + FLY_FROM.x * fly + frame.x * 0.55 * push + m.x * 0.45 + Math.sin(t * 0.21) * 0.07;
    const ty = BASE.y + FLY_FROM.y * fly + (frame.y + 0.25) * push + m.y * 0.28 + Math.cos(t * 0.17) * 0.05;
    const tz = BASE.z + FLY_FROM.z * fly - 6.4 * push;
    const stiffness = rig.current.t < 1 ? 7 : 3;
    cam.position.x = MathUtils.damp(cam.position.x, tx, stiffness, delta);
    cam.position.y = MathUtils.damp(cam.position.y, ty, stiffness, delta);
    cam.position.z = MathUtils.damp(cam.position.z, tz, stiffness, delta);

    // Look straight ahead at rest (the subject is composed off-centre), turning to the medallion as the camera pushes in.
    lookTarget.set(frame.x * 0.94 * push + m.x * 0.1, frame.y * push + m.y * 0.06, 0);
    look.current.lerp(lookTarget, 1 - Math.exp(-4 * delta));
    cam.lookAt(look.current);

    // The world dissolves into the fog as the camera dives in.
    const fog = state.scene.fog;
    if (fog && 'far' in fog) fog.far = 34 - 16 * push;
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Subject                                                            */
/* ------------------------------------------------------------------ */

/** Division-coloured light that eases to the active division. */
function AccentLight({ accent, frame }: { accent: string; frame: Framing }) {
  const light = useRef<PointLight>(null);
  const color = useMemo(() => new Color(), []);
  useFrame((_, delta) => {
    light.current?.color.lerp(color.set(accent), 1 - Math.exp(-3 * delta));
  });
  return <pointLight ref={light} position={[frame.x - 1.5, frame.y - 0.4, 2.8]} intensity={8.5} distance={8} color={accent} />;
}

/** Stand-in for bloom: a gold glow behind the medallion and a wash of the active division's colour. */
function Halo({ glow, accent, rig }: { glow: Texture; accent: string; rig: RigRef }) {
  const gold = useRef<Sprite>(null);
  const tint = useRef<Sprite>(null);
  const color = useMemo(() => new Color(), []);
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const on = easeOut(segment(rig.current.t, 0.1, 0.7));
    if (gold.current) {
      (gold.current.material as SpriteMaterial).opacity = (0.42 + Math.sin(t * 0.8) * 0.05) * on;
      gold.current.scale.setScalar(5.4 + Math.sin(t * 0.6) * 0.15);
    }
    if (tint.current) {
      const mat = tint.current.material as SpriteMaterial;
      mat.color.lerp(color.set(accent), 1 - Math.exp(-2.5 * delta));
      mat.opacity = 0.2 * on;
    }
  });
  return (
    <>
      <sprite ref={gold} position={[0, 0, -0.6]} scale={5.4}>
        <spriteMaterial map={glow} color="#f4b740" transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite ref={tint} position={[-0.8, -0.3, -1.2]} scale={8}>
        <spriteMaterial map={glow} color={accent} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </sprite>
    </>
  );
}

/** The logo artwork's proportions, its size in the scene, and the thickness it is given. */
const MARK_ASPECT = 331 / 320;
const MARK_WIDTH = 2.5;
const MARK_DEPTH = 0.16;
const MARK_EDGE_LAYERS = Array.from({ length: 7 }, (_, i) => -MARK_DEPTH / 2 + ((i + 0.5) * MARK_DEPTH) / 7);

/**
 * The PPAB logo at the centre: the gold mark on its own, given thickness, inside gyroscopic
 * rings and under a travelling specular sheen. It rises out of the floor light and unwinds
 * into place.
 */
function Core({ rig }: { rig: RigRef }) {
  const root = useRef<Group>(null);
  const shell = useRef<Group>(null);
  const gyroA = useRef<Mesh>(null);
  const gyroB = useRef<Mesh>(null);
  const sweep = useRef<PointLight>(null);
  const texture = useTexture('/brand/ppab-mark.png');

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const rise = easeOut(segment(rig.current.t, 0.12, 0.72));
    if (root.current) {
      root.current.visible = rig.current.t > 0.08;
      root.current.position.y = (1 - rise) * -1.1;
      root.current.scale.setScalar(0.55 + 0.45 * backOut(rise));
      root.current.rotation.y = (1 - rise) * -1.6;
    }
    if (shell.current) {
      // Gentle breathing tilt: stable, never spinning.
      shell.current.rotation.y = MathUtils.damp(shell.current.rotation.y, Math.sin(t * 0.6) * 0.05, 3, delta);
      shell.current.rotation.x = MathUtils.damp(shell.current.rotation.x, Math.cos(t * 0.4) * 0.03, 3, delta);
    }
    if (gyroA.current) gyroA.current.rotation.z += delta * 0.12;
    if (gyroB.current) gyroB.current.rotation.z -= delta * 0.09;
    if (sweep.current) {
      // A highlight crosses the medallion every 7.5 s, the first time just as it arrives.
      const cycle = (t + 5.6) % 7.5;
      if (cycle < 1.8) {
        const p = cycle / 1.8;
        sweep.current.position.set(MathUtils.lerp(-1.8, 1.8, p), 0.1, 0.5);
        sweep.current.intensity = Math.sin(p * Math.PI) * 4.5;
      } else {
        sweep.current.intensity = MathUtils.damp(sweep.current.intensity, 0, 4, delta);
      }
    }
  });

  return (
    <group ref={root} visible={false}>
      <Float speed={1} rotationIntensity={0.04} floatIntensity={0.16}>
        <group ref={shell}>
          {/* Edge: copies of the mark stacked behind the face, in deeper gold, give it thickness */}
          {MARK_EDGE_LAYERS.map((z) => (
            <mesh key={z} position={[0, 0, z]}>
              <planeGeometry args={[MARK_WIDTH, MARK_WIDTH / MARK_ASPECT]} />
              <meshStandardMaterial map={texture} alphaTest={0.5} color="#a8791c" roughness={0.35} metalness={0.9} side={DoubleSide} />
            </mesh>
          ))}
          {/* The PPAB logo itself, front and back */}
          {[1, -1].map((side) => (
            <mesh key={side} position={[0, 0, (side * MARK_DEPTH) / 2]} rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
              <planeGeometry args={[MARK_WIDTH, MARK_WIDTH / MARK_ASPECT]} />
              <meshStandardMaterial
                map={texture}
                alphaTest={0.5}
                roughness={0.16}
                metalness={0.82}
                bumpMap={texture}
                bumpScale={0.035}
                emissive="#ffcc44"
                emissiveMap={texture}
                emissiveIntensity={0.85}
                envMapIntensity={1.6}
              />
            </mesh>
          ))}
          {/* Fill lights that keep the lettering readable without a centre glare */}
          <pointLight position={[0, 0.45, 0.65]} intensity={1.2} color="#fff6e0" distance={3.5} />
          <pointLight position={[0, -0.38, 0.55]} intensity={2.2} color="#ffe8a3" distance={3} />
          <pointLight ref={sweep} position={[-1.8, 0.1, 0.5]} color="#ffffff" distance={3.5} intensity={0} />
          {/* Sparkle at the tip of the mace */}
          <mesh position={[0.02, 1.2, 0.1]}>
            <sphereGeometry args={[0.024, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive={GOLD} emissiveIntensity={2.5} />
          </mesh>
        </group>

        {/* Gyroscopic rings */}
        <mesh ref={gyroA} rotation={[Math.PI / 3, 0.25, 0]}>
          <torusGeometry args={[1.52, 0.012, 16, 160]} />
          <meshStandardMaterial color={GOLD} roughness={0.15} metalness={0.95} emissive="#5a3d08" emissiveIntensity={0.3} toneMapped={false} />
        </mesh>
        <mesh ref={gyroB} rotation={[-Math.PI / 2.8, -0.35, 0]}>
          <torusGeometry args={[1.76, 0.007, 16, 160]} />
          <meshBasicMaterial color="#4a90ff" transparent opacity={0.45} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
}

/** The division orbit: unfolds during the assembly and rotates the active module to front-right. */
function Orbit({ active, rig, tails }: { active: number; rig: RigRef; tails: boolean }) {
  const group = useRef<Group>(null);
  const rings = useRef<Group>(null);
  const rotation = useRef(0);
  const angles = useMemo(() => MODULES.map((_, i) => (i / MODULES.length) * Math.PI * 2), []);

  // Precision ticks around the orbit, like an instrument dial.
  const ticks = useMemo(() => {
    const count = 72;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      positions[i * 3] = Math.sin(a) * ORBIT_RADIUS * 1.08;
      positions[i * 3 + 2] = Math.cos(a) * ORBIT_RADIUS * 1.08;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    return g;
  }, []);
  useEffect(() => () => ticks.dispose(), [ticks]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const unfold = easeOut(segment(rig.current.t, 0.2, 0.9));
    const target = ACTIVE_ANGLE - angles[active];
    const diff = Math.atan2(Math.sin(target - rotation.current), Math.cos(target - rotation.current));
    rotation.current += diff * (1 - Math.exp(-3.2 * delta));
    group.current.rotation.y = rotation.current + (1 - unfold) * 1.8;
    if (rings.current) {
      rings.current.visible = unfold > 0.01;
      rings.current.scale.setScalar(0.35 + 0.65 * unfold);
    }
  });

  return (
    <group ref={group}>
      <group ref={rings} visible={false}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ORBIT_RADIUS, 0.008, 16, 240]} />
          <meshBasicMaterial color="#d8a62a" transparent opacity={0.42} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ORBIT_RADIUS * 1.04, 0.003, 12, 240]} />
          <meshBasicMaterial color="#4a90ff" transparent opacity={0.22} toneMapped={false} />
        </mesh>
        <points geometry={ticks}>
          <pointsMaterial size={0.035} color={GOLD} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
        </points>
        <Photon phase={0} speed={0.42} color={GOLD} tail={tails} />
        <Photon phase={2.2} speed={0.31} color="#4a90ff" tail={tails} />
      </group>

      {MODULES.map(({ Component, accent }, i) => (
        <ModuleSlot key={accent} index={i} angle={angles[i]} accent={accent} isActive={i === active} rig={rig}>
          <Component accent={accent} isActive={i === active} />
        </ModuleSlot>
      ))}
    </group>
  );
}

const TAIL_ARC = 0.55;

/**
 * A packet of light travelling the orbit with a comet tail behind it. The tail is a fixed
 * arc of the orbit that fades along its length, so it looks the same at any frame rate.
 */
function Photon({ phase, speed, color, tail }: { phase: number; speed: number; color: string; tail: boolean }) {
  const group = useRef<Group>(null);
  const fade = useMemo(
    () =>
      canvasTexture(64, (ctx, s) => {
        const g = ctx.createLinearGradient(0, 0, s, 0);
        g.addColorStop(0, 'rgb(255,255,255)');
        g.addColorStop(1, 'rgb(0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
      }),
    []
  );
  useEffect(() => () => fade.dispose(), [fade]);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = phase + clock.elapsedTime * speed;
  });

  return (
    <group ref={group} rotation={[0, phase, 0]}>
      <mesh position={[0, 0, ORBIT_RADIUS]}>
        <sphereGeometry args={[0.036, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {tail && (
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[ORBIT_RADIUS, 0.014, 8, 48, TAIL_ARC]} />
            <meshBasicMaterial color={color} alphaMap={fade} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
}

interface ModuleSlotProps {
  index: number;
  angle: number;
  accent: string;
  isActive: boolean;
  rig: RigRef;
  children: ReactNode;
}

function ModuleSlot({ index, angle, accent, isActive, rig, children }: ModuleSlotProps) {
  const slot = useRef<Group>(null);
  const aura = useRef<Mesh>(null);
  const offset = MODULE_OFFSETS[index] ?? { yOffset: 0, radialOffset: 0, scaleMult: 1.0 };
  const r = ORBIT_RADIUS + offset.radialOffset;
  const x = Math.sin(angle) * r;
  const z = Math.cos(angle) * r;

  useFrame((state, delta) => {
    // Modules arrive one after another along the orbit.
    const arrive = backOut(segment(rig.current.t, 0.42 + index * 0.08, 0.72 + index * 0.08));
    const targetScale = (isActive ? 1.2 : 0.8) * offset.scaleMult * arrive;
    const targetY = (isActive ? 0.04 : 0) + offset.yOffset + Math.sin(state.clock.elapsedTime * 0.9 + angle * 2) * 0.04;
    if (slot.current) {
      slot.current.visible = arrive > 0.01;
      slot.current.scale.setScalar(MathUtils.damp(slot.current.scale.x, targetScale, rig.current.t < 1 ? 12 : 4.5, delta));
      slot.current.position.y = MathUtils.damp(slot.current.position.y, targetY, 4.5, delta);
    }
    if (aura.current) {
      const mat = aura.current.material as MeshBasicMaterial;
      mat.opacity = MathUtils.damp(mat.opacity, (isActive ? 0.42 : 0.1) * arrive, 4.5, delta);
    }
  });

  return (
    <group position={[x, 0, z]} rotation={[0, angle, 0]}>
      <mesh ref={aura} position={[0, -0.45 + offset.yOffset, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.47, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0} side={DoubleSide} toneMapped={false} depthWrite={false} />
      </mesh>
      <group ref={slot} visible={false} scale={0.001}>
        {children}
      </group>
    </group>
  );
}

const WAVE_POOL = [0, 1, 2];

/** A ring of light that runs out along the orbit plane whenever the division changes. */
function PulseWaves({ active }: { active: number }) {
  const pool = useRef<(Mesh | null)[]>([]);
  const starts = useRef<number[]>(WAVE_POOL.map(() => -10));
  const next = useRef(0);
  const first = useRef(true);
  const clock = useThree((s) => s.clock);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const i = next.current;
    next.current = (i + 1) % WAVE_POOL.length;
    starts.current[i] = clock.elapsedTime;
    const mesh = pool.current[i];
    if (mesh) (mesh.material as MeshBasicMaterial).color.set(MODULES[active]?.accent ?? GOLD);
  }, [active, clock]);

  useFrame(({ clock: c }) => {
    pool.current.forEach((mesh, i) => {
      if (!mesh) return;
      const p = clamp01((c.elapsedTime - starts.current[i]) / 1.6);
      mesh.visible = p > 0 && p < 1;
      mesh.scale.setScalar(0.25 + easeOut(p) * ORBIT_RADIUS * 1.15);
      (mesh.material as MeshBasicMaterial).opacity = (1 - p) * 0.55;
    });
  });

  return (
    <>
      {WAVE_POOL.map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            pool.current[i] = m;
          }}
          rotation={[Math.PI / 2, 0, 0]}
          visible={false}
        >
          <ringGeometry args={[0.96, 1, 128]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0} side={DoubleSide} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Atmosphere                                                         */
/* ------------------------------------------------------------------ */

/** Deep glow behind everything: blue cloud upper left, violet-navy lower right, gold behind the core. */
function Nebula({ glow, frame, rig }: { glow: Texture; frame: Framing; rig: RigRef }) {
  const clouds = useRef<(Sprite | null)[]>([]);
  const layers = useMemo(
    () => [
      { color: '#0f3d8f', x: -6.5, y: 3.4, z: -14, scale: 24, opacity: 0.55, speed: 0.05 },
      { color: '#24215e', x: frame.x + 4.5, y: -2.6, z: -12, scale: 20, opacity: 0.45, speed: 0.07 },
      { color: '#8a5d14', x: frame.x + 0.4, y: frame.y + 0.6, z: -8, scale: 13, opacity: 0.3, speed: 0.09 },
      { color: '#0b4f7a', x: frame.x - 3, y: frame.y - 1.5, z: -10, scale: 15, opacity: 0.3, speed: 0.06 },
    ],
    [frame.x, frame.y]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const on = 0.35 + 0.65 * easeOut(rig.current.t);
    clouds.current.forEach((s, i) => {
      if (!s) return;
      const l = layers[i];
      s.position.set(l.x + Math.sin(t * l.speed + i) * 0.8, l.y + Math.cos(t * l.speed * 0.8 + i) * 0.5, l.z);
      (s.material as SpriteMaterial).opacity = l.opacity * on;
    });
  });

  return (
    <>
      {layers.map((l, i) => (
        <sprite
          key={l.color}
          ref={(s) => {
            clouds.current[i] = s;
          }}
          position={[l.x, l.y, l.z]}
          scale={l.scale}
        >
          <spriteMaterial map={glow} color={l.color} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} fog={false} toneMapped={false} />
        </sprite>
      ))}
    </>
  );
}

const RAY_LENGTH = 11;
const RAYS = [
  { offset: -0.16, width: 1.6, opacity: 0.1, speed: 0.7 },
  { offset: -0.05, width: 0.7, opacity: 0.16, speed: 1.1 },
  { offset: 0.04, width: 2.4, opacity: 0.08, speed: 0.5 },
  { offset: 0.13, width: 0.9, opacity: 0.12, speed: 0.9 },
];

/** Shafts of light falling from the upper right onto the medallion. */
function GodRays({ frame, rig }: { frame: Framing; rig: RigRef }) {
  const group = useRef<Group>(null);
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
  const texture = useMemo(
    () =>
      canvasTexture(256, (ctx, s) => {
        // Soft edges across the shaft, bright at the source and fading along its length.
        const across = ctx.createLinearGradient(0, 0, s, 0);
        across.addColorStop(0, 'rgba(255,255,255,0)');
        across.addColorStop(0.5, 'rgba(255,255,255,1)');
        across.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = across;
        ctx.fillRect(0, 0, s, s);
        ctx.globalCompositeOperation = 'destination-in';
        const along = ctx.createLinearGradient(0, 0, 0, s);
        along.addColorStop(0, 'rgba(0,0,0,0.9)');
        along.addColorStop(0.55, 'rgba(0,0,0,0.35)');
        along.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = along;
        ctx.fillRect(0, 0, s, s);
      }),
    []
  );
  // Hinged at the top edge, so each shaft swings from the light source.
  const geometry = useMemo(() => new PlaneGeometry(1, RAY_LENGTH).translate(0, -RAY_LENGTH / 2, 0), []);
  useEffect(
    () => () => {
      texture.dispose();
      geometry.dispose();
    },
    [texture, geometry]
  );

  const sourceX = frame.x + 2.6 * frame.scale;
  const sourceY = frame.y + 5.6;
  const angle = Math.atan2(frame.x - sourceX, -(frame.y - sourceY));

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const on = easeOut(segment(rig.current.t, 0.3, 1));
    mats.current.forEach((m, i) => {
      if (m) m.opacity = RAYS[i].opacity * on * (0.75 + Math.sin(t * RAYS[i].speed + i * 1.7) * 0.25);
    });
    if (group.current) group.current.rotation.z = angle + Math.sin(t * 0.15) * 0.015;
  });

  return (
    <group ref={group} position={[sourceX, sourceY, -3.5]} rotation={[0, 0, angle]}>
      {RAYS.map((r, i) => (
        <mesh key={r.offset} geometry={geometry} rotation={[0, 0, r.offset]} scale={[r.width, 1, 1]}>
          <meshBasicMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            map={texture}
            color="#ffe2a0"
            transparent
            opacity={0}
            depthWrite={false}
            blending={AdditiveBlending}
            side={DoubleSide}
            fog={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Perspective blueprint floor with a pool of light under the medallion. */
function Floor({ frame, rig, glow, accent }: { frame: Framing; rig: RigRef; glow: Texture; accent: string }) {
  const grid = useRef<MeshBasicMaterial>(null);
  const pool = useRef<MeshBasicMaterial>(null);
  const tint = useMemo(() => new Color(), []);
  const gold = useMemo(() => new Color(GOLD), []);
  const texture = useMemo(
    () =>
      canvasTexture(1024, (ctx, s) => {
        ctx.strokeStyle = 'rgba(120,170,255,0.55)';
        ctx.lineWidth = 1.2;
        const cells = 28;
        const step = s / cells;
        ctx.beginPath();
        for (let i = 0; i <= cells; i++) {
          ctx.moveTo(i * step, 0);
          ctx.lineTo(i * step, s);
          ctx.moveTo(0, i * step);
          ctx.lineTo(s, i * step);
        }
        ctx.stroke();
        // Fade towards the edges so the floor dissolves into the dark.
        ctx.globalCompositeOperation = 'destination-in';
        const fade = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        fade.addColorStop(0, 'rgba(0,0,0,1)');
        fade.addColorStop(0.6, 'rgba(0,0,0,0.35)');
        fade.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, s, s);
      }),
    []
  );
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, delta) => {
    const on = easeOut(segment(rig.current.t, 0, 0.6));
    if (grid.current) grid.current.opacity = 0.3 * on;
    if (pool.current) {
      pool.current.opacity = 0.45 * on;
      pool.current.color.lerp(tint.set(accent).lerp(gold, 0.6), 1 - Math.exp(-2 * delta));
    }
  });

  const poolSize = 7 * frame.scale;
  return (
    <group position={[frame.x, frame.y - 2.35 * frame.scale, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 34]} />
        <meshBasicMaterial ref={grid} map={texture} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[poolSize, poolSize, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={pool} map={glow} color={GOLD} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Fine gold dust filling the volume. It drifts slowly, so the space never feels frozen. */
function Dust({ count, glow, rig }: { count: number; glow: Texture; rig: RigRef }) {
  const group = useRef<Group>(null);
  const material = useRef<PointsMaterial>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const rand = seeded(11);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() * 2 - 1) * 14;
      positions[i * 3 + 1] = (rand() * 2 - 1) * 7;
      positions[i * 3 + 2] = -18 + rand() * 22;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.012;
      group.current.position.y = Math.sin(clock.elapsedTime * 0.12) * 0.3;
    }
    if (material.current) material.current.opacity = 0.65 * (0.4 + 0.6 * easeOut(rig.current.t));
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <pointsMaterial
          ref={material}
          size={0.07}
          map={glow}
          color="#f4d58a"
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

/** Large out-of-focus specks close to the lens, kept away from the headline. */
function Bokeh({ count, glow, frame, rig }: { count: number; glow: Texture; frame: Framing; rig: RigRef }) {
  const sprites = useRef<(Sprite | null)[]>([]);
  const specks = useMemo(() => {
    const rand = seeded(29);
    return Array.from({ length: count }, () => ({
      // Wide screens: the right side only, so the copy stays clean.
      x: frame.wide ? frame.x * 0.4 + rand() * 6.5 : (rand() * 2 - 1) * 3,
      y: (rand() * 2 - 1) * 3.6,
      z: 2.5 + rand() * 4,
      scale: 0.35 + rand() * 0.9,
      opacity: 0.05 + rand() * 0.1,
      color: rand() > 0.35 ? GOLD : '#6fa8ff',
      speed: 0.1 + rand() * 0.25,
      phase: rand() * 10,
    }));
  }, [count, frame.wide, frame.x]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const on = easeOut(segment(rig.current.t, 0.4, 1));
    sprites.current.forEach((s, i) => {
      const b = specks[i];
      if (!s || !b) return;
      s.position.set(b.x + Math.sin(t * b.speed + b.phase) * 0.35, b.y + Math.cos(t * b.speed * 0.7 + b.phase) * 0.25, b.z);
      (s.material as SpriteMaterial).opacity = b.opacity * on;
    });
  });

  return (
    <>
      {specks.map((b, i) => (
        <sprite
          key={i}
          ref={(s) => {
            sprites.current[i] = s;
          }}
          position={[b.x, b.y, b.z]}
          scale={b.scale}
        >
          <spriteMaterial map={glow} color={b.color} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} fog={false} toneMapped={false} />
        </sprite>
      ))}
    </>
  );
}
