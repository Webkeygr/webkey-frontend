"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./StaggeredMenu.css";
import GlassSurface from "./GlassSurface";

type MenuItem = { label: string; ariaLabel: string; link: string };
type GlassProps = React.ComponentProps<typeof GlassSurface>;

type Props = {
  position?: "left" | "right";
  colors?: string[];
  items?: MenuItem[];
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

  // Glass
  useGlassToggle?: boolean;
  toggleGlassProps?: Partial<GlassProps>;
  useGlassPanel?: boolean;
  panelGlassProps?: Partial<GlassProps>;

  // Συμπεριφορές
  iconOnlyToggle?: boolean;       // μόνο (+) χωρίς label
  showInternalHeader?: boolean;   // δεν το χρησιμοποιούμε εδώ
  showPrelayers?: boolean;        // default: false όταν έχουμε glass panel
};

export default function StaggeredMenu({
  position = "right",
  colors = ["#B19EEF", "#5227FF"],
  items = [],
  displayItemNumbering = true,
  className,
  logoUrl = "/images/logo-webkey.svg",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  accentColor = "#5227FF",
  changeMenuColorOnOpen = true,
  isFixed = true,
  onMenuOpen,
  onMenuClose,

  useGlassToggle = true,
  toggleGlassProps,
  useGlassPanel = true,
  panelGlassProps,

  iconOnlyToggle = true,
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
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));

    const layerStates = layers.map((el) => ({ el, start: Number(gsap.getProperty(el, "xPercent")) }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity" as any]: 0 });

    const tl = gsap.timeline({ paused: true });
    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07);
    });
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(panel, { xPercent: panelStart }, { xPercent: 0, duration: panelDuration, ease: "power4.out" }, panelInsertTime);

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
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

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => (busyRef.current = false));
      tl.play(0);
    } else busyRef.current = false;
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const off = position === "left" ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: off,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => (busyRef.current = false),
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.to(icon, { rotate: opening ? 225 : 0, duration: opening ? 0.8 : 0.35, ease: opening ? "power4.out" : "power3.inOut" });
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const target = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, { color: target, delay: 0.18, duration: 0.3, ease: "power2.out" });
      } else gsap.set(btn, { color: menuButtonColor });
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  const animateText = useCallback((opening: boolean) => {
    if (iconOnlyToggle) return; // icon-only: δεν κινούμε κείμενο
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const seq = [currentLabel, targetLabel, targetLabel];
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const finalShift = ((seq.length - 1) / seq.length) * 100;
    textCycleAnimRef.current = gsap.to(inner, { yPercent: -finalShift, duration: 0.8, ease: "power4.out" });
  }, [iconOnlyToggle]);

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
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  // --- Toggle (επιστρέφεται ΠΡΙΝ το fixed wrapper για σωστή διάταξη στο header)
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
              <span className="sm-toggle-line" key={i}>
                {l}
              </span>
            ))}
          </span>
        </span>
      )}
      <span ref={iconRef} className="sm-icon" aria-hidden="true">
        <span ref={plusHRef} className="sm-icon-line sm-icon-line--dark" />
        <span ref={plusVRef} className="sm-icon-line sm-icon-line-v sm-icon-line--dark" />
      </span>
    </button>
  );

  const ToggleNode = useGlassToggle ? (
    <GlassSurface
      width={44}
      height={44}
      borderRadius={999}
      backgroundOpacity={0.16}
      saturation={1.7}
      displace={0.4}
      distortionScale={-120}
      brightness={76}
      opacity={0.94}
      forceSvgMode
      mixBlendMode="screen"
      redOffset={2}
      greenOffset={2}
      blueOffset={2}
      className="sm-toggle-glass"
      style={{ padding: 0 }}
      {...toggleGlassProps}
    >
      {ToggleButton}
    </GlassSurface>
  ) : (
    ToggleButton
  );

  // --- Panel (fixed wrapper μόνο για το panel)
  return (
    <>
      {ToggleNode}

      <div
        className={(className ? className + " " : "") + "staggered-menu-wrapper" + (isFixed ? " fixed-wrapper" : "")}
        style={accentColor ? ({ ["--sm-accent" as any]: accentColor } as React.CSSProperties) : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        {shouldShowPrelayers && (
          <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
            {colors.slice(0, 2).map((c, i) => (
              <div key={i} className="sm-prelayer" style={{ background: c }} />
            ))}
          </div>
        )}

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
              forceSvgMode
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

                {/* Bottom CTA αντί για socials */}
                <div className="sm-panel-cta-wrap">
                  <a href="/contact" className="sm-panel-cta">Unleash your idea</a>
                </div>
              </div>
            </GlassSurface>
          ) : (
            <div className="sm-panel-inner">{/* non-glass */}</div>
          )}
        </aside>
      </div>
    </>
  );
}
