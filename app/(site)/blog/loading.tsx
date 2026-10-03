import React from 'react';
import { Skeleton, BlogCardSkeleton } from '@/components/loading/Skeleton';

export default function BlogRouteLoading() {
  return (
    <div className="min-h-screen bg-[#020b1d] pt-32 pb-24 text-white">
      <div className="container-ppab space-y-10">
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-full rounded" />
        </div>

        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        {/* Blog Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </div>
    </div>
  );
}
