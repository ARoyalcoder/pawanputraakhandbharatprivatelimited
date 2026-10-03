'use client';

import { useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  Color,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type Group,
  type LineSegments,
  type Mesh,
  type PointLight,
  type Points,
  type PointsMaterial,
} from 'three';
import type { SceneContext } from '../CanvasWrapper';

/** What the visitor has dragged in. Written by the section, read by the camera. */
export interface OrbitInput {
  /** Extra turn and tilt, in radians. */
  yaw: number;
  pitch: number;
  /** Turn speed left over from the last drag, in radians per second. */
  velocity: number;
  dragging: boolean;
  /** Mouse position over the scene, -1 to 1, for a light parallax. */
  hoverX: number;
  hoverY: number;
}

export interface SpaceJourneySceneProps extends SceneContext {
  /** 0 Plot · 1 Design · 2 Construction · 3 Interior · 4 Finished */
  stage: number;
  orbitRef: RefObject<OrbitInput>;
  onReady?: () => void;
}

/**
 * 0–1 timelines. The first five run forward as the project advances and back when it rewinds;
 * the last four are each lit for a single stage.
 */
interface Clocks {
  plot: number;
  design: number;
  build: number;
  interior: number;
  finish: number;
  survey: number;
  blueprint: number;
  site: number;
  cutaway: number;
}

interface Timed {
  clocksRef: RefObject<Clocks>;
}

type Triple = [number, number, number];

const GOLD = '#d8a62a';
const BLUEPRINT = '#8fbaff';
const WARM = '#ffc56e';

const FOV = 32;
/** Camera distance that fits the model by height, and by width at an aspect ratio of 1. */
const FIT_HEIGHT = 8.2;
const FIT_WIDTH = 15.6;
/**
 * A wide panel carries the stage caption top left, so the model sits right of centre and a
 * little low there: fractions of half the view's width and height.
 */
const WIDE_ASPECT = 1.5;
const SHIFT = { x: 0.15, y: 0.08 };
/** A narrow panel has the controls along its bottom edge instead, so the model sits a little high. */
const NARROW_LIFT = 0.16;
const IDLE_SWAY = 0.2;

/** Seconds each step takes when it plays on its own; rewinding is quicker. */
const SECONDS = { plot: 1.8, design: 1.9, build: 3.2, interior: 1.9, finish: 2.2 };
const REWIND_SECONDS = 0.7;
const DROP_HEIGHT = 0.9;

/** Where the camera rests for each stage. `zoom` scales the fitted distance. */
const views: { yaw: number; pitch: number; zoom: number; target: Triple }[] = [
  { yaw: 0.6, pitch: 0.68, zoom: 1.04, target: [0, 0, 0] },
  { yaw: 0.5, pitch: 0.5, zoom: 1.02, target: [0, 0.5, 0] },
  { yaw: 0.86, pitch: 0.34, zoom: 1.08, target: [0.25, 1.15, -0.15] },
  { yaw: 0.36, pitch: 0.62, zoom: 0.8, target: [0.15, 0.8, 0.1] },
  { yaw: 0.62, pitch: 0.25, zoom: 0.96, target: [0, 0.8, 0] },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
/** Progress of `value` through the window from → to. */
const span = (value: number, from: number, to: number) => clamp01((value - from) / (to - from));
const easeInOut = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeOutBack = (t: number) => 1 + 2.6 * (t - 1) ** 3 + 1.6 * (t - 1) ** 2;

const tint = {
  concrete: new Color('#98a3b4'),
  concreteDark: new Color('#7d889b'),
  plaster: new Color('#f1f3f7'),
  stone: new Color('#c3ad90'),
  timber: new Color('#a66f3f'),
  slab: new Color('#b4bdcb'),
  slabFinish: new Color('#e3e8f0'),
  earth: new Color('#16243c'),
  lawn: new Color('#27503a'),
};

/** Shared materials. The director retints and fades them as the project moves on. */
const materials = {
  // Structure: bare concrete while it is built, finishes at the end. The front walls, the
  // door and the roof are separate so they can open up for the interior stage.
  lower: new MeshStandardMaterial({ roughness: 0.9 }),
  lowerFront: new MeshStandardMaterial({ roughness: 0.9, transparent: true }),
  upper: new MeshStandardMaterial({ roughness: 0.9 }),
  upperFront: new MeshStandardMaterial({ roughness: 0.9, transparent: true }),
  tower: new MeshStandardMaterial({ roughness: 0.85 }),
  slab: new MeshStandardMaterial({ roughness: 0.8 }),
  roof: new MeshStandardMaterial({ roughness: 0.8, transparent: true }),
  door: new MeshStandardMaterial({ color: '#6f4526', roughness: 0.7, transparent: true }),
  column: new MeshStandardMaterial({ color: '#2a3447', metalness: 0.6, roughness: 0.4 }),
  paving: new MeshStandardMaterial({ color: '#5d6880', roughness: 0.95 }),
  glass: new MeshStandardMaterial({ color: '#a9c8ff', emissive: WARM, emissiveIntensity: 0, metalness: 0.2, roughness: 0.08, transparent: true, opacity: 0, depthWrite: false }),
  // Interior
  wood: new MeshStandardMaterial({ color: '#b98556', roughness: 0.7 }),
  fabric: new MeshStandardMaterial({ color: '#35527f', roughness: 0.95 }),
  linen: new MeshStandardMaterial({ color: '#efe6d6', roughness: 0.9 }),
  accent: new MeshStandardMaterial({ color: '#c9925e', roughness: 0.8 }),
  rug: new MeshStandardMaterial({ color: '#8c6a4b', roughness: 1 }),
  leaf: new MeshStandardMaterial({ color: '#3b7a50', roughness: 0.9, flatShading: true }),
  glow: new MeshBasicMaterial({ color: '#ffd9a0', toneMapped: false }),
  // Site and garden
  steel: new MeshStandardMaterial({ color: GOLD, metalness: 0.5, roughness: 0.45 }),
  canopy: new MeshStandardMaterial({ color: '#2f6b45', roughness: 0.85, flatShading: true }),
  canopyLight: new MeshStandardMaterial({ color: '#4c8a57', roughness: 0.85, flatShading: true }),
  trunk: new MeshStandardMaterial({ color: '#6b4f33', roughness: 0.9 }),
  water: new MeshStandardMaterial({ color: '#3fa7d6', emissive: '#2b86c9', emissiveIntensity: 0.35, metalness: 0.3, roughness: 0.15 }),
  // Ground
  ground: new MeshStandardMaterial({ roughness: 0.95 }),
  plinth: new MeshStandardMaterial({ color: '#0b1730', roughness: 0.7, metalness: 0.2 }),
  gold: new MeshBasicMaterial({ color: GOLD, toneMapped: false }),
};

const lines = {
  grid: new LineBasicMaterial({ color: '#6f93d6', transparent: true, depthWrite: false }),
  rim: new LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.45 }),
  dims: new LineBasicMaterial({ color: '#f3ead2', transparent: true, depthWrite: false }),
  plan: new LineBasicMaterial({ color: BLUEPRINT, transparent: true, depthWrite: false }),
  wire: new LineBasicMaterial({ color: BLUEPRINT, transparent: true, depthWrite: false }),
  scaffold: new LineBasicMaterial({ color: '#f1c453', transparent: true, depthWrite: false }),
};

