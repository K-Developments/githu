"use client";
import { motion } from 'framer-motion';

const preloaderVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { 
      duration: 0.6, 
      ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smoother fade
    }
  },
};

const containerVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
};

// Multi-ring spinner animation
const outerRingVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      ease: "linear",
      duration: 2,
    },
  },
};

const innerRingVariants = {
  animate: {
    rotate: -360,
    transition: {
      repeat: Infinity,
      ease: "linear",
      duration: 1.5,
    },
  },
};

// Pulsing dot animation
const dotVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

// Optional: Add some floating particles
const particleVariants = {
  animate: (i: number) => ({
    y: [-10, -20, -10],
    x: [0, Math.sin(i) * 10, 0],
    opacity: [0.3, 0.7, 0.3],
    transition: {
      repeat: Infinity,
      duration: 2 + i * 0.5,
      ease: "easeInOut",
      delay: i * 0.2,
    },
  }),
};


export function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-sm"
      variants={preloaderVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="relative flex items-center justify-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Outer ring */}
        <motion.div
          className="absolute w-16 h-16 border-2 border-foreground/20 border-t-foreground rounded-full"
          variants={outerRingVariants}
          animate="animate"
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute w-10 h-10 border-2 border-foreground/30 border-b-foreground rounded-full"
          variants={innerRingVariants}
          animate="animate"
        />
        
        {/* Center pulsing dot */}
        <motion.div
          className="w-3 h-3 bg-foreground rounded-full"
          variants={dotVariants}
          animate="animate"
        />
        
        {/* Optional: Floating particles around the spinner */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground/40 rounded-full"
            style={{
              left: `${50 + Math.cos((i * Math.PI) / 2) * 40}%`,
              top: `${50 + Math.sin((i * Math.PI) / 2) * 40}%`,
            }}
            custom={i}
            variants={particleVariants}
            animate="animate"
          />
        ))}
        

       
      </motion.div>
    </motion.div>
  );
}