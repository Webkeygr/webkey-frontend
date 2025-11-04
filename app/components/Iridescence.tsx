"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Iridescence.css";

type IridescenceProps = {
  // Συμβατότητα με παλιό API — αγνοούνται:
  color?: [number, number, number];
  mouseReact?: boolean;
  amplitude?: number;

  // Ρυθμίσεις εμφάνισης
  speed?: number;    // 0.2..1.5
  scale?: number;    // μικρότερο => πιο "γεμάτο" blob
  opacity?: number;  // 0..1 (alpha)
  colorA?: string;   // #FF00F2
  colorB?: string;   // #0090FF
  className?: string;

  // Σχήμα/θέση
  stretchX?: number; // >1 απλώνει οριζόντια
  stretchY?: number; // <1 πιέζει κάθετα
  centerX?: number;  // -0.5..0.5 (0 = κέντρο)
  centerY?: number;  // -0.5..0.5

  // Υπάρχουν μόνο για TS συμβατότητα με Hero.tsx
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
   - alpha (για να φαίνεται το λευκό background)
   - stretch & center για οβάλ blob
   - ΚΡΙΣΙΜΟ: περιστροφή του χώρου κατά 90° => γίνεται οριζόντιο στο κέντρο
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
uniform float uAngle; // σε radians (προεπιλογή: π/2 = 90°)

out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  // Κέντρο + scale
  vec2 center = iResolution * 0.5 + uCenter;
  vec2 P = (C - center) / uScale;

  // Ανισοτροπικό stretch (οβάλ)
  P *= mat2(uStretchX, 0.0, 0.0, uStretchY);

  // ΠΕΡΙΣΤΡΟΦΗ 90° (ή όσο ζητηθεί)
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
    d = p.y - T; // το αρχικό phase (κάθετο) — τώρα έχει “γίνει” οριζόντιο λόγω της περιστροφής

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

  float intensity = clamp((rgb.r + rgb.g + rgb.b) / 3.0, 0.0, 1.0);
  float t = smoothstep(0.2, 0.85, intensity);
  vec3 plasmaColor = mix(uColorA, uColorB, t);

  float alpha = intensity * clamp(uOpacity, 0.0, 1.0);
  fragColor = vec4(plasmaColor, alpha);
}
`;

export default function Iridescence({
  color = [1, 1, 1],
  mouseReact = false,
  amplitude = 0,
  speed = 12.5,
  scale = 0.86,        // πιο "γεμάτο"
  opacity = 0.8,
  colorA = "#FF00F2",
  colorB = "#0090FF",
  className = "",
  stretchX = 1.45,     // πλατύτερο
  stretchY = 0.65,     // χαμηλότερο
  centerX = -0.5,       // κέντρο
  centerY = 0.0,       // κέντρο
  cutRadius, cutFeather, cutStrength, // TS συμβατότητα
}: IridescenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  void cutRadius; void cutFeather; void cutStrength;

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

    gl.clearColor(1, 1, 1, 1); // λευκή βάση

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
        uCenter: { value: new Float32Array([0, 0]) }, // ενημερώνεται στο resize
        uAngle: { value: Math.PI * 0.5 },             // 90° → οριζόντιο
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

      // μετατόπιση κέντρου σε pixels (π.χ. 0.1 => 10% του πλάτους)
      const cx = centerX * res[0];
      const cy = centerY * res[1];
      const uC = program.uniforms.uCenter.value as Float32Array;
      uC[0] = cx;
      uC[1] = cy;
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
  }, [speed, scale, opacity, colorA, colorB, stretchX, stretchY, centerX, centerY]);

  return <div ref={containerRef} className={`iridescence-container ${className ?? ""}`} />;
}
