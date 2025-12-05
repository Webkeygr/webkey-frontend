// app/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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

/**
 * Επιστρέφει true όταν είμαστε κοντά στο τέλος της σελίδας
 * (τελευταίο ~80% ενός viewport από το bottom) – το θεωρούμε "ζώνη footer".
 */
function useFooterZone(): boolean {
  const [isFooterDark, setIsFooterDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handle = () => {
      const doc = document.documentElement;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 0;
      const docHeight = doc.scrollHeight || document.body.scrollHeight || 0;

      const distanceFromBottom = docHeight - (scrollY + vh);

      // Όταν η απόσταση από το bottom είναι μικρότερη από ~0.8 * viewport,
      // θεωρούμε ότι έχουμε μπει στην περιοχή του footer.
      const inFooterZone = distanceFromBottom <= vh * 0.8;

      setIsFooterDark(inFooterZone);
    };

    handle();
    window.addEventListener("scroll", handle);
    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  return isFooterDark;
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

  const pathname = usePathname() ?? "";
  // Αν έχεις και /en/contact, μπορείς να το κάνεις: pathname?.endsWith("/contact")
  const isContactPage = pathname.endsWith("/contact");

  const isAboutDark = useAboutDark();
  const isFooterDark = useFooterZone();

  // Θέλουμε "λευκό header" είτε στο About dark phase είτε στο footer zone είτε στη σελίδα contact
  const isHeaderDark = isAboutDark || isFooterDark || isContactPage;

  // Προσθέτουμε / αφαιρούμε την .dark-header στο <body>
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isHeaderDark) {
      document.body.classList.add("dark-header");
    } else {
      document.body.classList.remove("dark-header");
    }
  }, [isHeaderDark]);

  // Επιλογή logo: κανονικό ή λευκό
  const effectiveLogo = isHeaderDark
    ? "/images/logo-webkey-white.svg"
    : logoSrc;

  return (
    <BubbleMenu
      /* LOGO χωρίς background “pill” και ~25% πιο μεγάλο – όπως το είχαμε */
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
