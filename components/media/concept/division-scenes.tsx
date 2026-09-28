import {
  Backdrop,
  BulletCamera,
  DomeCamera,
  Floor,
  GOLD,
  GOLD_LIGHT,
  HORIZON,
  LINE,
  LINE_SOFT,
  NAVY_DEEP,
  NAVY_FILL,
  Node,
  r2,
  SolarArray,
  SunMark,
  Tree,
  WifiArcs,
  Windows,
} from './primitives';

type SceneProps = { id: string };

/** PPAB core surrounded by its five divisions. */
export function HeroScene({ id }: SceneProps) {
  const cx = 400;
  const cy = 280;
  const nodes = [
    { a: -90, label: 'secure' },
    { a: -18, label: 'connect' },
    { a: 54, label: 'solar' },
    { a: 126, label: 'digital' },
    { a: 198, label: 'space' },
  ].map((n) => ({ ...n, x: r2(cx + Math.cos((n.a * Math.PI) / 180) * 190), y: r2(cy + Math.sin((n.a * Math.PI) / 180) * 150) }));

  return (
    <>
      <Backdrop id={id} glowX={cx} glowY={cy} />
      <Floor id={id} />
      <g fill="none" stroke={GOLD} strokeOpacity="0.25">
        <ellipse cx={cx} cy={cy} rx="190" ry="150" strokeDasharray="4 8" />
        <ellipse cx={cx} cy={cy} rx="120" ry="95" />
        <ellipse cx={cx} cy={cy} rx="260" ry="205" strokeOpacity="0.12" />
      </g>
      {nodes.map((n) => (
        <line key={n.label} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke={GOLD_LIGHT} strokeOpacity="0.45" strokeDasharray="2 6" />
      ))}
      <g transform={`translate(${cx} ${cy})`}>
        <polygon points="0,-56 48,-28 48,28 0,56 -48,28 -48,-28" fill={NAVY_FILL} stroke={GOLD} strokeWidth="2" />
        <polygon points="0,-34 29,-17 29,17 0,34 -29,17 -29,-17" fill={GOLD} fillOpacity="0.18" stroke={GOLD_LIGHT} />
        <circle r="9" fill={GOLD_LIGHT} />
      </g>
      {nodes.map((n) => (
        <g key={`${n.label}-node`} transform={`translate(${n.x} ${n.y})`}>
          <circle r="34" fill={NAVY_DEEP} stroke={GOLD} strokeOpacity="0.7" />
          <DivisionGlyph kind={n.label} />
        </g>
      ))}
    </>
  );
}

function DivisionGlyph({ kind }: { kind: string }) {
  const s = { fill: 'none', stroke: GOLD_LIGHT, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (kind) {
    case 'secure':
      return (
        <g {...s}>
          <rect x="-14" y="-8" width="22" height="12" rx="3" />
          <path d="M8 -4 L14 -7 L14 3 L8 0" />
          <path d="M-8 4 V12 H-14" />
        </g>
      );
    case 'connect':
      return (
        <g {...s}>
          <circle cx="0" cy="-10" r="3" />
          <circle cx="-11" cy="8" r="3" />
          <circle cx="11" cy="8" r="3" />
          <path d="M0 -7 L-9 5 M0 -7 L9 5 M-8 8 H8" />
        </g>
      );
    case 'solar':
      return (
        <g {...s}>
          <path d="M-14 6 L-8 -6 H14 L8 6 Z" />
          <path d="M-11 0 H11 M-2 -6 L-5 6 M5 -6 L2 6" />
          <path d="M0 10 V14" />
        </g>
      );
    case 'digital':
      return (
        <g {...s}>
          <path d="M-6 -8 L-14 0 L-6 8 M6 -8 L14 0 L6 8 M3 -11 L-3 11" />
        </g>
      );
    default:
      return (
        <g {...s}>
          <path d="M-14 12 V-4 L-4 -10 V12 M-4 -2 H12 V12 M-18 12 H16" />
          <path d="M-10 0 V2 M-10 6 V8 M2 3 H6 M2 7 H6" />
        </g>
      );
  }
}

export function SecureScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={300} glowY={180} />
      <Floor id={id} vanishX={360} />
      {/* Building facade */}
      <rect x="470" y="150" width="250" height={HORIZON - 150} fill={NAVY_FILL} stroke={LINE_SOFT} />
      <Windows id={id} x={496} y={180} cols={4} rows={5} w={38} h={34} gap={16} />
      <rect x="560" y="400" width="70" height="70" fill={NAVY_DEEP} stroke={LINE} />
      {/* Coverage cone from the dome camera */}
      <path d="M260 138 L110 470 L430 470 Z" fill={`url(#${id}-beam)`} opacity="0.5" />
      <path d="M260 138 L110 470 M260 138 L430 470" stroke={GOLD_LIGHT} strokeOpacity="0.4" strokeDasharray="3 6" />
      <ellipse cx="270" cy="470" rx="160" ry="16" fill="none" stroke={GOLD} strokeOpacity="0.55" />
      {/* Ceiling mount */}
      <line x1="260" y1="0" x2="260" y2="106" stroke={LINE} strokeWidth="3" />
      <DomeCamera x={260} y={112} r={34} />
      <BulletCamera id={id} x={470} y={170} dir={-1} scale={1.3} beam={false} />
      {/* Scanning arcs */}
      <g fill="none" stroke={GOLD_LIGHT} strokeLinecap="round">
        <path d="M200 180 A70 70 0 0 0 320 180" strokeOpacity="0.5" strokeWidth="2" />
        <path d="M175 200 A100 100 0 0 0 345 200" strokeOpacity="0.25" strokeWidth="2" />
      </g>
      <Node x={270} y={470} r={4} />
    </>
  );
}

