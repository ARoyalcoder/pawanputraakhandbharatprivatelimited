'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { DoubleSide, MathUtils, type Group, type Mesh, type MeshStandardMaterial } from 'three';

const WHITE = '#eef1f6';
const ALUMINIUM = '#c3cad6';
const DARK = '#141a24';
const GLASS = '#0a1626';
const WARM = '#ffd58a';

export interface ModuleProps {
  accent: string;
  isActive?: boolean;
}

/** Evenly spaced positions centred on zero. */
const spread = (count: number, gap: number) => Array.from({ length: count }, (_, i) => (i - (count - 1) / 2) * gap);

/**
 * Pawan Putra Secure: an outdoor bullet CCTV camera on its wall bracket. White housing with a
 * sun shield, a glass lens behind a ring of infrared LEDs, and a slow surveillance pan.
 */
export function CameraModule({ accent, isActive = false }: ModuleProps) {
  const head = useRef<Group>(null);
  const led = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (head.current) head.current.rotation.y = MathUtils.damp(head.current.rotation.y, -0.35 + Math.sin(t * 0.7) * 0.22, 3, delta);
    // The recording light blinks while this division is in focus.
    if (led.current) led.current.visible = !isActive || Math.sin(t * 5) > -0.3;
  });

  return (
    <group scale={0.92} position={[0, 0.04, 0]} rotation={[0.06, -1.25, -0.08]}>
      {/* Wall plate, arm and ball joint */}
      <mesh position={[-0.5, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.035, 32]} />
        <meshStandardMaterial color={WHITE} roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[-0.37, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.045, 0.24, 20]} />
        <meshStandardMaterial color={WHITE} roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[-0.24, -0.08, 0]}>
        <sphereGeometry args={[0.06, 24, 16]} />
        <meshStandardMaterial color={ALUMINIUM} roughness={0.3} metalness={0.8} />
      </mesh>

      <group ref={head} position={[-0.24, -0.08, 0]}>
        <group position={[0.3, 0.12, 0]} rotation={[0, 0, -0.1]}>
          {/* Housing */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.125, 0.125, 0.56, 40]} />
            <meshStandardMaterial color={WHITE} roughness={0.35} metalness={0.2} envMapIntensity={1.2} />
          </mesh>
          {/* Rear cap with the cable gland */}
          <mesh position={[-0.29, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.105, 0.125, 0.04, 40]} />
            <meshStandardMaterial color={ALUMINIUM} roughness={0.35} metalness={0.6} />
          </mesh>
          {/* Sun shield, overhanging the lens */}
          <mesh position={[0.05, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.66, 40, 1, true, Math.PI * 0.5 + 0.55, Math.PI - 1.1]} />
            <meshStandardMaterial color={WHITE} roughness={0.4} metalness={0.15} side={DoubleSide} />
          </mesh>
          {/* Front bezel */}
          <mesh position={[0.285, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.122, 0.122, 0.02, 40]} />
            <meshStandardMaterial color={DARK} roughness={0.25} metalness={0.5} />
          </mesh>
          {/* Lens barrel and glass */}
          <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.058, 0.062, 0.03, 32]} />
            <meshStandardMaterial color="#05070b" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0.312, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <sphereGeometry args={[0.052, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
            <meshStandardMaterial color="#0b1f3a" roughness={0.03} metalness={1} envMapIntensity={3} />
          </mesh>
          {/* Infrared LEDs around the lens */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} position={[0.297, Math.cos(a) * 0.092, Math.sin(a) * 0.092]}>
                <sphereGeometry args={[0.011, 10, 8]} />
                <meshBasicMaterial color={isActive ? '#ff6a5c' : '#5c2b2b'} toneMapped={false} />
              </mesh>
            );
          })}
          {/* Status light */}
          <mesh ref={led} position={[0.297, -0.105, 0.045]}>
            <sphereGeometry args={[0.009, 8, 8]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Pawan Putra Connect: a Wi-Fi router. Low matte body with vents, a row of link lights that
 * flicker with traffic, and three antennas.
 */
export function NetworkModule({ accent, isActive = false }: ModuleProps) {
  const lights = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    lights.current?.children.forEach((light, i) => {
      // Each port blinks to its own rhythm; faster while the division is in focus.
      const on = Math.sin(t * (isActive ? 9 : 4) * (0.6 + i * 0.23) + i * 1.7) > -0.2;
      ((light as Mesh).material as MeshStandardMaterial).emissiveIntensity = on ? 2.2 : 0.15;
    });
  });

  return (
    <group scale={0.92} rotation={[0.15, -0.42, -0.04]} position={[0, -0.18, 0.06]}>
      {/* Body */}
      <RoundedBox args={[0.92, 0.11, 0.56]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color="#f2f4f8" roughness={0.4} metalness={0.1} envMapIntensity={1.1} />
      </RoundedBox>
      {/* Dark front strip carrying the link lights */}
      <mesh position={[0, 0, 0.281]}>
        <boxGeometry args={[0.78, 0.045, 0.006]} />
        <meshStandardMaterial color={DARK} roughness={0.2} metalness={0.4} />
      </mesh>
      <group ref={lights}>
        {spread(6, 0.085).map((x, i) => (
          <mesh key={i} position={[x - 0.1, 0, 0.286]}>
            <boxGeometry args={[0.03, 0.012, 0.004]} />
            <meshStandardMaterial color={i === 0 ? '#7dff9a' : accent} emissive={i === 0 ? '#7dff9a' : accent} emissiveIntensity={1} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* Cooling vents on top */}
      {spread(7, 0.07).map((z) => (
        <mesh key={z} position={[0, 0.056, z * 0.9]}>
          <boxGeometry args={[0.62, 0.004, 0.022]} />
          <meshStandardMaterial color="#aab2c0" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
      {/* Antennas: hinge, mast and tip - raked back and flared so they do not intersect the PPAB logo */}
      {[-0.36, 0, 0.36].map((x, i) => (
        <group key={x} position={[x, 0.03, -0.27]} rotation={[-0.34, 0, (i - 1) * -0.22]}>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.03, 0.034, 0.07, 16]} />
            <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.27, 0]}>
            <cylinderGeometry args={[0.016, 0.022, 0.44, 16]} />
            <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.016, 12, 8]} />
            <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.2} />
          </mesh>
        </group>
      ))}
      {/* Rubber feet */}
      {[-0.36, 0.36].flatMap((x) =>
        [-0.2, 0.2].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -0.06, z]}>
            <cylinderGeometry args={[0.03, 0.03, 0.015, 12]} />
            <meshStandardMaterial color="#20242c" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}

