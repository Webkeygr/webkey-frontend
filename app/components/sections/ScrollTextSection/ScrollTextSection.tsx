"use client";

import ScrollVelocity from "@/components/ui/shadcn-io/scroll-velocity";

export default function ScrollTextSection() {
  return (
    <section
      className="
        w-full 
        overflow-hidden 
        py-16 
        bg-transparent
      "
    >
      <div className="flex items-center justify-center">
        <ScrollVelocity
          texts={[
            "Creative Websites",
            "Digital Identity",
            "Headless WordPress",
            "Next.js Development",
            "Webkey Studio",
          ]}
          velocity={80}
          className="
            text-[clamp(28px,6vw,70px)] 
            font-ITC-Bold 
            uppercase 
            tracking-wide 
            text-white/90
          "
        />
      </div>
    </section>
  );
}
