"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Iridescence.css";

/**
 * Νέο Iridescence = Plasma-style φόντο σε λευκή βάση
 * με δύο χρώματα (#FF00F2, #0090FF) και mouse "cut" effect.
 * Κρατάμε συμβατότητα με τα ίδια props που είχες.
 */
type IridescenceProps = {
  color?: [number, number, number];        // global tint (κρατιέται για συμβατότητα, δεν χρειάζεται να το αλλάξεις)
  speed?: number;                          // ρυθμός κίνησης
  amplitude?: number;                      // ένταση "αναπνοής" (χρησιμοποιείται στο mouse cut)
  mouseReact?: boolean;                    // on/off το interaction (true = κόβει/παραμορφώνει γύρω από το mouse)
  className?: string;

  // optional νέα (όλα έχουν default οπότε δεν χρειάζεται να τα ορίσεις)
  colorA?: string;   // προεπιλογή #FF00F2 (magenta)
  colorB?: string;   // προεπιλογή #0090FF (cyan)
  opacity?: number;  // 0..1 ένταση χρώματος πάνω από λευκό (default 0.9)
  scale?: number;    // 0.8..1.4 μέγεθος μοτίβου (default 1.1)
  cutRadius?: number;   // px ακτίνα "κοψίματος" γύρω από mouse (default 120)
  cutFeather?: number;  // px feather του κοψίματος (default 80)
  cutStrength?: number; // 0..0.03 πόσο σπρώχνει γύρω από το mouse (default 0.012)
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

// WebGL1 shaders (συμβατά ευρέως)
const vertex = `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Plasma fragment σε λευκή βάση + 2-color palette + mouse "cut"
const fragment = `
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

varying vec2 vUv;

void mainImage(out vec4 o, vec2 C){
  vec2 center = iResolution * 0.5;
  C = (C - center) / uScale + center;

  // παραμόρφωση flow γύρω από το mouse (σαν να “σπρώχνει” το ρευστό)
  if(uMouseInteractive > 0.5){
    vec2  d    = C - uMouse;
    float dist = length(d) + 1e-6;
    float fall = exp(-dist / max(uCutRadius, 1.0));
    vec2  dir  = normalize(d);
    C += dir * uCutStrength * fall * iResolution.y; // scale με το ύψος
  }

  float i, d, z, T = iTime * uSpeed;
  vec4 ocol;
  vec3 O, p, S;

  for (vec2 r = iResolution, Q; ++i < 60.; O += ocol.w/d*ocol.xyz) {
    p = z*normalize(vec3(C-.5*r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;

    p.x += 0.4*(1.0+p.y)*sin(d + p.x*0.1)*cos(0.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec2(0.0,11.0).xxyy+vec4(0.0,11.0,33.0,0.0)-T));
    z += d = abs(sqrt(length(Q*Q)) - 0.25*(5.0+S.y))/3.0 + 8e-4;
    ocol = 1.0 + sin(S.y + p.z*0.5 + S.z - length(S-p) + vec4(2.0,1.0,0.0,8.0));
  }

  o.xyz = tanh(O/1e4);
  o.w   = 1.0;
}

void main(){
  vec2 fragCoord = vec2(vUv.x * iResolution.x, vUv.y * iResolution.y);

  vec4 o = vec4(0.0);
  mainImage(o, fragCoord);
  vec3 rgb = o.rgb;

  // intensity -> 2-color palette (A→B), με smoothstep για vivid transition
  float t = clamp((rgb.r + rgb.g + rgb.b) / 3.0, 0.0, 1.0);
  t = smoothstep(0.2, 0.85, t);
  vec3 plasmaColor = mix(uColorA, uColorB, t);

  // Λευκή βάση
  vec3 white = vec3(1.0);
  vec3 finalColor = mix(white, plasmaColor, uOpacity);

  // Feathered "hole" πάνω στο mouse — αποκαλύπτει το λευκό
  if(uMouseInteractive > 0.5){
    float dist  = length(fragCoord - uMouse);
    float hole  = smoothstep(uCutRadius, uCutRadius - uCutFeather, dist);
    finalColor  = mix(white, finalColor, hole);
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function Iridescence({
  color = [1, 1, 1],
  speed = 0.6,
  amplitude = 0.08, // επηρεάζει το "cut" strength έμμεσα
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

    const renderer = new Renderer({
      antialias: false,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5), // cap DPR για λιγότερο lag
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    containerRef.current.appendChild(canvas);

    // λευκή βάση (ό,τι “τρύπα” ανοίγει το mouse είναι καθαρό λευκό)
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
        uCutStrength: { value: cutStrength + amplitude * 0.05 }, // μικρή έξτρα “ώθηση”
        uMouseInteractive: { value: mouseReact ? 1.0 : 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // mouse move
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

    // resize
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
      try {
        containerRef.current?.removeChild(canvas);
      } catch {}
    };
  }, [color, speed, amplitude, mouseReact, colorA, colorB, opacity, scale, cutRadius, cutFeather, cutStrength]);

  return <div ref={containerRef} className={`iridescence-container ${className}`} />;
}
