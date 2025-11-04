// app/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import BubbleMenu from "./BubbleMenu";
import GlassSurface from "./GlassSurface";

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
    <header
      className="site-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 300,
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      {/* Left: Logo */}
      <Link
        href="/"
        aria-label="Webkey home"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          pointerEvents: "auto",
        }}
      >
        <Image src={logoSrc} alt="Webkey" width={132} height={28} priority />
      </Link>

      {/* Right cluster: CTA + BubbleMenu */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
          pointerEvents: "auto",
        }}
      >
        {/* CTA (μένει ως έχει) */}
        <GlassSurface
          width="auto"
          height={44}
          borderRadius={999}
          backgroundOpacity={0.16}
          saturation={1.8}
          displace={0.4}
          distortionScale={-120}
          brightness={76}
          opacity={0.94}
          forceSvgMode
          style={{ padding: "0 16px" }}
        >
          <Link
            href={ctaHref}
            className="cta-btn"
            aria-label={ctaText}
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,.6)",
              cursor: "pointer",
            }}
          >
            {ctaText}
          </Link>
        </GlassSurface>

        {/* Bubble Menu */}
        <BubbleMenu
          logo={<Image src={logoSrc} alt="Webkey" width={120} height={28} />}
          items={items}
          menuAriaLabel="Toggle navigation"
          menuBg="#ffffff"
          menuContentColor="#111111"
          useFixedPosition={true} /* overlay full-viewport */
          animationEase="back.out(1.5)"
          animationDuration={0.5}
          staggerDelay={0.12}
        />
      </div>
    </header>
  );
}
