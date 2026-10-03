'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface InteractiveTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees, default 6
  glareOpacity?: number; // max opacity of shine glare, default 0.15
  scaleOnHover?: number; // scale multiplier, default 1.02
}

/**
 * 3D Interactive Tilt Card with dynamic glare reflection using Framer Motion.
 */
export function InteractiveTiltCard({
  children,
  className = '',
  maxTilt = 6,
  glareOpacity = 0.15,
  scaleOnHover = 1.02,
}: InteractiveTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Tilt transformation
  const rotateX = useTransform(smoothMouseY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-maxTilt, maxTilt]);

  // Spotlight coordinates in percentages
  const glareX = useTransform(smoothMouseX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: scaleOnHover }}
        transition={{ duration: 0.2 }}
        className="relative h-full w-full"
      >
        {children}

        {/* Dynamic glare shine overlay */}
        {isHovered && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute -inset-full w-[300%] h-[300%] rounded-full pointer-events-none"
              style={{
                left: glareX,
                top: glareY,
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, rgba(255,255,255,${glareOpacity}) 0%, rgba(216,166,42,${glareOpacity * 0.7}) 30%, transparent 70%)`,
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
