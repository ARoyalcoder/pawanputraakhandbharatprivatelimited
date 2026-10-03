'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, Wifi, Eye } from 'lucide-react';
import { ThreeScene } from '@/components/3d/ThreeScene';
import { SceneLoader } from '@/components/3d/SceneLoader';
import { ConceptArt } from '@/components/media/ConceptArt';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const fallback = <ConceptArt variant="secure" />;

const CameraTrackerScene = dynamic(() => import('@/components/3d/scenes/CameraTrackerScene'), {
  ssr: false,
  loading: () => <SceneLoader>{fallback}</SceneLoader>,
});

export function SecureHeroVisual() {
  const finePointer = useMediaQuery('(pointer: fine)');
  const [timeStr, setTimeStr] = useState<string>('12:00:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toTimeString().split(' ')[0] + '.' + String(Math.floor(now.getMilliseconds() / 100))
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-panel border border-white/15 bg-[radial-gradient(75%_75%_at_50%_35%,#123668,#020b1d)] shadow-2xl">
      {/* 1. Surveillance Blueprint Grid & Scan Lines */}
      <div aria-hidden="true" className="absolute inset-0 bg-blueprint opacity-40 pointer-events-none" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,11,29,0.7)_100%)] pointer-events-none"
      />

      {/* 2. 3D Realistic CCTV Camera Interactive Scene */}
      <ThreeScene
        splineUrl={process.env.NEXT_PUBLIC_SPLINE_SECURE_URL || undefined}
        fallback={fallback}
        render={(ctx) => <CameraTrackerScene {...ctx} pointer={finePointer} />}
      />

      {/* 3. High-Tech Corner Viewfinder Brackets */}
      <CornerFrame inset={16} className="text-secure/60 pointer-events-none" />

      {/* 4. Top Real-Time Surveillance Telemetry Bar */}
      <div className="absolute top-4 inset-x-5 flex items-center justify-between text-[11px] font-mono pointer-events-none select-none z-10">
        {/* Left: Recording Beacon & Camera ID */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-navy-950/80 border border-white/10 backdrop-blur-md shadow-sm">
          <span className="size-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
          <span className="font-bold tracking-wider text-white uppercase">REC</span>
          <span className="text-white/30">•</span>
          <span className="text-secure font-semibold">CAM-01 // PPAB SECURE</span>
        </div>

        {/* Right: Live Digital Timestamp & Quality Spec */}
        <div className="hidden sm:flex items-center gap-2.5 px-2.5 py-1 rounded-full bg-navy-950/80 border border-white/10 backdrop-blur-md shadow-sm text-white/80">
          <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
            <Wifi className="size-3" /> 4K UHD
          </span>
          <span className="text-white/30">•</span>
          <span className="font-mono tabular-nums text-white/90">{timeStr}</span>
        </div>
      </div>

      {/* 5. Center Optical Target Reticle */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none select-none">
        <div className="relative size-24 sm:size-32 rounded-full border border-secure/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
          <div className="size-16 rounded-full border border-dashed border-secure/30" />
          <div className="absolute top-0 w-0.5 h-2 bg-secure/60" />
          <div className="absolute bottom-0 w-0.5 h-2 bg-secure/60" />
          <div className="absolute left-0 h-0.5 w-2 bg-secure/60" />
          <div className="absolute right-0 h-0.5 w-2 bg-secure/60" />
        </div>
      </div>

      {/* 6. Bottom Status HUD & Tagline */}
      <div className="absolute bottom-4 inset-x-5 flex items-center justify-between pointer-events-none select-none z-10">
        {/* Official Brand Tagline Badge */}
        <p className="inline-flex items-center gap-2 rounded-full bg-navy-950/85 border border-secure/30 px-3.5 py-1.5 type-tagline-sm text-secure backdrop-blur-md shadow-lg">
          <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
          Har Nazar Se Suraksha
        </p>

        {/* Optical Sensor Specs */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-navy-950/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-white/60">
          <ShieldCheck className="size-3.5 text-secure" />
          <span>AI MOTION DETECT // ACTIVE</span>
          <span className="text-white/30">•</span>
          <span>IR 50M NIGHT VISION</span>
        </div>
      </div>
    </div>
  );
}
