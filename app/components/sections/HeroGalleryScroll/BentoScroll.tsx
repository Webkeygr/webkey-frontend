"use client";

import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

const bentoGridVariants = cva(
  "relative grid gap-4 [&>*:first-child]:origin-top-right [&>*:nth-child(3)]:origin-bottom-right [&>*:nth-child(4)]:origin-top-right",
  {
    variants: {
      variant: {
        default: `
          grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr]
          [&>*:first-child]:col-span-8 md:[&>*:first-child]:col-span-6 [&>*:first-child]:row-span-3
          [&>*:nth-child(2)]:col-span-2 md:[&>*:nth-child(2)]:row-span-2 [&>*:nth-child(2)]:hidden md:[&>*:nth-child(2)]:block
          [&>*:nth-child(3)]:col-span-2 md:[&>*:nth-child(3)]:row-span-2 [&>*:nth-child(3)]:hidden md:[&>*:nth-child(3)]:block
          [&>*:nth-child(4)]:col-span-4 md:[&>*:nth-child(4)]:col-span-3
          [&>*:nth-child(5)]:col-span-4 md:[&>*:nth-child(5)]:col-span-3
        `,
        threeCells: `
          grid-cols-2 grid-rows-2
          [&>*:first-child]:col-span-2
        `,
        fourCells: `
          grid-cols-3 grid-rows-2
          [&>*:first-child]:col-span-1
          [&>*:nth-child(2)]:col-span-2
          [&>*:nth-child(3)]:col-span-2
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const ContainerScrollContext =
  React.createContext<ContainerScrollContextValue | undefined>(undefined);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component"
    );
  }
  return context;
}

const ContainerScroll = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        // ΔΙΝΟΥΜΕ ΜΕΓΑΛΟ ΥΨΟΣ ΓΙΑ ΝΑ ΠΑΙΖΕΙ ΟΛΟ ΤΟ ANIMATION
        className={cn("relative h-[240vh] w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};

const BentoGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof bentoGridVariants>
>(({ variant, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(bentoGridVariants({ variant }), className)}
      {...props}
    />
  );
});
BentoGrid.displayName = "BentoGrid";

const BentoCell = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext();

    // Από δεξιά → κέντρο
    const translate = useTransform(
      scrollYProgress,
      [0.1, 0.9],
      ["35%", "0%"]
    );
    const scale = useTransform(scrollYProgress, [0, 0.9], [0.5, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]); // fade-in

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ translate, scale, opacity, ...style }}
        {...props}
      />
    );
  }
);
BentoCell.displayName = "BentoCell";

const ContainerScale = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className, style, ...props }, ref) => {
  const { scrollYProgress } = useContainerScrollContext();

  // Smooth fade-in + μικρό zoom-in στην αρχή
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.6], [0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.6], [0.9, 1, 1]);

  const position = useTransform(scrollYProgress, (pos) =>
    pos >= 0.6 ? "absolute" : "fixed"
  );

  return (
    <motion.div
      ref={ref}
      className={cn("left-1/2 top-1/2 size-fit", className)}
      style={{
        translate: "-50% -50%",
        scale,
        position,
        opacity,
        ...style,
      }}
      {...props}
    />
  );
});
ContainerScale.displayName = "ContainerScale";

export { ContainerScroll, BentoGrid, BentoCell, ContainerScale };
