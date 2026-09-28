/**
 * Drawing primitives for concept illustrations. All scenes share an 800×600 canvas,
 * a horizon at y=470 and the navy/gold palette, so they read as one family.
 */

export const GOLD = '#D8A62A';
export const GOLD_LIGHT = '#F4C95D';
export const LINE = 'rgba(255,255,255,0.42)';
export const LINE_SOFT = 'rgba(255,255,255,0.16)';
export const NAVY_FILL = '#0f2b55';
export const NAVY_DEEP = '#081b3b';
export const HORIZON = 470;

/**
 * Round trig-derived coordinates: server (Node) and browser engines can differ in the last
 * floating-point digit, which would otherwise cause hydration mismatches in SVG attributes.
 */
export const r2 = (n: number) => Math.round(n * 100) / 100;

export function Backdrop({ id, glowX = 560, glowY = 220, glowColor = GOLD }: { id: string; glowX?: number; glowY?: number; glowColor?: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d2a55" />
          <stop offset="0.55" stopColor="#06152f" />
          <stop offset="1" stopColor="#020b1d" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx={glowX} cy={glowY} r="360" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={glowColor} stopOpacity="0.32" />
          <stop offset="0.45" stopColor={glowColor} stopOpacity="0.08" />
          <stop offset="1" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#fff" strokeOpacity="0.045" />
        </pattern>
        <linearGradient id={`${id}-floor`} x1="0" y1={HORIZON} x2="0" y2="600" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={GOLD} stopOpacity="0.26" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-window`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GOLD_LIGHT} stopOpacity="0.9" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GOLD_LIGHT} stopOpacity="0.45" />
          <stop offset="1" stopColor={GOLD_LIGHT} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#${id}-bg)`} />
      <rect width="800" height="600" fill={`url(#${id}-grid)`} />
      <rect width="800" height="600" fill={`url(#${id}-glow)`} />
    </>
  );
}

/** Perspective floor grid converging toward the centre of the horizon. */
export function Floor({ id, vanishX = 400 }: { id: string; vanishX?: number }) {
  const rays = Array.from({ length: 17 }, (_, i) => -400 + i * 100);
  const rows = [478, 492, 512, 540, 578];
  return (
    <g>
      <rect x="0" y={HORIZON} width="800" height={600 - HORIZON} fill={`url(#${id}-floor)`} opacity="0.35" />
      <line x1="0" y1={HORIZON} x2="800" y2={HORIZON} stroke={GOLD} strokeOpacity="0.5" />
      {rays.map((x) => (
        <line key={x} x1={vanishX} y1={HORIZON} x2={x} y2="600" stroke={GOLD} strokeOpacity="0.1" />
      ))}
      {rows.map((y) => (
        <line key={y} x1="0" y1={y} x2="800" y2={y} stroke={GOLD} strokeOpacity="0.08" />
      ))}
    </g>
  );
}

/** Deterministic grid of windows; `lit` picks which are glowing so SSR output is stable. */
export function Windows({
  id,
  x,
  y,
  cols,
  rows,
  w,
  h,
  gap,
  lit = (c, r) => (c * 7 + r * 3) % 4 !== 0,
}: {
  id: string;
  x: number;
  y: number;
  cols: number;
  rows: number;
  w: number;
  h: number;
  gap: number;
  lit?: (col: number, row: number) => boolean;
}) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = lit(c, r);
      cells.push(
        <rect
          key={`${c}-${r}`}
          x={x + c * (w + gap)}
          y={y + r * (h + gap)}
          width={w}
          height={h}
          rx="1.5"
          fill={on ? `url(#${id}-window)` : NAVY_DEEP}
          fillOpacity={on ? 0.85 : 1}
          stroke={LINE_SOFT}
        />
      );
    }
  }
  return <g>{cells}</g>;
}

