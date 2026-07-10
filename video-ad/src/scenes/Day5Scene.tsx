/**
 * Day 5 — Authority / Process Timeline
 * Thicker timeline (3px), larger milestone nodes (r=18), bigger type,
 * LogoMark on final milestone instead of emoji.
 * Camera pan with brand tokens throughout.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Zap } from "lucide-react";
import {
  BRAND, LIME, LIME_20, LIME_40,
  BORDER_DEFAULT, BORDER_LIME, BORDER_ACCENT,
  STROKE, RADIUS,
} from "../shared/brand";

const MILESTONES = [
  { label: "Descoberta",   day: "Dia 1-3",  sub: "Mapeamos seu processo"  },
  { label: "Arquitetura",  day: "Dia 4-8",  sub: "Escopo e wireframes"    },
  { label: "Dev & Testes", day: "Dia 9-30", sub: "Entregas semanais"      },
  { label: "Go Live!",     day: "Dia 35",   sub: "Em produção no mercado" },
];

export const Day5Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;
  const W = width;
  const H = height;

  // Camera pan
  const panProgress = interpolate(frame, [20, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panX = interpolate(panProgress, [0, 1], [isV ? W * 0.2 : W * 0.14, isV ? -W * 0.28 : -W * 0.22]);
  const camScale = interpolate(frame, [0, 270], [1.0, 1.05], { extrapolateRight: "clamp" });

  // Timeline
  const lineW = interpolate(frame, [10, 185], [0, isV ? W * 1.55 : W * 1.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const lineY   = isV ? H * 0.52 : H * 0.5;
  const spacing = isV ? W * 0.46 : W * 0.37;
  const startX  = isV ? W * 0.07 : W * 0.06;

  const headS = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const tagS  = spring({ frame: frame - 215, fps, config: { damping: 14 } });

  const nodeR     = isV ? 16 : 19;
  const labelW    = isV ? 130 : 152;
  const labelH    = isV ? 62 : 70;
  const cardTop   = isV ? 108 : 126;

  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${camScale})`, overflow: "hidden" }}>
      {/* Fixed headline */}
      <div style={{
        position: "absolute", top: isV ? 36 : 28, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800, fontSize: isV ? "20px" : "24px",
        color: BRAND.white, letterSpacing: "-0.025em",
        opacity: Math.max(0, headS),
        transform: `translateY(${(1 - Math.max(0, headS)) * -16}px)`,
        zIndex: 10, padding: "0 44px",
      }}>
        Por que entregamos em{" "}
        <span style={{ color: LIME }}>semanas, não meses</span>
      </div>

      {/* Panning container */}
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${panX}px)` }}>
        <svg style={{ position: "absolute", inset: 0, width: "200%", height: "100%", overflow: "visible" }}>
          {/* Track background */}
          <line
            x1={startX} y1={lineY}
            x2={startX + W * 1.5} y2={lineY}
            stroke={BRAND.gray900} strokeWidth={STROKE.hero}
          />
          {/* Active track */}
          <line
            x1={startX} y1={lineY}
            x2={startX + lineW} y2={lineY}
            stroke={LIME_40} strokeWidth={STROKE.hero}
          />
          {/* Glow on active track */}
          <line
            x1={startX} y1={lineY}
            x2={startX + lineW} y2={lineY}
            stroke={LIME}
            strokeWidth={STROKE.thin}
            opacity={0.6}
          />

          {/* Milestones */}
          {MILESTONES.map((m, i) => {
            const nodeX = startX + i * spacing;
            const delay = 28 + i * 34;
            const ns = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 150, mass: 0.5 } });
            const appear = Math.max(0, ns);
            const isLast = i === MILESTONES.length - 1;

            const burstP = interpolate(frame - delay - 4, [0, 40], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });

            return (
              <g key={i}>
                {/* Burst */}
                {[0, 14, 28].map((off, ri) => {
                  const rp = Math.max(0, burstP - off / 40);
                  return (
                    <circle key={ri}
                      cx={nodeX} cy={lineY}
                      r={interpolate(rp, [0, 1], [nodeR, nodeR * (isV ? 3.2 : 3.5)])}
                      fill="none"
                      stroke={isLast ? LIME : LIME_40}
                      strokeWidth={isLast ? STROKE.normal : STROKE.thin}
                      opacity={interpolate(rp, [0, 0.55, 1], [0.6, 0.18, 0])}
                    />
                  );
                })}

                {/* Node */}
                <circle
                  cx={nodeX} cy={lineY} r={nodeR}
                  fill={isLast ? LIME : BRAND.black2}
                  stroke={LIME}
                  strokeWidth={isLast ? 0 : STROKE.strong}
                  opacity={appear}
                  style={{ transform: `scale(${appear})`, transformOrigin: `${nodeX}px ${lineY}px` }}
                />

                {/* Zap icon on last node */}
                {isLast && appear > 0.3 && (
                  <foreignObject
                    x={nodeX - 9} y={lineY - 20}
                    width={18} height={18}
                  >
                    <Zap size={15} color={BRAND.black2} strokeWidth={2.5} fill={BRAND.black2} />
                  </foreignObject>
                )}

                {/* Vertical connector */}
                <line
                  x1={nodeX} y1={lineY - nodeR}
                  x2={nodeX} y2={lineY - (isV ? cardTop - 10 : cardTop - 8) * appear}
                  stroke={isLast ? LIME_40 : BORDER_DEFAULT}
                  strokeWidth={STROKE.normal}
                  opacity={appear}
                />

                {/* Label card */}
                <g opacity={appear}
                  style={{ transform: `scale(${appear})`, transformOrigin: `${nodeX}px ${lineY - cardTop - 20}px` }}
                >
                  <rect
                    x={nodeX - labelW / 2}
                    y={lineY - cardTop - labelH}
                    width={labelW} height={labelH}
                    rx={RADIUS.sm}
                    fill={BRAND.black2}
                    stroke={isLast ? BORDER_LIME : BORDER_DEFAULT}
                    strokeWidth={isLast ? STROKE.normal : STROKE.thin}
                  />
                  {/* Label text */}
                  <text
                    x={nodeX} y={lineY - cardTop - labelH + (isV ? 18 : 20)}
                    textAnchor="middle"
                    fontFamily="'Bricolage Grotesque', sans-serif"
                    fontWeight="800"
                    fontSize={isV ? 13 : 14}
                    fill={isLast ? LIME : BRAND.white}
                  >
                    {m.label}
                  </text>
                  <text
                    x={nodeX} y={lineY - cardTop - labelH + (isV ? 36 : 40)}
                    textAnchor="middle"
                    fontFamily="'Sora', sans-serif"
                    fontWeight="700"
                    fontSize={isV ? 11 : 12}
                    fill={LIME}
                  >
                    {m.day}
                  </text>
                  <text
                    x={nodeX} y={lineY - cardTop - labelH + (isV ? 52 : 57)}
                    textAnchor="middle"
                    fontFamily="'Sora', sans-serif"
                    fontSize={isV ? 10 : 11}
                    fill={BRAND.gray500}
                  >
                    {m.sub}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Fixed tagline */}
      <div style={{
        position: "absolute", bottom: isV ? "7%" : "6%",
        left: 0, right: 0, textAlign: "center",
        opacity: Math.max(0, tagS),
        transform: `translateY(${(1 - Math.max(0, tagS)) * 16}px)`,
        zIndex: 10,
      }}>
        <div style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800, fontSize: isV ? "16px" : "18px",
          color: BRAND.white,
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Do zero ao mercado em
          <span style={{ color: LIME }}> 5 semanas</span>
        </div>
      </div>
    </div>
  );
};
