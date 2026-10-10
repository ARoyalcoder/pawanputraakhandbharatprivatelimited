'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';
import { whatsappHref } from '@/lib/contact';
import { cn } from '@/lib/utils';
import type { SolutionCardData } from './types';

interface ActiveSolutionCardProps {
  item: SolutionCardData;
  className?: string;
}

export const ActiveSolutionCard: React.FC<ActiveSolutionCardProps> = ({
  item,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number; lightX: number; lightY: number }>({
    x: 0,
    y: 0,
    lightX: 50,
    lightY: 50,
  });

  // Mouse tilt interaction (desktop only, with prefers-reduced-motion check)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const lightX = ((e.clientX - rect.left) / rect.width) * 100;
      const lightY = ((e.clientY - rect.top) / rect.height) * 100;

      // Subtle 3D tilt
      setTilt({
        x: -y * 3,
        y: x * 3,
        lightX,
        lightY,
      });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0, lightX: 50, lightY: 50 });
    };

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const imageSrc =
    item.imageUrl ||
    (item.image.src ? item.image.src : `/images/solutions/${item.id}.jpg`);

  const whatsappMessage = `Hello PPAB, I would like to enquire about ${item.name} solutions.`;

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative isolate overflow-hidden rounded-3xl border transition-[border-color,box-shadow,opacity] duration-500 ease-out',
        'bg-[#061226]/90 shadow-2xl backdrop-blur-xl h-full flex flex-col justify-between',
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        borderColor: `${item.accent}55`,
        boxShadow: `0 25px 60px -12px rgba(0,0,0,0.75), 0 0 50px -15px ${item.accent}40`,
      }}
    >
      {/* 1. Realistic Environment Window (Photorealistic Backdrop) */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 65vw, 100vw"
          className="object-cover object-center filter brightness-[0.65] contrast-[1.12] saturate-[1.05] transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        {/* Soft Multi-Layer Gradients for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020b1d] via-[#020b1d]/85 to-[#020b1d]/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020b1d] via-[#020b1d]/75 to-transparent" />
      </div>

      {/* 2. Cursor Sheen & Ambient Rim Lighting */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 transition-opacity duration-300 group-hover:opacity-60"
        style={{
          background: `radial-gradient(circle 420px at ${tilt.lightX}% ${tilt.lightY}%, ${item.accent}35, transparent 70%)`,
        }}
      />

      {/* Top Accent Glowing Bar */}
      <div
        className="absolute inset-x-0 top-0 h-1.5 transition-all duration-700"
        style={{
          backgroundColor: item.accent,
          boxShadow: `0 0 20px ${item.accent}`,
        }}
      />

      {/* 3. Card Content Container with Smooth In-Change Animation */}
      <div
        key={item.id}
        className="relative flex flex-col justify-between h-full p-4 sm:p-5 z-10 motion-safe:animate-fade-in w-full min-w-[340px] xl:min-w-[390px]"
      >
        {/* Top Header HUD Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span
              className="font-mono text-xs font-extrabold tracking-widest text-white px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: `${item.accent}20`,
                borderColor: `${item.accent}60`,
              }}
            >
              {item.index}
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70 inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: item.accent }} />
              {item.category || item.environmentTelemetry || 'PPAB OFFICIAL DIVISION'}
            </span>
          </div>

          <div
            className="flex size-9 sm:size-10 items-center justify-center rounded-xl border transition-all duration-300 shadow-md backdrop-blur-md"
            style={{
              backgroundColor: `${item.accent}25`,
              borderColor: `${item.accent}70`,
              boxShadow: `0 0 16px ${item.accent}35`,
              color: item.accent,
            }}
          >
            <Icon name={item.icon} size={18} />
          </div>
        </div>

        {/* Main Body: Title, Tagline, Highlights, Capabilities */}
        <div className="my-auto py-2 space-y-2.5">
          {/* Division Heading & Motto */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-px w-5" style={{ backgroundColor: item.accent }} />
              <p
                className="font-serif text-sm sm:text-base italic font-normal tracking-wide"
                style={{ color: item.accent }}
              >
                &ldquo;{item.tagline}&rdquo;
              </p>
            </div>
            <h2 className="text-xl sm:text-2xl xl:text-[1.75rem] font-extrabold font-heading text-white tracking-tight leading-tight">
              {item.name}
            </h2>
            {item.subTagline && (
              <p className="font-mono text-[10.5px] uppercase tracking-wider text-white/50 mt-0.5">
                {item.subTagline}
              </p>
            )}
          </div>

          {/* Key Value Deliverables Grid (Direct, Visual, No wordy theory) */}
          {item.highlights && item.highlights.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {item.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="group/item flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 backdrop-blur-md transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <CheckCircle2 className="size-3.5 shrink-0 transition-transform group-hover/item:scale-110" style={{ color: item.accent }} />
                  <span className="text-[11px] font-semibold text-white/90 truncate">{highlight}</span>
                </div>
              ))}
            </div>
          )}

          {/* Capabilities & Live Metrics */}
          <div className="pt-0.5">
            <div className="text-[9.5px] font-mono uppercase tracking-wider text-white/50 mb-1.5 flex items-center justify-between">
              <span>Core Capabilities</span>
              {item.stat?.value && (
                <span className="text-white/80 font-mono text-[10.5px] inline-flex items-center gap-1.5">
                  <strong style={{ color: item.accent }}>{item.stat.value}</strong>
                  <span>{item.stat.label}</span>
                </span>
              )}
            </div>
            <ul className="flex flex-wrap gap-1.5" aria-label={`${item.name} services`}>
              {item.services.map((service) => (
                <li
                  key={service}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-navy-950/80 px-2.5 py-0.5 text-[10.5px] font-medium text-white/90 backdrop-blur-md shadow-sm transition-all hover:border-white/40 hover:bg-navy-900 hover:scale-[1.02] cursor-default"
                >
                  <span className="size-1 rounded-full" style={{ backgroundColor: item.accent }} />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Actions: Explore CTA, Consultation, WhatsApp */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-white/10 mt-auto">
          {/* Primary Division CTA */}
          <Link
            href={item.href}
            className="group/btn inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 select-none shadow-md hover:brightness-110 active:scale-[0.98]"
            style={{
              backgroundColor: item.accent,
              color: '#06152f',
              boxShadow: `0 3px 12px ${item.accent}35`,
            }}
          >
            <span>Explore {item.short}</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>

          {/* Secondary Consultation CTA */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-xs backdrop-blur-sm transition-all hover:border-white/30"
          >
            <span>Book Site Survey</span>
          </Link>

          {/* WhatsApp Direct Enquiry */}
          <a
            href={whatsappHref(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium text-xs backdrop-blur-sm transition-all"
            aria-label={`WhatsApp enquiry for ${item.name}`}
          >
            <WhatsAppIcon size={14} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Turnkey Standard Stamp */}
          <span className="ml-auto hidden text-[10.5px] text-white/50 2xl:inline-flex items-center gap-1.5 font-mono">
            <ShieldCheck className="size-3.5 text-emerald-400" /> Turnkey EPC
          </span>
        </div>
      </div>
    </div>
  );
};
