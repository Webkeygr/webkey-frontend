// app/components/StaggeredMenu.tsx
"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./StaggeredMenu.css";
import GlassSurface from "./GlassSurface";

type MenuItem = { label: string; ariaLabel: string; link: string };
type SocialItem = { label: string; link: string };
type GlassProps = React.ComponentProps<typeof GlassSurface>;

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
  isFixed?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;

  // Glass για toggle & panel
  useGlassToggle?: boolean;
  toggleGlassProps?: Partial<GlassProps>;
  useGlassPanel?: boolean;
  panelGlassProps?: Partial<GlassProps>;

  // Συμπεριφορές/flags
  iconOnlyToggle?: boolean;       // δείξε μόνο το (+) χωρίς label
  showInternalHeader?: boolean;   // κρύψε/δείξε το εσωτερικό header (logo+toggle)
  showPrelayers?: boolean;        // αν θα δείχνει τα “μπλε” prelayers (default: false όταν useGlassPanel)
};

export default function StaggeredMenu({
  position = "right",
  colors = ["#B19EEF", "#5227FF"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = "/images/logo-webkey.svg",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  accentColor = "#5227FF",
  changeMenuColorOnOpen = true,
  isFixed = false,
  onMenuOpen,
  onMenuClose,

  useGlassToggle = true,
  toggleGlassProps,
  useGlassPanel = true,
  panelGlassProps,

  iconOnlyToggle = true,
  showInternalHeader = false,
  showPrelayers,
}: Props) {
  const [open, setOpen] = useState(false);
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

  const shouldShowPrelayers = (showPrelayers ?? !useGlassPanel) === true;

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
        preLayers = Array.from(preContainer.querySelectorAll(".sm-prelayer")) as HTMLDivElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current!;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));
    const socialTitle = panel.querySelector(".sm-socials-title") as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const layerStates = layers.map((el) => ({ el, start: Number(gsap.getProperty(el, "xPercent")) }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity" as any]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07);
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
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: "power4.out", stagger: { each: 0.1, from: "start" } },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: "power2.out", ["--sm-num-opacity" as any]: 1, stagger: { each: 0.08, from: "start" } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: "power2.out" }, socialsStart);
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
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            },
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
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
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
    closeTweenRef.current?.kill();
    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));
        if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity" as any]: 0 });
        const socialTitle = panel.querySelector(".sm-socials-title") as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: "power4.out", overwrite: "auto" });
    } else {
      spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: "power3.inOut", overwrite: "auto" });
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
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
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, { yPercent: -finalShift, duration: 0.5 + lineCount * 0.07, ease: "power4.out" });
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
    if (!iconOnlyToggle) animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose, iconOnlyToggle]);

  // Το κουμπί toggle (με ή χωρίς κείμενο)
  const ToggleButton = (
    <button
      ref={toggleBtnRef}
      className={`sm-toggle ${iconOnlyToggle ? "icon-only" : ""}`}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="staggered-menu-panel"
      onClick={toggleMenu}
      type="button"
    >
      {!iconOnlyToggle && (
        <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
          <span ref={textInnerRef} className="sm-toggle-textInner">
            {textLines.map((l, i) => (
              <span className="sm-toggle-line" key={i}>{l}</span>
            ))}
          </span>
        </span>
      )}
      <span ref={iconRef} className="sm-icon" aria-hidden="true">
        <span ref={plusHRef} className="sm-icon-line" />
        <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
      </span>
    </button>
  );

  return (
    <div
      className={(className ? className + " " : "") + "staggered-menu-wrapper" + (isFixed ? " fixed-wrapper" : "")}
      style={accentColor ? ({ ["--sm-accent" as any]: accentColor } as React.CSSProperties) : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      {/* Προ-στρώσεις (μπλε) — εμφανίζονται μόνο αν ζητηθεί */}
      {shouldShowPrelayers && (
        <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ["#1e1e22", "#35353c"];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
          })()}
        </div>
      )}

      {/* ΜΟΝΟ το toggle (το εσωτερικό header παραμένει κρυφό εκτός αν ζητηθεί) */}
      {!showInternalHeader && (useGlassToggle ? (
        <GlassSurface
          width={iconOnlyToggle ? 44 : (toggleGlassProps?.width ?? "auto")}
          height={toggleGlassProps?.height ?? 44}
          borderRadius={toggleGlassProps?.borderRadius ?? 999}
          backgroundOpacity={toggleGlassProps?.backgroundOpacity ?? 0.16}
          saturation={toggleGlassProps?.saturation ?? 1.7}
          displace={toggleGlassProps?.displace ?? 0.4}
          distortionScale={toggleGlassProps?.distortionScale ?? -120}
          brightness={toggleGlassProps?.brightness ?? 76}
          opacity={toggleGlassProps?.opacity ?? 0.94}
          forceSvgMode={toggleGlassProps?.forceSvgMode ?? true}
          mixBlendMode={toggleGlassProps?.mixBlendMode ?? "screen"}
          redOffset={toggleGlassProps?.redOffset ?? 2}
          greenOffset={toggleGlassProps?.greenOffset ?? 2}
          blueOffset={toggleGlassProps?.blueOffset ?? 2}
          className={`sm-toggle-glass ${toggleGlassProps?.className || ""}`}
          style={{ padding: 0, ...(toggleGlassProps?.style || {}) }}
        >
          {ToggleButton}
        </GlassSurface>
      ) : (
        ToggleButton
      ))}

      {/* PANEL */}
      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className={`staggered-menu-panel${useGlassPanel ? " sm-panel--glass" : ""}`}
        aria-hidden={!open}
      >
        {useGlassPanel ? (
          <GlassSurface
            width={panelGlassProps?.width ?? "100%"}
            height={panelGlassProps?.height ?? "100%"}
            borderRadius={panelGlassProps?.borderRadius ?? 10}
            backgroundOpacity={panelGlassProps?.backgroundOpacity ?? 0.16}
            saturation={panelGlassProps?.saturation ?? 1.8}
            displace={panelGlassProps?.displace ?? 0.6}
            distortionScale={panelGlassProps?.distortionScale ?? -140}
            brightness={panelGlassProps?.brightness ?? 76}
            opacity={panelGlassProps?.opacity ?? 0.92}
            forceSvgMode={panelGlassProps?.forceSvgMode ?? true}
            mixBlendMode={panelGlassProps?.mixBlendMode ?? "screen"}
            redOffset={panelGlassProps?.redOffset ?? 2}
            greenOffset={panelGlassProps?.greenOffset ?? 2}
            blueOffset={panelGlassProps?.blueOffset ?? 2}
            className={`sm-panel-glass ${panelGlassProps?.className || ""}`}
            style={{ padding: 0, ...(panelGlassProps?.style || {}) }}
          >
            <div className="sm-panel-inner sm-panel-inner--on-glass">
              <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
                {items && items.length ? (
                  items.map((it, idx) => (
                    <li className="sm-panel-itemWrap" key={it.label + idx}>
                      <a className="sm-panel-item" href={it.link} aria-label={it.ariaLabel} data-index={idx + 1}>
                        <span className="sm-panel-itemLabel">{it.label}</span>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="sm-panel-itemWrap" aria-hidden="true">
                    <span className="sm-panel-item">
                      <span className="sm-panel-itemLabel">No items</span>
                    </span>
                  </li>
                )}
              </ul>

              {displaySocials && socialItems && socialItems.length > 0 && (
                <div className="sm-socials" aria-label="Social links">
                  <h3 className="sm-socials-title">Socials</h3>
                  <ul className="sm-socials-list" role="list">
                    {socialItems.map((s, i) => (
                      <li key={s.label + i} className="sm-socials-item">
                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </GlassSurface>
        ) : (
          <div className="sm-panel-inner">{/* non-glass fallback */}</div>
        )}
      </aside>
    </div>
  );
}
