/**
 * LogoMark — the Motion Studio C-shape icon, no text.
 * Use this in MIDDLE SCENES whenever you need to brand a hub or node.
 * The Intro and Outro use their own full-featured logo assembly.
 */
import React from "react";
import { BRAND, LOGO_PATH, RADIUS } from "./brand";

interface LogoMarkProps {
  /** Rendered size in px (square) */
  size?: number;
  /** Lime glow effect */
  glow?: boolean;
  /** Glow intensity 0–1 */
  glowIntensity?: number;
  /** Scale applied to the whole mark */
  scale?: number;
  opacity?: number;
}

const FILTER_ID = "lm-glow";

export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 56,
  glow = false,
  glowIntensity = 0.55,
  scale = 1,
  opacity = 1,
}) => {
  const r = (RADIUS.md / 200) * size; // proportional corner radius
  return (
    <svg
      width={size * scale}
      height={size * scale}
      viewBox="0 0 200 200"
      style={{ opacity, overflow: "visible" }}
    >
      {glow && (
        <defs>
          <filter id={FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={10} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      {/* Plate */}
      <rect
        width="200"
        height="200"
        rx={RADIUS.md * (200 / size)}
        fill={BRAND.black2}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={200 / size}
      />
      {/* C-mark */}
      <path
        d={LOGO_PATH}
        fill={BRAND.lime}
        style={glow ? { filter: `url(#${FILTER_ID})` } : undefined}
        fillOpacity={glowIntensity > 0 ? 1 : 1}
      />
      {/* Circle cutout */}
      <circle cx="100" cy="100" r="26" fill={BRAND.black2} />

      {/* Optional outer glow ring */}
      {glow && (
        <circle
          cx="100"
          cy="100"
          r="108"
          fill="none"
          stroke={BRAND.lime}
          strokeWidth={1.5}
          opacity={glowIntensity * 0.3}
        />
      )}
    </svg>
  );
};

/**
 * LogoMarkSVGGroup — renders the logo mark as raw SVG elements
 * for embedding directly inside a parent <svg> element.
 * Use when you need the mark positioned at (cx, cy) without foreignObject.
 */
interface LogoMarkSVGGroupProps {
  cx: number;
  cy: number;
  size?: number;
  glow?: boolean;
  glowIntensity?: number;
  opacity?: number;
  filterId?: string;
}

export const LogoMarkSVGGroup: React.FC<LogoMarkSVGGroupProps> = ({
  cx,
  cy,
  size = 56,
  glow = false,
  glowIntensity = 0.55,
  opacity = 1,
  filterId = "lmg-glow",
}) => {
  const scale = size / 200;
  const rx = RADIUS.md;
  return (
    <g
      transform={`translate(${cx - size / 2}, ${cy - size / 2}) scale(${scale})`}
      opacity={opacity}
    >
      {glow && (
        <defs>
          <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={12} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      {/* Plate */}
      <rect
        width="200"
        height="200"
        rx={rx}
        fill={BRAND.black2}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1 / scale}
      />
      {/* C-shape */}
      <path
        d={LOGO_PATH}
        fill={BRAND.lime}
        style={glow ? { filter: `url(#${filterId})` } : undefined}
      />
      {/* Cutout */}
      <circle cx="100" cy="100" r="26" fill={BRAND.black2} />

      {/* Glow halo */}
      {glow && (
        <circle
          cx="100" cy="100" r="115"
          fill={`${BRAND.lime}10`}
          stroke={`${BRAND.lime}28`}
          strokeWidth={1 / scale}
        />
      )}
    </g>
  );
};
