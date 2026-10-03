import React from 'react';
import { Skeleton, IndustryPanelSkeleton } from '@/components/loading/Skeleton';

export default function IndustriesRouteLoading() {
  return (
    <div className="min-h-screen bg-[#020b1d] pt-32 pb-24 text-white">
      <div className="container-ppab space-y-12">
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-full rounded" />
        </div>

        <IndustryPanelSkeleton />
      </div>
    </div>
  );
}
