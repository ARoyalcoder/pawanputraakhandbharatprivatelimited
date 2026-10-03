'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Route-level smooth page entrance transition.
 * Gently lifts and fades in content on navigation, creating a seamless, native-app feel.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
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
