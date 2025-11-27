// app/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import BubbleMenu from "./BubbleMenu";
import LanguageSwitcher from "./LanguageSwitcher";

type HeaderProps = {
  logoSrc?: string;
  // τα κρατάω στο type αν τα χρειαστούμε ξανά, αλλά δεν χρησιμοποιούνται στο header πλέον
  ctaHref?: string;
  ctaText?: string;
};

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

  return (
    <BubbleMenu
      /* LOGO */
      logo={
        <div className="header-logo-wrapper" style={{ paddingTop: 20 }}>
          {/* Κανονικό logo */}
          <Image
            src={logoSrc}
            alt="WebKey"
            width={250}
            height={100}
            priority
            className="header-logo header-logo-main"
          />
          {/* Λευκό logo για μαύρο φόντο */}
          <Image
            src="/images/logo-webkey-white.svg"
            alt="WebKey (white)"
            width={250}
            height={100}
            priority
            className="header-logo header-logo-white"
          />
        </div>
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
