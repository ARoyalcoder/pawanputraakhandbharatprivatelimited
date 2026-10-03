'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@/components/3d/Environment';
import { Lighting } from '@/components/3d/Lighting';
import { IntroParticles } from './IntroParticles';
import { IntroObject } from './IntroObject';
import { IntroCameraController } from '@/components/3d/IntroCameraController';
import { IntroLogoReveal } from './IntroLogoReveal';
import { IntroText } from './IntroText';
import { IntroTransition } from './IntroTransition';
import { IntroSkipButton } from './IntroSkipButton';
import { IntroFallback } from './IntroFallback';
import { buildIntroTimeline } from '@/lib/animations/introTimeline';
import { usePerformanceController } from '@/components/3d/PerformanceController';
import { useReducedMotion } from '@/hooks/useMediaQuery';

export interface IntroControllerProps {
  onComplete: () => void;
}

export function IntroController({ onComplete }: IntroControllerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);

  const perf = usePerformanceController();
  const reducedMotion = useReducedMotion();

  // 3D Scene animation states controlled by master timeline
  const [approachProgress, setApproachProgress] = useState(0);
  const [burstProgress, setBurstProgress] = useState(0);
  const [energy, setEnergy] = useState(0.2);
  const [cameraProgress, setCameraProgress] = useState(0);
  const [cameraShake, setCameraShake] = useState(0);
  const [hasImpacted, setHasImpacted] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Skip logic
  const handleSkip = () => {
    try {
      localStorage.setItem('ppab_intro_seen', 'true');
    } catch {
      // Ignore localStorage issues
    }
    onComplete();
  };

  useEffect(() => {
    if (reducedMotion || perf.tier === 'OFF') {
      // Reduced motion or no WebGL: show minimal fallback fade or skip directly
      return;
    }

    const targets = {
      container: containerRef.current,
      canvasWrap: canvasWrapRef.current,
      flashOverlay: flashRef.current,
      rippleWave: rippleRef.current,
      logoDom: logoRef.current,
      companyName: companyRef.current,
      tagline: taglineRef.current,
      skipBtn: skipBtnRef.current,
    };

    const tl = buildIntroTimeline(targets, {
      isMobile: perf.isMobile,
      onParticlesStart: () => {
        setShowParticles(true);
        setEnergy(0.8);
      },
      onObjectEnter: () => {
        setApproachProgress(0.5);
        setCameraProgress(0.4);
        setEnergy(1.1);
      },
      onImpactPrep: () => {
        setApproachProgress(0.95);
        setCameraProgress(0.85);
        setEnergy(1.4);
      },
      onImpact: () => {
        setApproachProgress(1);
        setHasImpacted(true);
        setCameraShake(1);
        setTimeout(() => setCameraShake(0), 450);
      },
      onParticleBurst: () => {
        setBurstProgress(1);
      },
      onLogoReveal: () => {
        // Logo appears in DOM overlay with metallic gleam
      },
      onCompanyReveal: () => {
        // Company name rises
      },
      onTaglineReveal: () => {
        // Tagline rises
      },
      onTransitionStart: () => {
        try {
          localStorage.setItem('ppab_intro_seen', 'true');
        } catch {
          // Ignore
        }
      },
      onComplete: () => {
        onComplete();
      },
    });

    tl.play();

    // Keyboard escape listener to skip
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      tl.kill();
      window.removeEventListener('keydown', onKey);
    };
  }, [reducedMotion, perf.tier, perf.isMobile, onComplete]);

  // Reduced motion accessible fallback
  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020b1d] p-6 text-center text-white"
      >
        <IntroLogoReveal logoRef={logoRef} />
        <IntroText companyRef={companyRef} taglineRef={taglineRef} />
        <button
          type="button"
          onClick={handleSkip}
          className="mt-8 rounded-full border border-gold-400/40 bg-[#06152f] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-200 transition-colors hover:border-gold-300 hover:text-white"
        >
          Enter PPAB
        </button>
      </div>
    );
  }

  // WebGL unavailable fallback
  if (perf.tier === 'OFF') {
    return (
      <div ref={containerRef} className="fixed inset-0 z-[100] bg-[#020b1d]">
        <IntroFallback onDismiss={handleSkip} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Pawan Putra Akhand Bharat Cinematic Introduction"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#020b1d] select-none"
    >
      {/* Three.js 3D Canvas Layer */}
      <div ref={canvasWrapRef} className="absolute inset-0 size-full pointer-events-none">
        <Canvas
          dpr={perf.dpr}
          gl={{
            antialias: perf.antialias,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 8.5], fov: 36, near: 0.1, far: 50 }}
        >
          <Environment enableLightformers={perf.enableLightformers} />
          <Lighting energy={energy} flash={hasImpacted} />
          <IntroCameraController
            progress={cameraProgress}
            shake={cameraShake}
            pointerParallax={!perf.isMobile}
          />
          {showParticles && (
            <IntroParticles
              count={perf.particleCount}
              burstProgress={burstProgress}
              energy={energy}
            />
          )}
          <IntroObject
            approachProgress={approachProgress}
            glowIntensity={energy}
          />
        </Canvas>
      </div>

      {/* Cinematic Flash & Ripple Shockwave */}
      <IntroTransition flashRef={flashRef} rippleRef={rippleRef} />

      {/* Brand Identity Revelation Layer (Post-Impact) */}
      <div className="relative z-50 flex flex-col items-center justify-center pointer-events-none">
        <IntroLogoReveal logoRef={logoRef} />
        <IntroText companyRef={companyRef} taglineRef={taglineRef} />
      </div>

      {/* Accessible Skip Button */}
      <IntroSkipButton onSkip={handleSkip} />
    </div>
  );
}
