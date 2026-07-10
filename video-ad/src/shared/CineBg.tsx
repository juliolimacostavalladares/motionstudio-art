import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const CineBg: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = Math.sin(frame * 0.018);
  const p2 = Math.cos(frame * 0.014);
  const glow1 = 0.07 + 0.025 * Math.sin(frame * 0.035);
  const glow2 = 0.05 + 0.02 * Math.cos(frame * 0.028);
  const gridOpacity = 0.8 + 0.2 * Math.sin(frame * 0.025);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#080808", overflow: "hidden" }}>
      {/* Orb 1 */}
      <div style={{
        position: "absolute",
        width: 900, height: 900, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(212,225,87,${glow1}) 0%, transparent 60%)`,
        left: `calc(12% + ${p1 * 14}px)`, top: `calc(8% + ${p2 * 10}px)`,
        transform: "translate(-50%,-50%)", filter: "blur(70px)",
      }} />
      {/* Orb 2 */}
      <div style={{
        position: "absolute",
        width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(212,225,87,${glow2}) 0%, transparent 60%)`,
        right: `calc(8% + ${-p1 * 12}px)`, bottom: `calc(6% + ${-p2 * 8}px)`,
        transform: "translate(50%,50%)", filter: "blur(60px)",
      }} />
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        opacity: gridOpacity,
        maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)",
      }} />
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)",
      }} />
    </div>
  );
};
