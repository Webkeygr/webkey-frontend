"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Iridescence.css";

type IridescenceProps = {
  color?: [number, number, number]; // (κρατείται για συμβατότητα)
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean; // αν θες το “cut” γύρω από το mouse
  className?: string;

  // νέα, όλα με defaults
  colorA?: string;   // #FF00F2
  colorB?: string;   // #0090FF
  opacity?: number;  // 0..1
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

const fragment = `
precision highp float;

uniform vec2  iResolution;
uniform float iTime;

uniform vec3  uColorA;
uniform vec3  uColorB;
uniform float uOpacity;
uniform float uSpeed;
uniform float uScale;

uniform vec2  uMouse;
uniform float uCutRadius;
uniform float uCutFeather;
uniform float uCutStrength;
uniform float uMouseInteractive;

varying vec2 vUv;

void mainImage(out vec4 o, vec2 C){
  vec2 center = iResolution * 0.5;
  C = (C - center) / uScale + center;

  if(uMouseInteractive > 0.5){
    vec2  d    = C - uMouse;
    float dist = length(d) + 1e-6;
    float fall = exp(-dist / max(uCutRadius, 1.0));
    vec2  dir  = normalize(d);
    C += dir * uCutStrength * fall * iResolution.y;
  }

  float i, d, z, T = iTime * uSpeed;
  vec4 ocol; vec3 O, p, S;

  for (vec2 r = iResolution, Q; ++i < 60.; O += ocol.w/d*ocol.xyz) {
    p = z*normalize(vec3(C-.5*r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;

    p.x += 0.4*(1.0+p.y)*sin(d + p.x*0.1)*cos(0.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
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

  float t = clamp((rgb.r + rgb.g + rgb.b) / 3.0, 0.0, 1.0);
  t = smoothstep(0.2, 0.85, t);
  vec3 plasma = mix(uColorA, uColorB, t);

  vec3 white = vec3(1.0);
  vec3 finalColor = mix(white, plasma, uOpacity);

  if(uMouseInteractive > 0.5){
    float dist = length(fragCoord - uMouse);
    float hole = smoothstep(uCutRadius, uCutRadius - uCutFeather, dist);
    finalColor = mix(white, finalColor, hole);
  }

  gl_FragColor = vec4(finalColor, 1.0);
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

    const renderer = new Renderer({
      antialias: false,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;

    // ΚΡΙΣΙΜΟ: κάνε το canvas να γεμίσει ΑΠΟ ΑΚΡΗ ΣΕ ΑΚΡΗ το container
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

    let raf = 0;
    let last = 0;
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
      if (mouseReact) containerRef.current?.removeEventListener("mousemove", onMouseMove);
      try { containerRef.current?.removeChild(canvas); } catch {}
    };
  }, [
    color, speed, amplitude, mouseReact,
    colorA, colorB, opacity, scale,
    cutRadius, cutFeather, cutStrength
  ]);

  // ΣΗΜΑΝΤΙΚΟ: absolute + inset:0 + σωστά z-index/pointer-events
  return (
    <div
      ref={containerRef}
      className={`iridescence-container ${mouseReact ? "interactive" : ""} ${className ?? ""}`}
    />
  );
}
