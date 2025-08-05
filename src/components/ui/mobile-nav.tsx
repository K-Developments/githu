
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const navLinks = [
  { title: "Destinations", href: "#" },
  { title: "Packages", href: "/packages" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "#" },
  { title: "Plan Trip", href: "#" },
];

const menuVariants = {
  initial: {
    scaleY: 0,
  },
  animate: {
    scaleY: 1,
    transition: {
      duration: 0.4,
      ease: [0.12, 0, 0.39, 0],
    },
  },
  exit: {
    scaleY: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const linkContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.09,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.09,
      staggerDirection: 1,
    },
  },
};

const linkVariants = {
    initial: {
        y: "30vh",
        transition: {
            duration: 0.5,
            ease: [0.37, 0, 0.63, 1]
        }
    },
    open: {
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0, 0.55, 0.45, 1]
        }
    }
}


export const MobileNav = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 bg-[#f8f5f2] text-primary-foreground origin-top z-[999]"
        >
            <div className="flex h-full flex-col">
                <div className="flex justify-between items-center p-4">
                     <Link href="/" className="logo" style={{ color: '#222', fontFamily: "'Marcellus', serif" }}>ISLAND<span style={{color: 'hsl(188 55% 45%)'}}>HOPES</span></Link>
                </div>
                <motion.div
                    variants={linkContainerVariants}
                    initial="initial"
                    animate="open"
                    exit="initial"
                    className="flex flex-col items-center justify-center h-full gap-8"
                >
                {navLinks.map((link, index) => (
                    <div className="overflow-hidden" key={index}>
                        <motion.div variants={linkVariants}>
                            <Link href={link.href} className="text-4xl font-semibold text-gray-800 hover:text-cyan-600 transition-colors" onClick={() => setIsOpen(false)}>
                                {link.title}
                            </Link>
                        </motion.div>
                    </div>
                ))}
                </motion.div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
