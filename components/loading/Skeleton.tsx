'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circle' | 'button';
}

/**
 * Premium PPAB Branded Skeleton Primitive.
 * Uses navy-900 / navy-800 backdrop with subtle warm gold/amber shimmer highlight.
 * Never causes layout shifts by preserving exact dimensions.
 */
export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-[#06152f]/70 border border-white/5',
        variant === 'circle' && 'rounded-full',
        variant === 'card' && 'rounded-2xl',
        variant === 'button' && 'rounded-xl h-10',
        variant === 'text' && 'rounded-md h-4',
        variant === 'default' && 'rounded-lg',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gold-400/10 before:to-transparent',
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for Solution Cards (Accordion / Showcase)
 */
export function SolutionCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-3xl border border-white/10 bg-[#040e22] p-6 sm:p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="size-8 rounded-full" variant="circle" />
        </div>
        <Skeleton className="h-8 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>

      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Industry Panel
 */
export function IndustryPanelSkeleton() {
  return (
    <div className="grid min-h-[22rem] lg:min-h-[24rem] lg:grid-cols-12 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <div className="lg:col-span-5 aspect-[16/10] lg:aspect-auto min-h-[16rem] lg:min-h-full bg-navy-950 p-4">
        <Skeleton className="size-full rounded-2xl" />
      </div>
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 lg:p-9 space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-32 rounded" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-36 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-line">
          <Skeleton className="h-10 w-44 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Project Cards
 */
export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#06152f]/60 shadow-lg">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <Skeleton className="h-6 w-4/5 rounded" />
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Blog Articles
 */
export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#040e22] shadow-sm">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-3.5 w-5/6 rounded" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Testimonials
 */
export function TestimonialSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#06152f]/50 p-6 space-y-4">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="size-4 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-4/5 rounded" />
      <div className="flex items-center gap-3 pt-3">
        <Skeleton className="size-10 rounded-full" variant="circle" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for FAQ Items
 */
export function FaqSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-[#06152f]/40 p-4 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-3.5 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for Contact / Lead Forms
 */
export function ContactFormSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#040e22] p-6 sm:p-8 space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
      <Skeleton className="h-12 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
