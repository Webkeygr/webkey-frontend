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
    // πόσο γρήγορα τρέχει το glitch animation (σε δευτερόλεπτα)
    ["--glitch-speed" as string]: `${speed}s`,
    // 1 = ενεργό shadow, 0 = χωρίς shadow
    ["--glitch-shadow" as string]: enableShadows ? "1" : "0",
  };

  const hoverClass = enableOnHover ? "enable-on-hover" : "";

  return (
    <div
      className={`glitch ${hoverClass} ${className}`.trim()}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </div>
  );
};

export default GlitchText;
