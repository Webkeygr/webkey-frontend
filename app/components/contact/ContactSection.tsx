"use client";

import React, { useState, FormEvent } from "react";
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
  newsletterOptIn: boolean;
  privacyAccepted: boolean;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  interests: [],
  newsletterOptIn: false,
  privacyAccepted: false,
};

const ContactSection: React.FC = () => {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en") ?? false;

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );

  const labels = {
    title: isEnglish ? "I am interested in:" : "Με ενδιαφέρει:",
    interests: {
      website: isEnglish ? "A new website" : "Νέα ιστοσελίδα",
      branding: "Branding",
      ecommerce: "E-Commerce",
    },
    firstName: isEnglish ? "First name*" : "Όνομα*",
    lastName: isEnglish ? "Last name*" : "Επώνυμο*",
    email: "Email*",
    message: isEnglish ? "Message" : "Μήνυμα",
    newsletter: isEnglish
      ? "I’m happy to receive a monthly newsletter from Webkey."
      : "Θέλω να λαμβάνω μηνιαίο newsletter από τη Webkey.",
    privacy: isEnglish
      ? "I understand Webkey will securely handle my data according to its privacy policy."
      : "Κατανοώ ότι η Webkey θα διαχειρίζεται τα δεδομένα μου με ασφάλεια σύμφωνα με την πολιτική απορρήτου της.",
    submit: isEnglish ? "Submit" : "Αποστολή",
    requiredPrivacy: isEnglish
      ? "Please accept the privacy policy to continue."
      : "Πρέπει να αποδεχτείς την πολιτική απορρήτου για να συνεχίσεις.",
    success: isEnglish
      ? "Thank you! Your message has been sent."
      : "Ευχαριστούμε! Το μήνυμά σου στάλθηκε με επιτυχία.",
    error: isEnglish
      ? "Something went wrong. Please try again later."
      : "Κάτι πήγε στραβά. Δοκίμασε ξανά αργότερα.",
  };

  const toggleInterest = (key: InterestKey) => {
    setFormState((prev) => {
      const exists = prev.interests.includes(key);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((k) => k !== key)
          : [...prev.interests, key],
      };
    });
  };

  const interestIsActive = (key: InterestKey) =>
    formState.interests.includes(key);

  const handleChange =
    (field: keyof FormState) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | React.ChangeEvent<HTMLInputElement>
    ) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.type === "checkbox") {
        setFormState((prev) => ({
          ...prev,
          [field]: (target as HTMLInputElement).checked,
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          [field]: target.value,
        }));
      }
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatusMessage(null);
    setStatusType(null);

    if (!formState.privacyAccepted) {
      setStatusMessage(labels.requiredPrivacy);
      setStatusType("error");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setFormState(initialFormState);
      setStatusMessage(labels.success);
      setStatusType("success");
    } catch (error) {
      console.error(error);
      setStatusMessage(labels.error);
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#050510] text-white">
      {/* Light pillar background */}
      <div className="pointer-events-none absolute inset-0">
        <LightPillar
          topColor="#ff00f2"
          bottomColor="#38bdf8"
          intensity={1.4}
          rotationSpeed={2.0}
          pillarWidth={3}
          pillarHeight={0.5}
          glowAmount={0.008}
          noiseIntensity={0.4}
          interactive={false}
          pillarRotation={0}
          className="opacity-90"
          mixBlendMode="screen"
        />
      </div>

      {/* μαύρο fade-out στο κάτω μέρος της σελίδας για να δένει με το footer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#050510]/60 to-[#050510]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-32 pt-40 md:px-10 lg:px-16">
        {/* FORM */}
        <div className="w-full max-w-5xl">
          <h1 className="mb-8 text-3xl font-semibold tracking-[0.12em] text-white sm:text-4xl md:text-[40px]">
            {labels.title}
          </h1>

          {/* Interest pills */}
          <div className="mb-12 flex flex-wrap gap-4">
            {interestOptions.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleInterest(key)}
                className={`rounded-full border px-6 py-2 text-xs font-medium tracking-[0.18em] uppercase transition sm:text-sm ${
                  interestIsActive(key)
                    ? "border-white bg-white/90 text-[#050510]"
                    : "border-white/50 bg-white/5 text-white/80 hover:border-white hover:bg-white/10"
                }`}
              >
                {labels.interests[key]}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* First / Last / Email */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium uppercase tracking-[0.16em] text-white">
                  {labels.firstName}
                </label>
                <input
                  type="text"
                  value={formState.firstName}
                  onChange={handleChange("firstName")}
                  className="w-full border-b border-white/40 bg-transparent pb-2 text-sm text-white placeholder-white/40 outline-none focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium uppercase tracking-[0.16em] text-white">
                  {labels.lastName}
                </label>
                <input
                  type="text"
                  value={formState.lastName}
                  onChange={handleChange("lastName")}
                  className="w-full border-b border-white/40 bg-transparent pb-2 text-sm text-white placeholder-white/40 outline-none focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium uppercase tracking-[0.16em] text-white">
                  {labels.email}
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={handleChange("email")}
                  className="w-full border-b border-white/40 bg-transparent pb-2 text-sm text-white placeholder-white/40 outline-none focus:border-white"
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-4">
              <label className="block text-sm font-medium uppercase tracking-[0.16em] text-white">
                {labels.message}
              </label>
              <textarea
                value={formState.message}
                onChange={handleChange("message")}
                rows={4}
                className="w-full border-b border-white/40 bg-transparent pb-2 text-sm text-white placeholder-white/40 outline-none focus:border-white"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 text-xs sm:text-sm text-white/80">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formState.newsletterOptIn}
                  onChange={handleChange("newsletterOptIn")}
                  className="mt-1 h-4 w-4 border border-white/60 bg-transparent accent-white"
                />
                <span>{labels.newsletter}</span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formState.privacyAccepted}
                  onChange={handleChange("privacyAccepted")}
                  className="mt-1 h-4 w-4 border border-white/60 bg-transparent accent-white"
                  required
                />
                <span>{labels.privacy}</span>
              </label>
            </div>

            {/* Status message */}
            {statusMessage && (
              <div
                className={`text-sm ${
                  statusType === "success"
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {statusMessage}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-white px-10 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#050510] disabled:cursor-not-allowed disabled:border-white/50 disabled:text-white/50"
            >
              {isSubmitting ? (isEnglish ? "Sending..." : "Αποστολή…") : labels.submit}
            </button>
          </form>
        </div>

        {/* CONTACT CARD με fade-out */}
        <div className="relative mt-20 flex justify-center">
          {/* wrapper για fade-out στο κάτω μέρος του λευκού card */}
          <div className="relative w-full max-w-5xl">
            {/* gradient που σβήνει προς τα κάτω χωρίς να πειράζει τα γράμματα */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#050510]" />

            <div className="relative overflow-hidden rounded-t-[80px] rounded-b-[40px] bg-white px-10 py-10 shadow-2xl sm:px-14 sm:py-12">
              <div className="space-y-4 text-left text-[#050510]">
                <div className="text-sm font-semibold tracking-[0.25em] text-[#050510] sm:text-base">
                  START YOUR PROJECT
                </div>
                <div className="text-base sm:text-lg font-medium">
                  info@webkey.gr
                </div>
                <div className="text-base sm:text-lg font-medium">
                  +30 6985608579
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
