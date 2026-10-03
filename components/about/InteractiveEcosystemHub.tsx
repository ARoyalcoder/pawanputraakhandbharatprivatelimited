'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Wifi,
  Sun,
  Code2,
  Building2,
  ArrowRight,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { InteractiveTiltCard } from '@/components/animation/InteractiveTiltCard';
import { divisionAccent } from '@/data/divisions';
import type { DivisionId } from '@/types/content';

interface EcosystemNode {
  id: DivisionId;
  name: string;
  short: string;
  tagline: string;
  summary: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  capabilities: string[];
  href: string;
  // Position in normalized percentages (0 - 100)
  x: number;
  y: number;
}

const nodes: EcosystemNode[] = [
  {
    id: 'secure',
    name: 'Pawan Putra Secure',
    short: 'Secure',
    tagline: 'Smart Technology. Safe Tomorrow.',
    summary: 'AI CCTV, Perimeter Surveillance, Biometrics & Video Door Access',
    accent: divisionAccent.secure.hex,
    icon: Shield,
    capabilities: ['4K AI Surveillance', 'Biometric Turnstiles', 'Cloud NVR Backups'],
    href: '/solutions/secure',
    x: 50,
    y: 15,
  },
  {
    id: 'connect',
    name: 'Pawan Putra Connect',
    short: 'Connect',
    tagline: 'Smart Networks. Stronger Connections.',
    summary: 'Enterprise Optical Fiber, LAN Backbones, Structured Cabling & Managed Wi-Fi',
    accent: divisionAccent.connect.hex,
    icon: Wifi,
    capabilities: ['Enterprise Fiber Splicing', 'Gigabit PoE Switching', 'Zero-Drop Mesh Wi-Fi'],
    href: '/solutions/connect',
    x: 82,
    y: 38,
  },
  {
    id: 'solar',
    name: 'Pawan Putra Solar',
    short: 'Solar',
    tagline: 'Suraj Ki Shakti, Aapki Bachat',
    summary: 'On-Grid, Off-Grid & Hybrid Solar Power, Water Pumps & Clean Storage',
    accent: divisionAccent.solar.hex,
    icon: Sun,
    capabilities: ['High-Yield Solar Modules', 'Hybrid Inverter Reserves', 'Net-Metering Support'],
    href: '/solutions/solar',
    x: 72,
    y: 80,
  },
  {
    id: 'digital',
    name: 'Pawan Putra Digital',
    short: 'Digital',
    tagline: 'All You Need, Under One Roof',
    summary: 'Enterprise Web Applications, Mobile Apps, Custom ERP & Cloud Solutions',
    accent: divisionAccent.digital.hex,
    icon: Code2,
    capabilities: ['Custom Enterprise ERP', 'Cross-Platform Mobile Apps', 'Cloud Infrastructure'],
    href: '/solutions/digital',
    x: 28,
    y: 80,
  },
  {
    id: 'space',
    name: 'Pawan Putra Space',
    short: 'Space',
    tagline: 'Har Space Ka Bharosa',
    summary: 'Modern Architecture, Turnkey Construction, Interior Layouts & Real Estate',
    accent: divisionAccent.space.hex,
    icon: Building2,
    capabilities: ['Architectural Blueprints', 'Turnkey Construction', 'Commercial Fit-Outs'],
    href: '/solutions/space',
    x: 18,
    y: 38,
  },
];

