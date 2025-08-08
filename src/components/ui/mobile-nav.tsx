
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Destinations", href: "/destinations" },
  { title: "Packages", href: "/packages" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "#" },
];

const sidebarVariants = {
  initial: { x: "100%" },
  animate: {
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.4,
      ease: [0.39, 0, 0.12, 1],
    },
  },
};

const linkContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.07,
      staggerDirection: -1
    },
  },
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
      staggerDirection: 1,
    },
  },
};

const linkVariants = {
    initial: {
        x: "100%",
        opacity: 0,
    },
    open: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeInOut"
        }
    }
}

export const MobileNav = ({ isOpen, setIsOpen, logoUrl }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; logoUrl?: string; }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-black/60 z-[99]"
                onClick={() => setIsOpen(false)}
            />
            <motion.div
                key="sidebar"
                variants={sidebarVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-background text-foreground origin-right z-[100] shadow-2xl flex flex-col"
            >
                <div className="p-6 flex-shrink-0">
                    <Link href="/" className="logo" onClick={() => setIsOpen(false)}>
                        {logoUrl ? (
                            <div className="relative w-32 h-12">
                                <Image src={logoUrl} alt="Island Hopes Logo" fill style={{ objectFit: 'contain', objectPosition: 'left' }} />
                            </div>
                        ) : (
                            <span className="font-bold text-2xl tracking-widest">ISLAND<span className="text-primary">HOPES</span></span>
                        )}
                    </Link>
                </div>
                
                <Separator />
                
                <motion.div
                    variants={linkContainerVariants}
                    initial="initial"
                    animate="open"
                    exit="initial"
                    className="flex flex-col justify-center h-full gap-4 px-6"
                >
                {navLinks.map((link, index) => (
                    <div className="overflow-hidden" key={index}>
                        <motion.div variants={linkVariants}>
                            <Link 
                                href={link.href} 
                                className={cn(
                                    "text-3xl font-light text-muted-foreground hover:text-foreground transition-colors duration-300 block py-2",
                                    pathname === link.href && "text-foreground font-medium"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.title}
                            </Link>
                        </motion.div>
                    </div>
                ))}
                </motion.div>

                <div className="p-6 text-center text-xs text-muted-foreground flex-shrink-0">
                    <p>&copy; {new Date().getFullYear()} Island Hopes. All Rights Reserved.</p>
                </div>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
