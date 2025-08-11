
"use client";

import { motion } from 'framer-motion';

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background pointer-events-none">
       <motion.div
            className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full"
            variants={spinnerVariants}
            animate="animate"
        />
    </div>
  );
}
