import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const LIME = "#d4e157";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;

  // Plate reveal
  const plateS = spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 100, mass: 0.8 } });
  // Logo mark
  const markS = spring({ frame: frame - 18, fps, config: { damping: 11, stiffness: 140, mass: 0.6 } });
  // Orbit ring
  const ringS = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 110 } });
  // Brand text
  const txtS = spring({ frame: frame - 35, fps, config: { damping: 16, stiffness: 120 } });
  // Tagline
  const tagS = spring({ frame: frame - 48, fps, config: { damping: 18, stiffness: 100 } });

  // Logo pulse after assembly
  const pulse = frame > 55 ? 1 + 0.04 * Math.sin((frame - 55) * 0.18) : 1;

  // Fade out at end
  const fadeOut = interpolate(frame, [62, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoSize = isV ? 130 : 110;

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: fadeOut,
    }}>
      {/* Logo assembly */}
      <div style={{ position: "relative", marginBottom: isV ? 28 : 22 }}>
        {/* Orbit ring */}
        <div style={{
          position: "absolute",
          inset: -16,
          borderRadius: "50%",
          border: `1.5px solid ${LIME}28`,
          transform: `scale(${Math.max(0, ringS)}) rotate(${(1 - Math.max(0, ringS)) * -90}deg)`,
          opacity: Math.max(0, ringS),
        }} />
        {/* Outer glow */}
        <div style={{
          position: "absolute",
          inset: -24,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${LIME}14 0%, transparent 70%)`,
          transform: `scale(${Math.max(0, ringS) * pulse})`,
        }} />

        {/* Logo plate */}
        <div style={{
          transform: `scale(${Math.max(0, plateS) * pulse})`,
          opacity: Math.max(0, plateS),
        }}>
          <svg width={logoSize} height={logoSize} viewBox="0 0 200 200" overflow="visible">
            {/* Shadow */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g style={{ transform: `scale(${Math.max(0, plateS)})`, transformOrigin: "100px 100px" }}>
              <rect width="200" height="200" rx="48" fill="#111" stroke="#1e1e1e" strokeWidth="2" />
            </g>
            <g style={{
              transform: `scale(${Math.max(0, markS)}) rotate(${(1 - Math.max(0, markS)) * 180}deg)`,
              transformOrigin: "100px 100px",
              filter: "url(#glow)",
            }}>
              <path
                d="M100 40C66.86 40 40 66.86 40 100C40 133.14 66.86 160 100 160H160V100C160 66.86 133.14 40 100 40Z"
                fill={LIME}
              />
            </g>
            <g style={{ transform: `scale(${Math.max(0, markS)})`, transformOrigin: "100px 100px" }}>
              <circle cx="100" cy="100" r="26" fill="#111" />
            </g>
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <div style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: isV ? 36 : 30,
        letterSpacing: "-0.03em",
        color: "#f0f0f0",
        opacity: Math.max(0, txtS),
        transform: `translateY(${(1 - Math.max(0, txtS)) * 20}px)`,
        marginBottom: 10,
      }}>
        Motion <span style={{ color: LIME }}>Studio</span>
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 500,
        fontSize: isV ? 13 : 11,
        color: "#444",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        opacity: Math.max(0, tagS),
        transform: `translateY(${(1 - Math.max(0, tagS)) * 12}px)`,
      }}>
        Software sob medida
      </div>
    </div>
  );
};
