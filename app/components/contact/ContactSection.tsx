"use client";

import React, { useState, FormEvent } from "react";
import { usePathname } from "next/navigation";
import LightPillar from "@/app/components/LightPillar";

// -------------------- TYPES & CONSTANTS --------------------

const interestOptions = ["website", "branding", "ecommerce"] as const;
type InterestKey = (typeof interestOptions)[number];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  newsletter: boolean;
  privacy: boolean;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  newsletter: false,
  privacy: false,
};

// -------------------- COMPONENT --------------------

export default function ContactSection() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  const [selectedInterest, setSelectedInterest] = useState<InterestKey | null>(
    null
  );
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInterestClick = (key: InterestKey) => {
    setSelectedInterest(key);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          interest: selectedInterest,
          language: isEnglish ? "en" : "gr",
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSubmitStatus("success");
      setForm(initialFormState);
      setSelectedInterest(null);
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labels: {
    title: string;
    interest: Record<InterestKey, string>;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    newsletter: string;
    privacy: string;
    submit: string;
    cardTitle: string;
  } = {
    title: isEnglish ? "I'm interested in:" : "Με ενδιαφέρει:",
    interest: {
      website: isEnglish ? "New Website" : "Νέα ιστοσελίδα",
      branding: "Branding",
      ecommerce: "E-Commerce",
    },
    firstName: isEnglish ? "First name*" : "Όνομα*",
    lastName: isEnglish ? "Last name*" : "Επώνυμο*",
    email: "Email*",
    message: isEnglish ? "Message" : "Μήνυμα",
    newsletter: isEnglish
      ? "I want to receive Webkey's monthly newsletter."
      : "Θέλω να λαμβάνω μηνιαίο newsletter από τη Webkey.",
    privacy: isEnglish
      ? "I understand that Webkey will handle my data securely according to its privacy policy."
      : "Κατανοώ ότι η Webkey θα διαχειρίζεται τα δεδομένα μου με ασφάλεια σύμφωνα με την πολιτική απορρήτου της.",
    submit: isEnglish ? "Send" : "Αποστολή",
    cardTitle: "START YOUR PROJECT",
  };

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#050316] via-[#05011f] to-black text-white py-24 md:py-28 lg:py-32">
      {/* LIGHTPILLAR BACKGROUND */}
      <div className="pointer-events-none absolute inset-x-0 top-[-20vh] h-[160vh] flex items-start justify-center">
        <div className="w-full max-w-5xl h-full">
          <LightPillar
            topColor="#38bdf8"
            bottomColor="#ff00f2"
            intensity={1.6}
            rotationSpeed={2.0}
            interactive={false}
            glowAmount={0.006}
            pillarWidth={3.0}
            pillarHeight={0.5}
            noiseIntensity={0.35}
            pillarRotation={0}
            mixBlendMode="screen"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* DARK OVERLAY ΓΙΑ ΝΑ «ΔΕΝΕΙ» ΜΕ ΤΟ ΦΟΝΤΟ */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(3,4,21,0)_0%,_rgba(3,5,25,0.65)_55%,_rgba(1,2,10,1)_100%)]" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 md:px-8 lg:px-0">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-10 md:space-y-12 pt-4"
        >
          {/* TITLE + INTEREST BUTTONS */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {labels.title}
            </h1>

            <div className="flex flex-wrap gap-3 md:gap-4">
              {(interestOptions as readonly InterestKey[]).map(
                (key: InterestKey) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleInterestClick(key)}
                    className={`rounded-full px-6 md:px-7 py-2 md:py-2.5 border text-xs md:text-sm font-semibold tracking-[0.2em] uppercase transition-all
                      ${
                        selectedInterest === key
                          ? "bg-white text-[#050316] border-white shadow-[0_0_40px_rgba(255,255,255,0.45)]"
                          : "border-white/50 text-white/80 hover:border-white hover:text-white"
                      }`}
                  >
                    {labels.interest[key]}
                  </button>
                )
              )}
            </div>
          </div>

          {/* FIELDS */}
          <div className="space-y-10 md:space-y-12">
            {/* ROW 1 – NAME / LAST NAME / EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {/* FIRST NAME */}
              <div className="space-y-3">
                <label className="block text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-white/80">
                  {labels.firstName}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/70 focus:border-white outline-none text-white text-sm md:text-base font-medium placeholder:text-white/30 py-3 transition-colors"
                  required
                />
              </div>

              {/* LAST NAME */}
              <div className="space-y-3">
                <label className="block text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-white/80">
                  {labels.lastName}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/70 focus:border-white outline-none text-white text-sm md:text-base font-medium placeholder:text-white/30 py-3 transition-colors"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-3">
                <label className="block text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-white/80">
                  {labels.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/70 focus:border-white outline-none text-white text-sm md:text-base font-medium placeholder:text-white/30 py-3 transition-colors"
                  required
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div className="space-y-3">
              <label className="block text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-white/80">
                {labels.message}
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-transparent border-b border-white/70 focus:border-white outline-none text-white text-sm md:text-base font-medium placeholder:text-white/30 py-3 resize-none transition-colors"
              />
            </div>
          </div>

          {/* CHECKBOXES + SUBMIT */}
          <div className="flex flex-col gap-6 md:gap-8">
            <label className="flex items-start gap-3 text-white/85 text-xs md:text-sm leading-relaxed">
              <input
                type="checkbox"
                name="newsletter"
                checked={form.newsletter}
                onChange={handleCheckboxChange}
                className="mt-[3px] h-4 w-4 rounded border-white/70 bg-transparent text-white focus:ring-white"
              />
              <span>{labels.newsletter}</span>
            </label>

            <label className="flex items-start gap-3 text-white/85 text-xs md:text-sm leading-relaxed">
              <input
                type="checkbox"
                name="privacy"
                checked={form.privacy}
                onChange={handleCheckboxChange}
                className="mt-[3px] h-4 w-4 rounded border-white/70 bg-transparent text-white focus:ring-white"
                required
              />
              <span>{labels.privacy}</span>
            </label>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full border border-white px-10 md:px-12 py-2.5 md:py-3 text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-white transition-colors hover:bg-white hover:text-[#050316] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (isEnglish ? "Sending..." : "Αποστολή...") : labels.submit}
              </button>
            </div>

            {submitStatus === "success" && (
              <p className="text-sm text-emerald-300">
                {isEnglish
                  ? "Your message has been sent successfully."
                  : "Το μήνυμά σου στάλθηκε με επιτυχία."}
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-sm text-red-300">
                {isEnglish
                  ? "Something went wrong. Please try again."
                  : "Κάτι πήγε στραβά. Δοκίμασε ξανά."}
              </p>
            )}
          </div>
        </form>

        {/* BOTTOM CARD ΜΕ FADE-OUT */}
        <div className="pb-6 md:pb-8 lg:pb-10 mt:10">
          <div className="flex justify-center">
            <div className="relative w-full max-w-5xl rounded-[64px] overflow-hidden bg-transparent">
              {/* GRADIENT: ΛΕΥΚΟ → TRANSPARENT */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-transparent" />

              {/* CONTENT πάνω από το gradient */}
              <div className="relative z-10 px-10 py-10 md:px-16 md:py-12">
                <h2 className="text-sm md:text-base font-semibold tracking-[0.28em] uppercase text-black">
                  {labels.cardTitle}
                </h2>
                <div className="mt-4 space-y-1 text-black text-sm md:text-base font-medium">
                  <p>info@webkey.gr</p>
                  <p>+30 6985608579</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
