"use client";

import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import "./Iridescence.css";

// Δέχομαι χαλαρά props για συμβατότητα με ό,τι στέλνει το Hero.tsx
type IridescenceProps = {
  className?: string;

  // Από το wavy:
  colors?: string[];          // προαιρετικά override της παλέτας κυμάτων
  waveWidth?: number;         // προεπιλογή 56
  backgroundFill?: string;    // προεπιλογή #fff
  blur?: number;              // προεπιλογή 16
  waveOpacity?: number;       // προεπιλογή 0.6

  // Συμβατότητα με το παλιό API – αγνοούνται ή χαρτογραφούνται:
  speed?: number;             // π.χ. 0.6 -> ρυθμός κίνησης (θα χαρτογραφηθεί)
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
  backgroundFill = "#ffffff",      // ΛΕΥΚΟ φόντο
  blur = 16,
  waveOpacity = 0.6,

  // από Hero.tsx συχνά έρχεται speed={0.6} – το χαρτογραφώ σε βήμα θορύβου
  speed = 0.8,

  // αν περάσεις colorA/B θα μπουν πρώτα στην παλέτα
  colorA,
  colorB,
}: IridescenceProps) {
  // ---- palette (blue + magenta like ζητήθηκε)
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

  // υποστήριξη Safari για blur στο canvas style
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  // ζωγραφική
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0,
      nt = 0,
      anim = 0;

    // Χαρτογράφηση speed (από αριθμό στο “βήμα χρόνου” για το noise)
    const timeStep = 0.0015 * (typeof speed === "number" ? speed : 1);

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      w = (canvas.width = Math.max(1, Math.floor(rect.width)));
      h = (canvas.height = Math.max(1, Math.floor(rect.height)));
      ctx.filter = `blur(${blur}px)`;
    };

    // resize observer στο container (όχι στο window)
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    // ζωγράφισε N waves
    const drawWave = (n: number) => {
      nt += timeStep;
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < w; x += 5) {
          // smooth, αργό κύμα – ταιριάζει για hero bg
          const y =
            noise3D(x / 800, 0.3 * i, nt) * 100 +
            // μικρό offset ώστε να “γεμίζει” διαγώνια
            noise3D(x / 1200, 0.15 * i, nt * 0.5) * 40;
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      // Λευκό φόντο
      ctx.globalAlpha = 1;
      ctx.fillStyle = backgroundFill;
      ctx.fillRect(0, 0, w, h);

      // Ημιδιαφανή κύματα
      ctx.globalAlpha = waveOpacity;
      drawWave(5);

      anim = requestAnimationFrame(render);
    };

    anim = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(anim);
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
