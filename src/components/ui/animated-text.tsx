
"use client";

import { motion, useScroll, useTransform, MotionValue, EasingFunction } from 'framer-motion';
import { useRef, useMemo, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ScrollOffset = [string, string] | string[];

interface AnimatedTextProps {
  text: string;
  className?: string;
  containerClassName?: string;
  animationType?: 'opacity' | 'slideUp' | 'scale' | 'blur' | 'color';
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
    offset: scrollOffset as any,
  });

  const words = useMemo(() => {
    return text.split(' ').filter(word => word.length > 0);
  }, [text]);

  if (animationType === 'color') {
    return (
      <p ref={container} className={className}>
        {words.map((word, i) => (
          <WordColor key={`${word}-${i}`} progress={scrollYProgress} words={words} wordIndex={i}>
            {word}
          </WordColor>
        ))}
      </p>
    );
  }

  const getAnimationRange = useCallback((index: number, total: number) => {
    const totalDuration = duration + (staggerDelay * total);
    const baseStart = (index * staggerDelay) / totalDuration;
    const baseEnd = Math.min(baseStart + (duration / totalDuration), 1);
    
    return [baseStart * 0.7, Math.min(baseEnd * 1.3, 1)] as [number, number];
  }, [staggerDelay, duration]);

  return (
    <p ref={container} className={cn(className, containerClassName)}>
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

// For color animation
function WordColor({ children, progress, words, wordIndex }: { children: string, progress: MotionValue<number>, words: string[], wordIndex: number }) {
  const totalChars = words.join(" ").length;
  const charsBefore = words.slice(0, wordIndex).join(" ").length + wordIndex; // + wordIndex for spaces
  
  return (
    <span className="relative mr-3 mt-3 inline-block">
      {children.split('').map((char, i) => {
        const charIndex = charsBefore + i;
        const start = charIndex / totalChars;
        const end = (charIndex + 1) / totalChars;
        const opacity = useTransform(progress, [start, end], [0.2, 1]);
        return (
          <motion.span key={i} style={{ opacity }} className="relative inline-block text-foreground">
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}


// For other animations
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
