'use client';

import { motion } from 'framer-motion';

type TitleRevealProps = {
  /** Σπάσε τον τίτλο σε γραμμές όπως θέλεις να εμφανιστούν */
  lines: string[];
  /** Καθυστέρηση έναρξης σε δευτερόλεπτα (προαιρετικό) */
  delay?: number;
  /** Stagger ανά γραμμή σε δευτερόλεπτα (προαιρετικό) */
  lineStagger?: number;
  /** Κοινές κλάσεις για όλο τον τίτλο (π.χ. μέγεθος γραμματοσειράς) */
  className?: string;
};

export default function TitleReveal({
  lines,
  delay = 0,
  lineStagger = 0.12,
  className = '',
}: TitleRevealProps) {
  return (
    <motion.div
      aria-label={lines.join(' ')}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: lineStagger,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {lines.map((text, i) => (
        <div
          key={i}
          className="overflow-hidden leading-[0.95]" /* μάσκα ανά γραμμή */
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: '110%', skewY: 6, opacity: 0 },
              visible: {
                y: '0%',
                skewY: 0,
                opacity: 1,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {text}
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
}
