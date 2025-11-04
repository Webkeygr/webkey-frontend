"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import "./Iridescence.css";

type IridescenceProps = {
  /** global tint, κρατάμε το API όπως ήταν */
  color?: [number, number, number];
  /** πιο χαμηλή ταχύτητα για minimal look */
  speed?: number;
  /** μικρή μετατόπιση για “ζωντάνια” */
  amplitude?: number;
  /** προαιρετικό – default off */
  mouseReact?: boolean;
  className?: string;
};

export default function Iridescence({
  color = [1, 1, 1],
  speed = 0.4,       // ↓ πιο “ήσυχο”
  amplitude = 0.06,  // ↓ λίγο “αναπνέον”
  mouseReact = false,
  className = "",
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;

    // Fallback για mobile/reduced motion → καθαρό CSS gradient (χωρίς WebGL)
    const prefersReduced =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(pointer: coarse)").matches);

    if (prefersReduced) {
      ctn.style.background =
        "radial-gradient(60vmax 60vmax at 22% 28%, rgba(88,92,160,0.35) 0%, rgba(0,0,0,0) 55%)," +
        "radial-gradient(70vmax 70vmax at 78% 42%, rgba(140,92,170,0.30) 0%, rgba(0,0,0,0) 50%)," +
        "linear-gradient(160deg, #06060a, #0b0b0f)";
      return; // stop here – no GL
    }

    // Renderer με low-power ρυθμίσεις
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 1.5), // cap DPR
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    let program: Program | null = null;

    const geometry = new Triangle(gl);

    // απλό, βελούδινο fragment – 2 “λοβοί” + 1 διακριτικός
    const vertexShader = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;

      uniform vec2 uRes;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uAmp;
      uniform vec3 uTint;

      // palette που ταιριάζει στο Webkey (deep blue/purple)
      vec3 baseA = vec3(0.05, 0.06, 0.10);
      vec3 lobe1 = vec3(0.30, 0.32, 0.60);
      vec3 lobe2 = vec3(0.42, 0.32, 0.66);
      vec3 lobe3 = vec3(0.10, 0.12, 0.22);

      // πολύ ελαφρύ hash noise (σβήνει banding χωρίς να “γδέρνει” την GPU)
      float hash(vec2 p){ return fract(sin(dot(p, vec2(27.168, 91.17))) * 43758.5453); }

      void main() {
        // normalized coords σε 0..1 και aspect fix
        vec2 uv = vUv;
        vec2 r = uRes;
        float aspect = r.x / max(r.y, 1.0);
        uv.x *= aspect;

        float t = uTime * 0.06 * uSpeed;

        // Κέντρα που κινούνται ΑΡΓΑ — αφήνουμε “ελεύθερο χώρο”
        vec2 c1 = vec2(0.25 * aspect, 0.33) + vec2(sin(t*0.7), cos(t*0.5)) * 0.03 * uAmp;
        vec2 c2 = vec2(0.78 * aspect, 0.42) + vec2(cos(t*0.6), sin(t*0.4)) * 0.04 * uAmp;
        vec2 c3 = vec2(0.55 * aspect, 0.82) + vec2(sin(t*0.3), cos(t*0.35)) * 0.02 * uAmp;

        // ομαλή Gaussian “ενέργεια”
        float f1 = exp(-6.0 * dot(uv - c1, uv - c1));
        float f2 = exp(-5.0 * dot(uv - c2, uv - c2));
        float f3 = exp(-8.0 * dot(uv - c3, uv - c3));

        // ανάμιξη με βάση ένταση — πιο χαμηλές τιμές για MINIMAL
        vec3 col = baseA;
        col = mix(col, lobe1, f1 * 0.65);
        col = mix(col, lobe2, f2 * 0.55);
        col = mix(col, lobe3, f3 * 0.25);

        // ανεπαίσθητο noise για να “μαλακώνει” το gradient χωρίς αισθητό grain
        float n = (hash(uv * r.xy + t) - 0.5) * 0.02; // ±0.01
        col += n;

        // global tint (κρατάμε συμβατότητα με prop color)
        col *= uTint;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: new Float32Array([gl.canvas.width, gl.canvas.height]) },
        uSpeed: { value: speed },
        uAmp: { value: amplitude },
        uTint: { value: new Color(...color) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      const { clientWidth, clientHeight } = ctn;
      renderer.setSize(clientWidth, clientHeight);
      if (program) {
        (program.uniforms.uRes.value as Float32Array)[0] = gl.canvas.width;
        (program.uniforms.uRes.value as Float32Array)[1] = gl.canvas.height;
      }
    }

    // throttle resize με rAF
    let resizeRaf = 0 as unknown as number;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    };
    window.addEventListener("resize", onResize, { passive: true });
    resize();

    // mouse (αν ποτέ ενεργοποιηθεί)
    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
    }
    if (mouseReact) ctn.addEventListener("mousemove", handleMouseMove);

    // cap FPS ~45 για πιο βελούδινη κίνηση και λιγότερο lag
    let rafId = 0;
    let last = 0;
    const targetMs = 1000 / 45;

    const update = (now: number) => {
      rafId = requestAnimationFrame(update);
      if (now - last < targetMs) return;
      last = now;

      if (program) {
        // μικρή επίδραση του mouse σε κέντρα (αν mouseReact)
        const m = mouseReact ? mousePos.current : { x: 0.5, y: 0.5 };
        // feed time
        program.uniforms.uTime.value = now * 0.001 + (m.x - 0.5) * 0.1;
      }
      renderer.render({ scene: mesh });
    };

    rafId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    // καθαρισμοί
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (mouseReact) ctn.removeEventListener("mousemove", handleMouseMove);
      if (ctn.contains(gl.canvas)) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact]);

  return <div ref={ctnDom} className={`iridescence-container ${className}`} />;
}
