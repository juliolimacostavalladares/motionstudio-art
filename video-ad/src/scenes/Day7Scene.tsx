/**
 * Day 7 — Community
 * Visual: Scattered dots gradually connect into a network.
 * Central "MS" node appears and glows, representing the hub.
 * Lines draw between nodes forming a living, breathing community graph.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const LIME = "#d4e157";

// Seeded random positions for the community dots
const DOTS = [
  { x: 0.12, y: 0.22 }, { x: 0.28, y: 0.15 }, { x: 0.45, y: 0.20 },
  { x: 0.62, y: 0.18 }, { x: 0.78, y: 0.25 }, { x: 0.88, y: 0.14 },
  { x: 0.08, y: 0.42 }, { x: 0.20, y: 0.52 }, { x: 0.36, y: 0.44 },
  { x: 0.60, y: 0.40 }, { x: 0.74, y: 0.48 }, { x: 0.90, y: 0.38 },
  { x: 0.14, y: 0.68 }, { x: 0.30, y: 0.74 }, { x: 0.48, y: 0.66 },
  { x: 0.65, y: 0.72 }, { x: 0.82, y: 0.65 }, { x: 0.92, y: 0.76 },
];

// Edges to draw (pairs of dot indices)
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
  // Gentle drift
  const drift = Math.sin(frame * 0.007) * 8;

  // Hub appears at frame 120
  const hubS = spring({ frame: frame - 120, fps, config: { damping: 11, stiffness: 140 } });
  const hubPulse = Math.max(0, hubS) > 0 ? 1 + 0.06 * Math.sin((frame - 120) * 0.14) : 0;

  // Headline
  const headS = spring({ frame, fps, config: { damping: 16 } });
  const tagS = spring({ frame: frame - 190, fps, config: { damping: 14 } });

  const hubR = isV ? 36 : 42;
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
        position: "absolute",
        top: isV ? 36 : 28, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800, fontSize: isV ? "19px" : "22px",
        color: "#f0f0f0", letterSpacing: "-0.02em",
        opacity: Math.max(0, headS),
        padding: "0 40px",
      }}>
        Construindo junto,{" "}
        <span style={{ color: LIME }}>crescendo mais rápido</span>
      </div>

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Network edges */}
        {EDGES.map(([a, b], i) => {
          const da = DOTS[a];
          const db = DOTS[b];
          const edgeDelay = 15 + i * 6;
          const edgeProgress = interpolate(frame - edgeDelay, [0, 20], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const ax = da.x * W, ay = da.y * H;
          const bx = db.x * W, by = db.y * H;
          const mx = ax + (bx - ax) * edgeProgress;
          const my = ay + (by - ay) * edgeProgress;
          // Pulse along edge
          const pulse = 0.15 + 0.1 * Math.sin(frame * 0.08 + i * 0.5);
          return (
            <line key={i}
              x1={ax} y1={ay} x2={mx} y2={my}
              stroke={LIME}
              strokeWidth={0.8}
              opacity={pulse * edgeProgress}
            />
          );
        })}

        {/* Community dots */}
        {DOTS.map((dot, i) => {
          const dotDelay = 5 + i * 5;
          const dotS = spring({ frame: frame - dotDelay, fps, config: { damping: 12, stiffness: 160 } });
          const appear = Math.max(0, dotS);
          const breathe = 1 + 0.12 * Math.sin(frame * 0.08 + i * 0.7);
          const r = (isV ? 5 : 6) * breathe;
          const dx = dot.x * W;
          const dy = dot.y * H;
          // Distance to center — closer = more lime
          const dist = Math.sqrt(Math.pow(dot.x - CENTER.x, 2) + Math.pow(dot.y - CENTER.y, 2));
          const limeAmount = Math.max(0, 1 - dist * 2.5);
          return (
            <g key={i}>
              {/* Glow */}
              <circle cx={dx} cy={dy} r={r * 2.5} fill={LIME} opacity={appear * limeAmount * 0.08} />
              {/* Dot */}
              <circle
                cx={dx} cy={dy} r={r}
                fill={`rgba(212,225,87,${0.25 + limeAmount * 0.55})`}
                stroke={LIME + "44"}
                strokeWidth={0.5}
                opacity={appear}
              />
            </g>
          );
        })}

        {/* Hub — Motion Studio center node */}
        {Math.max(0, hubS) > 0 && (
          <g>
            {/* Glow rings */}
            {[2.2, 1.6, 1.1].map((scale, i) => (
              <circle key={i}
                cx={cx} cy={cy}
                r={hubR * scale * hubPulse}
                fill="none"
                stroke={LIME + ["10", "1e", "33"][i]}
                strokeWidth={1}
              />
            ))}
            <circle
              cx={cx} cy={cy} r={hubR}
              fill="rgba(10,10,10,0.95)"
              stroke={LIME}
              strokeWidth={1.5}
              opacity={Math.max(0, hubS)}
              style={{ filter: `drop-shadow(0 0 20px ${LIME}55)` }}
            />
            <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Bricolage Grotesque', sans-serif" fontWeight="800"
              fontSize={isV ? 13 : 14} fill={LIME} opacity={Math.max(0, hubS)}
            >Motion</text>
            <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Bricolage Grotesque', sans-serif" fontWeight="800"
              fontSize={isV ? 13 : 14} fill={LIME} opacity={Math.max(0, hubS)}
            >Studio</text>
          </g>
        )}
      </svg>

      {/* Bottom tagline */}
      <div style={{
        position: "absolute",
        bottom: isV ? "7%" : "6%",
        left: 0, right: 0, textAlign: "center",
        opacity: Math.max(0, tagS),
        transform: `translateY(${(1 - Math.max(0, tagS)) * 16}px)`,
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: isV ? "13px" : "14px",
          color: "#444",
        }}>
          O que você vai construir essa semana? 💬
        </div>
      </div>
    </div>
  );
};
