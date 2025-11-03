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
        zIndex: 300,
        background: "transparent",
        pointerEvents: "none",
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

      {/* Right cluster: CTA + Toggle */}
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
  {/* CTA – πλήρες glass */}
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
      href="/contact"
      className="cta-btn"
      aria-label="Get a quote"
      style={{ textShadow: "0 1px 2px rgba(0,0,0,.6)", cursor: "pointer" }}
    >
      Get a quote
    </Link>
  </GlassSurface>

  {/* Toggle + Panel */}
  <StaggeredMenu
    position="right"
    items={[
      { label: "Home", ariaLabel: "Go to home page", link: "/" },
      { label: "About", ariaLabel: "Learn about us", link: "/about" },
      { label: "Services", ariaLabel: "View our services", link: "/services" },
      { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
    ]}
    displayItemNumbering
    logoUrl="/images/logo-webkey.svg"
    colors={["#B19EEF", "#5227FF"]}
    iconOnlyToggle
    useGlassToggle
    toggleGlassProps={{
      width: 44,
      height: 44,
      borderRadius: 999,
      backgroundOpacity: 0.16,
      saturation: 1.7,
      displace: 0.4,
      distortionScale: -120,
      brightness: 76,
      opacity: 0.94,
      forceSvgMode: true,
      mixBlendMode: "screen",
      redOffset: 2, greenOffset: 2, blueOffset: 2,
    }}
    useGlassPanel
    panelGlassProps={{
      width: "100%",
      height: "100%",
      borderRadius: 10,
      backgroundOpacity: 0.16,
      saturation: 1.8,
      displace: 0.6,
      distortionScale: -140,
      brightness: 76,
      opacity: 0.92,
      forceSvgMode: true,
      mixBlendMode: "screen",
      redOffset: 2, greenOffset: 2, blueOffset: 2,
    }}
    isFixed
    showPrelayers={false}
    menuButtonColor="#fff"
    openMenuButtonColor="#fff"
    changeMenuColorOnOpen
    accentColor="#fcec45"
    className="header-staggered"
  />
</div>
    </header>
  );
}
