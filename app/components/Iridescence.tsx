"use client";

import React, { useEffect, useRef, useState } from "react";
import "./Iridescence.css";

/**
 * Μικρό, inline 3D value-noise ([-1,1]) ώστε να ΜΗΝ χρειαζόμαστε το package "simplex-noise".
 * Δεν είναι simplex, αλλά για wavy φόντο δίνει το ίδιο "organic" αποτέλεσμα.
 */
function createNoise3D() {
  // hash: επιστρέφει [0,1)
  const hash = (x: number, y: number, z: number) => {
    // γρήγορο Integer hash
    let n = x * 15731 + y * 789221 + z * 1376312589;
    n = (n << 13) ^ n;
    const t = (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff;
    return t / 0x7fffffff;
  };

  // smoothstep/ fade
  const fade = (t: number) => t * t * (3 - 2 * t);

  // lerp
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // value noise 3D (trilinear)
  const value3D = (x: number, y: number, z: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);

    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;

    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);

    const x0 = xi, x1 = xi + 1;
    const y0 = yi, y1 = yi + 1;
    const z0 = zi, z1 = zi + 1;

    const c000 = hash(x0, y0, z0);
    const c100 = hash(x1, y0, z0);
    const c010 = hash(x0, y1, z0);
    const c110 = hash(x1, y1, z0);
    const c001 = hash(x0, y0, z1);
    const c101 = hash(x1, y0, z1);
    const c011 = hash(x0, y1, z1);
    const c111 = hash(x1, y1, z1);

    const x00 = lerp(c000, c100, u);
    const x10 = lerp(c010, c110, u);
    const x01 = lerp(c001, c101, u);
    const x11 = lerp(c011, c111, u);

    const y0v = lerp(x00, x10, v);
    const y1v = lerp(x01, x11, v);

    const val = lerp(y0v, y1v, w);
    return val * 2 - 1; // [-1,1]
  };

  return (x: number, y: number, z: number) => value3D(x, y, z);
}

type IridescenceProps = {
  className?: string;

  // Wavy ρυθμίσεις
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  waveOpacity?: number;

  // Συμβατότητα με παλιό API (αν έρχονται από Hero.tsx)
  speed?: number; // 0.6 κλπ
  scale?: number;
  opacity?: number;
  colorA?: string;
  colorB?: string;
  mouseReact?: boolean;
  amplitude?: number;
  [key: string]: any;
};

export default function Iridescence({
  className = "",
  colors,
  waveWidth = 56,
  backgroundFill = "#ffffff", // ΛΕΥΚΟ φόντο
  blur = 16,
  waveOpacity = 0.6,

  // από Hero.tsx συνήθως έρχεται speed={0.6}
  speed = 0.8,

  // αν δοθούν, μπαίνουν πρώτες στην παλέτα
  colorA,
  colorB,
}: IridescenceProps) {
  const waveColors =
    colors ??
    [
      colorA ?? "#0090FF", // cyan/blue
      colorB ?? "#FF00F2", // magenta
      "#818cf8",           // indigo
      "#c084fc",           // purple
      "#22d3ee",           // cyan
    ];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const noise3D = useRef(createNoise3D()).current;

  // Safari blur fallback
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0,
      t = 0,
      raf = 0;

    // map speed (0.8 ≈ “γρήγορα”, 0.4 ≈ “αργά”)
    const timeStep = 0.0015 * (typeof speed === "number" ? speed : 1);

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      w = (canvas.width = Math.max(1, Math.floor(rect.width)));
      h = (canvas.height = Math.max(1, Math.floor(rect.height)));
      ctx.filter = `blur(${blur}px)`;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const drawWave = (n: number) => {
      t += timeStep;
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = waveColors[i % waveColors.length];

        for (let x = 0; x < w; x += 5) {
          // “οργανικό” κύμα με 2 κλίμακες θορύβου
          const y =
            noise3D(x / 800, 0.3 * i, t) * 100 +
            noise3D(x / 1200, 0.15 * i, t * 0.5) * 40;
          ctx.lineTo(x, y + h * 0.5);
        }

        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      // background (λευκό)
      ctx.globalAlpha = 1;
      ctx.fillStyle = backgroundFill;
      ctx.fillRect(0, 0, w, h);

      // waves
      ctx.globalAlpha = waveOpacity;
      drawWave(5);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [waveColors, waveWidth, backgroundFill, blur, waveOpacity, speed]);

  return (
    <div ref={containerRef} className={`iridescence-container ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={isSafari ? { filter: `blur(${blur}px)` } : undefined}
      />
    </div>
  );
}
