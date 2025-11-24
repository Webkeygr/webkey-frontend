"use client";

import "./GlitchText.css";

export default function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = false, // δεν θέλουμε on-hover, το θέλουμε πάντα ενεργό
  className = "",
}: {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}) {
  const inlineStyles = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows ? "-5px 0 #ff00aa" : "none",
    "--before-shadow": enableShadows ? "5px 0 #00e5ff" : "none",
  } as React.CSSProperties;

  const hoverClass = enableOnHover ? "enable-on-hover" : "";

  return (
    <div
      className={`glitch ${hoverClass} ${className}`}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </div>
  );
}
