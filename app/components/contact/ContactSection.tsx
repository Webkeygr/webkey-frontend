"use client";

import { useState, FormEvent } from "react";
import { usePathname } from "next/navigation";
import LightPillar from "@/components/LightPillar";

const interestOptions = ["website", "branding", "ecommerce"] as const;
type InterestKey = (typeof interestOptions)[number];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  interests: InterestKey[];
  newsletter: boolean;
  privacy: boolean;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  interests: [],
  newsletter: false,
  privacy: false,
};

export default function ContactSection() {
  const pathname = usePathname();
  const isGreek = !pathname || pathname === "/" || pathname.startsWith("/gr");

  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const toggleInterest = (key: InterestKey) => {
    setForm((prev) => {
      const exists = prev.interests.includes(key);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((k) => k !== key)
          : [...prev.interests, key],
      };
    });
  };

  const handleChange = (
    field: keyof FormState,
    value: string | boolean | InterestKey[]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!form.privacy) {
      setSubmitMessage(
        isGreek
          ? "Πρέπει να αποδεχτείς την πολιτική απορρήτου για να συνεχίσεις."
          : "You must accept the privacy policy to continue."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          lang: isGreek ? "gr" : "en",
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setForm(initialState);
      setSubmitMessage(
        isGreek
          ? "Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σου σύντομα."
          : "Thank you! We will get back to you soon."
      );
    } catch (error) {
      console.error(error);
      setSubmitMessage(
        isGreek
          ? "Κάτι πήγε στραβά. Δοκίμασε ξανά σε λίγο."
          : "Something went wrong. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const labels = {
    heading: isGreek ? "Με ενδιαφέρει:" : "I am interested in:",
    interests: {
      website: isGreek ? "Νέα ιστοσελίδα" : "A new website",
      branding: "Branding",
      ecommerce: "E-Commerce",
    },
    firstName: isGreek ? "Όνομα*" : "First name*",
    lastName: isGreek ? "Επώνυμο*" : "Last name*",
    email: "Email*",
    message: isGreek ? "Μήνυμα" : "Message",
    newsletter: isGreek
      ? "Θέλω να λαμβάνω μηνιαίο newsletter από τη Webkey."
      : "I’m happy to receive the monthly Webkey newsletter.",
    privacy: isGreek
      ? "Κατανοώ ότι η Webkey θα διαχειρίζεται τα δεδομένα μου με ασφάλεια σύμφωνα με την πολιτική απορρήτου της."
      : "I understand that Webkey will securely handle my data in line with its privacy policy.",
    submit: isGreek ? "ΑΠΟΣΤΟΛΗ" : "Submit",
  };

  const interestIsActive = (key: InterestKey) => form.interests.includes(key);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050510] text-white">
      {/* 3D background pillar */}
      <div className="pointer-events-none absolute inset-0">
        <LightPillar
          topColor="#ff4fd8"
          bottomColor="#55c2ff"
          intensity={1.7}
          rotationSpeed={1.6}
          glowAmount={0.008}
          pillarWidth={2.0}
          pillarHeight={0.4}
          noiseIntensity={0.35}
          pillarRotation={0}
          mixBlendMode="screen"
          className=""
        />
        {/* Dark vignette to keep focus on the form */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(5,5,15,0)_0,rgba(5,5,15,0.4)_40%,rgba(5,5,10,0.9)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-28 md:px-8 lg:px-10 lg:pt-32">
            {/* Heading + interest pills */}
            <div className="space-y-6">
              <h1 className="text-3xl font-semibold tracking-[0.12em] text-white md:text-4xl lg:text-[44px]">
                {labels.heading}
              </h1>

              <div className="flex flex-wrap gap-4">
                {(interestOptions as InterestKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleInterest(key)}
                    className={`rounded-full border px-6 py-2 text-sm font-medium tracking-[0.12em] uppercase transition ${
                      interestIsActive(key)
                        ? "border-white bg-white/90 text-[#050510]"
                        : "border-white/50 bg-white/5 text-white/80 hover:border-white hover:bg-white/10"
                    }`}
                  >
                    {labels.interests[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-10 text-sm md:text-base"
            >
              {/* First row – 3 columns */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-[0.18em] text-white/80 md:text-sm">
                    {labels.firstName}
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full border-b border-white/60 bg-transparent pb-2 text-base font-medium text-white outline-none placeholder:text-white/40 focus:border-white"
                    autoComplete="given-name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-[0.18em] text-white/80 md:text-sm">
                    {labels.lastName}
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="w-full border-b border-white/60 bg-transparent pb-2 text-base font-medium text-white outline-none placeholder:text-white/40 focus:border-white"
                    autoComplete="family-name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-[0.18em] text-white/80 md:text-sm">
                    {labels.email}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full border-b border-white/60 bg-transparent pb-2 text-base font-medium text-white outline-none placeholder:text-white/40 focus:border-white"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-white/80 md:text-sm">
                  {labels.message}
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={4}
                  className="w-full resize-none border-b border-white/60 bg-transparent pb-3 text-base font-medium text-white outline-none placeholder:text-white/40 focus:border-white"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 text-xs leading-relaxed text-white/80 md:text-sm">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.newsletter}
                    onChange={(e) =>
                      handleChange("newsletter", e.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border border-white/60 bg-transparent text-white accent-white"
                  />
                  <span>{labels.newsletter}</span>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.privacy}
                    onChange={(e) => handleChange("privacy", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border border-white/60 bg-transparent text-white accent-white"
                  />
                  <span>{labels.privacy}</span>
                </label>
              </div>

              {/* Submit + message */}
              <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white bg-white/95 px-10 text-xs font-semibold uppercase tracking-[0.2em] text-[#050510] shadow-[0_0_40px_rgba(255,255,255,0.45)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? isGreek
                      ? "ΑΠΟΣΤΟΛΗ..."
                      : "Sending..."
                    : labels.submit}
                </button>

                {submitMessage && (
                  <p className="max-w-xl text-xs text-white/80 md:text-sm">
                    {submitMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* START YOUR PROJECT card */}
        <div className="relative z-10 mb-16 mt-4 px-4 md:px-8">
          <div className="mx-auto max-w-5xl">
            <div
              className="
                contact-project-card
                relative mx-auto
                rounded-[3rem] bg-white
                px-8 py-10 md:px-12 md:py-12
                shadow-[0_30px_120px_rgba(0,0,0,0.7)]
              "
            >
              <div className="space-y-6 md:space-y-8">
                <h2 className="text-xl font-semibold tracking-[0.35em] text-black md:text-2xl lg:text-[26px]">
                  START YOUR PROJECT
                </h2>
                <div className="space-y-2 text-base font-semibold text-black md:text-lg">
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
