import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface LogoProps {
  size?: number;
  delay?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 200, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations using springs
  const bgScale = spring({
    frame: frame - delay,
    fps,
    config: { mass: 0.8, damping: 12, stiffness: 100 },
  });

  const pathScale = spring({
    frame: frame - delay - 10,
    fps,
    config: { mass: 0.6, damping: 10, stiffness: 120 },
  });

  const pathRotate = spring({
    frame: frame - delay - 10,
    fps,
    config: { mass: 1, damping: 15, stiffness: 90 },
  });

  const circleScale = spring({
    frame: frame - delay - 20,
    fps,
    config: { mass: 0.5, damping: 8, stiffness: 150 },
  });

  // Map values
  const bgScaleVal = Math.max(0, bgScale);
  const pathScaleVal = Math.max(0, pathScale);
  const pathRotateVal = pathRotate * 360; // rotate 360 degrees
  const circleScaleVal = Math.max(0, circleScale);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Background plate */}
        <g style={{ transform: `scale(${bgScaleVal})`, transformOrigin: "100px 100px" }}>
          <rect width="200" height="200" rx="44" fill="#111111" stroke="#222222" strokeWidth="2" />
        </g>

        {/* Lime shape */}
        <g
          style={{
            transform: `scale(${pathScaleVal}) rotate(${pathRotateVal}deg)`,
            transformOrigin: "100px 100px",
          }}
        >
          <path
            d="M100 40C66.86 40 40 66.86 40 100C40 133.14 66.86 160 100 160H160V100C160 66.86 133.14 40 100 40Z"
            fill="#d4e157"
          />
        </g>

        {/* Center cutout */}
        <g style={{ transform: `scale(${circleScaleVal})`, transformOrigin: "100px 100px" }}>
          <circle cx="100" cy="100" r="25" fill="#111111" />
        </g>
      </svg>
    </div>
  );
};
