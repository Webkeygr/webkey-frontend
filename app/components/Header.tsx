// app/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BubbleMenu from "./BubbleMenu";
import LanguageSwitcher from "./LanguageSwitcher";

type HeaderProps = {
  logoSrc?: string;
  // τα κρατάω στο type αν τα χρειαστούμε ξανά, αλλά δεν χρησιμοποιούνται στο header πλέον
  ctaHref?: string;
  ctaText?: string;
};

/**
 * Κοιτάει το .about-black-circle στο DOM
 * και καταλαβαίνει πότε έχει πρακτικά γεμίσει την οθόνη.
 * Τότε:
 *  - επιστρέφει true
 *  - προσθέτει στο <body> την κλάση .about-dark
 */
function useAboutDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      const circle =
        document.querySelector<HTMLElement>(".about-black-circle");

      // Αν δεν υπάρχει το section, δεν είμαστε σε dark phase
      if (!circle) {
        setIsDark(false);
        document.body.classList.remove("about-dark");
        return;
      }

      const rect = circle.getBoundingClientRect();
      const vw = window.innerWidth || 0;
      const vh = window.innerHeight || 0;

      // Θεωρούμε "γεμάτη οθόνη" όταν ο κύκλος καλύπτει σχεδόν όλο το viewport
      const coversScreen =
        rect.width >= vw * 0.9 &&
        rect.height >= vh * 0.9 &&
        rect.top <= 0.1 * vh &&
        rect.bottom >= 0.9 * vh;

      setIsDark(coversScreen);

      if (coversScreen) {
        document.body.classList.add("about-dark");
      } else {
        document.body.classList.remove("about-dark");
      }
    };

    check();
    window.addEventListener("scroll", check);
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      document.body.classList.remove("about-dark");
    };
  }, []);

  return isDark;
}

export default function Header({
  logoSrc = "/images/logo-webkey.svg",
}: HeaderProps) {
  const items = [
    {
      label: "home",
      href: "/",
      ariaLabel: "Home",
      rotation: -8,
      hoverStyles: { bgColor: "#4FAAFF", textColor: "#fff" },
    },
    {
      label: "about",
      href: "/about",
      ariaLabel: "About",
      rotation: 8,
      hoverStyles: { bgColor: "#70D3F3", textColor: "#fff" },
    },
    {
      label: "services",
      href: "/services",
      ariaLabel: "Services",
      rotation: 8,
      hoverStyles: { bgColor: "#F823F4", textColor: "#fff" },
    },
    {
      label: "blog",
      href: "/blog",
      ariaLabel: "Blog",
      rotation: 8,
      hoverStyles: { bgColor: "#C48CFC", textColor: "#fff" },
    },
    {
      label: "contact",
      href: "/contact",
      ariaLabel: "Contact",
      rotation: -8,
      hoverStyles: { bgColor: "#9DA5FA", textColor: "#fff" },
    },
  ];

  const isAboutDark = useAboutDark();

  // --- Footer dark detection -----------------------------------
  const [isFooterDark, setIsFooterDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const footer = document.getElementById("home-footer");
    if (!footer || !(window as any).IntersectionObserver) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting && entry.intersectionRatio > 0.35;
        setIsFooterDark(visible);
      },
      {
        threshold: [0, 0.35, 0.7],
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Συνολική κατάσταση: χρειαζόμαστε "λευκό header" όταν
  // είτε το about-black-circle έχει γεμίσει την οθόνη
  // είτε είμαστε πάνω από το footer.
  const isHeaderDark = isAboutDark || isFooterDark;

  // Προσθέτουμε / αφαιρούμε την .dark-header από το <body>
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isHeaderDark) {
      document.body.classList.add("dark-header");
    } else {
      document.body.classList.remove("dark-header");
    }
  }, [isHeaderDark]);

  // Κανονικό logo παντού,
  // white logo όταν θέλουμε "λευκό header" (About black circle + Footer)
  const effectiveLogo = isHeaderDark
    ? "/images/logo-webkey-white.svg"
    : logoSrc;

  return (
    <BubbleMenu
      /* LOGO χωρίς background “pill” και ~25% πιο μεγάλο – όπως πριν */
      logo={
        <Image
          src={effectiveLogo}
          alt="WebKey"
          width={250}
          height={100}
          priority
          style={{ paddingTop: 20 }}
          className="header-logo"
        />
      }
      items={items}
      menuAriaLabel="Toggle navigation"
      menuBg="#ffffff"
      menuContentColor="#111111"
      useFixedPosition
      animationEase="back.out(1.5)"
      animationDuration={0.5}
      staggerDelay={0.12}
      /* Δίπλα από το toggle βάζουμε μόνο το language switcher */
      rightSlot={
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      }
    />
  );
}
