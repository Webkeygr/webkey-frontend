"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Iridescence.css";

type IridescenceProps = {
  // Συμβατότητα με παλιό API (αγνοούνται):
  color?: [number, number, number];
  mouseReact?: boolean;
  amplitude?: number;

  // Appearance
  speed?: number;     // 0.2..1.5
  scale?: number;     // μικρότερο => πιο "γεμάτο" blob
  opacity?: number;   // 0..1 (alpha)
  colorA?: string;    // #FF00F2
  colorB?: string;    // #0090FF
  className?: string;

  // Σχήμα/θέση blob
  stretchX?: number;  // >1 απλώνει οριζόντια
  stretchY?: number;  // <1 πιέζει κάθετα
  centerX?: number;   // -0.5..0.5 (0 = κέντρο)
  centerY?: number;   // -0.5..0.5

  // Ζώνη προβολής (κόβει πάνω/κάτω – σε ποσοστό ύψους)
  bandTopPct?: number;     // 0..1 από πάνω (π.χ. 0.22)
  bandBottomPct?: number;  // 0..1 από πάνω (π.χ. 0.72)
  bandFeatherPx?: number;  // feather px στα όρια (π.χ. 120)

  // Μαλάκωμα δεξιά για να μη φαίνεται «μύτη»
  rightFadePct?: number;   // 0..0.5 πλάτος fade από δεξί άκρο (π.χ. 0.10)

  // Υπάρχουν μόνο για TS συμβατότητα αν τα περνά το Hero.tsx
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

/* Plasma (reactbits) με:
   - alpha για να φαίνεται το λευκό background
   - περιστροφή 90° ώστε η κίνηση να είναι οριζόντια
   - stretch/center για οβάλ "μπάρα" στο κέντρο
   - "Band mask": εμφανίζει ΜΟΝΟ ανάμεσα σε δύο οριζόντιες γραμμές (με feather)
   - "Right fade": σβήνει απαλά δεξιά ώστε να μη βγαίνει «μύτη»
*/
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
uniform float uAngle;          // 90° = οριζόντιο

// Band mask (σε pixels)
uniform float uBandTop;        // y-top
uniform float uBandBottom;     // y-bottom
uniform float uBandFeather;    // px feather
// Right fade (σε ποσοστό πλάτους)
uniform float uRightFadePct;   // 0..0.5

out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  // Κέντρο + scale
  vec2 center = iResolution * 0.5 + uCenter;
  vec2 P = (C - center) / uScale;

  // Stretch
  P *= mat2(uStretchX, 0.0, 0.0, uStretchY);

  // Περιστροφή 90° ώστε η κίνηση να είναι οριζόντια
  float ca = cos(uAngle), sa = sin(uAngle);
  P = mat2(ca, -sa, sa, ca) * P;

  // Επιστροφή σε canvas space
  C = P + center;

  float i, d, z, T = iTime * uSpeed;
  vec4  ocol;
  vec3  O, p, S;

  for (vec2 r = iResolution, Q; ++i < 60.; O += ocol.w/d*ocol.xyz) {
    p = z * normalize(vec3(C - 0.5*r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T; // μετά την περιστροφή, αυτό αντιστοιχεί σε οριζόντιο flow

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

  // Ένταση & palette
  float intensity = clamp((rgb.r + rgb.g + rgb.b) / 3.0, 0.0, 1.0);
  float t = smoothstep(0.2, 0.85, intensity);
  vec3 plasmaColor = mix(uColorA, uColorB, t);

  // Βασικό alpha (όπως reactbits)
  float alpha = intensity * clamp(uOpacity, 0.0, 1.0);

  // -------- Band mask (top/bottom με feather) --------
  // 0 στο έξω-μπάντα, 1 μέσα στη ζώνη
  float topFeather    = uBandFeather;
  float bottomFeather = uBandFeather;
  float topMask    = smoothstep(uBandTop - topFeather, uBandTop, fragCoord.y);
  float bottomMask = 1.0 - smoothstep(uBandBottom, uBandBottom + bottomFeather, fragCoord.y);
  float bandMask = clamp(topMask * bottomMask, 0.0, 1.0);

  // -------- Right fade (για να μη βγαίνει μυτερό) --------
  float rightEdge = iResolution.x;
  float fadeStart = rightEdge * (1.0 - clamp(uRightFadePct, 0.0, 0.5));
  float rightMask = 1.0 - smoothstep(fadeStart, rightEdge, fragCoord.x);

  // Τελικό alpha = βασικό * band * (0.7 + 0.3*rightMask)  (ελαφρύ σβήσιμο δεξιά)
  alpha *= bandMask * mix(1.0, rightMask, 0.7);

  fragColor = vec4(plasmaColor, alpha);
}
`;

export default function Iridescence({
  // defaults για «γεμάτη» οριζόντια μπάρα στο κέντρο
  speed = 0.6,
  scale = 0.86,
  opacity = 0.8,
  colorA = "#FF00F2",
  colorB = "#0090FF",
  className = "",
  stretchX = 1.45,
  stretchY = 0.65,
  centerX = 0.0,
  centerY = 0.0,

  // Ζώνη ανάμεσα στις «κόκκινες» γραμμές (προσαρμόζεις όπως θέλεις)
  bandTopPct = 0.22,
  bandBottomPct = 0.72,
  bandFeatherPx = 120,

  // Σβήσιμο δεξιά για να μη φαίνεται μυτερό
  rightFadePct = 0.10,

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

    gl.clearColor(1, 1, 1, 1); // λευκό υπόβαθρο

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
        uCenter: { value: new Float32Array([0, 0]) }, // set on resize
        uAngle: { value: Math.PI * 0.5 },             // 90°
        uBandTop: { value: 0 },
        uBandBottom: { value: 0 },
        uBandFeather: { value: bandFeatherPx },
        uRightFadePct: { value: rightFadePct },
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

      // Κέντρο σε pixels
      const uC = program.uniforms.uCenter.value as Float32Array;
      uC[0] = centerX * res[0];
      uC[1] = centerY * res[1];

      // Band σε pixels
      (program.uniforms.uBandTop as any).value = bandTopPct * res[1];
      (program.uniforms.uBandBottom as any).value = bandBottomPct * res[1];
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerRef.current!);
    setSize();

    // cap ~45fps
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
    speed, scale, opacity, colorA, colorB, stretchX, stretchY,
    centerX, centerY, bandTopPct, bandBottomPct, bandFeatherPx, rightFadePct
  ]);

  return <div ref={containerRef} className={`iridescence-container ${className ?? ""}`} />;
}
