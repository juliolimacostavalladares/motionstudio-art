/**
 * Day 7 — Community Network
 * Hub replaced with LogoMark. Nodes larger, edges thicker.
 * Brand-only palette: lime variants + grays.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MessageSquare } from "lucide-react";
import { LogoMarkSVGGroup } from "../shared/LogoMark";
import {
  BRAND, LIME, LIME_20, LIME_40,
  STROKE,
} from "../shared/brand";

const DOTS = [
  { x: 0.12, y: 0.22 }, { x: 0.28, y: 0.15 }, { x: 0.45, y: 0.20 },
  { x: 0.62, y: 0.18 }, { x: 0.78, y: 0.25 }, { x: 0.88, y: 0.14 },
  { x: 0.08, y: 0.42 }, { x: 0.20, y: 0.52 }, { x: 0.36, y: 0.44 },
  { x: 0.60, y: 0.40 }, { x: 0.74, y: 0.48 }, { x: 0.90, y: 0.38 },
  { x: 0.14, y: 0.68 }, { x: 0.30, y: 0.74 }, { x: 0.48, y: 0.66 },
  { x: 0.65, y: 0.72 }, { x: 0.82, y: 0.65 }, { x: 0.92, y: 0.76 },
];

const EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],
  [0,6],[6,7],[1,7],[7,8],[8,2],
  [3,9],[9,10],[10,4],[10,11],
  [6,12],[12,13],[13,14],[14,8],
  [9,14],[14,15],[15,10],[15,16],[16,17],
];

const CENTER = { x: 0.5, y: 0.48 };

export const Day7Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;
  const W = width;
  const H = height;

  const camScale = interpolate(frame, [0, 270], [1.0, 1.08], { extrapolateRight: "clamp" });
  const drift    = Math.sin(frame * 0.006) * 8;

  const hubS     = spring({ frame: frame - 115, fps, config: { damping: 11, stiffness: 140 } });
  const hubPulse = Math.max(0, hubS) > 0 ? 1 + 0.06 * Math.sin((frame - 115) * 0.13) : 0;
  const hubSize  = isV ? 80 : 96;

  const headS = spring({ frame, fps, config: { damping: 16 } });
  const tagS  = spring({ frame: frame - 195, fps, config: { damping: 14 } });

  const cx = W * CENTER.x;
  const cy = H * CENTER.y;

  return (
    <div style={{
      position: "absolute", inset: 0,
      transform: `scale(${camScale}) translateX(${drift}px)`,
      overflow: "hidden",
    }}>
      {/* Headline */}
      <div style={{
        position: "absolute", top: isV ? 36 : 28, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800, fontSize: isV ? "19px" : "22px",
        color: BRAND.white, letterSpacing: "-0.025em",
        opacity: Math.max(0, headS),
        padding: "0 44px",
      }}>
        Construindo junto,{" "}
        <span style={{ color: LIME }}>crescendo mais rápido</span>
      </div>

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Network edges */}
        {EDGES.map(([a, b], i) => {
          const da = DOTS[a], db = DOTS[b];
          const delay = 12 + i * 5;
          const ep = interpolate(frame - delay, [0, 18], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const ax = da.x * W, ay = da.y * H;
          const bx = db.x * W, by = db.y * H;
          // Breathing pulse
          const pulse = 0.12 + 0.09 * Math.sin(frame * 0.07 + i * 0.45);
          return (
            <line key={i}
              x1={ax} y1={ay}
              x2={ax + (bx - ax) * ep}
              y2={ay + (by - ay) * ep}
              stroke={LIME}
              strokeWidth={STROKE.normal}
              opacity={pulse * ep}
            />
          );
        })}

        {/* Community dots */}
        {DOTS.map((dot, i) => {
          const ds = spring({ frame: frame - (4 + i * 5), fps, config: { damping: 12, stiffness: 160 } });
          const appear = Math.max(0, ds);
          const breathe = 1 + 0.14 * Math.sin(frame * 0.07 + i * 0.65);
          const dist = Math.sqrt(Math.pow(dot.x - CENTER.x, 2) + Math.pow(dot.y - CENTER.y, 2));
          // Closer to hub = more opaque lime
          const limeAmt = Math.max(0, 1 - dist * 2.4);
          const r = (isV ? 7 : 8) * breathe;
          const dx = dot.x * W, dy = dot.y * H;
          return (
            <g key={i}>
              <circle cx={dx} cy={dy} r={r * 2.2}
                fill={LIME} opacity={appear * limeAmt * 0.07}
              />
              <circle
                cx={dx} cy={dy} r={r}
                fill={`rgba(212,225,87,${0.22 + limeAmt * 0.6})`}
                stroke={LIME}
                strokeWidth={STROKE.thin}
                strokeOpacity={0.3 + limeAmt * 0.3}
                opacity={appear}
              />
            </g>
          );
        })}

        {/* Hub — LogoMark with pulse rings */}
        {Math.max(0, hubS) > 0 && (
          <g>
            {[2.2, 1.6].map((sc, i) => (
              <circle key={i}
                cx={cx} cy={cy}
                r={(hubSize / 2) * sc * hubPulse}
                fill="none"
                stroke={LIME}
                strokeWidth={STROKE.thin}
                opacity={Math.max(0, hubS) * [0.1, 0.2][i]}
              />
            ))}
            <LogoMarkSVGGroup
              cx={cx} cy={cy}
              size={hubSize}
              glow
              glowIntensity={0.55}
              opacity={Math.max(0, hubS)}
              filterId="d7-hub-glow"
            />
          </g>
        )}
      </svg>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: isV ? "7%" : "6%",
        left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
        opacity: Math.max(0, tagS),
        transform: `translateY(${(1 - Math.max(0, tagS)) * 16}px)`,
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: isV ? "13px" : "14px",
          color: BRAND.gray700,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          O que você vai construir essa semana?
          <MessageSquare size={isV ? 13 : 14} color={BRAND.gray700} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};
