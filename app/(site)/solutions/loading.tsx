import React from 'react';
import { Skeleton, SolutionCardSkeleton } from '@/components/loading/Skeleton';

export default function SolutionsRouteLoading() {
  return (
    <div className="min-h-screen bg-[#020b1d] pt-32 pb-24 text-white">
      <div className="container-ppab space-y-12">
        {/* Header Skeleton */}
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-5 w-36 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>

        {/* 5-Division Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <SolutionCardSkeleton />
          <SolutionCardSkeleton />
          <SolutionCardSkeleton />
        </div>
      </div>
    </div>
  );
}
