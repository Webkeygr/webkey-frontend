"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import GlassSurface from "./GlassSurface";
import "./StaggeredMenu.css";

type MenuItem = { label: string; ariaLabel?: string; link?: string };
type SocialItem = { label: string; link: string };

type Props = {
  position?: "left" | "right";
  colors?: string[];
  items?: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;

  /** Το toggle να εμφανίζεται inline (δίπλα στο CTA).
   * Το panel θα γίνει fixed για να καλύπτει όλο το viewport. */
  panelFixed?: boolean;

  showPrelayers?: boolean;

  /* Glass options */
  useGlassToggle?: boolean;
  iconOnlyToggle?: boolean;
  toggleGlassProps?: any;
  useGlassPanel?: boolean;
  panelGlassProps?: any;

  onMenuOpen?: () => void;
  onMenuClose?: () => void;
};

export const StaggeredMenu: React.FC<Props> = ({
  position = "right",
  colors = ["#B19EEF", "#5227FF"],
  items = [],
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = true,
  className,
  logoUrl = "/src/assets/logos/reactbits-gh-white.svg",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  accentColor = "#5227FF",
  changeMenuColorOnOpen = true,

  panelFixed = true,
  showPrelayers = false,

  useGlassToggle = true,
  iconOnlyToggle = true,
  toggleGlassProps,

  useGlassPanel = true,
  panelGlassProps,

  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLDivElement[]>([]);
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);

  const [textLines, setTextLines] = useState(["Menu", "Close"]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  /* ---------- Initial GSAP setup ---------- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: HTMLDivElement[] = [];
      if (preContainer) {
        preLayers = Array.from(
          preContainer.querySelectorAll(".sm-prelayer")
        ) as HTMLDivElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, force3D: true }); // GPU hint
      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current)
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  /* ---------- Open timeline ---------- */
  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector(
      ".sm-socials-title"
    ) as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "xPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 } as any);
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          } as any,
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    setAnimating(true);

    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
        setAnimating(false);
      });
      tl.play(0);
    } else {
      busyRef.current = false;
      setAnimating(false);
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onStart: () => setAnimating(true),
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll(".sm-panel-itemLabel")
        );
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll(
            ".sm-panel-list[data-numbering] .sm-panel-item"
          )
        );
        if (numberEls.length)
          gsap.set(numberEls, { "--sm-num-opacity": 0 } as any);

        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = Array.from(
          panel.querySelectorAll(".sm-socials-link")
        );
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
        setAnimating(false);
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.to(icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? "power4.out" : "power3.inOut",
      overwrite: "auto",
    });
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        colorTweenRef.current = gsap.to(btn, {
          color: opening ? openMenuButtonColor : menuButtonColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (!toggleBtnRef.current) return;
    const target = openRef.current ? openMenuButtonColor : menuButtonColor;
    const color = changeMenuColorOnOpen ? target : menuButtonColor;
    gsap.set(toggleBtnRef.current, { color });
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const seq = [currentLabel, targetLabel, targetLabel]; // πιο light cycling

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });
    const finalShift = ((seq.length - 1) / seq.length) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.55,
      ease: "power4.out",
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [
    playOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuOpen,
    onMenuClose,
  ]);

  const ToggleButton = (
    <button
      ref={toggleBtnRef}
      className={`sm-toggle${iconOnlyToggle ? " icon-only" : ""}`}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="staggered-menu-panel"
      onClick={toggleMenu}
      type="button"
      title={open ? "Close menu" : "Open menu"}
    >
      {!iconOnlyToggle && (
        <span
          ref={textWrapRef}
          className="sm-toggle-textWrap"
          aria-hidden="true"
        >
          <span ref={textInnerRef} className="sm-toggle-textInner">
            {textLines.map((l, i) => (
              <span className="sm-toggle-line" key={i}>
                {l}
              </span>
            ))}
          </span>
        </span>
      )}
      <span ref={iconRef} className="sm-icon" aria-hidden="true">
        <span ref={plusHRef} className="sm-icon-line sm-icon-line--dark" />
        <span
          ref={plusVRef}
          className="sm-icon-line sm-icon-line-v sm-icon-line--dark"
        />
      </span>
    </button>
  );

  return (
    <div
      className={(className ? className + " " : "") + "staggered-menu-wrapper"}
      style={
        accentColor
          ? ({ ["--sm-accent"]: accentColor } as React.CSSProperties)
          : undefined
      }
      data-position={position}
      data-open={open || undefined}
      data-animating={animating || undefined}
    >
      {/* Toggle: inline, δίπλα στο CTA */}
      {useGlassToggle ? (
        <div className="sm-toggle-glass">
          <GlassSurface
            width={44}
            height={44}
            borderRadius={999}
            {...toggleGlassProps}
          >
            {ToggleButton}
          </GlassSurface>
        </div>
      ) : (
        ToggleButton
      )}

      {/* Προ-στρώσεις (optional) */}
      {showPrelayers && (
        <div
          ref={preLayersRef}
          className={`sm-prelayers${panelFixed ? " panel-fixed" : ""}`}
          aria-hidden="true"
        >
          {(() => {
            const raw =
              colors && colors.length
                ? colors.slice(0, 4)
                : ["#1e1e22", "#35353c"];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div key={i} className="sm-prelayer" style={{ background: c }} />
            ));
          })()}
        </div>
      )}

      {/* PANEL: fixed για overlay */}
      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className={`staggered-menu-panel${panelFixed ? " panel-fixed" : ""}`}
        aria-hidden={!open}
      >
        {useGlassPanel ? (
          <GlassSurface className="sm-panel-glass" {...panelGlassProps}>
            <div className="sm-panel-inner sm-panel-inner--on-glass">
              <ul
                className="sm-panel-list"
                role="list"
                data-numbering={displayItemNumbering || undefined}
              >
                {(items && items.length ? items : [{ label: "No items" }]).map(
                  (it, idx) => (
                    <li className="sm-panel-itemWrap" key={it.label + idx}>
                      {it.link ? (
                        <a
                          className="sm-panel-item"
                          href={it.link}
                          aria-label={it.ariaLabel}
                          data-index={idx + 1}
                        >
                          <span className="sm-panel-itemLabel">{it.label}</span>
                        </a>
                      ) : (
                        <span className="sm-panel-item" aria-hidden="true">
                          <span className="sm-panel-itemLabel">{it.label}</span>
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>

              {/* Bottom CTA */}
              <div className="sm-panel-cta-wrap">
                <a
                  href="/contact"
                  className="sm-panel-cta"
                  aria-label="Unleash your idea"
                >
                  Unleash your idea
                </a>
              </div>
            </div>
          </GlassSurface>
        ) : (
          <div className="sm-panel-inner">{/* no-glass fallback */}</div>
        )}
      </aside>
    </div>
  );
};

export default StaggeredMenu;
