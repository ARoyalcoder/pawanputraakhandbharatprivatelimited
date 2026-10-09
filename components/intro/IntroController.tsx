'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FastForward, Shield, Radio, Cpu, Sparkles } from 'lucide-react';
import { buildIntroTimeline } from '@/lib/animations/introTimeline';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { announceIntroComplete, INTRO_SEEN_KEY, INTRO_SESSION_KEY } from '@/lib/animations/heroCue';

export interface IntroControllerProps {
  onComplete: () => void;
}

export function IntroController({ onComplete }: IntroControllerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoDomRef = useRef<HTMLDivElement>(null);
  const logoSheenRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const companyNameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterTextRef = useRef<HTMLSpanElement>(null);
  const statusTextRef = useRef<HTMLSpanElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  const [statusMessage, setStatusMessage] = useState('INITIALIZING SECURE SYSTEMS');
  const [percent, setPercent] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  const reducedMotion = useReducedMotion();

  const handleFinish = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
      localStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {
      // Ignore private browsing storage block
    }
    announceIntroComplete();
    onComplete();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (isSkipped) return;
    setIsSkipped(true);
    handleFinish();
  }, [isSkipped, handleFinish]);

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(handleFinish, 300);
      return () => clearTimeout(timer);
    }

    const targets = {
      container: containerRef.current,
      logoDom: logoDomRef.current,
      logoSheen: logoSheenRef.current,
      rings: ringsRef.current,
      companyName: companyNameRef.current,
      tagline: taglineRef.current,
      progressBar: progressBarRef.current,
      counterText: counterTextRef.current,
      statusText: statusTextRef.current,
      skipBtn: skipBtnRef.current,
      flashOverlay: flashOverlayRef.current,
    };

    const tl = buildIntroTimeline(targets, {
      isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
      onProgress: (p) => setPercent(p),
      onStatusChange: (s) => setStatusMessage(s),
      onTransitionStart: () => {
        try {
          sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
          localStorage.setItem(INTRO_SEEN_KEY, 'true');
        } catch {}
        announceIntroComplete();
      },
      onComplete: handleFinish,
    });

    tl.play();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      tl.kill();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reducedMotion, handleFinish, handleSkip]);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020b1d] text-white">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/brand/ppab-mark.png"
            alt="Pawan Putra Akhand Bharat Logo"
            width={96}
            height={96}
            priority
            className="size-24 object-contain filter drop-shadow-[0_0_24px_rgba(216,166,42,0.45)]"
          />
          <span className="font-mono text-xs uppercase tracking-widest text-gold-300">
            Pawan Putra Akhand Bharat
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Pawan Putra Akhand Bharat loading experience"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#020b1d] select-none text-white"
    >
      {/* 1. Subtle High-Tech Architectural Grid & Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,#071c3d_0%,#030f24_45%,#020b1d_100%)] opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(216,166,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(216,166,42,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_80%)]"
      />

      {/* 2. Technical Corner Crosshair Reticles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-6 sm:inset-10 text-gold-400/25 font-mono text-[10px]">
        <div className="absolute top-0 left-0 flex items-center gap-1.5">
          <span>+</span>
          <span className="hidden sm:inline tracking-widest">SYS:ONLINE</span>
        </div>
        <div className="absolute top-0 right-0 flex items-center gap-1.5">
          <span className="hidden sm:inline tracking-widest">LOC:28.6139°N</span>
          <span>+</span>
        </div>
        <div className="absolute bottom-0 left-0 flex items-center gap-1.5">
          <span>+</span>
          <span className="hidden sm:inline tracking-widest">PPAB // PROTOCOL 2.0</span>
        </div>
        <div className="absolute bottom-0 right-0 flex items-center gap-1.5">
          <span className="hidden sm:inline tracking-widest">SEC:ENTERPRISE</span>
          <span>+</span>
        </div>
      </div>

      {/* 3. Radiant Warm Golden Ambient Backlight Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-[28rem] sm:size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(216,166,42,0.18)_0%,rgba(216,166,42,0.05)_40%,transparent_70%)] blur-2xl animate-pulse duration-[3000ms]"
      />

      {/* 4. Golden Subtle Floating Ambient Specks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 size-1.5 rounded-full bg-gold-300/40 blur-[1px] animate-ping duration-[4000ms]" />
        <div className="absolute top-1/3 right-1/4 size-1 rounded-full bg-gold-400/50 blur-[0.5px] animate-pulse duration-[2500ms]" />
        <div className="absolute bottom-1/3 left-1/4 size-2 rounded-full bg-amber-400/30 blur-[1px] animate-pulse duration-[3500ms]" />
        <div className="absolute bottom-1/4 right-1/3 size-1.5 rounded-full bg-gold-200/40 blur-[0.5px] animate-ping duration-[5000ms]" />
      </div>

      {/* 5. Center Presentation Core */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4">
        {/* Emblem & Concentric Gold Orbital Rings */}
        <div className="relative flex items-center justify-center size-36 sm:size-44 md:size-48">
          {/* Orbital Rings */}
          <div
            ref={ringsRef}
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* Outer Subtle Dashed Ring */}
            <div className="size-full rounded-full border border-gold-400/20 [border-dasharray:6,6] animate-[spin_40s_linear_infinite]" />
            {/* Inner Ring with Glowing Accent Nodules */}
            <div className="absolute size-[82%] rounded-full border border-gold-300/35 shadow-[0_0_20px_rgba(216,166,42,0.15)] animate-[spin_25s_linear_infinite_reverse]">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-gold-300 shadow-[0_0_8px_#f4c95d]" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-gold-400/70" />
            </div>
          </div>

          {/* Golden Medallion Backing Plate */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute size-28 sm:size-36 rounded-full bg-gradient-to-b from-[#102a5c] to-[#040e22] border border-gold-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_8px_rgba(244,201,93,0.3)]"
          />

          {/* Official PPAB Mark with Metallic Glint */}
          <div
            ref={logoDomRef}
            className="relative size-24 sm:size-32 overflow-hidden rounded-full flex items-center justify-center"
          >
            <Image
              src="/brand/ppab-mark.png"
              alt="Pawan Putra Akhand Bharat Emblem"
              width={140}
              height={140}
              priority
              className="size-full object-contain filter drop-shadow-[0_4px_24px_rgba(216,166,42,0.65)]"
            />

            {/* Metallic Sheen Sweep Animation */}
            <div
              ref={logoSheenRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]"
            />
          </div>
        </div>

        {/* Company Title */}
        <div
          ref={companyNameRef}
          className="mt-6 text-center"
        >
          <p className="font-heading text-lg sm:text-2xl md:text-3xl font-extrabold uppercase tracking-[0.24em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
            <span>PAWAN PUTRA </span>
            <span className="text-[#f4c95d] drop-shadow-[0_0_15px_rgba(244,201,93,0.4)]">AKHAND BHARAT</span>
          </p>
        </div>

        {/* Tagline */}
        <div
          ref={taglineRef}
          className="mt-1.5 text-center"
        >
          <p className="font-serif italic text-xs sm:text-sm md:text-base text-gold-200/90 tracking-wide drop-shadow-[0_1px_8px_rgba(216,166,42,0.35)]">
            Powering Security, Connectivity &amp; Growth
          </p>
        </div>

        {/* Executive Loading Telemetry HUD & Progress Bar */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3 w-72 sm:w-88">
          {/* Status Label & Percentage Row */}
          <div className="flex w-full items-center justify-between font-mono text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 text-gold-300/80">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-gold-400" />
              </span>
              <span ref={statusTextRef} className="tracking-wider uppercase font-medium">
                {statusMessage}
              </span>
            </div>
            <span
              ref={counterTextRef}
              className="font-bold tabular-nums text-gold-200 tracking-wider shadow-sm"
            >
              {String(percent).padStart(2, '0')}%
            </span>
          </div>

          {/* High-Precision Gold Progress Track */}
          <div className="relative w-full h-1.5 sm:h-2 rounded-full bg-white/10 p-[1px] backdrop-blur-md border border-gold-400/25 overflow-hidden shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)]">
            <div
              ref={progressBarRef}
              style={{ width: `${percent}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#997017] via-[#f4c95d] to-[#ffe699] shadow-[0_0_12px_rgba(244,201,93,0.85)] relative"
            >
              {/* Glowing Lead Spark */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>

          {/* Sub-telemetry Pill Details */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-white/40 font-mono tracking-widest mt-1">
            <span className="flex items-center gap-1">
              <Shield className="size-3 text-gold-400/60" />
              <span>DEFENSE-GRADE</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Radio className="size-3 text-gold-400/60" />
              <span>4K CCTV &amp; AI</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Cpu className="size-3 text-gold-400/60" />
              <span>SMART INFRA</span>
            </span>
          </div>
        </div>
      </div>

      {/* 6. Subtle Gold Flash Overlay at Handover */}
      <div
        ref={flashOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,201,93,0.4)_0%,rgba(6,21,47,0.8)_80%)] opacity-0 z-30"
      />

      {/* 7. Executive Fast Skip Button */}
      <button
        ref={skipBtnRef}
        type="button"
        onClick={handleSkip}
        aria-label="Skip introduction directly to homepage"
        className="group absolute bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-gold-400/35 bg-[#06152f]/80 px-4 py-2 text-xs font-mono uppercase tracking-widest text-gold-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-gold-300 hover:bg-[#0b1d3d] hover:text-white hover:shadow-[0_0_20px_rgba(216,166,42,0.45)] focus:outline-none focus:ring-2 focus:ring-gold-400"
      >
        <span>Skip</span>
        <FastForward className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
