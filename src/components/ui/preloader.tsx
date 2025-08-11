
"use client";

import { motion } from 'framer-motion';

const containerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const dotVariants = {
  initial: {
    y: '0%',
  },
  animate: {
    y: '100%',
  },
};

const dotTransition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: 'reverse' as const,
  ease: 'easeInOut',
};


export function Preloader() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background pointer-events-none">
       <motion.div
            className="flex gap-2"
            variants={containerVariants}
            initial="initial"
            animate="animate"
        >
            <motion.span
                className="block w-3 h-3 bg-foreground rounded-full"
                variants={dotVariants}
                transition={dotTransition}
            />
            <motion.span
                className="block w-3 h-3 bg-foreground rounded-full"
                variants={dotVariants}
                transition={{...dotTransition, delay: 0.2}}
            />
            <motion.span
                className="block w-3 h-3 bg-foreground rounded-full"
                variants={dotVariants}
                transition={{...dotTransition, delay: 0.4}}
            />
        </motion.div>
    </div>
  );
}
