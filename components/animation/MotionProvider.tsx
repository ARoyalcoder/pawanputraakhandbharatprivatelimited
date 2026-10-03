'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger, prefersReducedMotion, useGSAP } from '@/lib/animations/gsap';
import { initBatchReveals, initParallax, initSplitHeadings, revealNow, showAllStatic } from '@/lib/animations/scroll';

/**
 * Wires up declarative motion ([data-reveal], [data-parallax], [data-split]) for the
 * current route. Sections stay server components and simply opt in with attributes.
 */
export function MotionProvider() {
  const pathname = usePathname();
  const seen = useRef(new WeakSet<Element>());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    document.documentElement.classList.add('motion-ready');
  }, []);

  useGSAP(
    () => {
      // Never alter DOM or run SplitText before initial React hydration is complete
      if (!isHydrated) return;

      const root = document.getElementById('main-content') ?? document.body;
      seen.current = new WeakSet();

      if (prefersReducedMotion()) {
        showAllStatic(document);
        return;
      }

      initBatchReveals(document, seen.current);
      initParallax(root);
      const cleanupSplit = initSplitHeadings(root);

      // Content mounted after this pass (tab panels, lazy sections) is revealed directly
      // so it can never remain in its hidden initial state.
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            const targets = node.matches('[data-reveal]')
              ? [node, ...Array.from(node.querySelectorAll('[data-reveal]'))]
              : Array.from(node.querySelectorAll('[data-reveal]'));
            targets.forEach((el) => {
              if (seen.current.has(el)) return;
              seen.current.add(el);
              revealNow(el);
            });
          });
        }
      });
      observer.observe(root, { childList: true, subtree: true });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh, { once: true });

      return () => {
        observer.disconnect();
        window.removeEventListener('load', refresh);
        cleanupSplit?.();
      };
    },
    { dependencies: [pathname, isHydrated], revertOnUpdate: true }
  );

  return null;
}
