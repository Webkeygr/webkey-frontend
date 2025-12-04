"use client";

import ScrollVelocity from "@/components/ui/shadcn-io/scroll-velocity";

export default function ScrollTextSection() {
  return (
    <section
      id="scroll-divider"
      className="
        relative
        z-[6]              /* πάνω από το προηγούμενο section */
        w-full
        overflow-hidden
        py-24              /* λίγο παραπάνω ύψος */
        bg-gradient-to-b
        from-white
        via-white
        to-white           /* ΠΛΗΡΩΣ λευκό – δεν φαίνεται τίποτα από πίσω */
      "
    >
      <div className="flex items-center justify-center">
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
