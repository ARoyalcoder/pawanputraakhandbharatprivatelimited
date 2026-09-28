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
  SolarArray,
  SunMark,
  Tree,
  WifiArcs,
  Windows,
} from './primitives';

type SceneProps = { id: string };

export function ResidentialScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={620} glowY={150} />
      <Floor id={id} />
      <SunMark x={660} y={110} r={26} />
      <path d="M200 470 V290 L400 170 L600 290 V470 Z" fill={NAVY_FILL} stroke={LINE_SOFT} />
      <path d="M175 300 L400 160 L625 300" fill="none" stroke={LINE} strokeWidth="4" strokeLinejoin="round" />
      {/* Panels laid along the right-hand roof slope (roof line: 400,160 → 625,300 ≈ 32°) */}
      <g transform="rotate(32 400 160)">
        <SolarArray x={428} y={136} cols={4} rows={1} cell={42} skew={6} />
      </g>
      <Windows id={id} x={235} y={320} cols={2} rows={2} w={50} h={44} gap={12} />
      <Windows id={id} x={455} y={320} cols={2} rows={2} w={50} h={44} gap={12} lit={(c, r) => c + r !== 2} />
      <rect x="365" y="360" width="70" height="110" fill={NAVY_DEEP} stroke={LINE} />
      {/* Video door phone */}
      <rect x="445" y="392" width="16" height="26" rx="3" fill="#dfe6f1" />
      <rect x="448" y="396" width="10" height="10" rx="1.5" fill={GOLD_LIGHT} />
      <BulletCamera id={id} x={606} y={300} dir={-1} scale={0.9} />
      <WifiArcs x={400} y={260} scale={0.9} />
      <Tree x={130} y={470} s={1.2} />
      <Tree x={690} y={470} s={1.3} />
    </>
  );
}

export function EducationScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={400} glowY={180} />
      <Floor id={id} />
      <rect x="90" y="270" width="620" height="200" fill={NAVY_FILL} stroke={LINE_SOFT} />
      <rect x="330" y="170" width="140" height="300" fill="#123260" stroke={LINE} />
      <path d="M320 170 L400 120 L480 170" fill="none" stroke={LINE} strokeWidth="3" />
      <circle cx="400" cy="215" r="22" fill={NAVY_DEEP} stroke={GOLD} strokeWidth="2" />
      <path d="M400 202 V215 L410 222" stroke={GOLD_LIGHT} strokeWidth="2" fill="none" strokeLinecap="round" />
      <Windows id={id} x={110} y={295} cols={4} rows={3} w={42} h={40} gap={12} />
      <Windows id={id} x={500} y={295} cols={4} rows={3} w={42} h={40} gap={12} lit={(c, r) => (c + r) % 3 !== 1} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={346 + i * 30} y="270" width="14" height="200" fill={NAVY_DEEP} stroke={LINE_SOFT} />
      ))}
      <DomeCamera x={330} y={284} r={12} />
      <DomeCamera x={470} y={284} r={12} />
      <WifiArcs x={170} y={250} scale={0.8} />
      <WifiArcs x={630} y={250} scale={0.8} />
      <Tree x={60} y={470} />
      <Tree x={750} y={470} />
    </>
  );
}

export function HealthcareScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={400} glowY={200} glowColor="#2fb5a7" />
      <Floor id={id} />
      <rect x="170" y="140" width="460" height={HORIZON - 140} fill={NAVY_FILL} stroke={LINE_SOFT} />
      <rect x="350" y="96" width="100" height="60" rx="4" fill={NAVY_DEEP} stroke={LINE} />
      <path d="M400 108 V144 M382 126 H418" stroke="#2fb5a7" strokeWidth="9" strokeLinecap="round" />
      <Windows id={id} x={195} y={180} cols={7} rows={4} w={44} h={36} gap={16} lit={(c, r) => (c * 5 + r) % 5 !== 0} />
      <path d="M320 400 H480 L500 380 H300 Z" fill="#dfe6f1" opacity="0.9" />
      <rect x="330" y="400" width="140" height="70" fill={`url(#${id}-window)`} opacity="0.7" />
      <path d="M400 400 V470" stroke={NAVY_DEEP} strokeWidth="3" />
      <BulletCamera id={id} x={170} y={180} dir={-1} scale={0.9} />
      <BulletCamera id={id} x={630} y={180} scale={0.9} />
    </>
  );
}

