"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Iridescence.css";

/**
 * Plasma-style φόντο (WebGL2 / GLSL 300 es)
 * - Λευκή βάση
 * - Δύο χρώματα (#FF00F2 / #0090FF)
 * - Mouse "cut" (feathered τρύπα + ελαφριά εκτροπή ροής)
 * Συμβατό με το αρχικό API του Iridescence (props).
 */
type IridescenceProps = {
  color?: [number, number, number]; // (κρατιέται για συμβατότητα, δεν επηρεάζει)
  speed?: number;                    // 0.2..1.5
  amplitude?: number;                // επηρεάζει ελαφρά τη δύναμη του cut
  mouseReact?: boolean;              // on/off interaction
  className?: string;

  // νέα προαιρετικά (όλα έχουν default)
  colorA?: string;   // default #FF00F2
  colorB?: string;   // default #0090FF
  opacity?: number;  // 0..1 (ένταση plasma πάνω από λευκό)
  scale?: number;    // 0.8..1.4
  cutRadius?: number;   // px
  cutFeather?: number;  // px
  cutStrength?: number; // 0..0.03
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

// WebGL2 fragment (GLSL 300 es) – ασφαλές compile
const fragment = `#version 300 es
precision highp float;

uniform vec2  iResolution;
uniform float iTime;

uniform vec3  uColorA;      // #FF00F2
uniform vec3  uColorB;      // #0090FF
uniform float uOpacity;     // 0..1
uniform float uSpeed;       // κίνηση
uniform float uScale;       // κλίμακα

uniform vec2  uMouse;            // pixel coords
uniform float uCutRadius;        // px
uniform float uCutFeather;       // px
uniform float uCutStrength;      // 0..0.03
uniform float uMouseInteractive; // 0/1

out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution * 0.5;
  C = (C - center) / uScale + center;

  // εκτροπή ροής γύρω από το mouse (σαν “κοπή”)
  if (uMouseInteractive > 0.5) {
    vec2  d    = C - uMouse;
    float dist = length(d) + 1e-6;
    float fall = exp(-dist / max(uCutRadius, 1.0));
    vec2  dir  = normalize(d);
    C += dir * uCutStrength * fall * iResolution.y;
  }

  float i, d, z, T = iTime * uSpeed;
  vec4  ocol;
  vec3  O, p, S;

  for (vec2 r = iResolution, Q; ++i < 60.; O += ocol.w/d*ocol.xyz) {
    p = z * normalize(vec3(C - 0.5*r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;

    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x*0.1) * cos(0.34*d + p.x*0.05);

    // η αρχική γραμμή σε 300es ήταν mat2(cos(p.y+vec4(0,11,33,0)-T));
    // την αναπτύσσουμε σε 4 στοιχεία για καθαρή συμβατότητα:
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

  // 2-color palette (A→B) πάνω σε λευκή βάση
  float t = clamp((rgb.r + rgb.g + rgb.b) / 3.0, 0.0, 1.0);
  t = smoothstep(0.2, 0.85, t);
  vec3 plasmaColor = mix(uColorA, uColorB, t);

  vec3 white = vec3(1.0);
  vec3 finalColor = mix(white, plasmaColor, uOpacity);

  // feathered "hole" στο mouse που αποκαλύπτει το λευκό
  if (uMouseInteractive > 0.5) {
    float dist = length(fragCoord - uMouse);
    float hole = smoothstep(uCutRadius, uCutRadius - uCutFeather, dist);
    finalColor = mix(white, finalColor, hole);
  }

  fragColor = vec4(finalColor, 1.0);
}
`;

export default function Iridescence({
  color = [1, 1, 1],
  speed = 0.6,
  amplitude = 0.08,
  mouseReact = true,
  className = "",
  colorA = "#FF00F2",
  colorB = "#0090FF",
  opacity = 0.9,
  scale = 1.1,
  cutRadius = 120,
  cutFeather = 80,
  cutStrength = 0.012,
}: IridescenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ΣΗΜΑΝΤΙΚΟ: WebGL2 context (όπως στο react-bits)
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

    // Γέμισε όλο το hero
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    containerRef.current.appendChild(canvas);

    // λευκή βάση (ό,τι “τρύπα” → καθαρό λευκό)
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
        uMouse: { value: new Float32Array([0, 0]) },
        uCutRadius: { value: cutRadius },
        uCutFeather: { value: cutFeather },
        uCutStrength: { value: cutStrength + amplitude * 0.05 },
        uMouseInteractive: { value: mouseReact ? 1.0 : 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseReact) return;
      const rect = containerRef.current!.getBoundingClientRect();
      const mu = program.uniforms.uMouse.value as Float32Array;
      mu[0] = e.clientX - rect.left;
      mu[1] = e.clientY - rect.top;
    };
    if (mouseReact) {
      containerRef.current.addEventListener("mousemove", onMouseMove, {
        passive: true,
      });
    }

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

    // cap ~45fps
    let raf = 0;
    let last = 0;
    const targetMs = 1000 / 45;
    const t0 = performance.now();

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < targetMs) return;
      last = t;

      const timeValue = (t - t0) * 0.001;
      (program.uniforms.iTime as any).value = timeValue;

      gl.clear(gl.COLOR_BUFFER_BIT);
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mouseReact) {
        containerRef.current?.removeEventListener("mousemove", onMouseMove);
      }
      try { containerRef.current?.removeChild(canvas); } catch {}
    };
  }, [
    color, speed, amplitude, mouseReact,
    colorA, colorB, opacity, scale,
    cutRadius, cutFeather, cutStrength
  ]);

  return (
    <div
      ref={containerRef}
      className={`iridescence-container ${mouseReact ? "interactive" : ""} ${className ?? ""}`}
    />
  );
}
