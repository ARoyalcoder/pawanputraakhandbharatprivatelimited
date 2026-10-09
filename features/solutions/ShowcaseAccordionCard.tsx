'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';
import { whatsappHref } from '@/lib/contact';
import { cn } from '@/lib/utils';
import type { SolutionCardData } from './types';

interface ShowcaseAccordionCardProps {
  item: SolutionCardData;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
  onHover: (index: number) => void;
  onHoverLeave?: () => void;
}

export const ShowcaseAccordionCard: React.FC<ShowcaseAccordionCardProps> = ({
  item,
  index,
  isActive,
  onSelect,
  onHover,
  onHoverLeave,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number; lightX: number; lightY: number }>({
    x: 0,
    y: 0,
    lightX: 50,
    lightY: 50,
  });

  // 3D subtle mouse tilt when active (desktop only, reduced-motion safe)
  useEffect(() => {
    if (!isActive) {
      setTilt({ x: 0, y: 0, lightX: 50, lightY: 50 });
      return;
    }

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
  }, [isActive]);

  const imageSrc =
    item.imageUrl ||
    (item.image?.src ? item.image.src : `/images/solutions/${item.id}.jpg`);

  const whatsappMessage = `Hello PPAB, I would like to enquire about ${item.name} solutions.`;

  return (
    <div
      ref={cardRef}
      role="tab"
      aria-selected={isActive}
      aria-label={`PPAB Division ${item.index}: ${item.name}`}
      tabIndex={0}
      onClick={() => onSelect(index)}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onHoverLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(index);
        }
      }}
      className={cn(
        'group relative isolate h-full overflow-hidden rounded-3xl border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400',
        isActive
          ? 'cursor-default border-white/20 shadow-2xl z-20'
          : 'cursor-pointer border-white/10 hover:border-white/30 hover:shadow-xl z-10'
      )}
      style={{
        flex: isActive ? '3.5 1 0%' : '1 1 0%',
        minWidth: '96px',
        borderColor: isActive ? `${item.accent}65` : undefined,
        boxShadow: isActive
          ? `0 25px 60px -12px rgba(0,0,0,0.75), 0 0 50px -15px ${item.accent}40`
          : '0 10px 30px -5px rgba(0,0,0,0.5)',
        backgroundColor: '#061226',
        transition:
          'flex 0.65s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease-out, box-shadow 0.5s ease-out',
      }}
    >
      {/* Inner Tilt & Content Shell */}
      <div
        className="relative h-full w-full overflow-hidden"
        style={
          isActive
            ? {
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
              }
            : undefined
        }
      >
        {/* 1. Shared Background Environmental Image */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <Image
          src={imageSrc}
          alt={`Illustrative image for ${item.name}`}
          fill
          priority={index < 2}
          sizes="(min-width: 1024px) 60vw, 220px"
          className={cn(
            'object-cover object-center filter transition-all duration-700 ease-out',
            isActive
              ? 'brightness-[0.65] contrast-[1.12] opacity-100 scale-105'
              : 'brightness-[0.3] contrast-[1.15] opacity-40 group-hover:opacity-75 group-hover:scale-105 group-hover:brightness-[0.55]'
          )}
        />
        {/* Soft Multi-Layer Gradients for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020b1d] via-[#020b1d]/85 to-[#020b1d]/50" />
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-[#020b1d] via-[#020b1d]/75 to-transparent transition-opacity duration-700 ease-out',
            isActive ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>

      {/* 2. Cursor Sheen & Ambient Rim Lighting when active */}
      {isActive && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 transition-opacity duration-300 group-hover:opacity-70"
          style={{
            background: `radial-gradient(circle 420px at ${tilt.lightX}% ${tilt.lightY}%, ${item.accent}35, transparent 70%)`,
          }}
        />
      )}

      {/* 3. Top Glowing Accent Line */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-0 transition-all duration-500 pointer-events-none',
          isActive ? 'h-1.5' : 'h-1 group-hover:h-1.5'
        )}
        style={{
          backgroundColor: item.accent,
          boxShadow: `0 0 16px ${item.accent}`,
        }}
      />

      {/* 4. COLLAPSED VIEW: Visible only when card is collapsed */}
      <div
        className={cn(
          'absolute inset-0 p-3.5 sm:p-4 flex flex-col items-center justify-between text-center z-10 transition-all duration-300 ease-out',
          isActive
            ? 'opacity-0 scale-95 pointer-events-none'
            : 'opacity-100 scale-100 pointer-events-auto'
        )}
      >
        {/* Top: Index & Glowing Icon */}
        <div className="flex flex-col items-center gap-2.5 z-10 w-full pt-1">
          <span
            className="font-mono text-xs font-bold text-white/70 group-hover:text-white transition-colors px-2.5 py-0.5 rounded-full border border-white/10 group-hover:border-white/30 backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            {item.index}
          </span>

          <div
            className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-all duration-300 shadow-md backdrop-blur-sm group-hover:scale-110"
            style={{
              borderColor: `${item.accent}60`,
              color: item.accent,
              boxShadow: `0 0 14px ${item.accent}25`,
            }}
          >
            <Icon name={item.icon} size={18} />
          </div>
        </div>

        {/* Center: Title & Stat */}
        <div className="my-auto py-3 z-10 flex flex-col items-center justify-center w-full px-1">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/45 group-hover:text-white/70 transition-colors line-clamp-1">
            {item.category || 'Division'}
          </span>
          <h3 className="font-heading text-base font-extrabold tracking-wide text-white/90 group-hover:text-white transition-colors uppercase mt-0.5">
            {item.short}
          </h3>

          {item.stat?.value && (
            <div className="mt-2.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm group-hover:border-white/20 transition-all">
              <div className="font-mono text-[11px] font-bold" style={{ color: item.accent }}>
                {item.stat.value}
              </div>
              <div className="font-mono text-[8.5px] uppercase tracking-wider text-white/50 leading-none mt-0.5">
                {item.stat.label}
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Accent Dot & Expand Prompt */}
        <div className="flex flex-col items-center gap-1.5 z-10 w-full pb-1">
          <span
            className="size-1.5 rounded-full transition-all duration-300 group-hover:scale-125"
            style={{
              backgroundColor: item.accent,
              boxShadow: `0 0 8px ${item.accent}`,
            }}
          />
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/40 group-hover:text-white/90 transition-colors inline-flex items-center gap-1">
            <span>EXPAND</span>
            <span className="transition-transform group-hover:translate-x-0.5">&gt;</span>
          </span>
        </div>
      </div>

      {/* 5. EXPANDED VIEW: Rich division information, capabilities and CTAs */}
      <div
        className={cn(
          'relative flex flex-col justify-between h-full p-4 sm:p-5 z-20 w-full min-w-[340px] xl:min-w-[380px]',
          'transition-all ease-out',
          isActive
            ? 'opacity-100 translate-y-0 duration-400 delay-150 pointer-events-auto'
            : 'opacity-0 translate-y-2 duration-150 delay-0 pointer-events-none'
        )}
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

          {/* Key Value Deliverables Grid */}
          {item.highlights && item.highlights.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {item.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="group/item flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 backdrop-blur-md transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <CheckCircle2
                    className="size-3.5 shrink-0 transition-transform group-hover/item:scale-110"
                    style={{ color: item.accent }}
                  />
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
    </div>
  );
};