type Motion = 'rise' | 'drop' | 'pop';

/** A box that appears during a window of its clock. `at` is its centre on x and z and its base on y. */
interface Part {
  material: keyof typeof materials;
  size: Triple;
  at: Triple;
  window: [number, number];
  motion?: Motion;
  /** Fades away for the interior stage, so it must stop casting a shadow then. */
  opens?: boolean;
  shadow?: boolean;
}

const structure: Part[] = [
  // Ground works
  { material: 'slab', size: [2.3, 0.05, 1.7], at: [-0.4, 0, -0.1], window: [0, 0.1] },
  { material: 'paving', size: [1.05, 0.03, 1.7], at: [1.25, 0, 0.05], window: [0.04, 0.14] },
  // Ground floor
  { material: 'lower', size: [2.2, 0.8, 0.06], at: [-0.4, 0.05, -0.87], window: [0.08, 0.26] },
  { material: 'lower', size: [0.06, 0.8, 1.48], at: [-1.47, 0.05, -0.1], window: [0.12, 0.3] },
  { material: 'lower', size: [0.06, 0.8, 1.48], at: [0.67, 0.05, -0.1], window: [0.16, 0.34] },
  { material: 'lowerFront', size: [0.72, 0.8, 0.06], at: [-1.14, 0.05, 0.67], window: [0.2, 0.38], opens: true },
  // Stair tower and the columns under the cantilever
  { material: 'tower', size: [0.6, 2.05, 0.6], at: [-1.25, 0, -0.65], window: [0.14, 0.62] },
  { material: 'column', size: [0.07, 0.85, 0.07], at: [1.62, 0, 0.82], window: [0.26, 0.42] },
  { material: 'column', size: [0.07, 0.85, 0.07], at: [1.62, 0, -0.72], window: [0.3, 0.46] },
  // First floor
  { material: 'slab', size: [2.4, 0.07, 1.7], at: [0.5, 0.85, 0.05], window: [0.42, 0.54], motion: 'drop' },
  { material: 'slab', size: [0.82, 0.07, 1.64], at: [-1.11, 0.85, -0.1], window: [0.46, 0.58], motion: 'drop' },
  { material: 'upper', size: [2.4, 0.72, 0.06], at: [0.5, 0.92, -0.77], window: [0.54, 0.7] },
  { material: 'upper', size: [0.06, 0.72, 1.58], at: [-0.67, 0.92, 0.05], window: [0.58, 0.74] },
  { material: 'upper', size: [0.06, 0.72, 1.58], at: [1.67, 0.92, 0.05], window: [0.62, 0.78] },
  { material: 'upperFront', size: [0.84, 0.72, 0.06], at: [1.28, 0.92, 0.87], window: [0.66, 0.82], opens: true },
  { material: 'roof', size: [2.6, 0.07, 1.9], at: [0.5, 1.64, 0.05], window: [0.86, 1], motion: 'drop', opens: true },
];

const glazing: Part[] = [
  { material: 'glass', size: [1.48, 0.76, 0.02], at: [-0.04, 0.07, 0.67], window: [0, 0.28], shadow: false },
  { material: 'glass', size: [1.56, 0.68, 0.02], at: [0.08, 0.94, 0.87], window: [0.06, 0.34], shadow: false },
  // Terrace rail
  { material: 'glass', size: [0.8, 0.2, 0.015], at: [-1.1, 0.92, 0.7], window: [0.1, 0.34], shadow: false },
  { material: 'glass', size: [0.015, 0.2, 1], at: [-1.5, 0.92, 0.2], window: [0.12, 0.36], shadow: false },
  // Mullions
  { material: 'column', size: [0.025, 0.76, 0.035], at: [-0.29, 0.07, 0.67], window: [0, 0.22], shadow: false },
  { material: 'column', size: [0.025, 0.76, 0.035], at: [0.2, 0.07, 0.67], window: [0.03, 0.25], shadow: false },
  { material: 'column', size: [0.025, 0.68, 0.035], at: [-0.18, 0.94, 0.87], window: [0.06, 0.28], shadow: false },
  { material: 'column', size: [0.025, 0.68, 0.035], at: [0.34, 0.94, 0.87], window: [0.09, 0.31], shadow: false },
  { material: 'door', size: [0.24, 0.54, 0.025], at: [-1.14, 0.05, 0.71], window: [0.12, 0.34], shadow: false },
];

