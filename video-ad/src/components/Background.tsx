import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Gentle floating movement for glowing circles
  const xOffset1 = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [-5, 5]
  );
  const yOffset1 = interpolate(
    Math.cos(frame * 0.02),
    [-1, 1],
    [-5, 5]
  );

  const xOffset2 = interpolate(
    Math.cos(frame * 0.015),
    [-1, 1],
    [5, -5]
  );
  const yOffset2 = interpolate(
    Math.sin(frame * 0.015),
    [-1, 1],
    [5, -5]
  );

  // Gentle opacity pulsing
  const pulseOpacity = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.75, 1]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Animated glowing radial gradients */}
      <div
        style={{
          position: "absolute",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 225, 87, 0.09) 0%, rgba(212, 225, 87, 0) 70%)",
          left: `calc(10% + ${xOffset1}px)`,
          top: `calc(20% + ${yOffset1}px)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 225, 87, 0.07) 0%, rgba(212, 225, 87, 0) 70%)",
          right: `calc(10% + ${xOffset2}px)`,
          bottom: `calc(10% + ${yOffset2}px)`,
          transform: "translate(50%, 50%)",
          filter: "blur(40px)",
        }}
      />

      {/* Grid Pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          opacity: pulseOpacity,
          maskImage: "radial-gradient(ellipse at center, black, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 90%)",
        }}
      />
    </div>
  );
};
