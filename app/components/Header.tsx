// app/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import BubbleMenu from "./BubbleMenu";

type HeaderProps = {
  logoSrc?: string;
  ctaHref?: string;
  ctaText?: string;
};

export default function Header({
  logoSrc = "/images/logo-webkey.svg",
  ctaHref = "/contact",
  ctaText = "Get a quote",
}: HeaderProps) {
  const items = [
    {
      label: "home",
      href: "/",
      ariaLabel: "Home",
      rotation: -8,
      hoverStyles: { bgColor: "#3b82f6", textColor: "#fff" },
    },
    {
      label: "about",
      href: "/about",
      ariaLabel: "About",
      rotation: 8,
      hoverStyles: { bgColor: "#10b981", textColor: "#fff" },
    },
    {
      label: "services",
      href: "/services",
      ariaLabel: "Services",
      rotation: 8,
      hoverStyles: { bgColor: "#f59e0b", textColor: "#fff" },
    },
    {
      label: "blog",
      href: "/blog",
      ariaLabel: "Blog",
      rotation: 8,
      hoverStyles: { bgColor: "#ef4444", textColor: "#fff" },
    },
    {
      label: "contact",
      href: "/contact",
      ariaLabel: "Contact",
      rotation: -8,
      hoverStyles: { bgColor: "#8b5cf6", textColor: "#fff" },
    },
  ];

  return (
    <BubbleMenu
      logo={
        <Image src={logoSrc} alt="Webkey" width={150} height={32} priority />
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
        <Link href={ctaHref} className="cta-link" aria-label={ctaText}>
          {ctaText}
        </Link>
      }
    />
  );
}
