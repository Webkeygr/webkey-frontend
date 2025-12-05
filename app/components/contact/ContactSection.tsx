"use client";

import React, { useState, FormEvent } from "react";
import { usePathname } from "next/navigation";
import LightPillar from "@/app/components/LightPillar";

const interestOptions = ["website", "branding", "ecommerce"] as const;
type InterestKey = (typeof interestOptions)[number];

type Labels = {
  title: string;
  interestsTitle: string;
  fields: {
    name: string;
    surname: string;
    email: string;
    message: string;
  };
  interest: Record<InterestKey, string>;
  newsletter: string;
  privacy: string;
  submit: string;
  contactTitle: string;
  emailLabel: string;
  phoneLabel: string;
};

function getLabels(pathname: string | null): Labels {
  const isEnglish = pathname?.startsWith("/en");

  if (isEnglish) {
    return {
      title: "I'm interested in:",
      interestsTitle: "What are you interested in?",
      fields: {
        name: "First name*",
        surname: "Last name*",
        email: "Email*",
        message: "Message",
      },
      interest: {
        website: "New Website",
        branding: "Branding",
        ecommerce: "E-Commerce",
      },
      newsletter: "I want to receive Webkey's monthly newsletter.",
      privacy:
        "I understand that Webkey will securely process my data according to its privacy policy.",
      submit: "Send",
      contactTitle: "Start your project",
      emailLabel: "info@webkey.gr",
      phoneLabel: "+30 6985608579",
    };
  }

  // Greek (default)
  return {
    title: "Με ενδιαφέρει:",
    interestsTitle: "Τι σε ενδιαφέρει;",
    fields: {
      name: "ΟΝΟΜΑ*",
      surname: "ΕΠΩΝΥΜΟ*",
      email: "EMAIL*",
      message: "ΜΗΝΥΜΑ",
    },
    interest: {
      website: "Νέα ιστοσελίδα",
      branding: "Branding",
      ecommerce: "E-Commerce",
    },
    newsletter: "Θέλω να λαμβάνω μηνιαίο newsletter από τη Webkey.",
    privacy:
      "Κατανοώ ότι η Webkey θα διαχειρίζεται τα δεδομένα μου με ασφάλεια σύμφωνα με την πολιτική απορρήτου της.",
    submit: "Αποστολή",
    contactTitle: "START YOUR PROJECT",
    emailLabel: "info@webkey.gr",
    phoneLabel: "+30 6985608579",
  };
}

