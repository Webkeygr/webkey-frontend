"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Iridescence.css";

type IridescenceProps = {
  color?: [number, number, number];
  mouseReact?: boolean;
  amplitude?: number;

  speed?: number;
  scale?: number;      // μικρότερο => πιο “γεμάτο”
  opacity?: number;    // 0..1
  colorA?: string;     // #FF00F2
  colorB?: string;     // #0090FF
  className?: string;

  stretchX?: number;   // >1 απλώνει οριζόντια
  stretchY?: number;   // <1 πιέζει κάθετα
  centerX?: number;    // -0.5..0.5
  centerY?: number;    // -0.5..0.5

  // Κάθετη ζώνη (όπως οι κόκκινες γραμμές)
  bandTopPct?: number;        // 0..1 από πάνω
  bandBottomPct?: number;     // 0..1 από πάνω
  bandFeatherPx?: number;     // feather σε px

  // Οριζόντιο “παράθυρο” (κόβει αριστερά/δεξιά)
  winStartPct?: number;       // 0..1 (αριστερό όριο)
  winEndPct?: number;         // 0..1 (δεξί όριο)
  winFeatherPx?: number;      // feather σε px

  // TS συμβατότητα με Hero.tsx
  cutRadius?: number; cutFeather?: number; cutStrength?: number;
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

// Plasma (reactbits) + 90° rotation + vertical band + symmetric horizontal window
// + HANN WINDOW profile (0→1→0) μέσα στο οριζόντιο παράθυρο για λεπτές άκρες.
const fragment = `#version 300 es
precision highp float;

uniform vec2  iResolution;
uniform float iTime;

uniform vec3  uColorA;
uniform vec3  uColorB;
uniform float uOpacity;
uniform float uSpeed;
uniform float uScale;

uniform float uStretchX;
uniform float uStretchY;
uniform vec2  uCenter;
uniform float uAngle; // 90° = οριζόντιο

// Κάθετη ζώνη
uniform float uBandTop;
uniform float uBandBottom;
uniform float uBandFeather;

// Οριζόντιο “παράθυρο”
uniform float uWinStart;
uniform float uWinEnd;
uniform float uWinFeather;

out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution * 0.5 + uCenter;
  vec2 P = (C - center) / uScale;

  P *= mat2(uStretchX, 0.0, 0.0, uStretchY);

  float ca = cos(uAngle), sa = sin(uAngle);
  P = mat2(ca, -sa, sa, ca) * P;

  C = P + center;

  float i, d, z, T = iTime * uSpeed;
  vec4  ocol;
  vec3  O, p, S;

  for (vec2 r = iResolution, Q; ++i < 60.; O += ocol.w/d*ocol.xyz) {
    p = z * normalize(vec3(C - 0.5*r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T; // μετά την περιστροφή => οριζόντιο flow

    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x*0.1) * cos(0.34*d + p.x*0.05);

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

  float intensity = clamp((rgb.r + rgb.g + rgb.b) / 3.0, 0.0, 1.0);
  float t = smoothstep(0.2, 0.85, intensity);
  vec3 plasmaColor = mix(uColorA, uColorB, t);

  // base alpha (reactbits-like)
  float alpha = intensity * clamp(uOpacity, 0.0, 1.0);

  // ----- Vertical band mask -----
  float topMask    = smoothstep(uBandTop - uBandFeather, uBandTop, fragCoord.y);
  float bottomMask = 1.0 - smoothstep(uBandBottom, uBandBottom + uBandFeather, fragCoord.y);
  float bandMask = clamp(topMask * bottomMask, 0.0, 1.0);

  // ----- Symmetric horizontal window (start..end) -----
  float leftMask  = smoothstep(uWinStart, uWinStart + uWinFeather, fragCoord.x);
  float rightMask = 1.0 - smoothstep(uWinEnd - uWinFeather, uWinEnd, fragCoord.x);
  float windowMask = clamp(leftMask * rightMask, 0.0, 1.0);

  // ----- HANN window profile μέσα στο οριζόντιο παράθυρο -----
  // τοπική θέση 0..1 μέσα στο [uWinStart, uWinEnd]
  float localX = clamp((fragCoord.x - uWinStart) / max(1.0, (uWinEnd - uWinStart)), 0.0, 1.0);
  // raised-cosine: 0 στα άκρα, 1 στο κέντρο (λεπτό → παχύ → λεπτό)
  float hann = 0.5 * (1.0 - cos(6.28318530718 * localX)); // 2π * x

  alpha *= bandMask * windowMask * hann;

  fragColor = vec4(plasmaColor, alpha);
}
`;

export default function Iridescence({
  speed = 25,
  scale = 0.86,
  opacity = 0.8,
  colorA = "#FF00F2",
  colorB = "#0090FF",
  className = "",

  stretchX = 1.45,
  stretchY = 0.65,
  centerX = 0.0,
  centerY = 0.0,

  // κάθετη ζώνη
  bandTopPct = 0.18,
  bandBottomPct = 0.78,
  bandFeatherPx = 130,

  // οριζόντιο παράθυρο — κάνε το λίγο «μέσα» για πιο λεπτές άκρες
  winStartPct = 0.10,
  winEndPct   = 0.90,
  winFeatherPx = 160,

  // TS συμβατότητα
  color = [1, 1, 1],
  mouseReact = false,
  amplitude = 0,
  cutRadius, cutFeather, cutStrength,
}: IridescenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  void color; void mouseReact; void amplitude; void cutRadius; void cutFeather; void cutStrength;

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    containerRef.current.appendChild(canvas);

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
        uStretchX: { value: stretchX },
        uStretchY: { value: stretchY },
        uCenter: { value: new Float32Array([0, 0]) },
        uAngle: { value: Math.PI * 0.5 },

        uBandTop: { value: 0 },
        uBandBottom: { value: 0 },
        uBandFeather: { value: bandFeatherPx },

        uWinStart: { value: 0 },
        uWinEnd: { value: 0 },
        uWinFeather: { value: winFeatherPx },
      },
      transparent: true,
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

      // κέντρο
      const uC = program.uniforms.uCenter.value as Float32Array;
      uC[0] = centerX * res[0];
      uC[1] = centerY * res[1];

      // κάθετη ζώνη σε pixels
      (program.uniforms.uBandTop as any).value = bandTopPct * res[1];
      (program.uniforms.uBandBottom as any).value = bandBottomPct * res[1];

      // οριζόντιο παράθυρο σε pixels
      (program.uniforms.uWinStart as any).value = winStartPct * res[0];
      (program.uniforms.uWinEnd as any).value   = winEndPct   * res[0];
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerRef.current!);
    setSize();

    // ~45fps cap
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
  }, [
    speed, scale, opacity, colorA, colorB,
    stretchX, stretchY, centerX, centerY,
    bandTopPct, bandBottomPct, bandFeatherPx,
    winStartPct, winEndPct, winFeatherPx
  ]);

  return <div ref={containerRef} className={`iridescence-container ${className ?? ""}`} />;
}
