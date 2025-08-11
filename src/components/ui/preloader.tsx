
"use client";

import { motion } from 'framer-motion';

const preloaderVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { 
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" }
  },
};

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      loop: Infinity,
      ease: "linear",
      duration: 1,
    },
  },
};

export function Preloader() {
  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
      variants={preloaderVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
       <motion.div
            className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full"
            variants={spinnerVariants}
            animate="animate"
        />
    </motion.div>
  );
}