const CELL_COLUMNS = 6;
const CELL_ROWS = 4;
const PANEL = { width: 1.0, depth: 0.66 };

/**
 * Pawan Putra Solar: a framed photovoltaic panel on a tilted ground mount. Deep-blue cells
 * with silver busbars under glass, an anodised aluminium frame, and steel legs.
 */
export function SolarModule({ accent, isActive = false }: ModuleProps) {
  const panel = useRef<Group>(null);
  const glint = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Tracks the sun by a few degrees.
    if (panel.current) panel.current.rotation.x = 0.62 + Math.sin(t * 0.5) * 0.05;
    if (glint.current) {
      // A band of light crosses the glass now and then.
      const p = (t * (isActive ? 0.5 : 0.28)) % 1.6;
      glint.current.position.x = MathUtils.lerp(-PANEL.width / 2, PANEL.width / 2, Math.min(1, p));
      glint.current.visible = p < 1;
    }
  });

  const cellWidth = (PANEL.width - 0.07) / CELL_COLUMNS;
  const cellDepth = (PANEL.depth - 0.07) / CELL_ROWS;

  return (
    <group scale={0.9} rotation={[0.04, -0.62, 0]} position={[0.04, -0.14, 0]}>
      <group ref={panel} position={[0, 0.06, 0]} rotation={[0.58, 0, 0]}>
        {/* Aluminium frame and white backsheet */}
        <RoundedBox args={[PANEL.width, 0.035, PANEL.depth]} radius={0.012} smoothness={3}>
          <meshStandardMaterial color={ALUMINIUM} roughness={0.3} metalness={0.9} envMapIntensity={1.4} />
        </RoundedBox>
        <mesh position={[0, 0.0185, 0]}>
          <boxGeometry args={[PANEL.width - 0.04, 0.002, PANEL.depth - 0.04]} />
          <meshStandardMaterial color="#e9edf3" roughness={0.6} />
        </mesh>
        {/* Cells */}
        {spread(CELL_COLUMNS, cellWidth).flatMap((x) =>
          spread(CELL_ROWS, cellDepth).map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.021, z]}>
              <boxGeometry args={[cellWidth - 0.012, 0.003, cellDepth - 0.012]} />
              <meshStandardMaterial color="#0b2a5c" roughness={0.18} metalness={0.75} envMapIntensity={2.2} />
            </mesh>
          ))
        )}
        {/* Busbars running across every cell */}
        {spread(CELL_ROWS, cellDepth).flatMap((z) =>
          [-0.035, 0.035].map((offset) => (
            <mesh key={`${z}${offset}`} position={[0, 0.0232, z + offset]}>
              <boxGeometry args={[PANEL.width - 0.07, 0.001, 0.004]} />
              <meshStandardMaterial color="#d7dde6" roughness={0.3} metalness={0.9} />
            </mesh>
          ))
        )}
        {/* Glass */}
        <mesh position={[0, 0.026, 0]}>
          <boxGeometry args={[PANEL.width - 0.04, 0.003, PANEL.depth - 0.04]} />
          <meshStandardMaterial color="#9cc4ff" roughness={0.02} metalness={0.4} transparent opacity={0.16} envMapIntensity={3} depthWrite={false} />
        </mesh>
        <mesh ref={glint} position={[0, 0.029, 0]} rotation={[0, 0.35, 0]}>
          <boxGeometry args={[0.09, 0.001, PANEL.depth * 1.1]} />
          <meshBasicMaterial color={accent} transparent opacity={0.22} depthWrite={false} toneMapped={false} />
        </mesh>
        {/* Junction box on the back */}
        <mesh position={[0, -0.03, -PANEL.depth / 2 + 0.1]}>
          <boxGeometry args={[0.12, 0.03, 0.08]} />
          <meshStandardMaterial color={DARK} roughness={0.5} />
        </mesh>
      </group>

      {/* Ground mount: rear legs, front legs and a rail */}
      {[-0.36, 0.36].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.12, -0.19]}>
            <boxGeometry args={[0.03, 0.56, 0.03]} />
            <meshStandardMaterial color="#8c95a4" roughness={0.35} metalness={0.85} />
          </mesh>
          <mesh position={[x, -0.3, 0.22]}>
            <boxGeometry args={[0.03, 0.2, 0.03]} />
            <meshStandardMaterial color="#8c95a4" roughness={0.35} metalness={0.85} />
          </mesh>
          <mesh position={[x, -0.4, 0.015]}>
            <boxGeometry args={[0.05, 0.02, 0.56]} />
            <meshStandardMaterial color="#6f7887" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const CHART = [0.1, 0.16, 0.13, 0.22, 0.18, 0.27, 0.24];

