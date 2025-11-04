"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Iridescence.css";

type IridescenceProps = {
  // legacy (αγνοούνται)
  color?: [number, number, number];
  mouseReact?: boolean;
  amplitude?: number;

  // εμφάνιση
  speed?: number;
  scale?: number;
  opacity?: number;
  colorA?: string;           // magenta
  colorB?: string;           // blue
  vibrance?: number;         // 1..2
  gamma?: number;            // 0.6..1.2
  magentaBias?: number;      // 0..1
  purpleBoost?: number;      // 0..1
  className?: string;

  // σχήμα/θέση (οριζόντιο)
  stretchX?: number;
  stretchY?: number;
  centerX?: number;
  centerY?: number;

  // κάθετη ζώνη
  bandTopPct?: number;
  bandBottomPct?: number;
  bandFeatherPx?: number;

  // οριζόντιο παράθυρο (συμμετρικό)
  winStartPct?: number;
  winEndPct?: number;
  winFeatherPx?: number;

  // TS συμβατότητα
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

// Οριζόντιο plasma + band/window + Hann + vibrance/gamma + purple boost/magenta bias + warm toning
const fragment = `#version 300 es
precision highp float;

uniform vec2  iResolution;
uniform float iTime;

uniform vec3  uColorA;      // magenta
uniform vec3  uColorB;      // blue
uniform float uOpacity;
uniform float uSpeed;
uniform float uScale;

uniform float uStretchX;
uniform float uStretchY;
uniform vec2  uCenter;
uniform float uAngle;       // 90° οριζόντιο

uniform float uBandTop;
uniform float uBandBottom;
uniform float uBandFeather;

uniform float uWinStart;
uniform float uWinEnd;
uniform float uWinFeather;

uniform float uVibrance;
uniform float uGamma;
uniform float uMagentaBias;
uniform float uPurpleBoost;

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
    d = p.y - T;

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

  // ένταση + καμπύλη
  float intensity = clamp((rgb.r + rgb.g + rgb.b) / 3.0, 0.0, 1.0);
  float iGamma = pow(intensity, uGamma);

  // mix factor με πόλωση προς magenta
  float t = smoothstep(0.10, 0.98, iGamma);
  t = clamp(t + uMagentaBias * (0.5 - t), 0.0, 1.0);

  // βασικό mix & vibrance
  vec3 col = mix(uColorA, uColorB, t);
  col = clamp(col * uVibrance, 0.0, 1.0);

  // έντονο ΜΩΒ στο mid-blend (t≈0.35..0.75)
  float mid = 1.0 - abs(t * 2.0 - 1.0);
  mid = smoothstep(0.25, 0.90, mid);
  vec3 purple = vec3(0.62, 0.00, 0.78);
  col = mix(col, purple, uPurpleBoost * mid);

  // ζεστό off-white μόνο όταν t είναι χαμηλό (αριστερή πλευρά)
  vec3 warm = vec3(0.98, 0.96, 0.93);
  float warmAmt = smoothstep(0.00, 0.35, 1.0 - t) * 0.45; // max ~45%
  col = mix(warm, col, 1.0 - warmAmt);

  // βάση alpha
  float alpha = iGamma * clamp(uOpacity, 0.0, 1.0);

  // κάθετη ζώνη
  float topMask    = smoothstep(uBandTop - uBandFeather, uBandTop, fragCoord.y);
  float bottomMask = 1.0 - smoothstep(uBandBottom, uBandBottom + uBandFeather, fragCoord.y);
  float bandMask = clamp(topMask * bottomMask, 0.0, 1.0);

  // οριζόντιο παράθυρο
  float leftMask  = smoothstep(uWinStart, uWinStart + uWinFeather, fragCoord.x);
  float rightMask = 1.0 - smoothstep(uWinEnd - uWinFeather, uWinEnd, fragCoord.x);
  float windowMask = clamp(leftMask * rightMask, 0.0, 1.0);

  // Hann window (λεπτές συμμετρικές άκρες, πλατύ κέντρο)
  float localX = clamp((fragCoord.x - uWinStart) / max(1.0, (uWinEnd - uWinStart)), 0.0, 1.0);
  float hann = 0.5 * (1.0 - cos(6.28318530718 * localX));
  hann = pow(hann, 0.6);

  alpha *= bandMask * windowMask * hann;

  fragColor = vec4(col, alpha);
}
`;

export default function Iridescence({
  // «KOTA-like» defaults
  speed = 0.6,
  opacity = 1.0,
  scale = 0.70,                 // γεμάτο σώμα
  colorA = "#FF00F2",
  colorB = "#0090FF",
  vibrance = 1.60,
  gamma = 0.72,
  magentaBias = 0.22,           // τραβάει προς magenta
  purpleBoost = 0.58,           // μωβ στο mid

  className = "",
  stretchX = 1.35,
  stretchY = 0.95,
  centerX = 0.14,               // μικρή μετατόπιση δεξιά
  centerY = 0.00,

  // μεγαλύτερο ύψος ζώνης
  bandTopPct = 0.06,
  bandBottomPct = 0.94,
  bandFeatherPx = 120,

  // παράθυρο εστιασμένο στη δεξιά μισή (όπου «κάθεται» η magenta)
  winStartPct = 0.32,
  winEndPct   = 1.02,           // λίγο εκτός δεξιά για καθαρή καμπύλη
  winFeatherPx = 140,

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

        uVibrance: { value: vibrance },
        uGamma: { value: gamma },
        uMagentaBias: { value: magentaBias },
        uPurpleBoost: { value: purpleBoost },
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

      // band σε pixels
      (program.uniforms.uBandTop as any).value = bandTopPct * res[1];
      (program.uniforms.uBandBottom as any).value = bandBottomPct * res[1];

      // window σε pixels
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
    vibrance, gamma, magentaBias, purpleBoost,
    stretchX, stretchY, centerX, centerY,
    bandTopPct, bandBottomPct, bandFeatherPx,
    winStartPct, winEndPct, winFeatherPx
  ]);

  return <div ref={containerRef} className={`iridescence-container ${className ?? ""}`} />;
}
