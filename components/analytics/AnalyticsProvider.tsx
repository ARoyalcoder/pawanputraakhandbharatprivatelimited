'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics/tracker';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname && pathname !== lastPath.current) {
      lastPath.current = pathname;
      trackEvent('page_view', { path: pathname });

      if (pathname.startsWith('/solutions/')) {
        const division = pathname.replace('/solutions/', '');
        trackEvent('solution_view', { division, path: pathname });
      } else if (pathname.startsWith('/industries/')) {
        const industry = pathname.replace('/industries/', '');
        trackEvent('industry_view', { category: industry, path: pathname });
      } else if (pathname.startsWith('/projects/')) {
        const project = pathname.replace('/projects/', '');
        trackEvent('project_view', { slug: project, path: pathname });
      } else if (pathname.startsWith('/blog/')) {
        const blog = pathname.replace('/blog/', '');
        trackEvent('blog_view', { slug: blog, path: pathname });
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
