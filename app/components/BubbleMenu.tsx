"use client";

import { useState, useRef, useEffect, ReactNode, CSSProperties } from "react";
import { gsap } from "gsap";
import "./BubbleMenu.css";

type Item = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: { bgColor?: string; textColor?: string };
};

type Props = {
  logo: ReactNode;
  items: Item[];
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  /** ΝΕΟ: ό,τι θες να μπει δεξιά από το toggle (π.χ. CTA) */
  rightSlot?: ReactNode;
};

const FALLBACK_ITEMS: Item[] = [
  {
    label: "home",
    href: "#",
    ariaLabel: "Home",
    rotation: -8,
    hoverStyles: { bgColor: "#3b82f6", textColor: "#fff" },
  },
  {
    label: "about",
    href: "#",
    ariaLabel: "About",
    rotation: 8,
    hoverStyles: { bgColor: "#10b981", textColor: "#fff" },
  },
  {
    label: "services",
    href: "#",
    ariaLabel: "Services",
    rotation: 8,
    hoverStyles: { bgColor: "#f59e0b", textColor: "#fff" },
  },
  {
    label: "blog",
    href: "#",
    ariaLabel: "Blog",
    rotation: 8,
    hoverStyles: { bgColor: "#ef4444", textColor: "#fff" },
  },
  {
    label: "contact",
    href: "#",
    ariaLabel: "Contact",
    rotation: -8,
    hoverStyles: { bgColor: "#8b5cf6", textColor: "#fff" },
  },
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = "Toggle navigation",
  menuBg = "#fff",
  menuContentColor = "#111",
  useFixedPosition = true,
  items = FALLBACK_ITEMS,
  animationEase = "back.out(1.5)",
  animationDuration = 0.5,
  staggerDelay = 0.12,
  rightSlot,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);

  const containerClassName = [
    "bubble-menu",
    useFixedPosition ? "fixed" : "absolute",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleToggle = () => {
    const next = !isMenuOpen;
    if (next) setShowOverlay(true);
    setIsMenuOpen(next);
    onMenuClick?.(next);
  };

  // Animate open / close
  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );

      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase,
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: "power3.out",
            },
            `-=${animationDuration * 0.9}`
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.18,
        ease: "power3.in",
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.18,
        ease: "power3.in",
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  // Rotation reset on mobile
  useEffect(() => {
    const handleResize = () => {
      if (!isMenuOpen) return;
      const isDesktop = window.innerWidth >= 900;
      bubblesRef.current.forEach((bubble, i) => {
        const item = items[i];
        const rot = isDesktop ? item.rotation ?? 0 : 0;
        gsap.set(bubble, { rotation: rot });
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, items]);

  return (
    <>
      <nav
        className={containerClassName}
        style={style}
        aria-label="Main navigation"
      >
        {/* Left: Logo */}
        <div
          className="bubble logo-bubble"
          aria-label="Logo"
          style={{ background: menuBg }}
        >
          <span className="logo-content">{logo}</span>
        </div>

        {/* Right: CTA (optional) + Toggle */}
        <div className="bubble-right">
          {rightSlot && <div className="bubble cta-bubble">{rightSlot}</div>}

          <button
            type="button"
            className={`bubble toggle-bubble menu-btn ${
              isMenuOpen ? "open" : ""
            }`}
            onClick={handleToggle}
            aria-label={menuAriaLabel}
            aria-pressed={isMenuOpen}
            style={{ background: menuBg }}
          >
            <span
              className="menu-line"
              style={{ background: menuContentColor }}
            />
            <span
              className="menu-line short"
              style={{ background: menuContentColor }}
            />
          </button>
        </div>
      </nav>

      {/* Fullscreen overlay + items */}
      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${
            useFixedPosition ? "fixed" : "absolute"
          }`}
          aria-hidden={!isMenuOpen}
          onClick={(e) => {
            // click έξω από τα pills => κλείσιμο
            if (e.target === overlayRef.current) setIsMenuOpen(false);
          }}
        >
          <ul
            className="pill-list"
            role="menu"
            aria-label="Menu links"
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item, idx) => (
              <li key={idx} role="none" className="pill-col">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link"
                  style={
                    {
                      "--item-rot": `${item.rotation ?? 0}deg`,
                      "--pill-bg": menuBg,
                      "--pill-color": menuContentColor,
                      "--hover-bg": item.hoverStyles?.bgColor || "#f3f4f6",
                      "--hover-color":
                        item.hoverStyles?.textColor || menuContentColor,
                    } as React.CSSProperties
                  }
                  ref={(el) => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className="pill-label"
                    ref={(el) => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
