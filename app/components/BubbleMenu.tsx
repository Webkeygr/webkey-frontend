"use client";

import { useState, useRef, useEffect } from "react";
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
  logo: React.ReactNode;
  items: Item[];
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  rightSlot?: React.ReactNode;
};

export default function BubbleMenu({
  logo,
  items,
  menuAriaLabel = "Toggle navigation",
  menuBg = "#fff",
  menuContentColor = "#111",
  useFixedPosition = true,
  animationEase = "back.out(1.5)",
  animationDuration = 0.5,
  staggerDelay = 0.12,
  rightSlot,
}: Props) {
  const [open, setOpen] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);

  const handleToggle = () => setOpen((v) => !v);

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) setOpen(false);
  };

  useEffect(() => {
    const overlay = overlayRef.current!;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (open) {
      gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.04, 0.04);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase,
        }).to(
          labels[i],
          {
            y: 0,
            autoAlpha: 1,
            duration: animationDuration * 0.9,
            ease: "power3.out",
          },
          `-=${animationDuration * 0.8}`
        );
      });
    } else {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power3.in",
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        },
      });
    }
  }, [open, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const applyRot = () => {
      const isDesktop = window.innerWidth >= 900;
      bubblesRef.current.forEach((b, i) => {
        const rot = isDesktop ? items[i]?.rotation ?? 0 : 0;
        gsap.set(b, { rotation: rot });
      });
    };
    applyRot();
    window.addEventListener("resize", applyRot);
    return () => window.removeEventListener("resize", applyRot);
  }, [items]);

  const containerCls = [
    "bubble-menu",
    useFixedPosition ? "fixed" : "absolute",
  ].join(" ");

  const overlayCls = [
    "bubble-menu-items",
    useFixedPosition ? "fixed" : "absolute",
    open ? "open" : "",
  ].join(" ");

  return (
    <>
      <nav className={containerCls} aria-label="Main navigation">
        {/* Logo χωρίς pill */}
        <div className="logo-plain" aria-label="Logo">
          {logo}
        </div>

        {/* Δεξιά συστάδα: CTA + Toggle */}
        <div className="right-cluster">
          {rightSlot ? <div className="cta-bubble">{rightSlot}</div> : null}

          <button
            type="button"
            className={`toggle-bubble ${open ? "open" : ""}`}
            onClick={handleToggle}
            aria-label={menuAriaLabel}
            aria-pressed={open}
            style={{ background: menuBg }}
          >
            <span
              className="menu-line"
              style={{ background: menuContentColor }}
            />
            <span
              className="menu-line"
              style={{ background: menuContentColor }}
            />
          </button>
        </div>
      </nav>

      {/* Overlay – μόνιμα mounted για smooth fade */}
      <div
        ref={overlayRef}
        className={overlayCls}
        onClick={onOverlayClick}
        aria-hidden={!open}
      >
        <div className="bm-backdrop" />
        <ul className="pill-list" role="menu" aria-label="Menu links">
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
                /* --- FIX: επιστρέφουμε void --- */
                ref={(el) => {
                  if (el) bubblesRef.current[idx] = el;
                }}
                onClick={() => setOpen(false)}
              >
                <span
                  className="pill-label"
                  /* --- FIX: επιστρέφουμε void --- */
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
    </>
  );
}