export function ConnectScene({ id }: SceneProps) {
  const units = Array.from({ length: 9 }, (_, i) => i);
  return (
    <>
      <Backdrop id={id} glowX={260} glowY={260} glowColor="#4a90ff" />
      <Floor id={id} vanishX={300} />
      {/* Rack */}
      <rect x="150" y="110" width="200" height={HORIZON - 110} rx="6" fill={NAVY_DEEP} stroke={LINE} strokeWidth="2" />
      {units.map((i) => (
        <g key={i}>
          <rect x="166" y={128 + i * 36} width="168" height="28" rx="3" fill={NAVY_FILL} stroke={LINE_SOFT} />
          {Array.from({ length: 8 }, (_, p) => (
            <rect key={p} x={176 + p * 14} y={136 + i * 36} width="9" height="7" rx="1" fill="#020b1d" stroke={LINE_SOFT} />
          ))}
          <circle cx={310} cy={142 + i * 36} r="3" fill={i % 3 === 0 ? GOLD_LIGHT : '#4a90ff'} />
          <circle cx={322} cy={142 + i * 36} r="3" fill={i % 2 === 0 ? '#2fb5a7' : '#4a90ff'} opacity="0.8" />
        </g>
      ))}
      {/* Fiber runs */}
      <g fill="none" strokeLinecap="round">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M334 ${150 + i * 60} C 440 ${150 + i * 60}, 470 ${120 + i * 70}, ${600 + (i % 2) * 40} ${110 + i * 72}`}
            stroke={i % 2 ? GOLD_LIGHT : '#6aa5ff'}
            strokeOpacity={0.75 - i * 0.08}
            strokeWidth="2.2"
          />
        ))}
      </g>
      {/* Network nodes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Node x={600 + (i % 2) * 40} y={110 + i * 72} r={6} color={i % 2 ? GOLD_LIGHT : '#6aa5ff'} />
        </g>
      ))}
      <path d="M600 110 L640 182 L600 254 L640 326 L600 398" fill="none" stroke={LINE_SOFT} strokeDasharray="3 5" />
      <WifiArcs x={700} y={200} scale={1.3} />
    </>
  );
}

export function SolarScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={620} glowY={120} glowColor="#f2a516" />
      <Floor id={id} />
      <SunMark x={640} y={110} r={36} />
      {/* Light rays toward the panels */}
      <path d="M620 140 L260 300 L360 330 Z" fill={`url(#${id}-beam)`} opacity="0.35" />
      {/* Building */}
      <path d="M120 470 V300 L400 250 L680 300 V470 Z" fill={NAVY_FILL} stroke={LINE_SOFT} />
      <path d="M100 305 L400 246 L700 305" fill="none" stroke={LINE} strokeWidth="3" />
      <Windows id={id} x={170} y={340} cols={6} rows={2} w={60} h={40} gap={20} />
      <rect x="370" y="410" width="60" height="60" fill={NAVY_DEEP} stroke={LINE} />
      {/* Panels on the roof */}
      <SolarArray x={170} y={255} cols={5} rows={2} cell={36} skew={10} />
      <SolarArray x={430} y={250} cols={5} rows={2} cell={36} skew={10} />
      <Tree x={70} y={470} s={1.3} />
      <Tree x={740} y={470} s={1.1} />
    </>
  );
}

export function DigitalScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={420} glowY={240} glowColor="#8c73f7" />
      <Floor id={id} />
      {/* Laptop */}
      <rect x="170" y="150" width="400" height="250" rx="12" fill={NAVY_DEEP} stroke={LINE} strokeWidth="2" />
      <rect x="186" y="166" width="368" height="218" rx="4" fill="#0b2347" />
      <path d="M130 400 H610 L580 430 H160 Z" fill={NAVY_FILL} stroke={LINE} />
      {/* Dashboard */}
      <rect x="200" y="180" width="80" height="190" rx="3" fill="#123260" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="212" y={196 + i * 26} width={i === 1 ? 56 : 44} height="8" rx="4" fill={i === 1 ? GOLD : LINE_SOFT} />
      ))}
      <rect x="296" y="180" width="244" height="92" rx="3" fill="#123260" />
      <path d="M310 250 L350 232 L390 240 L430 210 L470 220 L520 196" fill="none" stroke={GOLD_LIGHT} strokeWidth="2.5" />
      <path d="M310 250 L350 232 L390 240 L430 210 L470 220 L520 196 V262 H310 Z" fill={GOLD} opacity="0.12" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={310 + i * 38} y={350 - (i * 17) % 60 - 20} width="22" height={(i * 17) % 60 + 20} rx="2" fill={i === 4 ? GOLD : '#8c73f7'} opacity="0.8" />
      ))}
      {/* Phone */}
      <rect x="600" y="210" width="110" height="210" rx="16" fill={NAVY_DEEP} stroke={LINE} strokeWidth="2" />
      <rect x="610" y="228" width="90" height="170" rx="6" fill="#0b2347" />
      <circle cx="655" cy="270" r="22" fill="none" stroke={GOLD_LIGHT} strokeWidth="5" strokeDasharray="100 40" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="620" y={312 + i * 22} width={70 - i * 12} height="10" rx="5" fill={LINE_SOFT} />
      ))}
      {/* Floating cards */}
      <g transform="translate(90 120)">
        <rect width="120" height="64" rx="10" fill={NAVY_FILL} stroke={GOLD} strokeOpacity="0.6" />
        <circle cx="26" cy="32" r="12" fill={GOLD} opacity="0.85" />
        <rect x="46" y="24" width="56" height="7" rx="3.5" fill={LINE} />
        <rect x="46" y="36" width="40" height="7" rx="3.5" fill={LINE_SOFT} />
      </g>
    </>
  );
}

