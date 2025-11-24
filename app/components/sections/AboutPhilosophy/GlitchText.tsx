import React from "react";
import "./GlitchText.css";

type Props = {
  children: React.ReactNode;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
};

const GlitchText: React.FC<Props> = ({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = "",
}) => {
  const inlineStyles: React.CSSProperties = {
    // τα πολλαπλασιαζω για πιο ομαλό glitch
    ["--after-duration" as any]: `${speed * 3}s`,
    ["--before-duration" as any]: `${speed * 2}s`,
    ["--after-shadow" as any]: enableShadows ? "-4px 0 #ff00b7" : "none",
    ["--before-shadow" as any]: enableShadows ? "4px 0 #00e0ff" : "none",
  };

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
};

export default GlitchText;
