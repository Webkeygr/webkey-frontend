"use client";

import ScrollVelocity from "@/components/ui/shadcn-io/scroll-velocity";

export default function ScrollTextSection() {
  return (
    <section
      id="scroll-divider"
      className="
        relative
        z-[6]
        w-full
        overflow-hidden
        min-h-screen      /* καλύπτει όλη την οθόνη */
        bg-white          /* full λευκό φόντο */
      "
    >
      <div
        className="
          flex
          items-center
          justify-center
          pt-[40vh]        /* φέρνει το text στο ίδιο περίπου ύψος */
          pb-24
        "
      >
        <ScrollVelocity
          texts={["Creative Websites", "Digital Identity"]}
          velocity={80}
          className="
            text-black
            text-[clamp(28px,6vw,70px)]
            font-ITC-Bold
            uppercase
            tracking-wide
          "
        />
      </div>
    </section>
  );
}
