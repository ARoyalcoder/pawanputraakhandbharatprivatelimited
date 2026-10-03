import React from 'react';
import { Skeleton } from '@/components/loading/Skeleton';

export default function AboutRouteLoading() {
  return (
    <div className="min-h-screen bg-[#020b1d] pt-32 pb-24 text-white">
      <div className="container-ppab space-y-12">
        <div className="space-y-4 max-w-3xl">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-4/5 rounded-xl" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