/** Furniture pops in one piece after another. */
const piece = (order: number, material: Part['material'], size: Triple, at: Triple): Part => ({
  material,
  size,
  at,
  window: [0.26 + order * 0.034, 0.5 + order * 0.034],
  motion: 'pop',
  shadow: false,
});

const furniture: Part[] = [
  // Living room, kitchen and dining
  piece(0, 'rug', [0.95, 0.012, 0.62], [-0.05, 0.05, 0.1]),
  piece(1, 'fabric', [0.74, 0.13, 0.27], [-0.05, 0.05, -0.2]),
  piece(1, 'fabric', [0.74, 0.27, 0.07], [-0.05, 0.05, -0.37]),
  piece(2, 'wood', [0.34, 0.09, 0.2], [-0.05, 0.05, 0.18]),
  piece(3, 'linen', [1.1, 0.24, 0.17], [-0.15, 0.05, -0.72]),
  piece(4, 'wood', [0.3, 0.17, 0.52], [-1.1, 0.05, 0.22]),
  piece(5, 'linen', [0.1, 0.1, 0.1], [-0.86, 0.05, 0.1]),
  piece(5, 'linen', [0.1, 0.1, 0.1], [-0.86, 0.05, 0.34]),
  piece(6, 'accent', [0.1, 0.1, 0.1], [0.48, 0.05, 0.45]),
  piece(6, 'leaf', [0.17, 0.26, 0.17], [0.48, 0.15, 0.45]),
  piece(7, 'glow', [0.07, 0.07, 0.07], [-1.1, 0.6, 0.22]),
  piece(7, 'glow', [0.07, 0.07, 0.07], [-0.05, 0.62, 0]),
  // Bedroom and study
  piece(8, 'rug', [0.85, 0.012, 0.6], [1.05, 0.92, 0.3]),
  piece(9, 'wood', [0.58, 0.1, 0.74], [1.2, 0.92, -0.33]),
  piece(9, 'linen', [0.54, 0.06, 0.68], [1.2, 1.02, -0.32]),
  piece(10, 'fabric', [0.58, 0.32, 0.035], [1.2, 0.92, -0.715]),
  piece(10, 'accent', [0.2, 0.045, 0.13], [1.07, 1.08, -0.57]),
  piece(10, 'accent', [0.2, 0.045, 0.13], [1.33, 1.08, -0.57]),
  piece(11, 'fabric', [0.56, 0.065, 0.32], [1.2, 1.02, -0.1]),
  piece(12, 'linen', [0.56, 0.58, 0.17], [0.4, 0.92, -0.65]),
  piece(13, 'wood', [0.5, 0.17, 0.2], [-0.3, 0.92, -0.6]),
  piece(13, 'fabric', [0.12, 0.13, 0.12], [-0.3, 0.92, -0.36]),
  piece(14, 'accent', [0.22, 0.14, 0.22], [0.05, 0.92, 0.42]),
  piece(14, 'wood', [0.1, 0.12, 0.1], [0.33, 0.92, 0.52]),
  piece(14, 'column', [0.015, 0.4, 0.015], [-0.4, 0.92, 0.6]),
  piece(14, 'glow', [0.09, 0.08, 0.09], [-0.4, 1.32, 0.6]),
];

const garden: Part[] = [
  // Path to the door
  { material: 'paving', size: [0.3, 0.02, 0.16], at: [-1.14, 0, 0.92], window: [0.2, 0.4], motion: 'pop', shadow: false },
  { material: 'paving', size: [0.3, 0.02, 0.16], at: [-1.14, 0, 1.16], window: [0.26, 0.46], motion: 'pop', shadow: false },
  { material: 'paving', size: [0.3, 0.02, 0.16], at: [-1.14, 0, 1.4], window: [0.32, 0.52], motion: 'pop', shadow: false },
  // Pool and patio
  { material: 'water', size: [1.3, 0.02, 0.5], at: [1, 0, 1.25], window: [0.28, 0.58], motion: 'pop', shadow: false },
  { material: 'linen', size: [0.16, 0.06, 0.42], at: [1.05, 0.03, 0.2], window: [0.5, 0.7], motion: 'pop' },
  { material: 'linen', size: [0.16, 0.06, 0.42], at: [1.32, 0.03, 0.2], window: [0.54, 0.74], motion: 'pop' },
  // Hedges
  { material: 'leaf', size: [0.14, 0.16, 2.1], at: [-2.05, 0, 0.35], window: [0.3, 0.6] },
  { material: 'leaf', size: [2.6, 0.16, 0.14], at: [0.2, 0, -1.48], window: [0.36, 0.66] },
  // Garden lights
  { material: 'column', size: [0.03, 0.14, 0.03], at: [-1.38, 0, 1.02], window: [0.6, 0.8], shadow: false },
  { material: 'glow', size: [0.05, 0.03, 0.05], at: [-1.38, 0.14, 1.02], window: [0.7, 0.9], motion: 'pop', shadow: false },
  { material: 'column', size: [0.03, 0.14, 0.03], at: [-0.9, 0, 1.3], window: [0.64, 0.84], shadow: false },
  { material: 'glow', size: [0.05, 0.03, 0.05], at: [-0.9, 0.14, 1.3], window: [0.74, 0.94], motion: 'pop', shadow: false },
  { material: 'column', size: [0.03, 0.14, 0.03], at: [0.22, 0, 1.25], window: [0.68, 0.88], shadow: false },
  { material: 'glow', size: [0.05, 0.03, 0.05], at: [0.22, 0.14, 1.25], window: [0.78, 0.98], motion: 'pop', shadow: false },
];