export function InteractiveEcosystemHub() {
  const [activeId, setActiveId] = useState<DivisionId>('secure');
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(true);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeNode = nodes.find((n) => n.id === activeId) ?? nodes[0];

  // Auto-advance through divisions every 4 seconds when idle
  useEffect(() => {
    if (!isAutoOrbit || isUserInteracting) return;

    timerRef.current = setInterval(() => {
      setActiveId((current) => {
        const currentIndex = nodes.findIndex((n) => n.id === current);
        const nextIndex = (currentIndex + 1) % nodes.length;
        return nodes[nextIndex].id;
      });
    }, 4200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoOrbit, isUserInteracting]);

  const handleSelect = (id: DivisionId) => {
    setActiveId(id);
    setIsUserInteracting(true);
    // Resume auto-orbit after 8 seconds of idle
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 8000);
  };

  return (
    <InteractiveTiltCard maxTilt={5} glareOpacity={0.12} className="w-full">
      <div
        className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#08152c] via-[#050e1f] to-[#020712] shadow-[0_25px_80px_rgba(0,0,0,0.85)]"
        onMouseEnter={() => setIsUserInteracting(true)}
        onMouseLeave={() => setIsUserInteracting(false)}
      >
        {/* 1. Ambient Blueprint Matrix Background */}
        <div aria-hidden="true" className="absolute inset-0 bg-blueprint opacity-40 mask-fade-radial pointer-events-none" />

        {/* 2. Interactive SVG Energy Mesh & Radar Radians */}
        <svg
          className="absolute inset-0 size-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="hubCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d8a62a" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#d8a62a" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#d8a62a" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="activeBeamGradient" x1="50%" y1="50%" x2="50%" y2="15%">
              <stop offset="0%" stopColor="#d8a62a" stopOpacity="0.8" />
              <stop offset="100%" stopColor={activeNode.accent} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Concentric Ambient Radar Waves */}
          <circle cx="50" cy="50" r="16" fill="none" stroke="#d8a62a" strokeOpacity="0.15" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="#d8a62a" strokeOpacity="0.12" strokeDasharray="1 2" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#d8a62a" strokeOpacity="0.08" strokeWidth="0.2" />

          {/* Connection Lines from Center (50, 50) to each satellite */}
          {nodes.map((node) => {
            const isActive = node.id === activeId;
            return (
              <g key={`line-${node.id}`}>
                {/* Base passive wire */}
                <line
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  stroke={isActive ? node.accent : 'rgba(255,255,255,0.15)'}
                  strokeWidth={isActive ? '0.7' : '0.35'}
                  strokeDasharray={isActive ? 'none' : '1.5 2'}
                  className="transition-all duration-500"
                />

                {/* Active energized beam glow */}
                {isActive && (
                  <>
                    <line
                      x1="50"
                      y1="50"
                      x2={node.x}
                      y2={node.y}
                      stroke={node.accent}
                      strokeWidth="1.6"
                      strokeOpacity="0.3"
                      filter="blur(1px)"
                    />
                    {/* Animated Photon Packet Pulse */}
                    <circle r="1" fill="#ffffff">
                      <animateMotion
                        path={`M 50 50 L ${node.x} ${node.y}`}
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* 3. Central PPAB Master Integration Core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          {/* Pulsing Core Ambient Aura */}
          <motion.div
            className="absolute -inset-6 rounded-full bg-gold-500/20 blur-xl"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Hexagonal Master Core Badge */}
          <div className="relative flex flex-col items-center justify-center size-20 sm:size-24 rounded-2xl border border-gold-400/50 bg-[#061124] shadow-[0_0_30px_rgba(216,166,42,0.35)] backdrop-blur-md">
            <span className="size-2 rounded-full bg-gold-400 animate-ping absolute top-2 right-2" />
            <div className="flex flex-col items-center justify-center text-center p-1">
              <span className="font-heading font-black text-xs sm:text-sm tracking-wider text-white">
                PPAB
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-gold-300 font-bold">
                CORE
              </span>
              <span className="mt-1 text-[8px] font-mono text-white/50 tracking-tighter hidden sm:block">
                DIRECT TEAM
              </span>
            </div>
          </div>
        </div>

        {/* 4. Five Satellite Interactive Division Nodes */}
        {nodes.map((node) => {
          const isActive = node.id === activeId;
          const Icon = node.icon;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => handleSelect(node.id)}
              aria-label={`Inspect ${node.name}`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 z-30 focus:outline-none"
            >
              {/* Outer pulsing ring when active */}
              {isActive && (
                <motion.div
                  className="absolute -inset-2 rounded-full pointer-events-none"
                  style={{
                    backgroundColor: `${node.accent}20`,
                    borderColor: `${node.accent}60`,
                    borderWidth: '1px',
                  }}
                  animate={{
                    scale: [1, 1.35, 1],
                    opacity: [0.6, 0.2, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              {/* Satellite Node Badge */}
              <div
                className={`relative flex size-12 sm:size-14 items-center justify-center rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'scale-110 shadow-lg'
                    : 'bg-navy-950/80 border-white/15 text-white/70 hover:border-white/40 hover:text-white hover:scale-105'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: '#07162e',
                        borderColor: node.accent,
                        boxShadow: `0 0 20px ${node.accent}40`,
                        color: node.accent,
                      }
                    : undefined
                }
              >
                <Icon className="size-5 sm:size-6 transition-transform duration-300 group-hover:scale-110" />

                {/* Micro Division Label below node */}
                <span
                  className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-navy-950 text-white border border-white/20'
                      : 'text-white/60 group-hover:text-white'
                  }`}
                  style={isActive ? { color: node.accent } : undefined}
                >
                  {node.short}
                </span>
              </div>
            </button>
          );
        })}

        {/* 5. Holographic Inspection HUD Card (Active Division Spotlight) */}
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-auto sm:max-w-xs z-30 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="rounded-2xl border border-white/15 bg-navy-950/90 p-3.5 shadow-xl backdrop-blur-xl"
              style={{
                boxShadow: `0 10px 30px -5px ${activeNode.accent}25`,
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                <span
                  className="font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: activeNode.accent }}
                >
                  {activeNode.short} Division Active
                </span>
                <span className="flex items-center gap-1 font-mono text-[9px] text-white/50">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Deployed
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-white font-heading">
                  {activeNode.name}
                </h4>
                <p className="text-[11px] text-white/65 line-clamp-2 leading-tight">
                  {activeNode.summary}
                </p>
              </div>

              {/* Key Capabilities */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {activeNode.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/80"
                  >
                    <CheckCircle2 className="size-2.5 text-gold-400" />
                    <span>{cap}</span>
                  </span>
                ))}
              </div>

              {/* Action Link */}
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={activeNode.href}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors hover:text-white"
                  style={{ color: activeNode.accent }}
                >
                  <span>Explore division</span>
                  <ArrowRight className="size-3 transition-transform hover:translate-x-0.5" />
                </Link>
                <span className="text-[9px] font-mono text-white/40">
                  Click nodes to inspect
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 6. Bottom Interactive Division Selector Strip */}
        <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 z-30 flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-navy-950/80 px-2.5 py-1.5 backdrop-blur-md">
          {/* Quick Division Switcher Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {nodes.map((node) => {
              const isActive = node.id === activeId;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleSelect(node.id)}
                  className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all select-none ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-ecosystem-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        backgroundColor: `${node.accent}30`,
                        border: `1px solid ${node.accent}80`,
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: node.accent }}
                  />
                  <span className="relative z-10">{node.short}</span>
                </button>
              );
            })}
          </div>

          {/* Auto-Orbit Toggle Button */}
          <button
            type="button"
            onClick={() => setIsAutoOrbit((prev) => !prev)}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-mono text-white/60 hover:text-white transition-colors shrink-0"
            title={isAutoOrbit ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            {isAutoOrbit ? (
              <>
                <Pause className="size-2.5" />
                <span className="hidden sm:inline">ORBIT</span>
              </>
            ) : (
              <>
                <Play className="size-2.5" />
                <span className="hidden sm:inline">PAUSED</span>
              </>
            )}
          </button>
        </div>

        {/* 7. Golden Corner Frame Tech Styling */}
        <CornerFrame inset={14} />
      </div>
    </InteractiveTiltCard>
  );
}
