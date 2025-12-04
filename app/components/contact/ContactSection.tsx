"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import LightPillar from "@/app/components/LightPillar";

const interestOptions = ["website", "branding", "ecommerce"] as const;
type InterestKey = (typeof interestOptions)[number];

export default function ContactSection() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");
  const lang: "en" | "el" = isEnglish ? "en" : "el";

  const [selectedInterests, setSelectedInterests] = useState<InterestKey[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);

  const copy = {
    en: {
      title: "I am interested in :",
      interests: {
        website: "A new website",
        branding: "Branding",
        ecommerce: "E-Commerce",
      },
      firstName: "First name*",
      lastName: "Last name*",
      email: "Email*",
      message: "Message",
      newsletter: "I'm happy to receive a monthly newsletter from Webkey",
      privacy:
        "I understand that Webkey will securely hold my data in accordance with their privacy policy",
      submit: "Submit",
      sending: "Sending...",
      success: "Thank you! We will contact you soon.",
      error: "Something went wrong. Please try again.",
      startYourProject: "Start your project",
      phone: "+30 6985608579",
    },
    el: {
      title: "Με ενδιαφέρει:",
      interests: {
        website: "Νέα ιστοσελίδα",
        branding: "Branding",
        ecommerce: "E-Commerce",
      },
      firstName: "Όνομα*",
      lastName: "Επώνυμο*",
      email: "Email*",
      message: "Μήνυμα",
      newsletter: "Επιθυμώ να λαμβάνω μηνιαίο newsletter από τη Webkey",
      privacy:
        "Κατανοώ ότι η Webkey θα διαχειριστεί με ασφάλεια τα δεδομένα μου σύμφωνα με την πολιτική απορρήτου",
      submit: "Αποστολή",
      sending: "Αποστολή...",
      success: "Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σας σύντομα.",
      error: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
      startYourProject: "Start your project", // δεν μεταφράζεται
      phone: "+30 6985608579",
    },
  }[lang];

  const toggleInterest = (key: InterestKey) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!firstName || !lastName || !email || !message) {
      setStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          interests: selectedInterests,
          firstName,
          lastName,
          email,
          message,
          newsletter,
          privacyConsent,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setSelectedInterests([]);
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
      setNewsletter(false);
      setPrivacyConsent(true);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Φόντο LightPillar */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1.2}
          rotationSpeed={0.25}
          glowAmount={0.006}
          pillarWidth={3.2}
          pillarHeight={0.45}
          noiseIntensity={0.4}
          pillarRotation={0}
          interactive={false}
          mixBlendMode="screen"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* TODO: εδώ βάλε ό,τι trigger χρειάζεσαι για λευκό header (όπως στο AboutPhilosophy) */}

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
          {/* I am interested in */}
          <div className="mb-10 md:mb-12">
            <p className="text-sm md:text-base tracking-[0.08em] uppercase text-neutral-200 mb-4">
              {copy.title}
            </p>

            <div className="flex flex-wrap gap-4">
              {interestOptions.map((key) => {
                const label = copy.interests[key];
                const active = selectedInterests.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleInterest(key)}
                    className={`px-6 py-2 rounded-full border text-sm md:text-base transition-all ${
                      active
                        ? "bg-white text-black border-white"
                        : "border-neutral-500 text-neutral-100 hover:border-white hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10 text-neutral-100">
            {/* First row: First / Last / Email */}
            <div className="grid gap-6 md:gap-8 md:grid-cols-3">
              <div className="flex flex-col">
                <label className="text-sm mb-2">{copy.firstName}</label>
                <input
                  type="text"
                  className="bg-transparent border-b border-neutral-600 focus:border-white outline-none py-2 text-sm md:text-base"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-2">{copy.lastName}</label>
                <input
                  type="text"
                  className="bg-transparent border-b border-neutral-600 focus:border-white outline-none py-2 text-sm md:text-base"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-2">{copy.email}</label>
                <input
                  type="email"
                  className="bg-transparent border-b border-neutral-600 focus:border-white outline-none py-2 text-sm md:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <label className="text-sm mb-2">{copy.message}</label>
              <textarea
                rows={4}
                className="bg-transparent border-b border-neutral-600 focus:border-white outline-none py-2 text-sm md:text-base resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Checkboxes + Submit button */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3 text-xs md:text-sm text-neutral-200">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="mt-0.5 accent-white"
                  />
                  <span>{copy.newsletter}</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 accent-white"
                  />
                  <span>{copy.privacy}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !privacyConsent}
                className="self-end inline-flex items-center justify-center rounded-full border border-white px-8 py-2 text-sm md:text-base font-medium text-black bg-white hover:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? copy.sending : copy.submit}
                <span className="ml-2">→</span>
              </button>
            </div>

            {/* Status message */}
            {status === "success" && (
              <p className="text-xs md:text-sm text-emerald-400">
                {copy.success}
              </p>
            )}
            {status === "error" && (
              <p className="text-xs md:text-sm text-red-400">{copy.error}</p>
            )}
          </form>
        </div>
      </div>

      {/* Λευκό block στο κάτω μέρος (Start your project) */}
      <div className="relative z-10 mt-12">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-10 pb-10">
          <div className="bg-white text-black rounded-t-[80px] md:rounded-t-[120px] px-8 md:px-16 py-10 md:py-14">
            <p className="text-2xl md:text-4xl font-semibold tracking-[0.1em] uppercase mb-6">
              {copy.startYourProject}
            </p>
            <p className="text-lg md:text-2xl mb-1">info@webkey.gr</p>
            <p className="text-lg md:text-2xl">{copy.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
