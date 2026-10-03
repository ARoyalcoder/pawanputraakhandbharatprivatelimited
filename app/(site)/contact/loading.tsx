import React from 'react';
import { Skeleton, ContactFormSkeleton } from '@/components/loading/Skeleton';

export default function ContactRouteLoading() {
  return (
    <div className="min-h-screen bg-[#020b1d] pt-32 pb-24 text-white">
      <div className="container-ppab">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-10 sm:h-12 w-3/4 rounded-xl" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />

            <div className="space-y-4 pt-6">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactFormSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
