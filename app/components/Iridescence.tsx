"use client";

import React, { useEffect, useRef, useState } from "react";
import "./Iridescence.css";

/**
 * Inline 3D value-noise ([-1,1]) για wavy φόντο χωρίς extra package.
 */
function createNoise3D() {
  const hash = (x: number, y: number, z: number) => {
    let n = x * 15731 + y * 789221 + z * 1376312589;
    n = (n << 13) ^ n;
    const t = (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff;
    return t / 0x7fffffff;
  };
  const fade = (t: number) => t * t * (3 - 2 * t);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const value3D = (x: number, y: number, z: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = x - xi, yf = y - yi, zf = z - zi;
    const u = fade(xf), v = fade(yf), w = fade(zf);
    const c000 = hash(xi,     yi,     zi);
    const c100 = hash(xi + 1, yi,     zi);
    const c010 = hash(xi,     yi + 1, zi);
    const c110 = hash(xi + 1, yi + 1, zi);
    const c001 = hash(xi,     yi,     zi + 1);
    const c101 = hash(xi + 1, yi,     zi + 1);
    const c011 = hash(xi,     yi + 1, zi + 1);
    const c111 = hash(xi + 1, yi + 1, zi + 1);

    const x00 = lerp(c000, c100, u);
    const x10 = lerp(c010, c110, u);
    const x01 = lerp(c001, c101, u);
    const x11 = lerp(c011, c111, u);
    const y0v = lerp(x00, x10, v);
    const y1v = lerp(x01, x11, v);
    return (lerp(y0v, y1v, w) * 2 - 1);
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
  speed?: number;  // 0.6 κλπ (χρησιμοποιείται για ρυθμό)
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

  // από Hero.tsx συχνά έρχεται speed={0.6}
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

    let w = 0, h = 0, t = 0, raf = 0;

    // πιο ορατή κίνηση: baseline 0.002 * speed
    const timeStep = 0.002 * (typeof speed === "number" ? speed : 1);

    const setSize = () => {
      // Παίρνουμε μέγεθος από τον γονέα.
      const rect = container.getBoundingClientRect();
      // Fallback όταν ο γονιός είναι χωρίς ύψος (π.χ. height:100% αλλά ο δικός του γονιός 0px)
      const fallbackW = window.innerWidth;
      const fallbackH = Math.max(400, Math.floor(window.innerHeight * 0.7));

      w = canvas.width  = Math.max(1, Math.floor(rect.width  || fallbackW));
      h = canvas.height = Math.max(1, Math.floor(rect.height || fallbackH));

      // Αν όντως δεν έχει ύψος ο γονιός, δώσε minHeight για να “πιάσει” το 70vh
      if ((rect.height || 0) < 2) {
        container.style.minHeight = `${fallbackH}px`;
      }

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

        // Ξεκίνα από την αριστερή άκρη με moveTo για καθαρή γραμμή
        const y0 =
          noise3D(0 / 800, 0.3 * i, t) * 100 +
          noise3D(0 / 1200, 0.15 * i, t * 0.5) * 40 +
          h * 0.5;
        ctx.moveTo(0, y0);

        for (let x = 5; x < w; x += 5) {
          const y =
            noise3D(x / 800, 0.3 * i, t) * 100 +
            noise3D(x / 1200, 0.15 * i, t * 0.5) * 40 +
            h * 0.5;
          ctx.lineTo(x, y);
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