const trees: { at: [number, number]; size: number; window: [number, number] }[] = [
  { at: [-1.85, 1.2], size: 1, window: [0.3, 0.62] },
  { at: [-1.9, -1.15], size: 0.78, window: [0.38, 0.7] },
  { at: [1.95, 1.2], size: 0.86, window: [0.46, 0.78] },
  { at: [1.9, -1.15], size: 1.1, window: [0.54, 0.86] },
  { at: [2.05, 0.1], size: 0.7, window: [0.62, 0.94] },
];

/** Volumes drawn as a wireframe at the design stage: ground floor, stair tower, first floor. */
const volumes: { size: Triple; at: Triple; window: [number, number] }[] = [
  { size: [2.2, 0.85, 1.6], at: [-0.4, 0, -0.1], window: [0.3, 0.65] },
  { size: [0.6, 2.05, 0.6], at: [-1.25, 0, -0.65], window: [0.4, 0.85] },
  { size: [2.4, 0.86, 1.7], at: [0.5, 0.85, 0.05], window: [0.55, 1] },
];

const PLOT = { width: 4.4, depth: 3.2 };
const BASE = { width: 5.8, depth: 4.4 };
/** Plot corners in drawing order, as [x, z]. */
const corners: [number, number][] = [
  [-2.2, 1.6],
  [2.2, 1.6],
  [2.2, -1.6],
  [-2.2, -1.6],
];

function segments(points: number[]) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  return geometry;
}

/** A rectangle on the ground from (x0, z0) to (x1, z1), as four line segments. */
function outline(y: number, x0: number, z0: number, x1: number, z1: number) {
  return [x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0];
}

function gridGeometry() {
  const points: number[] = [];
  const step = 0.4;
  for (let i = 1; i < BASE.width / step - 0.5; i++) {
    const x = -BASE.width / 2 + i * step;
    points.push(x, 0, -BASE.depth / 2, x, 0, BASE.depth / 2);
  }
  for (let i = 1; i < BASE.depth / step - 0.5; i++) {
    const z = -BASE.depth / 2 + i * step;
    points.push(-BASE.width / 2, 0, z, BASE.width / 2, 0, z);
  }
  return segments(points);
}

/** Dimension lines along the front and left of the plot. */
function dimensionGeometry() {
  const y = 0.012;
  return segments([
    -2.2, y, 1.92, 2.2, y, 1.92,
    -2.2, y, 1.68, -2.2, y, 2,
    2.2, y, 1.68, 2.2, y, 2,
    -2.5, y, -1.6, -2.5, y, 1.6,
    -2.28, y, 1.6, -2.58, y, 1.6,
    -2.28, y, -1.6, -2.58, y, -1.6,
  ]);
}

/** Floor plan, in the order it is drawn: axes, footprints, partitions, door swing, stairs. */
function planGeometry() {
  const y = 0.014;
  const points = [
    -2, y, -0.1, 2, y, -0.1,
    -0.4, y, -1.4, -0.4, y, 1.4,
    ...outline(y, -1.5, -0.9, 0.7, 0.7),
    ...outline(y, -1.55, -0.95, -0.95, -0.35),
    ...outline(y, -0.7, -0.8, 1.7, 0.9),
    -0.78, y, -0.3, -0.78, y, 0.7,
    -0.95, y, -0.3, -0.78, y, -0.3,
    -0.7, y, -0.5, 0.7, y, -0.5,
  ];
  // Door swing at the entrance
  const hinge = [-1.26, 0.7];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    const b = ((i + 1) / 6) * (Math.PI / 2);
    points.push(hinge[0] + Math.cos(a) * 0.24, y, hinge[1] + Math.sin(a) * 0.24, hinge[0] + Math.cos(b) * 0.24, y, hinge[1] + Math.sin(b) * 0.24);
  }
  // Stair treads in the tower
  for (let i = 1; i < 6; i++) {
    const z = -0.95 + i * 0.1;
    points.push(-1.5, y, z, -1, y, z);
  }
  return segments(points);
}

/** Scaffolding along the front and the right of the first floor. */
function scaffoldGeometry() {
  const points: number[] = [];
  const levels = [0.62, 1.24, 1.86];
  const posts: [number, number][] = [];
  for (let i = 0; i <= 5; i++) posts.push([-0.7 + i * 0.52, 1.1]);
  for (let i = 1; i <= 4; i++) posts.push([1.9, 1.1 - i * 0.5]);
  posts.forEach(([x, z], i) => {
    points.push(x, 0, z, x, levels[2], z);
    const next = posts[i + 1];
    if (!next) return;
    for (const level of levels) points.push(x, level, z, next[0], level, next[1]);
    if (i % 2 === 0) points.push(x, 0, z, next[0], levels[0], next[1]);
  });
  return segments(points);
}

