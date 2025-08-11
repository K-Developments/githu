"use client";

import { motion, useScroll, useTransform, MotionValue, EasingFunction } from 'framer-motion';
import { useRef, useMemo, useCallback } from 'react';

// Updated type to match Framer Motion's expected offset type
type ScrollOffset = [string, string] | string[];

interface AnimatedTextProps {
  text: string;
  className?: string;
  containerClassName?: string;
  animationType?: 'opacity' | 'slideUp' | 'scale' | 'blur';
  staggerDelay?: number;
  scrollOffset?: ScrollOffset;
  duration?: number;
  easing?: EasingFunction | EasingFunction[];
}

export function AnimatedText({ 
  text,
  className = "w-[70%] md:max-w-4xl mx-auto text-center text-2xl md:text-3xl leading-relaxed text-muted-foreground flex flex-wrap justify-center",
  containerClassName,
  animationType = 'opacity',
  staggerDelay = 0.05,
  scrollOffset = ['start 0.8', 'end 0.2'],
  duration = 2,
  easing = (t) => t
}: AnimatedTextProps) {
  const container = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: scrollOffset as any, // Type assertion to resolve the mismatch
  });

  const words = useMemo(() => {
    return text.split(' ').filter(word => word.length > 0);
  }, [text]);

  const getAnimationRange = useCallback((index: number, total: number) => {
    const totalDuration = duration + (staggerDelay * total);
    const baseStart = (index * staggerDelay) / totalDuration;
    const baseEnd = Math.min(baseStart + (duration / totalDuration), 1);
    
    // Make the animation more gradual and smooth
    return [baseStart * 0.7, Math.min(baseEnd * 1.3, 1)] as [number, number];
  }, [staggerDelay, duration]);

  return (
    <p
      ref={container}
      className={`${className} ${containerClassName || ''}`}
    >
      {words.map((word, i) => {
        const range = getAnimationRange(i, words.length);
        return (
          <Word 
            key={`${word}-${i}`} 
            progress={scrollYProgress} 
            range={range}
            animationType={animationType}
            easing={easing}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  animationType: 'opacity' | 'slideUp' | 'scale' | 'blur';
  easing: EasingFunction | EasingFunction[];
}

function Word({ children, progress, range, animationType, easing }: WordProps) {
  const amount = range[1] - range[0];
  const step = amount / children.length;
  
  return (
    <span className="relative mr-3 mt-3 inline-block">
      {children.split('').map((char, i) => {
        const start = range[0] + (i * step);
        const end = range[0] + ((i + 1) * step);
        return (
          <Character 
            key={`${char}-${i}`} 
            progress={progress} 
            range={[start, end]}
            animationType={animationType}
            easing={easing}
          >
            {char}
          </Character>
        );
      })}
    </span>
  );
}

interface CharacterProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  animationType: 'opacity' | 'slideUp' | 'scale' | 'blur';
  easing: EasingFunction | EasingFunction[];
}

function Character({ children, progress, range, animationType, easing }: CharacterProps) {
  const smoothRange = [0, 1];
  const baseOpacity = useTransform(progress, range, smoothRange, { ease: easing });
  
  const slideY = useTransform(progress, range, [30, 0], { ease: easing });
  const scale = useTransform(progress, range, [0.7, 1], { ease: easing });
  const blur = useTransform(progress, range, [8, 0], { ease: easing });
  
  const getAnimationStyles = () => {
    switch (animationType) {
      case 'slideUp':
        return {
          opacity: baseOpacity,
          y: slideY,
        };
      case 'scale':
        return {
          opacity: baseOpacity,
          scale: scale,
        };
      case 'blur':
        return {
          opacity: baseOpacity,
          filter: useTransform(blur, (value) => `blur(${value}px)`),
        };
      default:
        return {
          opacity: baseOpacity,
        };
    }
  };

  return (
    <span className="relative inline-block">
      <span className="absolute opacity-20 pointer-events-none" aria-hidden="true">
        {children}
      </span>
      <motion.span 
        style={getAnimationStyles()}
        className="relative inline-block"
      >
        {children === ' ' ? '\u00A0' : children}
      </motion.span>
    </span>
  );
}

// Utility component for different presets
export function AnimatedTextPresets() {
  const sampleText = "This is an example of beautiful animated text that reveals itself as you scroll through the page.";
  
  return (
    <div className="space-y-16 py-16">
      <div>
        <h3 className="text-xl font-semibold mb-8 text-center">Opacity Animation</h3>
        <AnimatedText text={sampleText} animationType="opacity" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-8 text-center">Slide Up Animation</h3>
        <AnimatedText 
          text={sampleText} 
          animationType="slideUp" 
          staggerDelay={0.08}
          duration={2.5}
          className="w-[70%] md:max-w-4xl mx-auto text-center text-2xl md:text-3xl leading-relaxed text-blue-600 flex flex-wrap justify-center"
        />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-8 text-center">Scale Animation</h3>
        <AnimatedText 
          text={sampleText} 
          animationType="scale"
          staggerDelay={0.06}
          duration={3}
          className="w-[70%] md:max-w-4xl mx-auto text-center text-2xl md:text-3xl leading-relaxed text-green-600 flex flex-wrap justify-center"
        />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-8 text-center">Blur Animation</h3>
        <AnimatedText 
          text={sampleText} 
          animationType="blur"
          staggerDelay={0.04}
          duration={2.8}
          className="w-[70%] md:max-w-4xl mx-auto text-center text-2xl md:text-3xl leading-relaxed text-purple-600 flex flex-wrap justify-center"
        />
      </div>
    </div>
  );
}