export function SpaceScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={420} glowY={260} glowColor="#c9925e" />
      <Floor id={id} />
      {/* Blueprint dimension lines */}
      <g stroke={GOLD} strokeOpacity="0.45" fill="none">
        <path d="M130 120 H690 M130 112 V128 M690 112 V128" />
        <path d="M100 170 V470 M92 170 H108 M92 470 H108" />
      </g>
      {/* Ground floor */}
      <rect x="150" y="330" width="440" height="140" fill={NAVY_FILL} stroke={LINE} />
      <rect x="175" y="355" width="250" height="115" fill={`url(#${id}-window)`} opacity="0.85" />
      <path d="M258 355 V470 M342 355 V470" stroke={NAVY_DEEP} strokeWidth="3" />
      <rect x="455" y="370" width="100" height="100" fill={NAVY_DEEP} stroke={LINE_SOFT} />
      {/* Cantilevered upper floor */}
      <rect x="250" y="190" width="440" height="140" fill="#123260" stroke={LINE} />
      <rect x="275" y="215" width="190" height="90" fill={`url(#${id}-window)`} opacity="0.7" />
      <rect x="490" y="215" width="170" height="90" fill={NAVY_DEEP} stroke={LINE_SOFT} />
      <path d="M240 190 H700" stroke="#dfe6f1" strokeWidth="5" />
      <path d="M140 330 H600" stroke="#dfe6f1" strokeWidth="4" />
      {/* Railing */}
      <path d="M600 330 H700" stroke={LINE} strokeWidth="2" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={610 + i * 16} y1="310" x2={610 + i * 16} y2="330" stroke={LINE_SOFT} />
      ))}
      <Tree x={110} y={470} s={1.4} />
      <Tree x={720} y={470} s={1.2} />
      <Tree x={650} y={470} s={0.9} />
    </>
  );
}