function fireflyGeometry() {
  const points: number[] = [];
  for (let i = 0; i < 36; i++) {
    // Evenly scattered without a random source, so every render matches.
    const angle = i * 2.399963;
    const radius = 1.3 + ((i * 0.618034) % 1) * 1.5;
    points.push(Math.cos(angle) * radius, 0.25 + ((i * 0.381966) % 1) * 1.7, Math.sin(angle) * radius * 0.75);
  }
  return segments(points);
}

export default function SpaceJourneyScene({ tier, settings, visible, stage, orbitRef, onReady }: SpaceJourneySceneProps) {
  const clocksRef = useRef<Clocks>({ plot: 0, design: 0, build: 0, interior: 0, finish: 0, survey: 0, blueprint: 0, site: 0, cutaway: 0 });
  const shadows = tier === 'HIGH';

  return (
    <Canvas
      dpr={settings.dpr}
      shadows={shadows ? 'percentage' : false}
      gl={{ antialias: settings.antialias, alpha: true }}
      camera={{ position: [6, 8, 9], fov: FOV }}
      frameloop={visible ? 'always' : 'never'}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <Director stage={stage} clocksRef={clocksRef} />
      <CameraRig stage={stage} orbitRef={orbitRef} />
      <Lights clocksRef={clocksRef} shadows={shadows} />
      {settings.environment && (
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2.5} position={[0, 5, 5]} scale={[10, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#c9925e" />
        </Environment>
      )}
      <Base />
      <Survey clocksRef={clocksRef} />
      <Blueprint clocksRef={clocksRef} />
      <Parts parts={structure} clock="build" clocksRef={clocksRef} />
      <Parts parts={glazing} clock="interior" clocksRef={clocksRef} />
      <Parts parts={furniture} clock="interior" clocksRef={clocksRef} />
      <Site clocksRef={clocksRef} />
      <Parts parts={garden} clock="finish" clocksRef={clocksRef} />
      <Trees clocksRef={clocksRef} />
      {tier !== 'LOW' && <Fireflies clocksRef={clocksRef} />}
    </Canvas>
  );
}

/** Runs the timelines and keeps the shared materials in step with them. */
function Director({ stage, clocksRef }: Timed & { stage: number }) {
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const c = clocksRef.current;

    // Jumping several stages plays the steps in between as a time-lapse.
    const pending = [c.design < 1 && stage >= 1, c.build < 1 && stage >= 2, c.interior < 1 && stage >= 3, c.finish < 1 && stage >= 4].filter(Boolean).length;
    const rate = 1 + Math.max(0, pending - 1) * 1.4;
    const advance = (value: number, on: boolean, ready: boolean, seconds: number) => {
      if (!on) return Math.max(0, value - dt / REWIND_SECONDS);
      return ready ? Math.min(1, value + (dt * rate) / seconds) : value;
    };

    c.plot = Math.min(1, c.plot + dt / SECONDS.plot);
    c.design = advance(c.design, stage >= 1, true, SECONDS.design);
    c.build = advance(c.build, stage >= 2, c.design > 0.7, SECONDS.build);
    c.interior = advance(c.interior, stage >= 3, c.build > 0.9, SECONDS.interior);
    c.finish = advance(c.finish, stage >= 4, c.interior > 0.6, SECONDS.finish);
    c.survey = MathUtils.damp(c.survey, stage === 0 ? 1 : 0, 4, dt);
    c.blueprint = MathUtils.damp(c.blueprint, stage === 1 ? 1 : 0, 4, dt);
    c.site = MathUtils.damp(c.site, stage === 2 ? 1 : 0, 3, dt);
    c.cutaway = MathUtils.damp(c.cutaway, stage === 3 ? 1 : 0, 3.5, dt);

    const finish = easeInOut(c.finish);
    materials.lower.color.lerpColors(tint.concreteDark, tint.stone, finish);
    materials.lowerFront.color.copy(materials.lower.color);
    materials.upper.color.lerpColors(tint.concrete, tint.plaster, finish);
    materials.upper.roughness = MathUtils.lerp(0.9, 0.6, finish);
    materials.upperFront.color.copy(materials.upper.color);
    materials.upperFront.roughness = materials.upper.roughness;
    materials.tower.color.lerpColors(tint.concrete, tint.timber, finish);
    materials.slab.color.lerpColors(tint.slab, tint.slabFinish, finish);
    materials.roof.color.copy(materials.slab.color);
    materials.ground.color.lerpColors(tint.earth, tint.lawn, finish);

    // The interior stage opens the roof and the front walls.
    const closed = 1 - c.cutaway * 0.94;
    for (const material of [materials.roof, materials.upperFront, materials.lowerFront, materials.door]) {
      material.opacity = closed;
      material.depthWrite = closed > 0.9;
    }
    materials.glass.opacity = 0.16 + 0.2 * finish;
    materials.glass.emissiveIntensity = 0.5 * finish;

    lines.grid.opacity = 0.16 * (1 - finish * 0.85);
    lines.dims.opacity = (0.12 + 0.5 * Math.max(c.survey, c.blueprint)) * c.plot * (1 - finish);
    lines.plan.opacity = (0.3 + 0.6 * c.blueprint) * (1 - span(c.build, 0, 0.4));
    lines.wire.opacity = (0.3 + 0.7 * c.blueprint) * (1 - easeInOut(span(c.build, 0.15, 0.95)));
    lines.scaffold.opacity = 0.75 * c.site;
  });
  return null;
}

