'use client';

import React, { useId, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowRight,
  Battery,
  BatteryCharging,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Gauge,
  Home,
  Info,
  Moon,
  Power,
  RotateCcw,
  Shield,
  Sparkles,
  Sun,
  UtilityPole,
  Zap,
} from 'lucide-react';
import type { SolarSystemType } from '@/data/divisions/solar';
import { useQuote } from '@/components/forms/QuoteProvider';
import { cn } from '@/lib/utils';

interface EnergyFlowProps {
  systems: SolarSystemType[];
}

type NodeKey = 'sun' | 'panels' | 'inverter' | 'battery' | 'property' | 'grid';

interface NodeInfo {
  key: NodeKey;
  x: number;
  y: number;
  label: string;
  subLabel: string;
  techRole: string;
}

const NODES: Record<NodeKey, NodeInfo> = {
  sun: {
    key: 'sun',
    x: 95,
    y: 95,
    label: 'Sun',
    subLabel: 'Solar Irradiation',
    techRole: 'Photons hit solar array to generate DC electrical potential.',
  },
  panels: {
    key: 'panels',
    x: 235,
    y: 155,
    label: 'Solar Array',
    subLabel: 'Photovoltaic DC',
    techRole: 'High-efficiency mono-perc cells generating direct current (DC).',
  },
  inverter: {
    key: 'inverter',
    x: 410,
    y: 220,
    label: 'Smart Inverter',
    subLabel: 'DC to AC MPPT',
    techRole: 'Central hub converting solar DC to synchronized 230V/415V AC electricity.',
  },
  property: {
    key: 'property',
    x: 645,
    y: 135,
    label: 'Your Property',
    subLabel: 'AC Consumer Load',
    techRole: 'Powers lights, appliances, heavy motors, and electronics in real time.',
  },
  battery: {
    key: 'battery',
    x: 410,
    y: 380,
    label: 'Battery Storage',
    subLabel: 'Chemical Energy Bank',
    techRole: 'Stores surplus energy during daylight and discharges during night or outages.',
  },
  grid: {
    key: 'grid',
    x: 645,
    y: 350,
    label: 'Utility & Net Meter',
    subLabel: 'Bi-Directional Grid',
    techRole: 'Records power exported for billing credits and imports energy when solar is low.',
  },
};

