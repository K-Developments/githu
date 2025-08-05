
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkflowStep } from '@/lib/data';
import { Separator } from './separator';
import { cn } from '@/lib/utils';
import { Card } from './card';

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
      {/* Desktop Vertical Timeline */}
      <div className="hidden md:block space-y-16">
        {steps.map((step, index) => (
          <div key={step.id} className={cn("flex items-center gap-8", index % 2 !== 0 && "flex-row-reverse")}>
            {/* Content */}
            <div className="w-1/3">
              <Card className="p-6">
                <h3 className="text-2xl font-headline mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
            </div>

            {/* Timeline Connector */}
            <div className="flex flex-col items-center self-stretch">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <div className="flex-grow w-px bg-border"></div>
            </div>

            {/* Image */}
            <div className="w-1/3">
              <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  data-ai-hint={step.imageHint || ''}
                />
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Mobile Carousel */}
      <div className="md:hidden">
        <div className="relative overflow-hidden h-[34rem]">
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
                className="absolute w-full h-full flex flex-col items-center justify-start gap-4"
                >
                    <div className="relative aspect-[4/3] w-full max-w-sm rounded-md overflow-hidden shadow-lg">
                        <Image 
                            src={currentStep.image}
                            alt={currentStep.title}
                            fill
                            className="object-cover"
                            data-ai-hint={currentStep.imageHint || ''}
                        />
                    </div>
                    <div className="text-center px-4">
                        <h3 className="text-3xl font-headline uppercase mb-2">{currentStep.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">{currentStep.description}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-4">
            <Button variant="outline" size="icon" onClick={() => paginate(-1)} disabled={steps.length <= 1}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center font-semibold">
              {stepIndex + 1} / {steps.length}
            </div>
            <Button variant="outline" size="icon" onClick={() => paginate(1)} disabled={steps.length <= 1}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </>
  );
}
