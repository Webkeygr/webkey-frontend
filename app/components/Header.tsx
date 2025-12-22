// app/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import BubbleMenu from "./BubbleMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import { usePageTransition } from "./PageTransition"; // ✅ ΜΟΝΟ αυτό το import προστέθηκε

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
      // ✅ Αν είμαστε σε σελίδα που θέλει ΠΑΝΤΑ light header (π.χ. Project Details)
      // τότε δεν επιτρέπουμε να μπει dark state από About trigger
      

      const circle = document.querySelector<HTMLElement>(".about-black-circle");

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

    const footer = document.getElementById("site-footer");
    if (!footer) {
      setIsFooterDark(false);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        // true όταν το footer φαίνεται στο viewport
        setIsFooterDark(entry.isIntersecting);
      },
      {
        // μόλις αρχίσει να μπαίνει, κάνε το dark
        threshold: 0.01,
      }
    );

    obs.observe(footer);

    return () => {
      obs.disconnect();
    };
  }, []);

  return isFooterDark;
}



export default function Header({
  logoSrc = "/images/logo-webkey.svg",
}: HeaderProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { startTransition } = usePageTransition(); // ✅ χρήση του page transition

  const isEnglish = pathname.startsWith("/en");

  const isPortfolioPage =
  pathname === "/portfolio" ||
  pathname === "/en/portfolio" ||
  pathname.startsWith("/portfolio/") ||
  pathname.startsWith("/en/portfolio/");

  // Βασικά paths ΧΩΡΙΣ locale
  const rawItems = [
    {
      label: "home",
      baseHref: "/",
      ariaLabel: "Home",
      rotation: -8,
      hoverStyles: { bgColor: "#4FAAFF", textColor: "#fff" },
    },
    {
      label: "portfolio",
      baseHref: "/portfolio",
      ariaLabel: "Portfolio",
      rotation: 8,
      hoverStyles: { bgColor: "#70D3F3", textColor: "#fff" },
    },
    {
      label: "services",
      baseHref: "/services",
      ariaLabel: "Services",
      rotation: 8,
      hoverStyles: { bgColor: "#F823F4", textColor: "#fff" },
    },
    {
      label: "blog",
      baseHref: "/blog",
      ariaLabel: "Blog",
      rotation: 8,
      hoverStyles: { bgColor: "#C48CFC", textColor: "#fff" },
    },
    {
      label: "contact",
      baseHref: "/contact",
      ariaLabel: "Contact",
      rotation: -8,
      hoverStyles: { bgColor: "#9DA5FA", textColor: "#fff" },
    },
  ] as const;

  // Αν είμαστε σε EN, προσθέτουμε /en μπροστά στα href
  const items = rawItems.map(({ baseHref, ...rest }) => {
    const href = isEnglish
      ? baseHref === "/"
        ? "/en/"
        : `/en${baseHref}`
      : baseHref;

    return { ...rest, href };
  });

  // Πιάνει ΚΑΙ /contact ΚΑΙ /en/contact
  const isContactPage = pathname.endsWith("/contact");

  const isAboutDark = useAboutDark();
  const isFooterDark = useFooterZone();

  // Θέλουμε "λευκό header" είτε στο About dark phase είτε στο footer zone είτε στη σελίδα contact
  // ➕ αλλά ΟΧΙ όταν είμαστε στο /portfolio
  const isHeaderDark =
  (isAboutDark && !isPortfolioPage) ||
  isFooterDark ||
  isContactPage;

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

  // Αν είμαστε σε /en/... στέλνουμε το logo στο /en/, αλλιώς στο /
  const homeHref = isEnglish ? "/en/" : "/";

  const handleLogoClick = () => {
    startTransition("Home", () => {
      router.push(homeHref);
    });
  };

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
          onClick={handleLogoClick}
          style={{ paddingTop: 20, cursor: "pointer" }}
          className="site-logo header-logo"
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
      rightSlot={
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      }
    />
  );
}
