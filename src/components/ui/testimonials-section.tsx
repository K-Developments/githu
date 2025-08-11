
"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import type { Testimonial } from "@/lib/data";

export const TestimonialsSection = memo(function TestimonialsSection({ 
  testimonials, 
  backgroundImage 
}: { 
  testimonials: Testimonial[], 
  backgroundImage?: string 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const testimonialVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } },
  }), []);

  if (testimonials.length === 0) return null;
  
  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      className="homepage-testimonials-section py-28 relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 md:px-12 text-center relative">
        <Quote className="w-16 h-16 md:w-20 md:h-20 mb-6 mx-auto text-primary/30" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={testimonialVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[12rem]"
          >
            <p className="text-2xl md:text-3xl font-light leading-snug md:leading-tight mb-8 text-foreground text-body">
              "{currentTestimonial.text}"
            </p>
            <p className="text-lg font-semibold uppercase tracking-wider text-muted-foreground text-body">
              {currentTestimonial.author}, <span className="font-light normal-case opacity-80">{currentTestimonial.location}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      
        {testimonials.length > 1 && (
          <div className="mt-12 flex justify-center gap-3 z-20">
            <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full">
              <ArrowLeft />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full">
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
});
