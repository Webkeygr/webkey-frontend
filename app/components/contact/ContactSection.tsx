"use client";

import React, { useState, FormEvent } from "react";
import { usePathname } from "next/navigation";
import LightPillar from "@/app/components/LightPillar";

const interestOptions = ["website", "branding", "ecommerce"] as const;
type InterestKey = (typeof interestOptions)[number];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  interest: InterestKey;
  newsletter: boolean;
  privacy: boolean;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  interest: "website",
  newsletter: false,
  privacy: false,
};

export default function ContactSection() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const t = {
    title: isEnglish ? "I'm interested in:" : "Με ενδιαφέρει:",
    btnWebsite: isEnglish ? "New Website" : "Νέα ιστοσελίδα",
    btnBranding: "Branding",
    btnEcommerce: "E-Commerce",
    labelFirstName: isEnglish ? "First name*" : "Όνομα*",
    labelLastName: isEnglish ? "Last name*" : "Επώνυμο*",
    labelEmail: "Email*",
    labelMessage: isEnglish ? "Message" : "Μήνυμα",
    newsletter:
      (isEnglish
        ? "I want to receive Webkey's monthly newsletter."
        : "Θέλω να λαμβάνω μηνιαίο newsletter από τη Webkey.") + "",
    privacy: isEnglish
      ? "I understand that Webkey will handle my data securely according to its privacy policy."
      : "Κατανοώ ότι η Webkey θα διαχειρίζεται τα δεδομένα μου με ασφάλεια σύμφωνα με την πολιτική απορρήτου της.",
    submit: isEnglish ? "Send" : "Αποστολή",
    footerTitle: "START YOUR PROJECT",
    footerEmail: "info@webkey.gr",
    footerPhone: "+30 6985608579",
    success: isEnglish
      ? "Your message has been sent."
      : "Το μήνυμά σου στάλθηκε.",
    error: isEnglish
      ? "Something went wrong. Please try again."
      : "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
  };

  const handleChange =
    (field: keyof FormState) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | InterestKey
    ) => {
      if (field === "interest") {
        setForm((prev) => ({ ...prev, interest: e as InterestKey }));
        return;
      }

      if (field === "newsletter" || field === "privacy") {
        const target = e as React.ChangeEvent<HTMLInputElement>;
        setForm((prev) => ({ ...prev, [field]: target.target.checked }));
        return;
      }

      const target = e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
      setForm((prev) => ({ ...prev, [field]: target.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.privacy || !form.email || !form.firstName || !form.lastName) {
      setSubmitStatus("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus("idle");

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          message: form.message,
          interest: form.interest,
          newsletter: form.newsletter,
          privacy: form.privacy,
          locale: isEnglish ? "en" : "el",
        }),
      });

      setSubmitStatus("success");
      setForm(initialFormState);
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050716]">
      {/* LIGHT PILLAR BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <LightPillar
          className="w-full h-full"
          topColor="#ff00f2"
          bottomColor="#38bdf8"
          intensity={1.45}
          rotationSpeed={2.0}
          glowAmount={0.007}
          pillarWidth={2.6}
          pillarHeight={0.5}
          noiseIntensity={0.45}
          pillarRotation={0}
          mixBlendMode="screen"
        />
        {/* Fade-out προς το μαύρο στο τέλος της σελίδας */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-[#050716] to-[#050716]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-24 pt-32 md:px-10 lg:px-16">
        {/* TITLE + INTEREST BUTTONS */}
        <div className="mb-10 space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[40px]">
            {t.title}
          </h1>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleChange("interest").bind(null, "website")}
              className={`rounded-full border px-6 py-2 text-sm uppercase tracking-[0.22em] ${
                form.interest === "website"
                  ? "border-white bg-white/10 text-white"
                  : "border-white/40 bg-black/10 text-white/80 hover:border-white/80 hover:text-white"
              }`}
            >
              {t.btnWebsite}
            </button>
            <button
              type="button"
              onClick={handleChange("interest").bind(null, "branding")}
              className={`rounded-full border px-6 py-2 text-sm uppercase tracking-[0.22em] ${
                form.interest === "branding"
                  ? "border-white bg-white/10 text-white"
                  : "border-white/40 bg-black/10 text-white/80 hover:border-white/80 hover:text-white"
              }`}
            >
              {t.btnBranding}
            </button>
            <button
              type="button"
              onClick={handleChange("interest").bind(null, "ecommerce")}
              className={`rounded-full border px-6 py-2 text-sm uppercase tracking-[0.22em] ${
                form.interest === "ecommerce"
                  ? "border-white bg-white/10 text-white"
                  : "border-white/40 bg-black/10 text-white/80 hover:border-white/80 hover:text-white"
              }`}
            >
              {t.btnEcommerce}
            </button>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-10 text-white">
          {/* 3 COLUMNS (NAME / LAST NAME / EMAIL) */}
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                {t.labelFirstName}
              </label>
              <input
                type="text"
                className="w-full border-b border-white/50 bg-transparent pb-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-white"
                value={form.firstName}
                onChange={handleChange("firstName")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                {t.labelLastName}
              </label>
              <input
                type="text"
                className="w-full border-b border-white/50 bg-transparent pb-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-white"
                value={form.lastName}
                onChange={handleChange("lastName")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                {t.labelEmail}
              </label>
              <input
                type="email"
                className="w-full border-b border-white/50 bg-transparent pb-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-white"
                value={form.email}
                onChange={handleChange("email")}
              />
            </div>
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              {t.labelMessage}
            </label>
            <textarea
              rows={4}
              className="w-full border-b border-white/50 bg-transparent pb-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-white"
              value={form.message}
              onChange={handleChange("message")}
            />
          </div>

          {/* CHECKBOXES + SUBMIT */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3 text-xs text-white/80 md:text-[11px]">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-[2px] h-4 w-4 rounded border border-white/60 bg-transparent accent-white"
                  checked={form.newsletter}
                  onChange={handleChange("newsletter")}
                />
                <span>{t.newsletter}</span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-[2px] h-4 w-4 rounded border border-white/60 bg-transparent accent-white"
                  checked={form.privacy}
                  onChange={handleChange("privacy")}
                />
                <span>{t.privacy}</span>
              </label>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full border border-white bg-white/10 px-10 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "..." : t.submit}
              </button>

              {submitStatus === "success" && (
                <p className="text-xs text-emerald-300">{t.success}</p>
              )}
              {submitStatus === "error" && (
                <p className="text-xs text-red-300">{t.error}</p>
              )}
            </div>
          </div>
        </form>

        {/* FOOTER CARD WITH FADE-OUT */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[64px] bg-white px-10 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:px-16 md:py-12">
            {/* περιεχόμενο σε z-10 για να μην επηρεάζεται */}
            <div className="relative z-10 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-black">
                {t.footerTitle}
              </h2>
              <div className="space-y-1 text-base leading-relaxed text-black">
                <p>{t.footerEmail}</p>
                <p>{t.footerPhone}</p>
              </div>
            </div>

            {/* fade-out ΜΟΝΟ στο κάτω μέρος του card */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
