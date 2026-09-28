'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ThreeScene } from '@/components/3d/ThreeScene';
import { SceneLoader } from '@/components/3d/SceneLoader';
import { ConceptArt } from '@/components/media/ConceptArt';
import { gsap, ScrollTrigger, prefersReducedMotion, useGSAP } from '@/lib/animations/gsap';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

export interface HeroDivision {
  id: string;
  short: string;
  name: string;
  tagline: string;
  summary: string;
  href: string;
  accent: string;
}

const heroFallback = <ConceptArt variant="hero" className="mask-fade-radial opacity-80" />;

const HeroScene = dynamic(() => import('@/components/3d/scenes/HeroScene'), {
  ssr: false,
  loading: () => <SceneLoader>{heroFallback}</SceneLoader>,
});

const splineUrl = process.env.NEXT_PUBLIC_SPLINE_HERO_URL || undefined;

/**
 * Client shell for the homepage hero: the 3D visual, the division tabs that drive it,
 * and scroll-linked depth. The copy itself is server-rendered and passed in as children.
 */
export function HeroStage({ divisions, children }: { divisions: HeroDivision[]; children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(true);
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const baseId = useId();
  const paused = hovering || !inView;
  const current = divisions[active];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
      if (prefersReducedMotion()) return;
      gsap.to('[data-hero-copy]', {
        yPercent: -10,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: sectionRef }
  );

  const next = () => setActive((i) => (i + 1) % divisions.length);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = divisions.length - 1;
    const target =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (target === null) return;
    e.preventDefault();
    setActive(target);
    tabRefs.current[target]?.focus();
  };

  return (
    <section
      ref={sectionRef}
      data-theme="ppab-night"
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-950 text-white"
    >
      {/* Atmosphere */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(80%_60%_at_75%_40%,#12305c_0%,#06152f_45%,#020b1d_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint mask-fade-radial opacity-70" />

      {/* Copy */}
      <div className="container-ppab flex items-start pt-32 sm:pt-36 lg:flex-1 lg:items-center lg:pt-40 lg:pb-16">
        <div data-hero-copy className="w-full max-w-2xl lg:max-w-[40rem] xl:max-w-[44rem]">
          {children}
        </div>
      </div>

      {/* 3D visual — in flow on mobile, a right-hand stage on desktop */}
      <div className="pointer-events-none relative -z-10 -mt-4 h-[21rem] sm:h-[26rem] lg:absolute lg:inset-y-0 lg:right-[-4%] lg:mt-0 lg:h-auto lg:w-[62%]">
        <ThreeScene
          splineUrl={splineUrl}
          fallback={heroFallback}
          render={(ctx) => <HeroScene {...ctx} active={active} progressRef={progressRef} pointer={finePointer} />}
        />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-navy-950 to-transparent" />

      {/* Division tabs */}
      <div
        className="relative border-t border-white/10 bg-navy-950/60 backdrop-blur-md"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHovering(false)}
      >
        <div className="container-ppab grid gap-0 lg:grid-cols-[1fr_22rem]">
          <div role="tablist" aria-label="PPAB divisions" className="no-scrollbar flex overflow-x-auto lg:grid lg:grid-cols-5">
            {divisions.map((d, i) => {
              const selected = i === active;
              return (
                <button
                  key={d.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`${baseId}-tab-${d.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    'group relative min-w-[9.5rem] shrink-0 px-4 py-5 text-left transition-colors lg:min-w-0 lg:px-5',
                    selected ? 'text-white' : 'text-white/50 hover:text-white/85'
                  )}
                >
                  <span className="absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden="true">
                    {selected && (
                      <span
                        key={`${active}-${reduced}`}
                        className={cn('absolute inset-0 origin-left', reduced ? '' : 'animate-progress')}
                        style={{ backgroundColor: d.accent, animationPlayState: paused ? 'paused' : 'running', ['--progress-duration' as string]: '5.5s' }}
                        onAnimationEnd={() => !reduced && next()}
                      />
                    )}
                  </span>
                  <span className="block font-mono text-caption" style={selected ? { color: d.accent } : undefined}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-1.5 block text-[1.02rem] font-semibold tracking-tight">{d.short}</span>
                </button>
              );
            })}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${current.id}`}
            aria-live="polite"
            className="border-t border-white/10 py-5 lg:border-l lg:border-t-0 lg:pl-8"
          >
            <p className="font-serif text-[1.15rem] italic leading-snug" style={{ color: current.accent }}>
              {current.tagline}
            </p>
            <Link
              href={current.href}
              className="group mt-2 inline-flex items-center gap-1.5 text-small font-semibold text-white/85 hover:text-white"
            >
              Explore {current.name}
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