export function CorporateScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={460} glowY={160} />
      <Floor id={id} vanishX={440} />
      <rect x="280" y="70" width="220" height={HORIZON - 70} fill="#123260" stroke={LINE} />
      <Windows id={id} x={296} y={90} cols={5} rows={10} w={34} h={26} gap={8} lit={(c, r) => (c * 3 + r * 5) % 6 > 1} />
      <rect x="520" y="200" width="170" height={HORIZON - 200} fill={NAVY_FILL} stroke={LINE_SOFT} />
      <Windows id={id} x={534} y={216} cols={4} rows={7} w={30} h={24} gap={8} lit={(c, r) => (c + r * 2) % 4 !== 0} />
      <rect x="110" y="260" width="150" height={HORIZON - 260} fill={NAVY_FILL} stroke={LINE_SOFT} />
      <Windows id={id} x={124} y={276} cols={3} rows={5} w={34} h={26} gap={8} />
      <path d="M270 70 H510" stroke="#dfe6f1" strokeWidth="4" />
      <WifiArcs x={390} y={50} scale={1.1} />
    </>
  );
}

export function HospitalityScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={400} glowY={240} />
      <Floor id={id} />
      <rect x="150" y="120" width="500" height={HORIZON - 120} fill={NAVY_FILL} stroke={LINE_SOFT} />
      {[0, 1, 2, 3, 4].map((r) => (
        <g key={r}>
          <Windows id={id} x={175} y={140 + r * 46} cols={8} rows={1} w={44} h={30} gap={14} lit={(c) => (c + r) % 3 !== 0} />
          <path d={`M168 ${172 + r * 46} H632`} stroke={LINE_SOFT} />
        </g>
      ))}
      {/* Canopy */}
      <path d="M270 380 H530 L560 400 H240 Z" fill={GOLD} opacity="0.85" />
      <rect x="300" y="400" width="200" height="70" fill={`url(#${id}-window)`} opacity="0.8" />
      <path d="M350 400 V470 M450 400 V470" stroke={NAVY_DEEP} strokeWidth="3" />
      <DomeCamera x={290} y={408} r={10} />
      <Tree x={110} y={470} s={1.2} />
      <Tree x={690} y={470} s={1.2} />
    </>
  );
}

export function ManufacturingScene({ id }: SceneProps) {
  return (
    <>
      <Backdrop id={id} glowX={600} glowY={140} glowColor="#f2a516" />
      <Floor id={id} />
      <SunMark x={690} y={96} r={24} />
      <path d="M80 470 V270 L180 210 V270 L280 210 V270 L380 210 V270 L480 210 V270 L580 210 V470 Z" fill={NAVY_FILL} stroke={LINE} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${80 + i * 100} 270) rotate(-31)`}>
          <SolarArray x={4} y={-16} cols={3} rows={1} cell={34} skew={0} />
        </g>
      ))}
      <rect x="610" y="120" width="30" height="350" fill="#123260" stroke={LINE_SOFT} />
      <Windows id={id} x={110} y={320} cols={8} rows={1} w={40} h={28} gap={18} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={140 + i * 140} y="380" width="90" height="90" fill={NAVY_DEEP} stroke={LINE} />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${140 + i * 140} ${395 + 0} h90 M${140 + i * 140} 410 h90 M${140 + i * 140} 425 h90`} stroke={LINE_SOFT} />
      ))}
      <BulletCamera id={id} x={580} y={280} scale={1} />
      <BulletCamera id={id} x={80} y={280} dir={-1} scale={1} />
    </>
  );
}

export function CommercialScene({ id }: SceneProps) {
  const stores = [0, 1, 2];
  return (
    <>
      <Backdrop id={id} glowX={400} glowY={260} />
      <Floor id={id} />
      <rect x="90" y="150" width="620" height={HORIZON - 150} fill={NAVY_FILL} stroke={LINE_SOFT} />
      <Windows id={id} x={115} y={175} cols={10} rows={2} w={45} h={34} gap={12} lit={(c, r) => (c + r) % 4 !== 2} />
      {stores.map((i) => (
        <g key={i}>
          <path d={`M${105 + i * 205} 330 h185 l-12 30 h-161 Z`} fill={i === 1 ? GOLD : '#dfe6f1'} opacity={i === 1 ? 0.9 : 0.75} />
          {Array.from({ length: 6 }, (_, s) => (
            <line key={s} x1={117 + i * 205 + s * 30} y1="330" x2={117 + i * 205 + s * 30} y2="360" stroke={NAVY_DEEP} strokeOpacity="0.35" />
          ))}
          <rect x={115 + i * 205} y="370" width="165" height="100" fill={`url(#${id}-window)`} opacity={0.55 + i * 0.1} />
          <path d={`M${197 + i * 205} 370 V470`} stroke={NAVY_DEEP} strokeWidth="3" />
        </g>
      ))}
      <BulletCamera id={id} x={710} y={200} scale={0.9} />
      <DomeCamera x={400} y={374} r={10} />
    </>
  );
}
