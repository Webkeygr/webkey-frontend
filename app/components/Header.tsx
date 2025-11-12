"use client";

import Image from "next/image";
import Link from "next/link";
import BubbleMenu from "./BubbleMenu";
import LanguageSwitcher from "./LanguageSwitcher";

type HeaderProps = {
  logoSrc?: string;
  ctaHref?: string;
  ctaText?: string;
};

export default function Header({
  logoSrc = "/images/logo-webkey.svg",
  ctaHref = "/contact",
  ctaText = "Unleash your idea",
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
      /* LOGO χωρίς background “pill” και ~25% πιο μεγάλο */
      logo={
        <Image
          src={logoSrc}
          alt="Webkey"
          width={250}
          height={100}
          priority
          style={{ paddingTop: 20 }}
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
      /* CTA δίπλα από το toggle + Language Switcher */
      rightSlot={
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href={ctaHref} className="cta-link" aria-label={ctaText}>
            {ctaText}
          </Link>
        </div>
      }
    />
  );
}
