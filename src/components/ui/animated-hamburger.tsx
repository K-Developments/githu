
"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface AnimatedHamburgerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  color?: string;
  width?: number;
  height?: number;
}

const iconVariants = {
  hidden: { opacity: 0, rotate: -45, scale: 0.8 },
  visible: { opacity: 1, rotate: 0, scale: 1 },
};

export const AnimatedHamburgerButton = React.forwardRef<HTMLButtonElement, AnimatedHamburgerButtonProps>(({
  isOpen,
  color = "#333",
  width = 24,
  height = 24,
  ...props
}, ref) => {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <button ref={ref} className="relative" style={{ width, height }} {...props}>
            <div className="absolute inset-0 flex items-center justify-center">
                <Menu size={width} color={color} />
            </div>
        </button>
    );
  }

  return (
    <button ref={ref} className="relative" style={{ width, height }} {...props}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={iconVariants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Menu size={width} color={color} />
          </motion.div>
        ) : (
          <motion.div
            key="close"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={iconVariants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <X size={width} color={color} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
});

AnimatedHamburgerButton.displayName = "AnimatedHamburgerButton";
