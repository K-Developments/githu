
"use client";
import { motion, AnimatePresence } from 'framer-motion';
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

const TwoLineMenuIcon = ({ width, height, color }: { width: number, height: number, color: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <motion.line 
            x1="3" y1="8" x2="21" y2="8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        />
        <motion.line 
            x1="3" y1="16" x2="21" y2="16"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        />
    </svg>
);

const TwoLineXIcon = ({ width, height, color }: { width: number, height: number, color: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <motion.line 
            x1="3" y1="8" x2="21" y2="16"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        />
        <motion.line 
            x1="3" y1="16" x2="21" y2="8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        />
    </svg>
);


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
                 <TwoLineMenuIcon width={width} height={height} color={color} />
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
            <TwoLineMenuIcon width={width} height={height} color={color} />
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
            <TwoLineXIcon width={width} height={height} color={color} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
});

AnimatedHamburgerButton.displayName = "AnimatedHamburgerButton";
