"use client";

import React, { useEffect, useRef, useState } from "react";
import "./Iridescence.css";

/** ---- Inline Simplex Noise 3D (χωρίς dependency) ----
 * Επιστρέφει τιμή ~[-1,1]. Αρκετά κοντά στο πακέτο `simplex-noise`
 * ώστε το αποτέλεσμα/κίνηση να ταιριάζει οπτικά με το demo.
 */
function createSimplex3D() {
  const F3 = 1.0 / 3.0;
  const G3 = 1.0 / 6.0;

  // pseudo-random permutation (σταθερός σπόρος για σταθερό pattern)
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let seed = 1337;
  const rand = () => ((seed = (seed * 1103515245 + 12345) | 0) >>> 16) & 255;
  for (let i = 255; i > 0; i--) {
    const j = rand() % (i + 1);
    const t = p[i]; p[i] = p[j]; p[j] = t;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const dot = (g: number[], x: number, y: number, z: number) => g[0]*x + g[1]*y + g[2]*z;
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  return (xin: number, yin: number, zin: number) => {
    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);

    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;

    let i1 = 0, j1 = 0, k1 = 0;
    let i2 = 0, j2 = 0, k2 = 0;
    if (x0 >= y0) {
      if (y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else               { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if (y0 < z0)       { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if (x0 < z0)  { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else               { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
    const x3 = x0 - 1 + 3*G3,  y3 = y0 - 1 + 3*G3,  z3 = z0 - 1 + 3*G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;

    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 > 0) {
      t0 *= t0;
      n0 = t0 * t0 * dot(grad3[perm[ii + perm[jj + perm[kk]]] % 12], x0, y0, z0);
    }

    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 > 0) {
      t1 *= t1;
      n1 = t1 * t1 * dot(grad3[perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12], x1, y1, z1);
    }

    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if (t2 > 0) {
      t2 *= t2;
      n2 = t2 * t2 * dot(grad3[perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12], x2, y2, z2);
    }

    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if (t3 > 0) {
      t3 *= t3;
      n3 = t3 * t3 * dot(grad3[perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12], x3, y3, z3);
    }

    // scale ~[-1,1] (τυπική κλίμακα simplex 3D)
    return 32.0 * (n0 + n1 + n2 + n3);
  };
}

type IridescenceProps = {
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  waveOpacity?: number;
  speed?: "slow" | "fast" | number; // δέχομαι και το numeric που ίσως στέλνει το Hero.tsx
  colorA?: string;
  colorB?: string;
  [key: string]: any;
};

export default function Iridescence({
  className = "",
  containerClassName = "",
  colors,
  waveWidth,
  backgroundFill = "#ffffff",  // ΛΕΥΚΟ background (αντί για μαύρο)
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  colorA,
  colorB,
}: IridescenceProps) {
  const noise = useRef(createSimplex3D()).current;

  // ίδια default παλέτα με το repo (θα μπει πρώτα colorA/B αν δοθούν)
  const waveColors =
    colors ?? [
      colorA ?? "#38bdf8",
      colorB ?? "#818cf8",
      "#c084fc",
      "#e879f9",
      "#22d3ee",
    ];

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getSpeed = () => {
    if (typeof speed === "number") return Math.max(0.0005, Math.min(0.004, 0.002 * speed));
    return speed === "fast" ? 0.002 : 0.001;
    // ακριβώς όπως στο demo για "slow"/"fast"
  };

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
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w: number, h: number, nt = 0, i: number, x: number;
    let animationId = 0;

    // --- ίδιες διαστάσεις με το demo: window.innerWidth/innerHeight
    const setSize = () => {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    setSize();

    const onResize = () => {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    window.addEventListener("resize", onResize);

    const drawWave = (n: number) => {
      nt += getSpeed();
      for (i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill || "#ffffff";
      ctx.globalAlpha = waveOpacity || 0.5;
      ctx.fillRect(0, 0, w, h);
      drawWave(5);
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, [blur, waveOpacity, backgroundFill, waveWidth, waveColors, speed]);

  return (
    <div
      className={`iridescence-container ${containerClassName}`}
      style={{ minHeight: "100vh" }} // όπως το demo ("h-screen")
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={isSafari ? { filter: `blur(${blur}px)` } : undefined}
      />
      {/* Αν το Hero σου βάζει children πάνω από το canvas, κρατάμε και className */}
      <div className={`relative z-10 ${className}`}></div>
    </div>
  );
}