export default function ContactSection() {
  const pathname = usePathname();
  const labels = getLabels(pathname);

  // Πολλαπλές επιλογές interest (AND / OR)
  const [interests, setInterests] = useState<InterestKey[]>(["website"]);

  const [formState, setFormState] = useState({
    name: "",
    surname: "",
    email: "",
    message: "",
    newsletter: false,
    privacy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const toggleInterest = (key: InterestKey) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          interests, // στέλνουμε array με όλα τα selected interests
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setFormState({
        name: "",
        surname: "",
        email: "",
        message: "",
        newsletter: false,
        privacy: false,
      });
      setInterests(["website"]);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <section className="relative w-full min-h-[120vh] overflow-hidden bg-gradient-to-b from-[#050816]/40 via-transparent to-[#02030a]/70">
      {/* Light pillar background */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <LightPillar
          topColor="#38bdf8"
          bottomColor="#ff00f2"
          intensity={1.4}
          rotationSpeed={2.0}
          glowAmount={0.005}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          mixBlendMode="screen"
        />
      </div>

      {/* Gradient overlay για fade σε μαύρο στο τέλος του section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70vh] bg-gradient-to-b from-transparent via-[#050816]/60 to-black z-10" />


      <div className="relative z-20 mx-auto flex min-h-[120vh] w-full max-w-[1180px] flex-col px-6 pb-0 pt-32 md:px-8 lg:px-10">
        {/* ====== FORM ====== */}
        <form onSubmit={handleSubmit} className="w-full max-w-[1180px]">
          {/* Title + interests */}
          <div className="mb-10 md:mb-14">
            <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[0.06em] text-white md:text-[40px]">
              {labels.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-4">
              {interestOptions.map((key) => {
                const isActive = interests.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleInterest(key)}
                    className={[
                      "rounded-full border px-6 py-2 text-sm md:text-[15px] tracking-[0.16em] uppercase transition-colors",
                      isActive
                        ? "bg-white text-slate-900 border-white shadow-[0_0_32px_rgba(255,255,255,0.25)]"
                        : "border-white/40 text-white/70 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {labels.interest[key as InterestKey]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fields grid */}
          <div className="grid gap-y-10 md:gap-y-12">
            {/* Name / Surname / Email */}
            <div className="grid gap-y-10 md:grid-cols-3 md:gap-x-12">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold tracking-[0.2em] text-white/80 md:text-[13px]">
                  {labels.fields.name}
                </label>
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="border-b border-white/30 bg-transparent pb-2 text-sm text-white outline-none placeholder:text-white/40 md:text-base"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold tracking-[0.2em] text-white/80 md:text-[13px]">
                  {labels.fields.surname}
                </label>
                <input
                  name="surname"
                  value={formState.surname}
                  onChange={handleChange}
                  className="border-b border-white/30 bg-transparent pb-2 text-sm text-white outline-none placeholder:text-white/40 md:text-base"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold tracking-[0.2em] text-white/80 md:text-[13px]">
                  {labels.fields.email}
                </label>
                <input
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="border-b border-white/30 bg-transparent pb-2 text-sm text-white outline-none placeholder:text-white/40 md:text-base"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold tracking-[0.2em] text-white/80 md:text-[13px]">
                {labels.fields.message}
              </label>
              <textarea
                name="message"
                rows={4}
                value={formState.message}
                onChange={handleChange}
                className="border-b border-white/30 bg-transparent pb-3 text-sm text-white outline-none placeholder:text-white/40 md:text-base"
              />
            </div>

            {/* Checkboxes + submit */}
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-3 text-[12px] leading-relaxed text-white/75 md:text-[13px]">
                <label className="inline-flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formState.newsletter}
                    onChange={handleChange}
                    className="mt-[3px] h-4 w-4 rounded border-white/60 bg-transparent text-white accent-white"
                  />
                  <span>{labels.newsletter}</span>
                </label>

                <label className="inline-flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={formState.privacy}
                    onChange={handleChange}
                    className="mt-[3px] h-4 w-4 rounded border-white/60 bg-transparent text-white accent-white"
                  />
                  <span>{labels.privacy}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 inline-flex min-w-[180px] items-center justify-center rounded-full border border-white px-10 py-3 text-xs font-semibold tracking-[0.25em] uppercase text-white transition-all hover:bg-white hover:text-slate-900 disabled:opacity-60 md:text-[13px]"
              >
                {isSubmitting ? "..." : labels.submit}
              </button>
            </div>

            {status === "success" && (
              <p className="text-sm text-emerald-300"></p>
            )}
            {status === "error" && <p className="text-sm text-red-300"></p>}
          </div>
        </form>

        {/* ====== CONTACT CARD ΣΤΟ ΤΕΛΟΣ ΤΟΥ SECTION ====== */}
        <div className="mt-auto flex justify-center pt-16 md:pt-20 lg:pt-24">
          <div className="relative w-full max-w-[960px] overflow-hidden rounded-[52px] bg-transparent px-10 py-10 shadow-[0_32px_80px_rgba(0,0,0,0.45)] md:px-16 md:py-12">
            {/* inner gradient για fade από λευκό σε transparent */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-transparent" />

            <div className="relative">
              <h2 className="text-[20px] font-semibold tracking-[0.3em] text-slate-900 uppercase md:text-[24px]">
                {labels.contactTitle}
              </h2>

              <div className="mt-6 space-y-2 text-[15px] font-medium text-slate-900 md:text-[16px]">
                <p>{labels.emailLabel}</p>
                <p>{labels.phoneLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
