/**
 * Day 4 — Free Tools
 * Hub uses LogoMark SVG (not text). Brand-aligned strokes and sizes.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { siNotion, siMiro, siN8n, siSupabase } from "simple-icons";
import { BrandIcon } from "../shared/BrandIcon";
import { LogoMarkSVGGroup } from "../shared/LogoMark";
import {
  BRAND, LIME, LIME_20, LIME_40,
  BORDER_DEFAULT, STROKE,
} from "../shared/brand";

const TOOLS = [
  { si: siNotion,   angle: 225, label: "Notion"   },
  { si: siMiro,     angle: 315, label: "Miro"     },
  { si: siN8n,      angle: 135, label: "n8n"      },
  { si: siSupabase, angle: 45,  label: "Supabase" },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export const Day4Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;
  const W = width;
  const H = height;

  const cx = W * 0.5;
  const cy = H * 0.48;
  const orbitR  = isV ? H * 0.26 : W * 0.26;
  const nodeR   = isV ? 52 : 60;
  const hubSize = isV ? 100 : 116;

  const camScale = interpolate(frame, [0, 270], [1.0, 1.07], { extrapolateRight: "clamp" });

  const hubS    = spring({ frame: frame - 5,   fps, config: { damping: 12, stiffness: 120 } });
  const hubPulse = 1 + 0.05 * Math.sin(frame * 0.11);
  const headlineS = spring({ frame, fps, config: { damping: 16 } });
  const footerS   = spring({ frame: frame - 185, fps, config: { damping: 16 } });

  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${camScale})` }}>
      {/* Headline */}
      <div style={{
        position: "absolute", top: isV ? 38 : 30, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800, fontSize: isV ? "19px" : "22px",
        color: BRAND.white, letterSpacing: "-0.025em",
        opacity: Math.max(0, headlineS),
        padding: "0 44px",
      }}>
        Ferramentas que{" "}
        <span style={{ color: LIME }}>usamos com clientes</span>
      </div>

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {/* Orbit guide */}
        <circle
          cx={cx} cy={cy} r={orbitR}
          fill="none"
          stroke={BORDER_DEFAULT}
          strokeWidth={STROKE.thin}
          strokeDasharray="6 10"
          opacity={Math.max(0, hubS)}
        />

        {/* Tool nodes + connections */}
        {TOOLS.map((tool, i) => {
          const pos = polar(cx, cy, orbitR, tool.angle);
          const toolS = spring({ frame: frame - (22 + i * 18), fps, config: { damping: 12, stiffness: 130 } });
          const appear = Math.max(0, toolS);

          // Particle along edge
          const pt = ((frame * 0.85 + i * 58) % 100) / 100;
          const px = cx + (pos.x - cx) * pt;
          const py = cy + (pos.y - cy) * pt;

          // Keep brand color from simple-icons but render it respectfully
          const toolColor = `#${tool.si.hex}`;

          return (
            <g key={i}>
              {/* Connection */}
              <line
                x1={cx} y1={cy}
                x2={cx + (pos.x - cx) * appear}
                y2={cy + (pos.y - cy) * appear}
                stroke={LIME_20} strokeWidth={STROKE.normal}
              />
              {/* Traveling particle */}
              {appear > 0.5 && (
                <circle cx={px} cy={py} r={4} fill={LIME} opacity={0.5} />
              )}

              {/* Node */}
              <g opacity={appear}
                style={{ transform: `scale(${appear})`, transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                {/* Subtle glow ring */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={nodeR + 10}
                  fill={`${toolColor}0a`}
                />
                {/* Node circle */}
                <circle
                  cx={pos.x} cy={pos.y} r={nodeR}
                  fill={BRAND.black2}
                  stroke={BORDER_DEFAULT}
                  strokeWidth={STROKE.strong}
                />
                {/* Brand icon + label via foreignObject */}
                <foreignObject
                  x={pos.x - nodeR * 0.7}
                  y={pos.y - nodeR * 0.85}
                  width={nodeR * 1.4}
                  height={nodeR * 1.7}
                >
                  <div style={{
                    width: "100%", height: "100%",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 5,
                  }}>
                    <BrandIcon icon={tool.si} size={isV ? 24 : 28} />
                    <span style={{
                      fontFamily: "'Sora', sans-serif",
                      fontWeight: 700,
                      fontSize: isV ? "10px" : "11px",
                      color: BRAND.gray300,
                      whiteSpace: "nowrap",
                    }}>
                      {tool.label}
                    </span>
                  </div>
                </foreignObject>
              </g>
            </g>
          );
        })}

        {/* Hub — LogoMark SVG (not text) */}
        <g>
          {/* Pulsing glow rings */}
          {[1.9, 1.5, 1.1].map((sc, i) => (
            <circle key={i}
              cx={cx} cy={cy}
              r={(hubSize / 2) * sc * hubPulse}
              fill="none"
              stroke={LIME}
              strokeWidth={STROKE.thin}
              opacity={Math.max(0, hubS) * [0.08, 0.16, 0.32][i]}
            />
          ))}
          {/* Logo mark */}
          <LogoMarkSVGGroup
            cx={cx} cy={cy}
            size={hubSize}
            glow
            glowIntensity={0.6}
            opacity={Math.max(0, hubS)}
            filterId="hub-glow"
          />
        </g>
      </svg>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: isV ? "7%" : "6%",
        left: 0, right: 0, textAlign: "center",
        opacity: Math.max(0, footerS),
        transform: `translateY(${(1 - Math.max(0, footerS)) * 16}px)`,
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: isV ? "13px" : "14px",
          color: BRAND.gray700,
        }}>
          100% gratuitas · Use agora mesmo
        </div>
      </div>
    </div>
  );
};
