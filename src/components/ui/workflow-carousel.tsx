
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkflowStep } from '@/lib/data';
import { cn } from '@/lib/utils';

interface WorkflowCarouselProps {
  steps: WorkflowStep[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export function WorkflowCarousel({ steps }: WorkflowCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([(page + newDirection + steps.length) % steps.length, newDirection]);
  };

  const stepIndex = page;
  const currentStep = steps[stepIndex];

  return (
    <>
        {/* Desktop Carousel */}
        <div className='hidden md:block relative overflow-hidden'>
            <div className="flex items-center justify-center mb-12">
                <div className="flex-grow border-t border-border"></div>
                <div className="flex items-center gap-4 mx-6">
                    {steps.map((_, i) => (
                        <button key={i} onClick={() => setPage([i, i > stepIndex ? 1 : -1])} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <span className={cn(
                                "block pb-2 border-b-2",
                                i === stepIndex ? "border-primary text-primary" : "border-transparent"
                            )}>
                               0{i+1}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="flex-grow border-t border-border"></div>
            </div>

            <div className="relative h-[25rem]">
                <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="absolute w-full h-full"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
                        <div className="relative w-full h-full">
                            <Image
                                src={currentStep.image}
                                alt={currentStep.title}
                                fill
                                className="object-cover rounded-lg shadow-xl"
                                sizes="50vw"
                                data-ai-hint="teamwork collaboration"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-4xl font-headline uppercase mb-4">{currentStep.title}</h3>
                            <p className="text-muted-foreground leading-relaxed mb-8 text-body">{currentStep.description}</p>
                            <div className="flex items-center space-x-2">
                                <Button
                                variant="outline"
                                size="icon"
                                onClick={() => paginate(-1)}
                                disabled={steps.length <= 1}
                                >
                                <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                variant="outline"
                                size="icon"
                                onClick={() => paginate(1)}
                                disabled={steps.length <= 1}
                                >
                                <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
                </AnimatePresence>
            </div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative overflow-hidden w-full">
            <div className="relative h-[480px]">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className="absolute w-full h-full"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x);
                            if (swipe > 50) {
                                paginate(offset.x > 0 ? -1 : 1);
                            }
                        }}
                    >
                        <div className="flex flex-col h-full bg-card border rounded-lg overflow-hidden shadow-lg">
                             <div className="relative w-full h-1/2">
                                <Image
                                    src={currentStep.image}
                                    alt={currentStep.title}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                />
                             </div>
                             <div className="flex flex-col justify-center items-center text-center p-6 flex-grow">
                                <h3 className="text-2xl font-headline mb-2">{currentStep.title}</h3>
                                <p className="text-muted-foreground text-sm text-body">{currentStep.description}</p>
                             </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
             <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-2 z-10">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(-1)}
                    className="bg-white/50"
                    >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(1)}
                     className="bg-white/50"
                    >
                    <ChevronRight className="h-4 w-4" />
                </Button>
             </div>
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
                {steps.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage([i, i > stepIndex ? 1 : -1])}
                        className={cn("w-2 h-2 rounded-full transition-colors", i === stepIndex ? "bg-primary" : "bg-muted-foreground/50")}
                    />
                ))}
            </div>
        </div>
    </>
  );
}