/** Orbits the model: a resting view per stage, a slow idle sway, and whatever the visitor drags in. */
function CameraRig({ stage, orbitRef }: { stage: number; orbitRef: RefObject<OrbitInput> }) {
  // Starts high and wide, so the first frames fly in to the plot.
  const current = useRef({ yaw: views[0].yaw - 0.9, pitch: 1.05, zoom: 1.45, x: 0, y: 0.3, z: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const view = views[stage] ?? views[0];
    const orbit = orbitRef.current;
    const c = current.current;

    if (!orbit.dragging) {
      orbit.yaw += orbit.velocity * dt;
      orbit.velocity = MathUtils.damp(orbit.velocity, 0, 3, dt);
    }
    const idle = Math.sin(state.clock.elapsedTime * 0.22) * IDLE_SWAY;
    const follow = orbit.dragging ? 14 : 3.4;
    c.yaw = MathUtils.damp(c.yaw, view.yaw + orbit.yaw + idle + orbit.hoverX * 0.1, follow, dt);
    c.pitch = MathUtils.damp(c.pitch, MathUtils.clamp(view.pitch + orbit.pitch + orbit.hoverY * 0.04, 0.1, 1.25), follow, dt);
    c.zoom = MathUtils.damp(c.zoom, view.zoom, 2.6, dt);
    c.x = MathUtils.damp(c.x, view.target[0], 2.6, dt);
    c.y = MathUtils.damp(c.y, view.target[1], 2.6, dt);
    c.z = MathUtils.damp(c.z, view.target[2], 2.6, dt);

    // Far enough back to fit the model in a wide panel and in a narrow one.
    const aspect = state.size.width / state.size.height;
    const distance = Math.max(FIT_HEIGHT, FIT_WIDTH / aspect) * c.zoom;
    const flat = Math.cos(c.pitch) * distance;
    // Slide the camera and its target together, which moves the model on screen without turning it.
    const half = Math.tan(MathUtils.degToRad(FOV / 2)) * distance;
    const wide = aspect > WIDE_ASPECT;
    const side = wide ? -half * aspect * SHIFT.x : 0;
    const x = c.x + Math.cos(c.yaw) * side;
    const y = c.y + half * (wide ? SHIFT.y : -NARROW_LIFT);
    const z = c.z - Math.sin(c.yaw) * side;
    state.camera.position.set(x + Math.sin(c.yaw) * flat, y + Math.sin(c.pitch) * distance, z + Math.cos(c.yaw) * flat);
    state.camera.lookAt(x, y, z);
  });
  return null;
}

function Lights({ clocksRef, shadows }: Timed & { shadows: boolean }) {
  const living = useRef<PointLight>(null);
  const bedroom = useRef<PointLight>(null);

  useFrame(() => {
    const lit = easeInOut(span(clocksRef.current.interior, 0.2, 0.8));
    if (living.current) living.current.intensity = lit * 1.3;
    if (bedroom.current) bedroom.current.intensity = lit * 1.3;
  });

  return (
    <>
      <hemisphereLight args={['#b9cdfb', '#101a2e', 0.75]} />
      <directionalLight position={[4.5, 7, 5.5]} intensity={2.3} color="#fff1d8" castShadow={shadows} shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} shadow-normalBias={0.02}>
        <orthographicCamera attach="shadow-camera" args={[-3.7, 3.7, 3.7, -3.7, 1, 20]} />
      </directionalLight>
      <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#7fa6ff" />
      <pointLight position={[-4, 2, 3]} intensity={10} color="#c9925e" distance={12} />
      <pointLight ref={living} position={[-0.3, 0.62, 0.05]} color={WARM} intensity={0} distance={2.4} />
      <pointLight ref={bedroom} position={[0.6, 1.42, 0.1]} color={WARM} intensity={0} distance={2.6} />
    </>
  );
}

/** The model's base: a plinth with a drafting grid on top that turns to lawn at the end. */
function Base() {
  const grid = useMemo(() => gridGeometry(), []);
  const rim = useMemo(() => new EdgesGeometry(new BoxGeometry(BASE.width, 0.2, BASE.depth)), []);
  const { plinth, ground } = materials;

  return (
    <group>
      <mesh position-y={-0.1} material={[plinth, plinth, ground, plinth, plinth, plinth]} receiveShadow>
        <boxGeometry args={[BASE.width, 0.2, BASE.depth]} />
      </mesh>
      <lineSegments geometry={rim} material={lines.rim} position-y={-0.1} />
      <lineSegments geometry={grid} material={lines.grid} position-y={0.004} />
    </group>
  );
}

