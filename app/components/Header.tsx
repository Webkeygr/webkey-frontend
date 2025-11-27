"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import BubbleMenu from "./BubbleMenu";
import LanguageSwitcher from "./LanguageSwitcher";

type HeaderProps = {
  logoSrc?: string;
  // τα κρατάω στο type αν τα χρειαστούμε ξανά, αλλά δεν χρησιμοποιούνται στο header πλέον
  ctaHref?: string;
  ctaText?: string;
};

// Μικρό hook που ελέγχει αν ο μαύρος κύκλος του AboutPhilosophy έχει γεμίσει την οθόνη
function useAboutDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      const circle = document.querySelector<HTMLElement>(".about-black-circle");
      if (!circle) {
        setIsDark(false);
        return;
      }

      const rect = circle.getBoundingClientRect();
      const vw = window.innerWidth || 0;
      const vh = window.innerHeight || 0;

      // Θεωρούμε "dark phase" όταν ο κύκλος καλύπτει σχεδόν όλη την οθόνη
      const coversScreen =
        rect.width >= vw * 0.9 &&
        rect.height >= vh * 0.9 &&
        rect.top <= 0.1 * vh &&
        rect.bottom >= 0.9 * vh;

      setIsDark(coversScreen);
    };

    check();
    window.addEventListener("scroll", check);
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
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

  // Default logo παντού, white logo ΜΟΝΟ όταν ο κύκλος είναι full screen
  const logoToShow = isAboutDark ? "/images/logo-webkey-white.svg" : logoSrc;

  return (
    <BubbleMenu
      logo={
        <Link href="/" aria-label="WebKey home" className="inline-block">
          <Image
            src={logoToShow}
            alt="WebKey"
            width={220}
            height={80}
            priority
            className="header-logo"
          />
        </Link>
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