export function EnergyFlow({ systems }: EnergyFlowProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isDayTime, setIsDayTime] = useState(true);
  const [inspectedNode, setInspectedNode] = useState<NodeKey | null>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const { openQuote } = useQuote();

  const currentSystem = systems[activeTab];
  const flowsSet = new Set(currentSystem.flows);

  // System features detection based on active system
  const hasBattery = flowsSet.has('inverter-battery');
  const hasGrid = flowsSet.has('inverter-grid') || flowsSet.has('grid-home');

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = systems.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : e.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : null;
    if (next === null) return;
    e.preventDefault();
    setActiveTab(next);
    tabsRef.current[next]?.focus();
  };

  // Node active states based on system mode and day/night simulation
  const isNodeActive = (nodeKey: NodeKey): boolean => {
    if (nodeKey === 'sun') return isDayTime;
    if (nodeKey === 'panels') return isDayTime;
    if (nodeKey === 'inverter') return true;
    if (nodeKey === 'property') return true;
    if (nodeKey === 'battery') return hasBattery;
    if (nodeKey === 'grid') return hasGrid;
    return true;
  };

  // Dynamic flow states based on day/night simulation
  const isFlowLive = (flowName: string): boolean => {
    if (!isDayTime) {
      // At night / grid outage:
      if (flowName === 'panels-inverter') return false;
      if (currentSystem.id === 'on-grid') {
        // On-grid at night imports from grid
        return flowName === 'grid-home';
      }
      if (currentSystem.id === 'off-grid') {
        // Off-grid discharges battery through inverter to property
        return flowName === 'battery-inverter' || flowName === 'inverter-home';
      }
      if (currentSystem.id === 'hybrid') {
        // Hybrid uses battery storage or grid backup
        return flowName === 'battery-inverter' || flowName === 'inverter-home';
      }
    }

    // Daytime:
    if (flowName === 'panels-inverter') return true;
    if (flowName === 'inverter-home') return true;
    if (flowName === 'inverter-battery') return hasBattery;
    if (flowName === 'inverter-grid') return hasGrid;
    if (flowName === 'grid-home') return hasGrid && false; // Surplus flows to grid during sun
    return false;
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-start">
      {/* ================================================================= */}
      {/* LEFT COLUMN: System Intelligence & Engineering Console            */}
      {/* ================================================================= */}
      <div className="lg:col-span-5 space-y-7">
        {/* System Type Selector Tabs */}
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-gold-700 flex items-center gap-2">
            <Compass className="size-3.5" />
            <span>Select Configuration</span>
          </p>

          <div
            role="tablist"
            aria-label="Solar system topologies"
            className="inline-flex w-full rounded-2xl border border-navy-900/10 bg-white p-1.5 shadow-card"
          >
            {systems.map((s, i) => {
              const isSelected = i === activeTab;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  id={`${baseId}-tab-${s.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveTab(i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={cn(
                    'flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 text-center select-none',
                    isSelected
                      ? 'bg-navy-900 text-white shadow-md'
                      : 'text-navy-900/65 hover:text-navy-900 hover:bg-navy-50/50'
                  )}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* System Details Panel */}
        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${currentSystem.id}`}
          className="rounded-3xl border border-navy-900/10 bg-white p-6 sm:p-7 shadow-card space-y-6"
        >
          {/* Header & Tagline */}
          <div className="space-y-2 border-b border-navy-900/10 pb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-solar/15 px-3 py-1 text-xs font-mono font-bold text-navy-950">
              <Zap className="size-3.5 text-solar" />
              <span>{currentSystem.name.toUpperCase()} ARCHITECTURE</span>
            </div>
            <h3 className="type-h3 text-navy-950 font-bold tracking-tight">
              {currentSystem.headline}
            </h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              {currentSystem.description}
            </p>
          </div>

          {/* Architectural Feature Indicators */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-xl border border-navy-900/10 bg-surface p-2.5">
              <span className="block text-[10px] font-mono uppercase text-muted">Grid Link</span>
              <span className="block text-xs font-bold text-navy-900 mt-0.5">
                {hasGrid ? 'Net-Metered' : 'Zero Grid'}
              </span>
            </div>
            <div className="rounded-xl border border-navy-900/10 bg-surface p-2.5">
              <span className="block text-[10px] font-mono uppercase text-muted">Storage</span>
              <span className="block text-xs font-bold text-navy-900 mt-0.5">
                {hasBattery ? 'Battery Bank' : 'No Batteries'}
              </span>
            </div>
            <div className="rounded-xl border border-navy-900/10 bg-surface p-2.5">
              <span className="block text-[10px] font-mono uppercase text-muted">Outage Backup</span>
              <span className="block text-xs font-bold text-navy-900 mt-0.5">
                {hasBattery ? 'Instant Supply' : 'Grid Interlocked'}
              </span>
            </div>
          </div>

          {/* Best Suited Recommendation */}
          <div className="rounded-2xl border border-gold-500/25 bg-gold-50/70 p-4">
            <p className="text-xs font-semibold text-navy-950">
              <span className="text-gold-800 font-bold">Recommended For: </span>
              {currentSystem.suitedFor}
            </p>
          </div>

          {/* Verified Scope Components */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider text-muted">
              Included System Components
            </p>
            <div className="grid grid-cols-2 gap-2">
              {currentSystem.components.map((comp) => (
                <div
                  key={comp}
                  className="flex items-center gap-2 rounded-xl border border-navy-900/10 bg-surface px-3 py-2 text-xs font-semibold text-navy-900"
                >
                  <CheckCircle2 className="size-3.5 text-solar shrink-0" />
                  <span className="truncate">{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => openQuote({ division: 'solar', source: `energy-flow-${currentSystem.id}` })}
              className="w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-navy-800 active:scale-[0.98]"
            >
              <span>Request Sizing for {currentSystem.name}</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* RIGHT COLUMN: Interactive High-Tech Energy Canvas & Telemetry     */}
      {/* ================================================================= */}
      <div className="lg:col-span-7 space-y-4">
        {/* Canvas Header HUD Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-navy-900">
              Active Energy Stream &bull; {currentSystem.name}
            </span>
          </div>

          {/* Day / Night Simulation Toggle */}
          <div className="flex items-center gap-1.5 rounded-full border border-navy-900/15 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setIsDayTime(true)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all',
                isDayTime
                  ? 'bg-amber-400 text-navy-950 font-bold shadow-sm'
                  : 'text-navy-900/60 hover:text-navy-900'
              )}
            >
              <Sun className="size-3.5" />
              <span>Day (Solar Peak)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDayTime(false)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all',
                !isDayTime
                  ? 'bg-navy-900 text-white font-bold shadow-sm'
                  : 'text-navy-900/60 hover:text-navy-900'
              )}
            >
              <Moon className="size-3.5" />
              <span>Night / Outage</span>
            </button>
          </div>
        </div>

        {/* Master Dark Canvas Card */}
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/15 bg-navy-950 p-4 sm:p-7 shadow-2xl backdrop-blur-xl">
          {/* Subtle blueprint grid texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-blueprint opacity-40 mask-fade-radial"
          />

          {/* Ambient Lighting based on Sun/Night state */}
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -left-20 -top-20 size-80 rounded-full blur-3xl transition-opacity duration-1000',
              isDayTime ? 'bg-amber-400/20 opacity-100' : 'bg-blue-600/10 opacity-30'
            )}
          />

          {/* SVG Vector Energy Circuit (ViewBox: 760 x 480) */}
          <svg
            viewBox="0 0 760 480"
            className="w-full select-none"
            role="img"
            aria-label={`Interactive energy topology for ${currentSystem.name} solar`}
          >
            <defs>
              {/* Sun radial aura */}
              <radialGradient id={`${baseId}-sun-aura`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f4c95d" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#f2a516" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#06152f" stopOpacity="0" />
              </radialGradient>

              {/* Glowing energy flow filter */}
              <filter id={`${baseId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ----------------------------------------------------------- */}
            {/* 1. BUSWAY CONDUIT TRACKS (PHYSICAL ENERGY RAILS)            */}
            {/* ----------------------------------------------------------- */}

            {/* Track: Sun to Panels (Photon Ray) */}
            <line
              x1="125"
              y1="110"
              x2="200"
              y2="145"
              stroke="#f4c95d"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeOpacity={isDayTime ? 0.8 : 0.15}
            />
            {isDayTime && (
              <circle r="3" fill="#f4c95d">
                <animateMotion path="M 125 110 L 200 145" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Track: Panels to Inverter (DC Generation) */}
            <path
              d="M 270 165 C 330 185, 360 215, 380 220"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.1"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 270 165 C 330 185, 360 215, 380 220"
              fill="none"
              stroke="#f2a516"
              strokeWidth="2.5"
              strokeDasharray={isFlowLive('panels-inverter') ? 'none' : '4 8'}
              strokeOpacity={isFlowLive('panels-inverter') ? 0.9 : 0.15}
            />
            {isFlowLive('panels-inverter') && (
              <circle r="4" fill="#f4c95d" filter={`url(#${baseId}-glow)`}>
                <animateMotion path="M 270 165 C 330 185, 360 215, 380 220" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Track: Inverter to Property (AC Consumption) */}
            <path
              d="M 440 210 C 510 190, 560 145, 610 135"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.1"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 440 210 C 510 190, 560 145, 610 135"
              fill="none"
              stroke="#f2a516"
              strokeWidth="2.5"
              strokeDasharray={isFlowLive('inverter-home') ? 'none' : '4 8'}
              strokeOpacity={isFlowLive('inverter-home') ? 0.9 : 0.15}
            />
            {isFlowLive('inverter-home') && (
              <circle r="4" fill="#f4c95d" filter={`url(#${baseId}-glow)`}>
                <animateMotion path="M 440 210 C 510 190, 560 145, 610 135" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Track: Inverter to Battery (DC Charge/Discharge) */}
            <line
              x1="410"
              y1="255"
              x2="410"
              y2="345"
              stroke="#ffffff"
              strokeOpacity="0.1"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="410"
              y1="255"
              x2="410"
              y2="345"
              stroke="#3cc48a"
              strokeWidth="2.5"
              strokeDasharray={hasBattery ? 'none' : '4 8'}
              strokeOpacity={hasBattery ? 0.9 : 0.15}
            />
            {hasBattery && (
              <circle r="4" fill="#3cc48a" filter={`url(#${baseId}-glow)`}>
                <animateMotion
                  path={isDayTime ? 'M 410 255 L 410 345' : 'M 410 345 L 410 255'}
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Track: Inverter to Grid (Net Metering Export / Import) */}
            <path
              d="M 440 230 C 510 250, 560 320, 610 345"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.1"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 440 230 C 510 250, 560 320, 610 345"
              fill="none"
              stroke="#6aa5ff"
              strokeWidth="2.5"
              strokeDasharray={hasGrid ? 'none' : '4 8'}
              strokeOpacity={hasGrid ? 0.9 : 0.15}
            />
            {hasGrid && (
              <circle r="4" fill="#6aa5ff" filter={`url(#${baseId}-glow)`}>
                <animateMotion
                  path={isDayTime ? 'M 440 230 C 510 250, 560 320, 610 345' : 'M 610 345 C 560 320, 510 250, 440 230'}
                  dur="2.0s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Track: Grid to Property (Direct Grid Utility Feed) */}
            <line
              x1="645"
              y1="315"
              x2="645"
              y2="175"
              stroke="#ffffff"
              strokeOpacity="0.1"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="645"
              y1="315"
              x2="645"
              y2="175"
              stroke="#6aa5ff"
              strokeWidth="2"
              strokeDasharray={isFlowLive('grid-home') ? 'none' : '4 8'}
              strokeOpacity={isFlowLive('grid-home') ? 0.85 : 0.15}
            />
            {isFlowLive('grid-home') && (
              <circle r="3.5" fill="#6aa5ff">
                <animateMotion path="M 645 315 L 645 175" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* ----------------------------------------------------------- */}
            {/* 2. COMPONENT NODES (INTERACTIVE PUSH BUTTONS)               */}
            {/* ----------------------------------------------------------- */}

            {/* NODE 1: SUN */}
            <g
              transform={`translate(${NODES.sun.x} ${NODES.sun.y})`}
              className="cursor-pointer"
              onClick={() => setInspectedNode('sun')}
            >
              {isDayTime && <circle r="50" fill={`url(#${baseId}-sun-aura)`} />}
              <circle
                r="28"
                fill="#0b2347"
                stroke={isDayTime ? '#f4c95d' : 'rgba(255,255,255,0.2)'}
                strokeWidth="2"
                className="transition-colors"
              />
              <g className={isDayTime ? 'text-amber-300' : 'text-white/40'}>
                <circle r="10" fill="currentColor" fillOpacity={isDayTime ? 0.9 : 0.3} />
              </g>
              <text y="46" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                Sun
              </text>
            </g>

            {/* NODE 2: SOLAR ARRAY */}
            <g
              transform={`translate(${NODES.panels.x} ${NODES.panels.y})`}
              className="cursor-pointer"
              onClick={() => setInspectedNode('panels')}
            >
              <circle
                r="30"
                fill="#0b2347"
                stroke={isNodeActive('panels') ? '#f2a516' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isNodeActive('panels') ? 2 : 1}
              />
              <g className={isNodeActive('panels') ? 'text-amber-400' : 'text-white/30'}>
                {/* Solar panel grid icon */}
                <path
                  d="M-13 8 L-8 -8 H13 L8 8 Z M-10 0 H10 M-1 -8 L-3 8 M5 -8 L3 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
              <text y="48" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                Solar Array
              </text>
            </g>

            {/* NODE 3: SMART INVERTER (CENTER HUB) */}
            <g
              transform={`translate(${NODES.inverter.x} ${NODES.inverter.y})`}
              className="cursor-pointer"
              onClick={() => setInspectedNode('inverter')}
            >
              <circle
                r="36"
                fill="#06152f"
                stroke="#d8a62a"
                strokeWidth="2.5"
                filter={`url(#${baseId}-glow)`}
              />
              <g className="text-gold-300">
                <rect x="-14" y="-12" width="28" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M-7 3 Q -3 -5 0 0 T 7 -3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>
              <text y="52" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                Inverter (MPPT)
              </text>
            </g>

            {/* NODE 4: PROPERTY (LOAD) */}
            <g
              transform={`translate(${NODES.property.x} ${NODES.property.y})`}
              className="cursor-pointer"
              onClick={() => setInspectedNode('property')}
            >
              <circle
                r="32"
                fill="#0b2347"
                stroke="#f4c95d"
                strokeWidth="2"
              />
              <g className="text-amber-300">
                <path
                  d="M-13 1 L0 -12 L13 1 M-9 -2 V11 H9 V-2 M-3 11 V4 H3 V11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
              <text y="50" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                Your Property
              </text>
            </g>

            {/* NODE 5: BATTERY STORAGE */}
            <g
              transform={`translate(${NODES.battery.x} ${NODES.battery.y})`}
              className={cn('cursor-pointer transition-opacity duration-300', !hasBattery && 'opacity-30')}
              onClick={() => setInspectedNode('battery')}
            >
              <circle
                r="30"
                fill="#0b2347"
                stroke={hasBattery ? '#3cc48a' : 'rgba(255,255,255,0.2)'}
                strokeWidth={hasBattery ? 2 : 1}
              />
              <g className={hasBattery ? 'text-emerald-400' : 'text-white/30'}>
                <rect x="-12" y="-7" width="24" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 -3 V3 M-7 0 H3 M-2 -4 V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>
              <text y="48" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                Battery Bank
              </text>
              {!hasBattery && (
                <text y="64" textAnchor="middle" fill="#ff7a7a" fontSize="10" fontFamily="monospace">
                  (Bypassed)
                </text>
              )}
            </g>

            {/* NODE 6: UTILITY GRID / NET METER */}
            <g
              transform={`translate(${NODES.grid.x} ${NODES.grid.y})`}
              className={cn('cursor-pointer transition-opacity duration-300', !hasGrid && 'opacity-30')}
              onClick={() => setInspectedNode('grid')}
            >
              <circle
                r="30"
                fill="#0b2347"
                stroke={hasGrid ? '#6aa5ff' : 'rgba(255,255,255,0.2)'}
                strokeWidth={hasGrid ? 2 : 1}
              />
              <g className={hasGrid ? 'text-blue-400' : 'text-white/30'}>
                <path
                  d="M0 -13 L-8 13 M0 -13 L8 13 M-5 3 H5 M-7 8 H7 M-10 -6 H10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
              <text y="48" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                Grid / Net Meter
              </text>
              {!hasGrid && (
                <text y="64" textAnchor="middle" fill="#ff7a7a" fontSize="10" fontFamily="monospace">
                  (Offline)
                </text>
              )}
            </g>
          </svg>

          {/* Interactive Inspection HUD Strip */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-gold-300 shrink-0" />
              <span>
                {inspectedNode ? (
                  <>
                    <strong className="text-white">{NODES[inspectedNode].label}: </strong>
                    {NODES[inspectedNode].techRole}
                  </>
                ) : (
                  <span>Click or tap any component above to inspect its real-time operating role.</span>
                )}
              </span>
            </div>

            {inspectedNode && (
              <button
                type="button"
                onClick={() => setInspectedNode(null)}
                className="shrink-0 text-gold-300 hover:text-white underline font-mono text-[11px]"
              >
                Clear inspection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
