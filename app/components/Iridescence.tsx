"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Iridescence.css";

/**
 * Reactbits Plasma-style (WebGL2 / GLSL 300 es)
 * - Λευκή βάση
 * - 2 χρώματα (A→B) με opacity πάνω απ’ το λευκό
 * - Χωρίς mouse interaction (εντελώς off)
 */
type IridescenceProps = {
  // Συμβατότητα με το παλιό API (αγνοούνται εδώ):
  color?: [number, number, number];
  mouseReact?: boolean;  // αγνοείται (off)
  amplitude?: number;    // αγνοείται

  // Χρήσιμα props (όλα προαιρετικά):
  speed?: number;        // 0.2..1.5 (ρυθμός κίνησης)
  scale?: number;        // 0.8..1.4 (κλίμακα μοτίβου)
  opacity?: number;      // 0..1 (ένταση plasma πάνω από λευκό)
  colorA?: string;       // default #FF00F2
  colorB?: string;       // default #0090FF
  className?: string;

  // Προστίθενται μόνο για να μην “γκρινιάζει” το TypeScript στο Hero.tsx (δεν χρησιμοποιούνται)
  cutRadius?: number;
  cutFeather?: number;
  cutStrength?: number;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [1, 1, 1];
  return [
    parseInt(m[1], 16) / 255,
    parseInt(m[2], 16) / 255,
    parseInt(m[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Πιστό plasma shader (reactbits) + 2-color palette πάνω από λευκό
const fragment = `#version 300 es
precision highp float;

uniform vec2  iResolution;
uniform float iTime;

uniform vec3  uColorA;  // #FF00F2
uniform vec3  uColorB;  // #0090FF
uniform float uOpacity; // 0..1
uniform float uSpeed;   // κίνηση
uniform float uScale;   // κλίμακα

out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution * 0.5;
  C = (C - center) / uScale + center;

  float i, d, z, T = iTime * uSpeed;
  vec4  ocol;
  vec3  O, p, S;

  for (vec2 r = iResolution, Q; ++i < 60.; O += ocol.w/d*ocol.xyz) {
    p = z * normalize(vec3(C - 0.5*r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;

    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x*0.1) * cos(0.34*d + p.x*0.05);

    // explicit mat2 για 300es
    float a = cos(p.y - T + 0.0);
    float b = cos(p.y - T + 11.0);
    float c = cos(p.y - T + 33.0);
    float d2= cos(p.y - T + 0.0);
    mat2 R = mat2(a, b, c, d2);

    Q = (R * p.xz);
    p.xz = Q;

    z += d = abs(sqrt(dot(Q, Q)) - 0.25 * (5.0 + S.y)) / 3.0 + 8e-4;
    ocol = 1.0 + sin(S.y + p.z*0.5 + S.z - length(S - p) + vec4(2.0, 1.0, 0.0, 8.0));
  }

  o.xyz = tanh(O / 1e4);
  o.w   = 1.0;
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec4 o = vec4(0.0);
  mainImage(o, fragCoord);
  vec3 rgb = sanitize(o.rgb);

  // map σε 2-color palette (A→B) και μετά πάνω από λευκό
  float t = clamp((rgb.r + rgb.g + rgb.b) / 3.0, 0.0, 1.0);
  t = smoothstep(0.2, 0.85, t);
  vec3 plasmaColor = mix(uColorA, uColorB, t);

  vec3 white = vec3(1.0);
  vec3 finalColor = mix(white, plasmaColor, clamp(uOpacity, 0.0, 1.0));

  fragColor = vec4(finalColor, 1.0);
}
`;

export default function Iridescence({
  color = [1, 1, 1],
  mouseReact = false, // ζητήθηκε off
  amplitude = 0,      // αγνοείται
  speed = 0.6,
  scale = 1.1,
  opacity = 0.9,
  colorA = "#FF00F2",
  colorB = "#0090FF",
  className = "",
  // τα cut* υπάρχουν μόνο για TS συμβατότητα με Hero.tsx
  cutRadius,
  cutFeather,
  cutStrength,
}: IridescenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  void cutRadius; void cutFeather; void cutStrength; // silence unused vars

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({
      webgl: 2,                    // WebGL2 όπως στο reactbits
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;

    // Γεμίζει από άκρη σε άκρη τον wrapper (hero)
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    containerRef.current.appendChild(canvas);

    // λευκή βάση
    gl.clearColor(1, 1, 1, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uColorA: { value: new Float32Array(hexToRgb(colorA)) },
        uColorB: { value: new Float32Array(hexToRgb(colorB)) },
        uOpacity: { value: opacity },
        uSpeed: { value: speed * 0.4 },
        uScale: { value: scale },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(containerRef.current!);
    setSize();

    // cap ~45fps για ομαλή κίνηση & λιγότερο lag
    let raf = 0, last = 0;
    const targetMs = 1000 / 45;
    const t0 = performance.now();

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < targetMs) return;
      last = t;

      (program.uniforms.iTime as any).value = (t - t0) * 0.001;
      gl.clear(gl.COLOR_BUFFER_BIT);
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      try { containerRef.current?.removeChild(canvas); } catch {}
    };
  }, [speed, scale, opacity, colorA, colorB]);

  return (
    <div
      ref={containerRef}
      className={`iridescence-container ${className ?? ""}`}
    />
  );
}
