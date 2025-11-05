'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

type PerType = 'word' | 'char' | 'line';

type TextScrubProps = {
  children: string;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /**
   * MotionValue από 0 έως 1 που έρχεται από useScroll/useSpring
   */
  progress: MotionValue<number>;
  /**
   * πόσο “πλάτος” (σε progress units) χρειάζεται κάθε κομμάτι για να αποκαλυφθεί
   * π.χ. 0.08 = πιο σφιχτό reveal, 0.15 = πιο άπλωμα
   */
  window?: number;
  segmentWrapperClassName?: string;
};

const SplitText: React.FC<{
  text: string;
  per: PerType;
}> = ({ text, per }) => {
  if (per === 'line') {
    return <>{text.split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}</>;
  }
  if (per === 'word') {
    return <>{text.split(/(\s+)/).map((w, i) => <span key={i} className="inline-block whitespace-pre">{w}</span>)}</>;
  }
  // char
  return (
    <>
      {text.split('').map((c, i) => (
        <span key={i} className="inline-block whitespace-pre">{c}</span>
      ))}
    </>
  );
};

export function TextScrub({
  children,
  per = 'word',
  as = 'h1',
  className,
  progress,
  window: win = 0.12,
  segmentWrapperClassName,
}: TextScrubProps) {
  // Φτιάχνουμε segments για να ξέρουμε πόσα βήματα έχουμε
  const segments =
    per === 'line'
      ? children.split('\n')
      : per === 'word'
      ? children.split(/(\s+)/)
      : children.split('');

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag className={cn('whitespace-pre-wrap', className)}>
      {segments.map((segment, i) => {
        // normalized "στόχος" για αυτό το segment (0..1)
        const t = segments.length <= 1 ? 0 : i / (segments.length - 1);
        // ένα “παράθυρο” γύρω από t στο οποίο περνάμε από 0 → 1
        const start = t - win;
        const end = t + win * 0.6;

        const opacity = useTransform(progress, [start, end], [0, 1], { clamp: true });
        const y = useTransform(progress, [start, end], [20, 0], { clamp: true });
        const blur = useTransform(progress, [start, end], [8, 0], { clamp: true });

        const wrapperClass =
          per === 'line' ? 'block' : 'inline-block whitespace-pre';

        return (
          <motion.span
            key={`${per}-${i}-${segment}`}
            className={cn(wrapperClass, segmentWrapperClassName)}
            style={{
              opacity,
              y,
              filter: blur.to((b) => `blur(${b}px)`),
            }}
          >
            {/* Για char mode, κρατάμε κάθε char ξεχωριστό για καλύτερο kerning */}
            {per === 'char' ? (
              <span className="inline-block whitespace-pre">{segment}</span>
            ) : per === 'word' ? (
              <span className="inline-block whitespace-pre">{segment}</span>
            ) : (
              <span className="block">{segment}</span>
            )}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
