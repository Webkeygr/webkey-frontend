"use client";

import ScrollVelocity from "@/components/ui/shadcn-io/scroll-velocity";
// αν το shadcn στο έφτιαξε αλλού (π.χ. "@/components/text/scroll-velocity"),
// άλλαξε απλώς το import path.

export default function ScrollTextSection() {
  return (
    <section
      id="scroll-divider"
      className="
        relative
        w-full
        overflow-hidden
        py-16
        bg-gradient-to-b
        from-white         /* ίδια λευκή αρχή με το προηγούμενο section */
        via-white/90
        to-transparent    /* σβήνει σταδιακά και αποκαλύπτει το background από κάτω */
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