/** Stage 1: the boundary is drawn, pegs are driven in, and the plot is surveyed. */
function Survey({ clocksRef }: Timed) {
  const bars = useRef<Group>(null);
  const pegs = useRef<Group>(null);
  const fill = useRef<Mesh>(null);
  const pin = useRef<Group>(null);
  const rings = useRef<Group>(null);
  const sweep = useRef<Group>(null);
  const curtain = useRef<Mesh>(null);
  const dimensions = useMemo(() => dimensionGeometry(), []);

  useFrame((state) => {
    const { plot, survey, finish } = clocksRef.current;
    const t = state.clock.elapsedTime;

    bars.current?.children.forEach((bar, i) => {
      bar.scale.x = Math.max(0.001, easeInOut(span(plot, i * 0.2, i * 0.2 + 0.3)));
    });
    pegs.current?.children.forEach((peg, i) => {
      const p = span(plot, 0.1 + i * 0.2, 0.35 + i * 0.2);
      peg.visible = p > 0.001;
      peg.position.y = 0.14 + (1 - easeOutBack(p)) * 1.1;
    });
    if (fill.current) (fill.current.material as MeshBasicMaterial).opacity = (0.03 + 0.11 * survey) * plot * (1 - finish);

    if (pin.current) {
      const size = survey * easeOutBack(span(plot, 0.55, 0.9));
      pin.current.visible = size > 0.02;
      pin.current.scale.setScalar(Math.max(0.001, size));
      pin.current.position.y = 0.95 + Math.sin(t * 1.7) * 0.07;
      pin.current.rotation.y = t * 0.9;
    }
    rings.current?.children.forEach((ring, i) => {
      const phase = (t * 0.45 + i * 0.5) % 1;
      ring.scale.setScalar(0.25 + phase * 1.3);
      ((ring as Mesh).material as MeshBasicMaterial).opacity = (1 - phase) * 0.55 * survey * span(plot, 0.6, 1);
    });
    if (sweep.current) {
      sweep.current.visible = survey > 0.02;
      sweep.current.position.x = Math.sin(t * 0.8) * (PLOT.width / 2 - 0.05);
    }
    if (curtain.current) (curtain.current.material as MeshBasicMaterial).opacity = 0.22 * survey;
  });

  return (
    <group>
      <group ref={bars}>
        {corners.map((from, i) => {
          const to = corners[(i + 1) % corners.length];
          const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
          return (
            <group key={i} position={[from[0], 0.014, from[1]]} rotation-y={Math.atan2(from[1] - to[1], to[0] - from[0])}>
              <mesh position-x={length / 2} material={materials.gold}>
                <boxGeometry args={[length, 0.018, 0.028]} />
              </mesh>
            </group>
          );
        })}
      </group>
      <group ref={pegs}>
        {corners.map(([x, z], i) => (
          <mesh key={i} position={[x, 0.14, z]} material={materials.gold} visible={false}>
            <cylinderGeometry args={[0.035, 0.03, 0.3, 10]} />
          </mesh>
        ))}
      </group>
      <mesh ref={fill} rotation-x={-Math.PI / 2} position-y={0.008}>
        <planeGeometry args={[PLOT.width, PLOT.depth]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0} depthWrite={false} />
      </mesh>
      <lineSegments geometry={dimensions} material={lines.dims} />

      {/* Location pin over the plot, with a pulse on the ground beneath it */}
      <group ref={pin} visible={false}>
        <mesh position-y={0.2}>
          <sphereGeometry args={[0.17, 24, 16]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.45} metalness={0.3} roughness={0.35} />
        </mesh>
        <mesh rotation-x={Math.PI} position-y={-0.02}>
          <coneGeometry args={[0.13, 0.3, 20]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.45} metalness={0.3} roughness={0.35} />
        </mesh>
      </group>
      <group ref={rings} position-y={0.02}>
        {[0, 1].map((i) => (
          <mesh key={i} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.92, 1, 48]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Survey sweep across the plot */}
      <group ref={sweep} visible={false}>
        <mesh position-y={0.02} material={materials.gold}>
          <boxGeometry args={[0.02, 0.02, PLOT.depth]} />
        </mesh>
        <mesh ref={curtain} rotation-y={Math.PI / 2} position-y={0.26}>
          <planeGeometry args={[PLOT.depth, 0.5]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0} depthWrite={false} side={DoubleSide} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Stage 2: the floor plan is drawn on the plot and the volumes rise as a wireframe. */
function Blueprint({ clocksRef }: Timed) {
  const plan = useRef<LineSegments>(null);
  const wires = useRef<Group>(null);
  const scan = useRef<Group>(null);
  const sheet = useRef<Mesh>(null);
  const planLines = useMemo(() => planGeometry(), []);
  const wireframes = useMemo(() => volumes.map(({ size }) => new EdgesGeometry(new BoxGeometry(...size)).translate(0, size[1] / 2, 0)), []);

  useFrame((state) => {
    const { design, blueprint } = clocksRef.current;
    if (plan.current) {
      const count = plan.current.geometry.getAttribute('position').count;
      plan.current.geometry.setDrawRange(0, Math.floor((easeInOut(span(design, 0, 0.5)) * count) / 2) * 2);
    }
    wires.current?.children.forEach((wire, i) => {
      const p = easeInOut(span(design, volumes[i].window[0], volumes[i].window[1]));
      wire.visible = p > 0.001;
      wire.scale.y = Math.max(0.001, p);
    });
    if (scan.current) {
      scan.current.visible = blueprint > 0.02;
      scan.current.position.y = 0.12 + (Math.sin(state.clock.elapsedTime * 0.9) * 0.5 + 0.5) * 1.8;
    }
    if (sheet.current) (sheet.current.material as MeshBasicMaterial).opacity = 0.1 * blueprint * span(design, 0.3, 0.7);
  });

  return (
    <group>
      <lineSegments ref={plan} geometry={planLines} material={lines.plan} />
      <group ref={wires}>
        {volumes.map((volume, i) => (
          <lineSegments key={i} geometry={wireframes[i]} material={lines.wire} position={volume.at} visible={false} />
        ))}
      </group>
      {/* A level sweeping through the design */}
      <group ref={scan} visible={false}>
        <mesh ref={sheet} rotation-x={-Math.PI / 2} position={[0.1, 0, 0]}>
          <planeGeometry args={[3.7, 2.3]} />
          <meshBasicMaterial color={BLUEPRINT} transparent opacity={0} depthWrite={false} side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/** Boxes that rise, drop or pop into place as their clock passes each one's window. */
function Parts({ parts, clock, clocksRef }: Timed & { parts: Part[]; clock: keyof Clocks }) {
  const group = useRef<Group>(null);

  useFrame(() => {
    const clocks = clocksRef.current;
    const value = clocks[clock];
    group.current?.children.forEach((child, i) => {
      const { window, motion, at, opens } = parts[i];
      const p = span(value, window[0], window[1]);
      child.visible = p > 0.001;
      if (!child.visible) return;
      if (motion === 'drop') child.position.y = at[1] + (1 - easeOut(p)) * DROP_HEIGHT;
      else if (motion === 'pop') child.scale.setScalar(Math.max(0.001, easeOutBack(p)));
      else child.scale.y = Math.max(0.001, easeInOut(p));
      if (opens) child.children[0].castShadow = clocks.cutaway < 0.5;
    });
  });

  return (
    <group ref={group}>
      {parts.map((part, i) => (
        <group key={i} position={part.at} visible={false}>
          <mesh position-y={part.size[1] / 2} material={materials[part.material]} castShadow={part.shadow !== false} receiveShadow>
            <boxGeometry args={part.size} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Stage 3: a tower crane, scaffolding and stacked materials while the structure goes up. */
function Site({ clocksRef }: Timed) {
  const site = useRef<Group>(null);
  const slew = useRef<Group>(null);
  const cable = useRef<Mesh>(null);
  const load = useRef<Mesh>(null);
  const scaffold = useMemo(() => scaffoldGeometry(), []);

  useFrame((state) => {
    const { site: active } = clocksRef.current;
    const t = state.clock.elapsedTime;
    if (site.current) {
      site.current.visible = active > 0.02;
      site.current.scale.setScalar(Math.max(0.001, easeOutBack(clamp01(active))));
    }
    // The jib swings over the building while the hook runs a load up and down.
    if (slew.current) slew.current.rotation.y = 0.5 + Math.sin(t * 0.4) * 0.5;
    const drop = 0.6 + (Math.sin(t * 0.7) * 0.5 + 0.5) * 0.7;
    if (cable.current) {
      cable.current.scale.y = drop;
      cable.current.position.y = -drop / 2;
    }
    if (load.current) load.current.position.y = -drop - 0.03;
  });

  return (
    <group>
      <lineSegments geometry={scaffold} material={lines.scaffold} />
      <group ref={site} position={[2.35, 0, -1.55]} visible={false}>
        <mesh position-y={1.55} material={materials.steel} castShadow>
          <boxGeometry args={[0.12, 3.1, 0.12]} />
        </mesh>
        <mesh position-y={0.04} material={materials.column}>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
        </mesh>
        <group ref={slew} position-y={3.1}>
          <mesh position={[-1, 0.04, 0]} material={materials.steel} castShadow>
            <boxGeometry args={[2.8, 0.07, 0.07]} />
          </mesh>
          <mesh position={[0.55, 0, 0]} material={materials.column}>
            <boxGeometry args={[0.3, 0.2, 0.2]} />
          </mesh>
          <mesh position={[0, 0.12, 0]} material={materials.linen}>
            <boxGeometry args={[0.18, 0.16, 0.18]} />
          </mesh>
          <group position={[-1.9, 0, 0]}>
            <mesh ref={cable} material={materials.linen}>
              <boxGeometry args={[0.012, 1, 0.012]} />
            </mesh>
            <mesh ref={load} material={materials.slab} castShadow>
              <boxGeometry args={[0.42, 0.05, 0.3]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/** Stage 5: trees grow in around the finished home and sway a little. */
function Trees({ clocksRef }: Timed) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    const { finish } = clocksRef.current;
    group.current?.children.forEach((tree, i) => {
      const { window, size } = trees[i];
      const p = span(finish, window[0], window[1]);
      tree.visible = p > 0.001;
      tree.scale.setScalar(Math.max(0.001, easeOutBack(p)) * size);
      tree.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + i * 1.7) * 0.025;
    });
  });

  return (
    <group ref={group}>
      {trees.map(({ at }, i) => (
        <group key={i} position={[at[0], 0, at[1]]} visible={false}>
          <mesh position-y={0.24} material={materials.trunk} castShadow>
            <cylinderGeometry args={[0.03, 0.045, 0.48, 8]} />
          </mesh>
          <mesh position-y={0.66} material={materials.canopy} castShadow>
            <icosahedronGeometry args={[0.3, 1]} />
          </mesh>
          <mesh position={[0.13, 0.9, 0.05]} material={materials.canopyLight} castShadow>
            <icosahedronGeometry args={[0.19, 1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Warm specks drifting over the garden once the home is finished. */
function Fireflies({ clocksRef }: Timed) {
  const points = useRef<Points>(null);
  const geometry = useMemo(() => fireflyGeometry(), []);

  useFrame((state) => {
    if (!points.current) return;
    const { finish } = clocksRef.current;
    const t = state.clock.elapsedTime;
    points.current.visible = finish > 0.02;
    points.current.rotation.y = t * 0.06;
    points.current.position.y = Math.sin(t * 0.5) * 0.08;
    (points.current.material as PointsMaterial).opacity = span(finish, 0.5, 1) * (0.65 + Math.sin(t * 2.2) * 0.25);
  });

  return (
    <points ref={points} geometry={geometry} visible={false}>
      <pointsMaterial color={WARM} size={0.045} sizeAttenuation transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
    </points>
  );
}
