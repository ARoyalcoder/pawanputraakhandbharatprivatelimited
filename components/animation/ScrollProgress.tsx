'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * Top reading progress bar and animated Back-to-Top button using Framer Motion.
 */
export function ScrollProgress() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowBackToTop(latest > 450);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top progress indicator bar */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-gold-500 via-amber-400 to-gold-300 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
        style={{ scaleX }}
      />

      {/* Floating Back-To-Top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-24 right-6 z-40 hidden sm:flex size-11 items-center justify-center rounded-full border border-gold-500/30 bg-navy-950/90 text-gold-300 shadow-xl backdrop-blur-md transition-colors hover:border-gold-500 hover:bg-navy-900 hover:text-gold-200"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
