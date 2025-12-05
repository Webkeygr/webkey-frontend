"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import LightPillar from "@/app/components/LightPillar";

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

export default function ContactSection() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    interests: [],
    newsletter: false,
    privacy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

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

  const handleChange =
    (field: keyof FormState) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | React.ChangeEvent<HTMLInputElement>
    ) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.type === "checkbox") {
        setForm((prev) => ({
          ...prev,
          [field]: (target as HTMLInputElement).checked,
        }));
      } else {
        setForm((prev) => ({ ...prev, [field]: target.value }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          message: form.message,
          interests: form.interests,
          newsletter: form.newsletter,
          privacy: form.privacy,
          locale: isEnglish ? "en" : "el",
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        interests: [],
        newsletter: false,
        privacy: false,
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = {
    title: isEnglish ? "I am interested in:" : "Με ενδιαφέρει:",
    interests: {
      website: isEnglish ? "A new website" : "Νέα ιστοσελίδα",
      branding: "Branding",
      ecommerce: "E-Commerce",
    },
    firstName: isEnglish ? "First name*" : "Όνομα*",
    lastName: isEnglish ? "Last name*" : "Επώνυμο*",
    email: "Email*",
    messageLabel: isEnglish ? "Message" : "Μήνυμα",
    newsletter:
      (isEnglish
        ? "I'm happy to receive a monthly newsletter from Webkey."
        : "Θέλω να λαμβάνω μηνιαίο newsletter από τη Webkey.") + "",
    privacy: isEnglish
      ? "I understand that Webkey will securely hold my data in accordance with their privacy policy."
      : "Κατανοώ ότι η Webkey θα διαχειρίζεται τα δεδομένα μου με ασφάλεια σύμφωνα με την πολιτική απορρήτου της.",
    submit: isEnglish ? "Submit" : "Αποστολή",
    startYourProject: "Start your project", // ΜΗΝ μεταφράσεις
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* 🔵 LightPillar background */}
      <LightPillar
        className=""
        topColor="#38bdf8" // Webkey yellow
        bottomColor="#ff00f2" // cyan
        intensity={1.2}
        rotationSpeed={1.5} // πιο αργό / premium
        glowAmount={0.006}
        pillarWidth={3}
        pillarHeight={0.5}
        noiseIntensity={0.4}
        pillarRotation={0}
        interactive={false}
        mixBlendMode="screen"
      />

      {/* 🔴 Content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-16 px-6 py-24">
        {/* Επικεφαλίδα & επιλογές ενδιαφέροντος */}
        <div>
          <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-light">
            {t.title}
          </h1>

          <div className="flex flex-wrap gap-4">
            {interestOptions.map((key) => {
              const label = t.interests[key];
              const isActive = form.interests.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleInterest(key)}
                  className={`rounded-full border px-6 py-2 text-sm tracking-wide transition-colors ${
                    isActive
                      ? "border-white bg-white text-black"
                      : "border-zinc-500/70 text-zinc-200 hover:border-white/80 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Φόρμα */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-10 text-sm sm:text-base"
        >
          {/* 3 πεδία στη σειρά */}
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                {t.firstName}
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={handleChange("firstName")}
                className="border-b border-zinc-600 bg-transparent pb-2 outline-none transition-colors focus:border-white"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                {t.lastName}
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={handleChange("lastName")}
                className="border-b border-zinc-600 bg-transparent pb-2 outline-none transition-colors focus:border-white"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                {t.email}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="border-b border-zinc-600 bg-transparent pb-2 outline-none transition-colors focus:border-white"
                required
              />
            </div>
          </div>

          {/* Μήνυμα */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium tracking-wide">
              {t.messageLabel}
            </label>
            <textarea
              value={form.message}
              onChange={handleChange("message")}
              rows={4}
              className="resize-none border-b border-zinc-600 bg-transparent pb-2 outline-none transition-colors focus:border-white"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-zinc-300">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.newsletter}
                onChange={handleChange("newsletter")}
                className="mt-[2px] h-4 w-4 border border-zinc-500 bg-transparent accent-white"
              />
              <span>{t.newsletter}</span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.privacy}
                onChange={handleChange("privacy")}
                className="mt-[2px] h-4 w-4 border border-zinc-500 bg-transparent accent-white"
                required
              />
              <span>{t.privacy}</span>
            </label>
          </div>

          {/* Submit + status */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full border border-white px-8 py-2 text-sm uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "..." : t.submit}
            </button>

            {status === "success" && (
              <span className="text-xs text-emerald-400">
                {isEnglish
                  ? "Thank you! We will get back to you soon."
                  : "Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σου σύντομα."}
              </span>
            )}
            {status === "error" && (
              <span className="text-xs text-red-400">
                {isEnglish
                  ? "Something went wrong. Please try again."
                  : "Κάτι πήγε στραβά. Δοκίμασε ξανά."}
              </span>
            )}
          </div>
        </form>

        {/* Start your project block */}
        <div className="relative mt-4 rounded-t-[4rem] bg-white px-8 py-10 text-black sm:px-12 sm:py-12 md:px-16">
          <p className="mb-4 text-2xl sm:text-3xl md:text-4xl font-medium tracking-[0.12em] uppercase">
            {t.startYourProject}
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold">
            info@webkey.gr
          </p>
          <p className="text-lg sm:text-xl md:text-2xl mt-2 font-semibold">
            +30 6985608579
          </p>
        </div>
      </div>
    </section>
  );
}
