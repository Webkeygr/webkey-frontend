// app/components/ui/text-scrub.tsx
'use client';

import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

type PerType = 'word' | 'char' | 'line';

type TextScrubProps = {
  children: string;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  progress: MotionValue<number>;
  window?: number;
  segmentWrapperClassName?: string;
};

export function TextScrub({
  children,
  per = 'word',
  as = 'h1',
  className = '',
  progress,
  window: win = 0.12,
  segmentWrapperClassName = '',
}: TextScrubProps) {
  const segments =
    per === 'line' ? children.split('\n') :
    per === 'word' ? children.split(/(\s+)/) :
    children.split('');

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag className={`whitespace-pre-wrap ${className}`}>
      {segments.map((segment, i) => {
        const t = segments.length <= 1 ? 0 : i / (segments.length - 1);
        const start = t - win;
        const end = t + win * 0.6;

        const opacity = useTransform(progress, [start, end], [0, 1], { clamp: true });
        const y = useTransform(progress, [start, end], [20, 0], { clamp: true });
        const blur = useTransform(progress, [start, end], [8, 0], { clamp: true });

        const wrapperClass = per === 'line' ? 'block' : 'inline-block whitespace-pre';

        return (
          <motion.span
            key={`${per}-${i}-${segment}`}
            className={`${wrapperClass} ${segmentWrapperClassName}`}
            style={{ opacity, y, filter: blur.to((b) => `blur(${b}px)`) }}
          >
            {per === 'line' ? (
              <span className="block">{segment}</span>
            ) : (
              <span className="inline-block whitespace-pre">{segment}</span>
            )}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
