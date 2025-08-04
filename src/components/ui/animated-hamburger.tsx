
"use client";
import { motion, Variants } from 'framer-motion';

interface AnimatedHamburgerButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  strokeWidth?: number;
  color?: string;
  width?: number;
  height?: number;
}

export const AnimatedHamburgerButton = ({
  isOpen,
  setIsOpen,
  strokeWidth = 2,
  color = "#333",
  width = 24,
  height = 24,
}: AnimatedHamburgerButtonProps) => {
  const variant = isOpen ? "opened" : "closed";

  const top: Variants = {
    closed: {
      rotate: 0,
      translateY: 0,
    },
    opened: {
      rotate: 45,
      translateY: 1.5,
    },
  };
  const center: Variants = {
    closed: {
      opacity: 1,
    },
    opened: {
      opacity: 0,
    },
  };
  const bottom: Variants = {
    closed: {
      rotate: 0,
      translateY: 0,
    },
    opened: {
      rotate: -45,
      translateY: -1.5,
    },
  };

  const lineProps = {
    stroke: color,
    strokeWidth: strokeWidth,
    vectorEffect: "non-scaling-stroke",
    initial: "closed",
    animate: variant,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  };
  const unitHeight = 3;
  const unitWidth = (unitHeight * (width)) / (height);

  return (
    <motion.svg
      viewBox={`0 0 ${unitWidth} ${unitHeight}`}
      overflow="visible"
      preserveAspectRatio="none"
      width={width}
      height={height}
      onClick={() => setIsOpen(!isOpen)}
    >
      <motion.line
        x1="0"
        x2={unitWidth}
        y1="0"
        y2="0"
        variants={top}
        {...lineProps}
      />
      <motion.line
        x1="0"
        x2={unitWidth}
        y1="1.5"
        y2="1.5"
        variants={center}
        {...lineProps}
      />
      <motion.line
        x1="0"
        x2={unitWidth}
        y1="3"
        y2="3"
        variants={bottom}
        {...lineProps}
      />
    </motion.svg>
  );
};
