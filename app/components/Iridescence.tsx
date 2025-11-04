"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import "./Iridescence.css";

type IridescenceProps = {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
  className?: string;
  /** Πόσο έντονα μπαίνουν τα χρώματα (0.7–1.6) */
  intensity?: number;
  /** Οξύτητα των “λωβών” (3.0–9.0). Μεγαλύτερο = πιο “κοφτό”/ζωντανό. */
  sharpness?: number;
};

export default function Iridescence({
  color = [1, 1, 1],
  speed = 0.5,
  amplitude = 0.08,
  mouseReact = false,
  className = "",
  intensity = 1.25,
  sharpness = 5.2,
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;

    // --- Light fallback για mobile / reduced motion ---
    const prefersReduced =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(pointer: coarse)").matches);

    if (prefersReduced) {
      // Off-white βάση + έντονος “λόφος” κάτω-δεξιά σε 3 τόνους
      ctn.style.backgroundImage =
        "radial-gradient(65vmax 65vmax at 78% 62%, rgba(255,95,180,0.55) 0%, rgba(170,120,255,0.45) 35%, rgba(110,200,255,0.35) 60%, rgba(255,255,255,0) 76%)," +
        "radial-gradient(60vmax 60vmax at 46% 14%, rgba(248,226,206,0.35) 0%, rgba(255,255,255,0) 60%)," +
        "linear-gradient(180deg, #f2f3f6 0%, #f7f8fa 100%)";
      return;
    }

    // --- WebGL (ελαφρύ & δυναμικό) ---
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const geometry = new Triangle(gl);

    const vertex = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // “Strong KOTA-style” iridescent hill
    const fragment = `
      precision highp float;
      varying vec2 vUv;

      uniform vec2  uRes;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uAmp;
      uniform vec3  uTint;
      uniform float uInt;
      uniform float uSharp;

      // φωτεινή ουδέτερη βάση
      const vec3 baseA = vec3(0.952, 0.956, 0.970);
      const vec3 baseB = vec3(0.980, 0.982, 0.990);

      // iridescent παλέτα
      const vec3 C_MAG = vec3(1.00, 0.45, 0.78); // magenta
      const vec3 C_VIO = vec3(0.74, 0.55, 1.00); // violet
      const vec3 C_CYN = vec3(0.54, 0.81, 1.00); // cyan
      const vec3 C_WARM= vec3(1.00, 0.92, 0.86); // warm beige

      float hash(vec2 p){ return fract(sin(dot(p, vec2(27.168,91.17))) * 43758.5453); }

      // “Gaussian-like” αλλά με ρυθμιζόμενο falloff (uSharp)
      float lobe(vec2 p, vec2 c, float k){
        vec2 d = p - c;
        // k ~ sharpness: 3..9
        return exp(-k * dot(d, d));
      }

      void main(){
        vec2 res = uRes;
        vec2 uv = vUv;
        vec3 col = mix(baseA, baseB, smoothstep(0.0, 1.0, uv.y)); // διακριτική κάθετη βάση

        // aspect-correct coordinates για κυκλικές θολώσεις
        float aspect = res.x / max(res.y, 1.0);
        vec2 p = uv; p.x *= aspect;

        float t = uTime * 0.06 * uSpeed;

        // Κέντρα:
        // ζεστή ανάσα ψηλά-κέντρο
        vec2 cWarm = vec2(0.47 * aspect, 0.14);
        // “λόφος” κάτω-δεξιά (κοινό κέντρο, μικρές αποκλίσεις)
        vec2 cHill = vec2(0.80 * aspect, 0.62);

        // Aπαλή αναπνοή και μικρή “ολίσθηση” του λόφου
        float breathe = 1.0 + 0.03 * sin(t * 1.1);
        vec2 drift = vec2(0.018 * uAmp * sin(t*0.8), 0.018 * uAmp * cos(t*0.6));

        // ζέστη
        float wWarm = lobe(p, cWarm, 6.0) * 0.55 * uInt;

        // 3 “στρώσεις” του λόφου με διαφορετικές οξύτητες, ώστε να φαίνεται έντονο
        float wMag = lobe(p, cHill + drift + vec2( 0.00,  0.00), uSharp)     * 1.25 * uInt * breathe;
        float wVio = lobe(p, cHill + drift + vec2(-0.01, -0.01), uSharp*0.8) * 0.90 * uInt;
        float wCyn = lobe(p, cHill + drift + vec2( 0.00, -0.02), uSharp*0.55)* 0.85 * uInt;

        // λίγο “σκληραίνουμε” το falloff με power για πιο ζωντανά χείλη
        wMag = pow(wMag, 1.0);
        wVio = pow(wVio, 1.1);
        wCyn = pow(wCyn, 1.2);

        // μίξεις — κρατάμε τη βάση φωτεινή αλλά δίνουμε ένταση στον λόφο
        col = mix(col, C_WARM, clamp(wWarm, 0.0, 1.0));
        col = mix(col, C_MAG,  clamp(wMag,  0.0, 1.0));
        col = mix(col, C_VIO,  clamp(wVio,  0.0, 1.0));
        col = mix(col, C_CYN,  clamp(wCyn,  0.0, 1.0));

        // ανεπαίσθητο noise για banding (χωρίς να “γκριζάρει”)
        float n = (hash(vUv * res + t) - 0.5) * 0.007;
        col += n;

        // global tint για συμβατότητα
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
        uSharp: { value: sharpness },
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

    // cap ~45fps
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
  }, [color, speed, amplitude, mouseReact, intensity, sharpness]);

  return <div ref={ctnDom} className={`iridescence-container ${className}`} />;
}
