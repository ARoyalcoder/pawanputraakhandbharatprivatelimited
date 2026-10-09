'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Route-level smooth page entrance transition.
 * Gently lifts and fades in content on navigation, creating a seamless, native-app feel.
 *
 * The first render skips the hidden starting state: it is what the server sends, and content
 * that starts at opacity 0 stays invisible until JavaScript has loaded and hydrated.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return (
    <motion.div
      key={pathname}
      // eslint-disable-next-line react-hooks/refs -- read once per mount to tell the server render from a navigation
      initial={firstRender.current ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
