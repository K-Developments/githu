
"use client";

import { motion } from 'framer-motion';

const containerVariants = {
  initial: { opacity: 1 },
  exit: { 
    opacity: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeInOut" 
    } 
  },
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
        duration: 0.8, 
        ease: "easeOut",
        repeat: Infinity,
        repeatType: 'reverse'
    } 
  },
};

export function Preloader() {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
    >
      <motion.div
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        <a href="#" className="logo" style={{ fontSize: '1.8rem', color: '#222' }}>
          ISLAND<span>HOPES</span>
        </a>
      </motion.div>
    </motion.div>
  );
}

    