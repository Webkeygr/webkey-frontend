"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import "./Iridescence.css";

type IridescenceProps = {
  color?: [number, number, number]; // global tint (παραμένει για συμβατότητα)
  speed?: number;                   // κίνηση κυματισμού
  amplitude?: number;               // ένταση “αναπνοής”
  mouseReact?: boolean;             // προαιρετικό
  className?: string;

  /** ΝΕΑ προαιρετικά για το “κύμα” (κρατάνε default αν δεν τα δώσεις) */
  angleDeg?: number;    // γωνία διαγώνιου κύματος (μοίρες). default: -35
  bandEdge?: number;    // που “ξεκινά” από δεξιά (0..1). default: 0.62
  bandWidth?: number;   // πλάτος κύματος (0..1). default: 0.35
  intensity?: number;   // πόσο έντονα μπαίνουν τα χρώματα (0..1.3). default: 1
};

export default function Iridescence({
  color = [1, 1, 1],
  speed = 0.45,
  amplitude = 0.06,
  mouseReact = false,
  className = "",
  angleDeg = -35,
  bandEdge = 0.62,
  bandWidth = 0.35,
  intensity = 1.0,
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;

    // --- Light CSS fallback (mobile/reduced motion) ---
    const prefersReduced =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(pointer: coarse)").matches);

    if (prefersReduced) {
      // Φωτεινό, με διακριτικό διαγώνιο χρώμα δεξιά
      ctn.style.background =
        "linear-gradient(180deg, #f7f9ff, #f3f6ff)"; // λευκή βάση
      ctn.style.maskImage = "";
      ctn.style.webkitMaskImage = "";
      ctn.style.backgroundImage =
        "linear-gradient(160deg, rgba(255,255,255,0) 40%, rgba(105,140,255,0.22) 58%, rgba(176,140,255,0.18) 72%, rgba(255,111,177,0.14) 86%)," +
        "linear-gradient(180deg, #f7f9ff, #f3f6ff)";
      return;
    }

    // --- WebGL (ελαφρύ) ---
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 1.5), // cap DPR
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1); // λευκή βάση

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

    // --- Ιριδίζον “κύμα” διαγώνια, με λευκή βάση ---
    const fragment = `
      precision highp float;
      varying vec2 vUv;

      uniform vec2 uRes;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uAmp;
      uniform vec3  uTint;

      uniform float uAngle;   // radians
      uniform float uEdge;    // 0..1 (που ξεκινά)
      uniform float uWidth;   // 0..1 (πλάτος)
      uniform float uInt;     // πόσο έντονα τα χρώματα

      // φωτεινή, ουδέτερη βάση (λευκό με ελαφρύ μπλε)
      const vec3 baseWhite = vec3(0.975, 0.98, 0.995);

      // τρεις ιριδίζουσες αποχρώσεις (blue → violet → pink)
      const vec3 c1 = vec3(0.43, 0.62, 1.00); // #6fa0ff περίπου
      const vec3 c2 = vec3(0.69, 0.55, 1.00); // #b08cff περίπου
      const vec3 c3 = vec3(1.00, 0.54, 0.77); // #ff6fb1 περίπου

      float hash(vec2 p){ return fract(sin(dot(p, vec2(27.168, 91.17))) * 43758.5453); }

      mat2 rot(float a){
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
      }

      void main(){
        // uv με aspect (για να κρατήσουμε σωστή γωνία)
        vec2 res = uRes;
        vec2 uv = vUv;
        float aspect = res.x / max(res.y, 1.0);
        uv.x *= aspect;

        float t = uTime * 0.06 * uSpeed;

        // μετασχηματισμός για διαγώνιο λωρίδα χρώματος
        vec2 p = uv - vec2(0.5 * aspect, 0.5);
        p = rot(uAngle) * p;

        // band: ομαλή μετάβαση από δεξιά προς τα αριστερά
        float edge = uEdge * aspect - (aspect - 1.0) * 0.5; // προσαρμογή για aspect
        float band = smoothstep(edge, edge - uWidth, p.x);

        // κύμα (απαλή παλλόμενη μεταβολή μέσα στη λωρίδα)
        float wave = 0.5 + 0.5 * sin( (p.y * 5.0 + t*1.5) + sin(t*0.7)*0.5 );
        float w1 = band * (0.35 + 0.25 * wave);     // μπλε κορμός
        float w2 = band * (0.28 + 0.22 * sin(t*0.9 + p.y*3.2));
        float w3 = band * (0.20 + 0.18 * cos(t*0.7 + p.y*2.6));

        // αρχική τιμή: φωτεινή λευκή βάση
        vec3 col = baseWhite;

        // μίξεις — διακριτικές, ώστε να “κυλάει” το χρώμα αλλά να κυριαρχεί το λευκό
        col = mix(col, c1, clamp(w1 * 0.30 * uInt, 0.0, 1.0));
        col = mix(col, c2, clamp(w2 * 0.22 * uInt, 0.0, 1.0));
        col = mix(col, c3, clamp(w3 * 0.18 * uInt, 0.0, 1.0));

        // ελαφρύτατο noise για αποφυγή banding (χωρίς να “γκριζάρει”)
        float n = (hash(vUv * res + t) - 0.5) * 0.01;
        col += n;

        // global tint (κρατάμε το prop)
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
        uAngle: { value: (angleDeg * Math.PI) / 180 }, // σε radians
        uEdge: { value: bandEdge },
        uWidth: { value: bandWidth },
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

    // cap ~45fps για “βελούδινη” κίνηση + λιγότερο lag
    let rafId = 0;
    let last = 0;
    const targetMs = 1000 / 45;

    const update = (now: number) => {
      rafId = requestAnimationFrame(update);
      if (now - last < targetMs) return;
      last = now;

      // ελάχιστη επιρροή από το mouse αν είναι ενεργό (κρατάμε minimal)
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
  }, [color, speed, amplitude, mouseReact, angleDeg, bandEdge, bandWidth, intensity]);

  return <div ref={ctnDom} className={`iridescence-container ${className}`} />;
}
