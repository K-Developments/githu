
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkflowStep } from '@/lib/data';

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
    setPage([page + newDirection, newDirection]);
  };

  const stepIndex = (page % steps.length + steps.length) % steps.length;
  const currentStep = steps[stepIndex];

  return (
    <div className="relative overflow-hidden">
      <div className="flex items-center justify-center mb-12">
        <div className="flex-grow border-t border-gray-300"></div>
        <div className="border border-gray-400 px-4 py-2 mx-4 font-bold text-lg">
          {stepIndex + 1}
        </div>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="relative h-[450px]">
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
            className="absolute w-full h-full flex flex-col justify-between"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end flex-grow">
               <h3 className="text-4xl font-headline uppercase">{currentStep.title}</h3>
               <div className="relative aspect-video h-full">
                  <Image
                    src={currentStep.image}
                    alt={currentStep.title}
                    fill
                    className="object-cover rounded-lg shadow-xl"
                    data-ai-hint={currentStep.imageHint || ''}
                  />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
                <p className="text-muted-foreground leading-relaxed">{currentStep.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
