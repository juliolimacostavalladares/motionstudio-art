/**
 * Day 5 — Authority / Process
 * Visual: Horizontal timeline that extends left-to-right with a camera pan.
 * Milestone nodes pop up with burst effects as the camera moves forward.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Zap } from "lucide-react";

const LIME = "#d4e157";
const MILESTONES = [
  { label: "Descoberta",   day: "Dia 1-3",  sub: "Mapeamos seu processo" },
  { label: "Arquitetura",  day: "Dia 4-8",  sub: "Escopo e wireframes" },
  { label: "Dev & Testes", day: "Dia 9-30", sub: "Entregas semanais" },
  { label: "Go Live!",     day: "Dia 35",   sub: "Em produção no mercado" },
];

export const Day5Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;
  const W = width;
  const H = height;

  // Camera pans right, revealing the timeline
  const panProgress = interpolate(frame, [20, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panX = interpolate(panProgress, [0, 1], [isV ? W * 0.2 : W * 0.15, isV ? -W * 0.28 : -W * 0.22]);
  const camScale = interpolate(frame, [0, 270], [1.0, 1.05], { extrapolateRight: "clamp" });

  // Timeline line extends
  const lineW = interpolate(frame, [10, 180], [0, isV ? W * 1.5 : W * 1.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineY = isV ? H * 0.52 : H * 0.5;
  const spacing = isV ? W * 0.45 : W * 0.36;
  const startX = isV ? W * 0.08 : W * 0.06;

  // Headline
  const headS = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const tagS = spring({ frame: frame - 210, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div style={{
      position: "absolute", inset: 0,
      transform: `scale(${camScale})`,
      overflow: "hidden",
    }}>
      {/* Headline — fixed position */}
      <div style={{
        position: "absolute",
        top: isV ? 36 : 28, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: isV ? "20px" : "24px",
        color: "#f0f0f0",
        letterSpacing: "-0.02em",
        opacity: Math.max(0, headS),
        transform: `translateY(${(1 - Math.max(0, headS)) * -16}px)`,
        zIndex: 10,
      }}>
        Por que entregamos em{" "}
        <span style={{ color: LIME }}>semanas, não meses</span>
      </div>

      {/* Panning container */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, right: 0, bottom: 0,
        transform: `translateX(${panX}px)`,
      }}>
        <svg style={{ position: "absolute", inset: 0, width: "200%", height: "100%", overflow: "visible" }}>
          {/* Timeline base track */}
          <line
            x1={startX} y1={lineY}
            x2={startX + lineW} y2={lineY}
            stroke={LIME + "33"}
            strokeWidth={2}
          />

          {/* Milestones */}
          {MILESTONES.map((m, i) => {
            const nodeX = startX + i * spacing;
            const nodeDelay = 30 + i * 35;
            const ns = spring({ frame: frame - nodeDelay, fps, config: { damping: 11, stiffness: 150, mass: 0.5 } });
            const appear = Math.max(0, ns);
            const isLast = i === MILESTONES.length - 1;
            // Burst rings
            const burstProgress = interpolate(
              frame - nodeDelay - 5,
              [0, 40],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <g key={i}>
                {/* Burst rings */}
                {[0, 12, 24].map((offset, ri) => {
                  const rp = Math.max(0, burstProgress - offset / 40);
                  return (
                    <circle key={ri}
                      cx={nodeX} cy={lineY}
                      r={interpolate(rp, [0, 1], [8, isV ? 44 : 50])}
                      fill="none"
                      stroke={isLast ? LIME : LIME + "55"}
                      strokeWidth={1.5}
                      opacity={interpolate(rp, [0, 0.6, 1], [0.6, 0.2, 0])}
                    />
                  );
                })}

                {/* Node dot */}
                <circle
                  cx={nodeX} cy={lineY} r={isLast ? 14 : 10}
                  fill={isLast ? LIME : "rgba(10,10,10,0.95)"}
                  stroke={LIME}
                  strokeWidth={isLast ? 0 : 2}
                  opacity={appear}
                  style={{ transform: `scale(${appear})`, transformOrigin: `${nodeX}px ${lineY}px` }}
                />
                {isLast && (
                  <foreignObject
                    x={nodeX - 8} y={lineY - 19}
                    width={16} height={16}
                  >
                    <Zap size={14} color="#111" strokeWidth={2.5} fill="#111" />
                  </foreignObject>
                )}

                {/* Vertical line up to label */}
                <line
                  x1={nodeX} y1={lineY - (isLast ? 14 : 10)}
                  x2={nodeX} y2={lineY - (isV ? 78 : 88) * appear}
                  stroke={LIME + "44"}
                  strokeWidth={1}
                  opacity={appear}
                />

                {/* Label card */}
                <g opacity={appear} style={{ transform: `scale(${appear})`, transformOrigin: `${nodeX}px ${lineY - 100}px` }}>
                  <rect
                    x={nodeX - (isV ? 62 : 72)} y={lineY - (isV ? 130 : 148)}
                    width={isV ? 124 : 144} height={isV ? 52 : 58}
                    rx={8}
                    fill="rgba(12,12,12,0.92)"
                    stroke={isLast ? LIME + "66" : LIME + "28"}
                    strokeWidth={1}
                  />
                  <text x={nodeX} y={lineY - (isV ? 114 : 130)}
                    textAnchor="middle"
                    fontFamily="'Bricolage Grotesque', sans-serif"
                    fontWeight="800"
                    fontSize={isV ? 11 : 12}
                    fill={isLast ? LIME : "#f0f0f0"}
                  >
                    {m.label}
                  </text>
                  <text x={nodeX} y={lineY - (isV ? 98 : 112)}
                    textAnchor="middle"
                    fontFamily="'Sora', sans-serif"
                    fontWeight="600"
                    fontSize={isV ? 9 : 10}
                    fill={LIME}
                  >
                    {m.day}
                  </text>
                  <text x={nodeX} y={lineY - (isV ? 85 : 96)}
                    textAnchor="middle"
                    fontFamily="'Sora', sans-serif"
                    fontSize={isV ? 8 : 9}
                    fill="#555"
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
        position: "absolute",
        bottom: isV ? "8%" : "7%",
        left: 0, right: 0, textAlign: "center",
        opacity: Math.max(0, tagS),
        transform: `translateY(${(1 - Math.max(0, tagS)) * 16}px)`,
        zIndex: 10,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: isV ? "16px" : "18px",
          color: "#f0f0f0",
        }}>
          Do zero ao mercado em
          <span style={{ color: LIME }}> 5 semanas</span>
        </div>
      </div>
    </div>
  );
};
