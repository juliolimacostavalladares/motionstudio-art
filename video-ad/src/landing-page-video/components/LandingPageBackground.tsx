import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const LandingPageBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Floating movement for multiple ambient orbs — gentle organic drift
  const orb1X = interpolate(Math.sin(frame * 0.012), [-1, 1], [-80, 80]);
  const orb1Y = interpolate(Math.cos(frame * 0.015), [-1, 1], [-60, 60]);

  const orb2X = interpolate(Math.cos(frame * 0.01), [-1, 1], [60, -60]);
  const orb2Y = interpolate(Math.sin(frame * 0.013), [-1, 1], [40, -40]);

  const orb3X = interpolate(Math.sin(frame * 0.008), [-1, 1], [-50, 50]);
  const orb3Y = interpolate(Math.cos(frame * 0.01), [-1, 1], [50, -50]);

  // Gentle opacity pulsing for the grid
  const pulseOpacity = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [0.6, 0.95]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#060608",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* 1. Ambient Orb - Yellow-Green (Brand signature) */}
      <div
        style={{
          position: "absolute",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(212, 225, 87, 0.11) 0%, rgba(212, 225, 87, 0.02) 40%, rgba(212, 225, 87, 0) 70%)",
          left: `calc(20% + ${orb1X}px)`,
          top: `calc(25% + ${orb1Y}px)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
          mixBlendMode: "screen",
        }}
      />

      {/* 2. Ambient Orb - Royal Blue (Contrasting modern tech vibe) */}
      <div
        style={{
          position: "absolute",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.01) 50%, rgba(37, 99, 235, 0) 70%)",
          left: `calc(75% + ${orb2X}px)`,
          top: `calc(35% + ${orb2Y}px)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(70px)",
          mixBlendMode: "screen",
        }}
      />

      {/* 3. Ambient Orb - Muted Violet/Magenta (Adds volumetric richness) */}
      <div
        style={{
          position: "absolute",
          width: "850px",
          height: "850px",
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.06) 0%, rgba(139, 92, 246, 0) 65%)",
          left: `calc(35% + ${orb3X}px)`,
          top: `calc(70% + ${orb3Y}px)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Grid Pattern overlay with sutil opacity */}
      <div
        style={{
          position: "absolute",
          inset: "-50px",
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          opacity: pulseOpacity,
          maskImage: "radial-gradient(circle at center, black 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 95%)",
        }}
      />
    </div>
  );
};
export default LandingPageBackground;