/** Wall-mounted bullet camera pointing left or right, with a soft coverage beam. */
export function BulletCamera({ id, x, y, dir = 1, scale = 1, beam = true }: { id: string; x: number; y: number; dir?: 1 | -1; scale?: number; beam?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * scale} ${scale})`}>
      {beam && <path d="M34 8 L170 70 L170 -30 Z" fill={`url(#${id}-beam)`} opacity="0.55" />}
      <rect x="-6" y="-14" width="8" height="30" rx="2" fill={NAVY_FILL} stroke={LINE} />
      <path d="M2 2 L10 2 L14 -4" fill="none" stroke={LINE} strokeWidth="2" />
      <rect x="8" y="-10" width="30" height="18" rx="5" fill="#dfe6f1" />
      <rect x="30" y="-8" width="8" height="14" rx="3" fill={NAVY_DEEP} />
      <circle cx="35" cy="-1" r="3" fill={GOLD_LIGHT} />
      <rect x="10" y="-14" width="30" height="5" rx="2" fill="#bfcde3" />
    </g>
  );
}

/** Ceiling dome camera. */
export function DomeCamera({ x, y, r = 22 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-r * 1.1} y={-6} width={r * 2.2} height={8} rx="3" fill="#dfe6f1" />
      <path d={`M${-r} 2 A${r} ${r} 0 0 0 ${r} 2 Z`} fill={NAVY_DEEP} stroke="#dfe6f1" strokeWidth="2.5" />
      <circle cx="0" cy={r * 0.45} r={r * 0.28} fill={NAVY_FILL} stroke={GOLD} />
      <circle cx="0" cy={r * 0.45} r={r * 0.1} fill={GOLD_LIGHT} />
    </g>
  );
}

/** Wi-Fi arcs radiating upward from a point. */
export function WifiArcs({ x, y, color = GOLD_LIGHT, scale = 1 }: { x: number; y: number; color?: string; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={color} strokeLinecap="round">
      <path d="M-10 -10 A14 14 0 0 1 10 -10" strokeWidth="2.5" strokeOpacity="0.9" />
      <path d="M-20 -19 A28 28 0 0 1 20 -19" strokeWidth="2.5" strokeOpacity="0.6" />
      <path d="M-30 -28 A42 42 0 0 1 30 -28" strokeWidth="2.5" strokeOpacity="0.35" />
      <circle cx="0" cy="0" r="3.5" fill={color} stroke="none" />
    </g>
  );
}

/** Tilted solar array as a parallelogram of cells. */
export function SolarArray({
  x,
  y,
  cols = 4,
  rows = 2,
  cell = 30,
  skew = 14,
}: {
  x: number;
  y: number;
  cols?: number;
  rows?: number;
  cell?: number;
  skew?: number;
}) {
  const cells = [];
  const ch = cell * 0.62;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ox = x + c * cell + r * skew;
      const oy = y + r * ch;
      cells.push(
        <path
          key={`${c}-${r}`}
          d={`M${ox} ${oy} h${cell - 3} l${skew} ${ch - 3} h${-(cell - 3)} Z`}
          fill="#16427a"
          stroke="#8fb1e6"
          strokeOpacity="0.55"
        />
      );
    }
  }
  const w = cols * cell;
  return (
    <g>
      {cells}
      <path d={`M${x} ${y} h${w} l${rows * skew} ${rows * ch} h${-w} Z`} fill="none" stroke={GOLD} strokeWidth="1.5" />
      <path d={`M${x + 4} ${y + 2} l${w * 0.35} 0`} stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
    </g>
  );
}

/** Sun with soft rays. */
export function SunMark({ x, y, r = 34 }: { x: number; y: number; r?: number }) {
  const rays = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * 2.6} fill={GOLD_LIGHT} opacity="0.08" />
      <circle r={r * 1.6} fill={GOLD_LIGHT} opacity="0.12" />
      <circle r={r} fill={GOLD_LIGHT} />
      {rays.map((a) => (
        <line
          key={a}
          x1={r2(Math.cos(a) * (r + 10))}
          y1={r2(Math.sin(a) * (r + 10))}
          x2={r2(Math.cos(a) * (r + 24))}
          y2={r2(Math.sin(a) * (r + 24))}
          stroke={GOLD_LIGHT}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />
      ))}
    </g>
  );
}

/** Small glowing data node. */
export function Node({ x, y, r = 5, color = GOLD_LIGHT }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 3} fill={color} opacity="0.12" />
      <circle cx={x} cy={y} r={r} fill={color} />
    </g>
  );
}

/** Tree silhouette for landscaping. */
export function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1="0" y1="0" x2="0" y2="-26" stroke={LINE} strokeWidth="2" />
      <ellipse cx="0" cy="-44" rx="18" ry="24" fill="#0f2b55" stroke={LINE_SOFT} />
    </g>
  );
}
