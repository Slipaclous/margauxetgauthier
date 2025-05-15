'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const ScrollSection = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up'
}: ScrollSectionProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const getDirectionOffset = () => {
    switch (direction) {
      case 'left':
        return { x: -100, y: 0 };
      case 'right':
        return { x: 100, y: 0 };
      case 'up':
        return { x: 0, y: 50 };
      case 'down':
        return { x: 0, y: -50 };
      default:
        return { x: 0, y: 50 };
    }
  };

  const directionOffset = getDirectionOffset();
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.95, 1, 1, 0.95]
  );

  const x = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [directionOffset.x, 0, 0, directionOffset.x]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [directionOffset.y, 0, 0, directionOffset.y]
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [direction === 'left' ? -2 : direction === 'right' ? 2 : 0, 0, 0, direction === 'left' ? -2 : direction === 'right' ? 2 : 0]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        x,
        y,
        scale,
        rotate,
        transformOrigin: 'center center'
      }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollSection; 