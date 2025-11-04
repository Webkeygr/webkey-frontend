"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import "./Iridescence.css";

type IridescenceProps = {
  color?: [number, number, number]; // global tint
  speed?: number;                   // ρυθμός “αναπνοής”
  amplitude?: number;               // ένταση κίνησης
  mouseReact?: boolean;             // off για minimal
  className?: string;

  /** Ένταση χρώματος (0.7–1.3) */
  intensity?: number;
};

export default function Iridescence({
  color = [1, 1, 1],
  speed = 0.45,
  amplitude = 0.06,
  mouseReact = false,
  className = "",
  intensity = 1.0,
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;

    // --- Light CSS fallback (mobile / reduced motion) ---
    const prefersReduced =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(pointer: coarse)").matches);

    if (prefersReduced) {
      // Off-white βάση + μεγάλος “θολός” λόφος κάτω-δεξιά (magenta→cyan) + ζεστός τόνος επάνω
      ctn.style.backgroundImage =
        "radial-gradient(70vmax 70vmax at 78% 62%, rgba(255,90,170,0.32) 0%, rgba(116,190,255,0.28) 45%, rgba(255,255,255,0) 70%)," +
        "radial-gradient(60vmax 60vmax at 48% 16%, rgba(245,220,200,0.35) 0%, rgba(255,255,255,0) 60%)," +
        "linear-gradient(180deg, #f0f1f4 0%, #f6f7f9 100%)";
      return;
    }

    // --- WebGL (ελαφρύ) ---
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1); // λευκή/φωτεινή βάση

    const geometry = new Triangle(gl);

    const vertex = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // --- Fragment: off-white background + big blurry magenta/cyan hill bottom-right + warm top-center ---
    const fragment = `
      precision highp float;
      varying vec2 vUv;

      uniform vec2 uRes;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uAmp;
      uniform vec3  uTint;
      uniform float uInt; // intensity

      // Off-white βάση (πολύ ελαφρύ γκρι/μπλε)
      const vec3 base1 = vec3(0.945, 0.95, 0.965);
      const vec3 base2 = vec3(0.975, 0.976, 0.985);

      // Χρώματα “λόφου”
      const vec3 warm   = vec3(1.00, 0.92, 0.86); // beige/peach
      const vec3 magenta= vec3(1.00, 0.45, 0.75);
      const vec3 cyan   = vec3(0.52, 0.78, 1.00);

      float hash(vec2 p){ return fract(sin(dot(p, vec2(27.168, 91.17))) * 43758.5453); }
      float gauss(vec2 p, vec2 c, float k){
        vec2 d = p - c;
        return exp(-k * dot(d, d));
      }

      void main(){
        vec2 res = uRes;
        vec2 uv = vUv;

        // ελαφρύς διακριτικός κάθετος φωτισμός στη βάση
        vec3 col = mix(base1, base2, smoothstep(0.0, 1.0, uv.y));

        // aspect-correct space για “κύκλους”
        float aspect = res.x / max(res.y, 1.0);
        vec2 p = uv; p.x *= aspect;

        float t = uTime * 0.06 * uSpeed;

        // --- Θέσεις λόφων ---
        // ζεστός τόνος επάνω-κέντρο
        vec2 cWarm = vec2(0.48 * aspect, 0.16);
        // μεγάλος λόφος κάτω-δεξιά (κοινό κέντρο για magenta/cyan)
        vec2 cHill = vec2(0.80 * aspect, 0.62);

        // “αναπνοή” (πολύ διακριτική)
        float breathe = 1.0 + 0.02 * sin(t * 1.1);

        // ζεστός τόνος
        float wWarm = gauss(p, cWarm, 6.0) * 0.45 * uInt;

        // magenta core + cyan halo (διαφορετικές εκθέσεις για φαρδιές θολώσεις)
        float wMag = gauss(p, cHill + vec2(0.00, 0.00), 3.6) * 1.10 * uInt * breathe;
        float wCyn = gauss(p, cHill + vec2(0.00, -0.02), 1.6) * 0.65 * uInt;

        // αργή μετατόπιση για “ζωντανό” blurry edge (χωρίς να αποσπά)
        float driftX = 0.02 * uAmp * sin(t*0.7);
        float driftY = 0.02 * uAmp * cos(t*0.5);
        wMag *= 1.0 - 0.08 * length(p - (cHill + vec2(driftX,driftY)));
        wCyn *= 1.0 - 0.05 * length(p - (cHill + vec2(driftX,driftY)));

        // μίξεις (κρατάμε πάντα φωτεινή τη βάση)
        col = mix(col, warm,   clamp(wWarm, 0.0, 1.0));
        col = mix(col, magenta,clamp(wMag,  0.0, 1.0));
        col = mix(col, cyan,   clamp(wCyn,  0.0, 1.0));

        // ελαφρύτατο noise για να σπάσει banding (χωρίς να “γκριζάρει”)
        float n = (hash(vUv * res + t) - 0.5) * 0.008;
        col += n;

        // Global tint (συμβατότητα με prop)
        col *= uTint;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: new Float32Array([gl.canvas.width, gl.canvas.height]) },
        uSpeed: { value: speed },
        uAmp: { value: amplitude },
        uTint: { value: new Color(...color) },
        uInt: { value: intensity },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const { clientWidth, clientHeight } = ctn;
      renderer.setSize(clientWidth, clientHeight);
      const uRes = program.uniforms.uRes.value as Float32Array;
      uRes[0] = gl.canvas.width;
      uRes[1] = gl.canvas.height;
    };

    let resizeRaf = 0 as unknown as number;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    };
    window.addEventListener("resize", onResize, { passive: true });
    resize();

    function onMouse(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }
    if (mouseReact) ctn.addEventListener("mousemove", onMouse);

    // cap ~45fps για βελούδινη κίνηση + λιγότερο lag
    let rafId = 0;
    let last = 0;
    const targetMs = 1000 / 45;

    const update = (now: number) => {
      rafId = requestAnimationFrame(update);
      if (now - last < targetMs) return;
      last = now;

      const m = mouseReact ? mousePos.current : { x: 0.5, y: 0.5 };
      program.uniforms.uTime.value = now * 0.001 + (m.x - 0.5) * 0.06;

      renderer.render({ scene: mesh });
    };

    rafId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (mouseReact) ctn.removeEventListener("mousemove", onMouse);
      if (ctn.contains(gl.canvas)) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact, intensity]);

  return <div ref={ctnDom} className={`iridescence-container ${className}`} />;
}
