// app/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import StaggeredMenu from "./StaggeredMenu";
import GlassSurface from "./GlassSurface";
import { useMemo } from "react";

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
  const menuItems = useMemo(
    () => [
      { label: "Home", ariaLabel: "Go to home page", link: "/" },
      { label: "About", ariaLabel: "Learn about us", link: "/about" },
      { label: "Services", ariaLabel: "View our services", link: "/services" },
      { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
    ],
    []
  );

  const socialItems = useMemo(
    () => [
      { label: "Twitter", link: "https://twitter.com" },
      { label: "GitHub", link: "https://github.com" },
      { label: "LinkedIn", link: "https://linkedin.com" },
    ],
    []
  );

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
        zIndex: 300,            // πάνω από το hero
        background: "transparent",
        pointerEvents: "none",  // επιτρέπουμε clicks μόνο στα παιδιά
      }}
    >
      {/* Left: Logo */}
      <Link
        href="/"
        aria-label="Webkey home"
        style={{ display: "inline-flex", alignItems: "center", gap: 12, pointerEvents: "auto" }}
      >
        <Image src={logoSrc} alt="Webkey" width={132} height={28} priority />
      </Link>

      {/* Right: CTA + Hamburger */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "nowrap",
          whiteSpace: "nowrap", // ΜΗ σπάει γραμμή
          pointerEvents: "auto",
        }}
      >
        <GlassSurface
          width="auto"
          height={44}
          borderRadius={999}
          backgroundOpacity={0.12}
          saturation={1.6}
          displace={0.6}
          distortionScale={-120}
          brightness={70}
          opacity={0.9}
          className="cta-glass"
          style={{ padding: "0 14px" }}
        >
          <Link href={ctaHref} className="cta-btn" aria-label={ctaText}>
            {ctaText}
          </Link>
        </GlassSurface>

        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials
          displayItemNumbering
          logoUrl={logoSrc}
          colors={["#B19EEF", "#5227FF"]}
          useGlassToggle
          toggleGlassProps={{
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundOpacity: 0.12,
            saturation: 1.6,
            displace: 0.6,
            distortionScale: -120,
            brightness: 70,
            opacity: 0.9,
          }}
          useGlassPanel
          panelGlassProps={{
            width: "100%",
            height: "100%",
            borderRadius: 0,
            backgroundOpacity: 0.08,
            saturation: 1.6,
            displace: 0.8,
            distortionScale: -160,
            brightness: 65,
            opacity: 0.9,
          }}
          isFixed     // <<--- ΣΗΜΑΝΤΙΚΟ: κάνει το wrapper full-viewport
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          accentColor="#fcec45"
          className="header-staggered"
        />
      </div>
    </header>
  );
}