/**
 * Pawan Putra Digital: an open laptop. Aluminium base with a keyboard and trackpad, and a
 * lit screen showing a dashboard whose bars keep moving.
 */
export function DigitalModule({ accent, isActive = false }: ModuleProps) {
  const bars = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    bars.current?.children.forEach((bar, i) => {
      const height = CHART[i] * (0.8 + 0.2 * Math.sin(t * (isActive ? 2.4 : 1.2) + i * 0.9));
      bar.scale.y = height / CHART[i];
      bar.position.y = -0.16 + height / 2;
    });
  });

  return (
    <group scale={0.92} rotation={[0.22, -0.74, 0.04]} position={[0.04, -0.14, 0]}>
      {/* Base */}
      <RoundedBox args={[0.9, 0.03, 0.6]} radius={0.012} smoothness={3}>
        <meshStandardMaterial color={ALUMINIUM} roughness={0.28} metalness={0.9} envMapIntensity={1.4} />
      </RoundedBox>
      {/* Keyboard well, keys and trackpad */}
      <mesh position={[0, 0.0155, -0.08]}>
        <boxGeometry args={[0.78, 0.002, 0.3]} />
        <meshStandardMaterial color="#1a2029" roughness={0.6} />
      </mesh>
      {spread(5, 0.056).flatMap((z) =>
        spread(12, 0.062).map((x) => (
          <mesh key={`${x}${z}`} position={[x, 0.0185, z - 0.08]}>
            <boxGeometry args={[0.05, 0.004, 0.044]} />
            <meshStandardMaterial color="#2b323d" roughness={0.5} />
          </mesh>
        ))
      )}
      <mesh position={[0, 0.0158, 0.18]}>
        <boxGeometry args={[0.28, 0.002, 0.15]} />
        <meshStandardMaterial color="#b3bbc8" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Lid, hinged at the back edge - open wider to face camera */}
      <group position={[0, 0.015, -0.3]} rotation={[-0.42, 0, 0]}>
        <RoundedBox args={[0.9, 0.6, 0.018]} radius={0.012} smoothness={3} position={[0, 0.3, 0]}>
          <meshStandardMaterial color={ALUMINIUM} roughness={0.28} metalness={0.9} envMapIntensity={1.4} />
        </RoundedBox>
        {/* Bezel and screen */}
        <mesh position={[0, 0.3, 0.0095]}>
          <boxGeometry args={[0.87, 0.57, 0.002]} />
          <meshStandardMaterial color="#05070b" roughness={0.25} />
        </mesh>
        <group position={[0, 0.305, 0.011]}>
          <mesh>
            <planeGeometry args={[0.82, 0.51]} />
            <meshBasicMaterial color={GLASS} toneMapped={false} />
          </mesh>
          {/* Window bar, side menu and a headline figure */}
          <mesh position={[0, 0.225, 0.001]}>
            <planeGeometry args={[0.82, 0.05]} />
            <meshBasicMaterial color="#15263f" toneMapped={false} />
          </mesh>
          {[-0.37, -0.34, -0.31].map((x, i) => (
            <mesh key={x} position={[x, 0.225, 0.002]}>
              <circleGeometry args={[0.009, 12]} />
              <meshBasicMaterial color={['#ff6a5c', '#ffc24a', '#52d86b'][i]} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[-0.335, -0.03, 0.001]}>
            <planeGeometry args={[0.13, 0.42]} />
            <meshBasicMaterial color="#101d33" toneMapped={false} />
          </mesh>
          {spread(5, 0.06).map((y) => (
            <mesh key={y} position={[-0.335, y + 0.02, 0.002]}>
              <planeGeometry args={[0.09, 0.016]} />
              <meshBasicMaterial color="#2c4368" toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[-0.13, 0.14, 0.002]}>
            <planeGeometry args={[0.2, 0.035]} />
            <meshBasicMaterial color="#e8eefc" toneMapped={false} />
          </mesh>
          <mesh position={[0.2, 0.14, 0.002]}>
            <planeGeometry args={[0.2, 0.05]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
          {/* Chart */}
          <group ref={bars} position={[0.07, 0, 0.002]}>
            {CHART.map((h, i) => (
              <mesh key={i} position={[-0.27 + i * 0.09, -0.16 + h / 2, 0]}>
                <planeGeometry args={[0.055, h]} />
                <meshBasicMaterial color={i === CHART.length - 2 ? WARM : accent} toneMapped={false} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * Pawan Putra Space: a three-storey building. Floor slabs with glazing between them, a core
 * wall, balconies, a glass entrance and a roof terrace; some windows are lit from inside.
 */
export function SpaceModule({ accent, isActive = false }: ModuleProps) {
  const beacon = useRef<Mesh>(null);

  useFrame((state) => {
    if (beacon.current) beacon.current.visible = !isActive || Math.sin(state.clock.elapsedTime * 4) > 0;
  });

  const floors = [0, 1, 2];
  const storey = 0.24;

  return (
    <group scale={0.76} rotation={[0, -0.72, 0]} position={[-0.14, -0.22, 0]}>
      {/* Plot */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[1.05, 0.04, 0.8]} />
        <meshStandardMaterial color="#39424f" roughness={0.9} />
      </mesh>
      <mesh position={[0.36, 0.002, 0.05]}>
        <boxGeometry args={[0.28, 0.006, 0.66]} />
        <meshStandardMaterial color="#3f7a4d" roughness={0.95} />
      </mesh>

      {/* Solid core at the back and side */}
      <mesh position={[-0.33, storey * 1.5 + 0.02, 0]}>
        <boxGeometry args={[0.12, storey * 3 + 0.04, 0.56]} />
        <meshStandardMaterial color="#d9c9b0" roughness={0.75} />
      </mesh>
      <mesh position={[-0.06, storey * 1.5 + 0.02, -0.25]}>
        <boxGeometry args={[0.66, storey * 3 + 0.04, 0.06]} />
        <meshStandardMaterial color={WHITE} roughness={0.7} />
      </mesh>

      {floors.map((floor) => {
        const y = floor * storey;
        return (
          <group key={floor} position={[0, y, 0]}>
            {/* Slab, projecting as a balcony at the front */}
            <mesh position={[-0.05, storey + 0.01, 0.03]}>
              <boxGeometry args={[0.7, 0.025, 0.66]} />
              <meshStandardMaterial color={WHITE} roughness={0.6} />
            </mesh>
            {/* Glazing along the front and the open side */}
            <mesh position={[-0.02, storey / 2, 0.24]}>
              <boxGeometry args={[0.5, storey - 0.03, 0.012]} />
              <meshStandardMaterial color="#2a5fa8" roughness={0.08} metalness={0.7} envMapIntensity={2.4} />
            </mesh>
            <mesh position={[0.235, storey / 2, 0]}>
              <boxGeometry args={[0.012, storey - 0.03, 0.48]} />
              <meshStandardMaterial color="#2a5fa8" roughness={0.08} metalness={0.7} envMapIntensity={2.4} />
            </mesh>
            {/* Mullions */}
            {spread(4, 0.165).map((x) => (
              <mesh key={x} position={[x - 0.02, storey / 2, 0.248]}>
                <boxGeometry args={[0.012, storey - 0.03, 0.008]} />
                <meshStandardMaterial color="#2a323e" roughness={0.4} metalness={0.6} />
              </mesh>
            ))}
            {/* Rooms lit from inside */}
            {[-0.18, 0.15].map((x, i) =>
              (floor + i) % 2 === 0 ? (
                <mesh key={x} position={[x - 0.02 + 0.08, storey / 2, 0.2475]}>
                  <planeGeometry args={[0.14, storey - 0.07]} />
                  <meshBasicMaterial color={WARM} transparent opacity={0.85} toneMapped={false} />
                </mesh>
              ) : null
            )}
            {/* Balcony rail */}
            {floor > 0 && (
              <mesh position={[-0.05, 0.055, 0.35]}>
                <boxGeometry args={[0.7, 0.07, 0.006]} />
                <meshStandardMaterial color="#bcd4ff" roughness={0.05} metalness={0.5} transparent opacity={0.35} depthWrite={false} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Entrance canopy and door */}
      <mesh position={[0.02, 0.2, 0.36]}>
        <boxGeometry args={[0.26, 0.015, 0.14]} />
        <meshStandardMaterial color="#2a323e" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0.02, 0.1, 0.2485]}>
        <planeGeometry args={[0.13, 0.18]} />
        <meshBasicMaterial color={WARM} toneMapped={false} />
      </mesh>

      {/* Roof: parapet, plant room and a beacon */}
      <mesh position={[-0.05, storey * 3 + 0.05, 0.03]}>
        <boxGeometry args={[0.72, 0.05, 0.68]} />
        <meshStandardMaterial color={WHITE} roughness={0.6} />
      </mesh>
      <mesh position={[-0.22, storey * 3 + 0.13, -0.1]}>
        <boxGeometry args={[0.2, 0.11, 0.2]} />
        <meshStandardMaterial color="#aeb6c3" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[-0.22, storey * 3 + 0.25, -0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
        <meshStandardMaterial color="#aeb6c3" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={beacon} position={[-0.22, storey * 3 + 0.33, -0.1]}>
        <sphereGeometry args={[0.016, 10, 8]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>

      {/* A tree on the lawn */}
      <mesh position={[0.4, 0.07, 0.22]}>
        <cylinderGeometry args={[0.012, 0.016, 0.14, 8]} />
        <meshStandardMaterial color="#6b4f33" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.2, 0.22]}>
        <icosahedronGeometry args={[0.1, 1]} />
        <meshStandardMaterial color="#3b7a50" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}
