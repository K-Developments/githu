
"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnimatedHamburgerButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  color?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

const iconVariants = {
  hidden: { opacity: 0, rotate: -45, scale: 0.8 },
  visible: { opacity: 1, rotate: 0, scale: 1 },
};

export const AnimatedHamburgerButton = ({
  isOpen,
  setIsOpen,
  color = "#333",
  width = 24,
  height = 24,
  onClick,
}: AnimatedHamburgerButtonProps) => {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onClick) {
        onClick();
    }
  };

  if (!isClient) {
    return (
        <button onClick={handleClick} className="relative" style={{ width, height }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <Menu size={width} color={color} />
            </div>
        </button>
    );
  }

  return (
    <button onClick={handleClick} className="relative" style={{ width, height }}>
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
};
