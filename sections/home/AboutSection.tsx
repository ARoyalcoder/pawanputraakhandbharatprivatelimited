'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Layers,
  MapPin,
  Sparkles,
  Workflow,
  Handshake,
  ExternalLink,
} from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { aboutPillars } from '@/data/company';
import { divisionAccent, divisions } from '@/data/divisions';
import { siteConfig } from '@/config/site.config';
import { Icon } from '@/components/ui/Icon';
import { useQuote } from '@/components/forms/QuoteProvider';
import type { DivisionId } from '@/types/content';

// Geometric constellation node coordinates (viewBox 0 0 540 330, center 270, 155)
const NODE_COORDS: Record<DivisionId, { x: number; y: number; labelPos: 'top' | 'right' | 'bottom-right' | 'bottom-left' | 'left' }> = {
  secure: { x: 270, y: 45, labelPos: 'top' },
  connect: { x: 445, y: 125, labelPos: 'right' },
  solar: { x: 380, y: 250, labelPos: 'bottom-right' },
  digital: { x: 160, y: 250, labelPos: 'bottom-left' },
  space: { x: 95, y: 125, labelPos: 'left' },
};

const pillarIcons = [Layers, Handshake, Workflow];

export function AboutSection() {
  const [activeDivisionId, setActiveDivisionId] = useState<DivisionId>('secure');
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const autoCycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { openQuote } = useQuote();

  const activeDivision = divisions.find((d) => d.id === activeDivisionId) || divisions[0];
  const activeAccent = divisionAccent[activeDivision.id];

  // Smooth auto-cycling through the 5 divisions if user is not actively interacting
  useEffect(() => {
    if (!isAutoCycling) return;

    autoCycleTimerRef.current = setInterval(() => {
      setActiveDivisionId((prev) => {
        const currentIndex = divisions.findIndex((d) => d.id === prev);
        const nextIndex = (currentIndex + 1) % divisions.length;
        return divisions[nextIndex].id;
      });
    }, 4500);

    return () => {
      if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
    };
  }, [isAutoCycling]);

  const handleSelectDivision = (id: DivisionId) => {
    setActiveDivisionId(id);
    setIsAutoCycling(false); // Pause auto-rotation when user engages
  };

  return (
    <Section tone="light" id="about" aria-labelledby="about-title" className="relative overflow-hidden py-20 lg:py-28">
      {/* Background subtle radial texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 -z-10 h-96 w-96 rounded-full bg-gold-400/[0.04] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-navy-900/[0.03] blur-3xl"
      />

      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* ================================================================= */}
        {/* LEFT COLUMN: Editorial & Interactive Delivery Pillars             */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <SectionHeading
              id="about-title"
              eyebrow="About PPAB"
              index="01"
              title={
                <>
                  Complete Solutions.{' '}
                  <span className="type-accent text-gold-700 italic font-serif">One Trusted Partner.</span>
                </>
              }
              description="Pawan Putra Akhand Bharat brings security, connectivity, solar, digital technology and infrastructure under one roof, so homes, businesses, institutions and industries can plan, build and maintain with a single partner."
            />

            <div className="mt-6 border-l-2 border-gold-400/50 pl-4 py-1">
              <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                Most requirements do not stop at one service. A new office needs cameras, a network to carry them,
                reliable power, and a website to be found. A new home needs design, construction, security and solar.
                PPAB&apos;s five divisions are engineered to work seamlessly together on exactly these requirements.
              </p>
            </div>
          </div>

          {/* Interactive 3-Pillar Assurance Cards */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
              <Sparkles className="size-3 text-gold-600" />
              <span>Core Architectural Synergies</span>
            </p>

            <div className="grid gap-3">
              {aboutPillars.map((pillar, i) => {
                const PillarIcon = pillarIcons[i] || Layers;
                const isSelected = activePillarIndex === i;

                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActivePillarIndex(i)}
                    className={`group w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
                      isSelected
                        ? 'border-gold-500/40 bg-white shadow-card ring-1 ring-gold-400/30'
                        : 'border-navy-900/10 bg-white/40 hover:border-navy-900/20 hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                          isSelected
                            ? 'border-gold-500 bg-gold-400/20 text-gold-800'
                            : 'border-navy-900/10 bg-navy-50 text-navy-800 group-hover:border-navy-900/20'
                        }`}
                      >
                        <PillarIcon className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-gold-700">0{i + 1}</span>
                          <h3 className="type-h5 text-navy-950 font-bold">{pillar.title}</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Triggers & Verified Offices */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-navy-900/10">
            <div className="flex items-center gap-3">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-navy-800 active:scale-[0.98]"
              >
                <span>Corporate Overview</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={() => openQuote({ source: 'about-section' })}
                className="inline-flex items-center gap-1.5 rounded-xl border border-navy-900/15 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-navy-900 transition-all hover:border-navy-900/35 hover:bg-navy-50"
              >
                <span>Consultation</span>
              </button>
            </div>

            <p className="flex items-center gap-2 text-xs font-medium text-muted">
              <MapPin aria-hidden="true" className="size-3.5 text-gold-600 shrink-0" />
              <span>{siteConfig.offices.map((o) => o.city).join(' & ')} Hubs</span>
            </p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: Interactive Living Unified Constellation Hub        */}
        {/* ================================================================= */}
        <div className="relative lg:col-span-6">
          <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-navy-950 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl">
            {/* Viewfinder Corner Framing */}
            <CornerFrame inset={16} size={20} className="text-gold-400/50" />

            {/* Background Blueprint Grid & Accent Lighting */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-blueprint opacity-35 mask-fade-radial pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full blur-3xl opacity-20 transition-all duration-700"
              style={{ backgroundColor: activeAccent.hex }}
            />

            {/* Top Card HUD Status Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="size-2 rounded-full animate-ping"
                  style={{ backgroundColor: activeAccent.hex }}
                />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/90">
                  PPAB UNIFIED ARCHITECTURE
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-white/70">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>5 Divisions</span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SVG Constellation Graphic (Orbit, Rays & Central Core)        */}
            {/* ------------------------------------------------------------- */}
            <div className="relative my-4 aspect-[540/320] w-full select-none">
              <svg
                viewBox="0 0 540 320"
                className="size-full overflow-visible"
                aria-hidden="true"
              >
                <defs>
                  {/* Radial gradient for ambient core glow */}
                  <radialGradient id="aboutCoreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f4c95d" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#d8a62a" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#06152f" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Orbit elliptical tracks */}
                <ellipse
                  cx="270"
                  cy="155"
                  rx="180"
                  ry="110"
                  fill="none"
                  stroke="#f4c95d"
                  strokeOpacity="0.16"
                  strokeDasharray="4 8"
                />
                <ellipse
                  cx="270"
                  cy="155"
                  rx="115"
                  ry="70"
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.08"
                />

                {/* Energy Connection Rays from Center to Nodes */}
                {divisions.map((d) => {
                  const node = NODE_COORDS[d.id];
                  const isCurrent = d.id === activeDivisionId;
                  const accent = divisionAccent[d.id];

                  return (
                    <g key={`ray-${d.id}`}>
                      {/* Base connection line */}
                      <line
                        x1="270"
                        y1="155"
                        x2={node.x}
                        y2={node.y}
                        stroke={isCurrent ? accent.hex : '#ffffff'}
                        strokeOpacity={isCurrent ? 0.85 : 0.18}
                        strokeWidth={isCurrent ? 2 : 1}
                        strokeDasharray={isCurrent ? 'none' : '3 6'}
                        className="transition-all duration-500"
                      />

                      {/* Animated energy pulse packet on active division */}
                      {isCurrent && (
                        <circle r="3" fill={accent.hex}>
                          <animateMotion
                            path={`M 270 155 L ${node.x} ${node.y}`}
                            dur="1.8s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Ambient Center Glow */}
                <circle cx="270" cy="155" r="75" fill="url(#aboutCoreGlow)" />

                {/* Central PPAB Hexagon Core */}
                <g transform="translate(270 155)">
                  {/* Outer Hexagon */}
                  <polygon
                    points="0,-38 33,-19 33,19 0,38 -33,19 -33,-19"
                    fill="#06152f"
                    stroke="#d8a62a"
                    strokeWidth="2"
                    strokeOpacity="0.9"
                  />
                  {/* Inner Hexagon */}
                  <polygon
                    points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12"
                    fill="#f4c95d"
                    fillOpacity="0.22"
                    stroke="#f4c95d"
                    strokeWidth="1.2"
                  />
                  {/* Center Core Dot */}
                  <circle r="6" fill="#f4c95d" className="animate-pulse" />
                </g>
              </svg>

              {/* Interactive Division Node Pods positioned over SVG */}
              {divisions.map((d) => {
                const node = NODE_COORDS[d.id];
                const isCurrent = d.id === activeDivisionId;
                const accent = divisionAccent[d.id];

                // Relative percentages for absolute HTML overlay positioning
                const leftPercent = (node.x / 540) * 100;
                const topPercent = (node.y / 320) * 100;

                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelectDivision(d.id)}
                    aria-label={`Select ${d.name}`}
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                    }}
                    className="group/node absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  >
                    {/* Glowing active ring */}
                    {isCurrent && (
                      <span
                        className="absolute inset-0 -m-2 rounded-full animate-ping opacity-35"
                        style={{ backgroundColor: accent.hex }}
                      />
                    )}

                    {/* Node Pod Button */}
                    <div
                      className={`relative flex size-12 sm:size-14 items-center justify-center rounded-2xl border transition-all duration-300 shadow-lg backdrop-blur-md ${
                        isCurrent
                          ? 'scale-110 shadow-2xl'
                          : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: isCurrent ? `${accent.hex}25` : '#06152f',
                        borderColor: isCurrent ? accent.hex : 'rgba(255,255,255,0.2)',
                        boxShadow: isCurrent ? `0 0 25px ${accent.hex}50` : 'none',
                      }}
                    >
                      <span
                        className="transition-colors"
                        style={{ color: isCurrent ? accent.hex : '#ffffff' }}
                      >
                        <Icon name={d.icon} size={22} />
                      </span>
                    </div>

                    {/* Node Label Tooltip */}
                    <span
                      className={`mt-1 block text-center font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
                        isCurrent ? 'text-white' : 'text-white/60 group-hover/node:text-white'
                      }`}
                      style={{ color: isCurrent ? accent.hex : undefined }}
                    >
                      {d.short}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Integrated Division Detail HUD Card (Docked Cleanly Inside)  */}
            {/* ------------------------------------------------------------- */}
            <div
              className="mt-2 rounded-2xl border p-4 sm:p-5 transition-all duration-500 backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(6, 21, 47, 0.75)',
                borderColor: `${activeAccent.hex}45`,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: activeAccent.hex }}
                    />
                    <h4 className="text-base sm:text-lg font-bold text-white tracking-wide">
                      {activeDivision.name}
                    </h4>
                  </div>
                  <p
                    className="font-serif italic text-xs sm:text-sm tracking-wide"
                    style={{ color: activeAccent.hex }}
                  >
                    &ldquo;{activeDivision.tagline}&rdquo;
                  </p>
                </div>

                <Link
                  href={activeDivision.href}
                  className="group inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:underline shrink-0"
                  style={{ color: activeAccent.hex }}
                >
                  <span>Explore {activeDivision.short}</span>
                  <ExternalLink className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {/* Service Capabilities Chips */}
              <div className="pt-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-2">
                  Integrated Capabilities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeDivision.services.slice(0, 5).map((service) => (
                    <span
                      key={service.id}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/85"
                    >
                      <CheckCircle2 className="size-3" style={{ color: activeAccent.hex }} />
                      <span>{service.name}</span>
                    </span>
                  ))}
                  {activeDivision.services.length > 5 && (
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/50">
                      +{activeDivision.services.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Fast Division Selector Pills along the bottom */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                {divisions.map((d, index) => {
                  const isCur = d.id === activeDivisionId;
                  const accent = divisionAccent[d.id];
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectDivision(d.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isCur
                          ? 'text-navy-950 shadow-md font-bold'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                      style={{
                        backgroundColor: isCur ? accent.hex : undefined,
                      }}
                    >
                      <span>0{index + 1}</span>
                      <span>{d.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
