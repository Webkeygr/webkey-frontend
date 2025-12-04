"use client";

import ScrollVelocity from "@/components/ui/shadcn-io/scroll-velocity";

export default function ScrollTextSection() {
  return (
    <section
      id="scroll-divider"
      className="relative z-[6] w-full min-h-[200vh] bg-white"
    >
      {/* Sticky wrapper που μένει καρφωμένος όσο κάνεις scroll μέσα στο section */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <ScrollVelocity
          texts={[
            "Custom Websites • Unique Branding • Digital Strategy",
            "Innovative Ideas • Seamless Experiences • Meaningful Results",
          ]}
          velocity={80}
          className="text-black text-[clamp(28px,6vw,70px)] font-ITC-Bold uppercase tracking-wide"
        />
      </div>
    </section>
  );
}
