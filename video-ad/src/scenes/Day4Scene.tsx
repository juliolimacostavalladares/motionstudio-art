/**
 * Day 4 — Free Tools
 * Visual: Central "MS" hub node with 4 tool satellites flying in from corners,
 * connected by animated lines. Particles travel along the edges.
 * Brand logos from simple-icons — no emojis.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { siNotion, siMiro, siN8n, siSupabase } from "simple-icons";
import { BrandIcon } from "../shared/BrandIcon";

const LIME = "#d4e157";

const TOOLS = [
  { si: siNotion,  color: "#ffffff", angle: 225, label: "Notion"   },
  { si: siMiro,    color: "#F8D000", angle: 315, label: "Miro"     },
  { si: siN8n,     color: "#EA4B71", angle: 135, label: "n8n"      },
  { si: siSupabase,color: "#3FCF8E", angle: 45,  label: "Supabase" },
];

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
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
  const orbitR = isV ? H * 0.26 : W * 0.26;
  const nodeR = isV ? 46 : 52;
  const hubR = isV ? 54 : 62;

  const camScale = interpolate(frame, [0, 270], [1.0, 1.07], { extrapolateRight: "clamp" });

  // Hub appears first
  const hubS = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 120 } });
  const hubPulse = 1 + 0.05 * Math.sin(frame * 0.12);

  // Headline
  const headlineS = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const footerS = spring({ frame: frame - 180, fps, config: { damping: 16, stiffness: 110 } });

  return (
    <div style={{
      position: "absolute", inset: 0,
      transform: `scale(${camScale})`,
    }}>
      {/* Title */}
      <div style={{
        position: "absolute",
        top: isV ? 38 : 30, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: isV ? "19px" : "22px",
        color: "#f0f0f0",
        letterSpacing: "-0.02em",
        opacity: Math.max(0, headlineS),
        padding: "0 40px",
      }}>
        Ferramentas que{" "}
        <span style={{ color: LIME }}>usamos com clientes</span>
      </div>

      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
      >
        {/* Orbit dashed guide circle */}
        <circle
          cx={cx} cy={cy} r={orbitR}
          fill="none"
          stroke={LIME + "0c"}
          strokeWidth={1}
          strokeDasharray="6 10"
          opacity={Math.max(0, hubS)}
        />

        {/* Connections + traveling particles */}
        {TOOLS.map((tool, i) => {
          const pos = polarToXY(cx, cy, orbitR, tool.angle);
          const toolS = spring({ frame: frame - (20 + i * 18), fps, config: { damping: 12, stiffness: 130 } });
          const appear = Math.max(0, toolS);

          // Particle traveling along connection
          const particleT = ((frame * 0.9 + i * 55) % 100) / 100;
          const px = cx + (pos.x - cx) * particleT;
          const py = cy + (pos.y - cy) * particleT;

          return (
            <g key={i}>
              {/* Connection line */}
              <line
                x1={cx} y1={cy}
                x2={cx + (pos.x - cx) * appear}
                y2={cy + (pos.y - cy) * appear}
                stroke={tool.color + "28"}
                strokeWidth={1.5}
              />
              {/* Traveling dot */}
              {appear > 0.5 && (
                <circle cx={px} cy={py} r={3} fill={tool.color} opacity={0.55} />
              )}

              {/* Tool node — foreignObject for React icon */}
              <g opacity={appear}>
                <circle
                  cx={pos.x} cy={pos.y} r={nodeR}
                  fill="rgba(10,10,10,0.92)"
                  stroke={tool.color + "55"}
                  strokeWidth={1.5}
                  style={{
                    transform: `scale(${appear})`,
                    transformOrigin: `${pos.x}px ${pos.y}px`,
                  }}
                />
                {/* Brand color glow */}
                <circle
                  cx={pos.x} cy={pos.y} r={nodeR * 1.5}
                  fill={tool.color + "08"}
                />
                <foreignObject
                  x={pos.x - nodeR * 0.55}
                  y={pos.y - nodeR * 0.7}
                  width={nodeR * 1.1}
                  height={nodeR * 1.1}
                >
                  <div style={{
                    width: "100%", height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}>
                    <BrandIcon
                      icon={tool.si}
                      size={isV ? 22 : 26}
                      color={tool.color}
                    />
                    <span style={{
                      fontFamily: "'Sora', sans-serif",
                      fontWeight: 700,
                      fontSize: isV ? "9px" : "10px",
                      color: tool.color,
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

        {/* Hub — Motion Studio center */}
        <g>
          {/* Glow rings */}
          {[1.8, 1.4, 1.0].map((scale, i) => (
            <circle
              key={i}
              cx={cx} cy={cy}
              r={hubR * scale * hubPulse}
              fill="none"
              stroke={LIME + ["10", "20", "38"][i]}
              strokeWidth={1}
              opacity={Math.max(0, hubS)}
            />
          ))}
          {/* Main circle */}
          <circle
            cx={cx} cy={cy} r={hubR}
            fill="rgba(10,10,10,0.95)"
            stroke={LIME}
            strokeWidth={1.5}
            opacity={Math.max(0, hubS)}
            style={{ filter: `drop-shadow(0 0 18px #d4e15744)` }}
          />
          <text x={cx} y={cy - 8}
            textAnchor="middle"
            fontFamily="'Bricolage Grotesque', sans-serif"
            fontWeight="800" fontSize={isV ? 13 : 14}
            fill={LIME} opacity={Math.max(0, hubS)}
          >Motion</text>
          <text x={cx} y={cy + 10}
            textAnchor="middle"
            fontFamily="'Bricolage Grotesque', sans-serif"
            fontWeight="800" fontSize={isV ? 13 : 14}
            fill={LIME} opacity={Math.max(0, hubS)}
          >Studio</text>
        </g>
      </svg>

      {/* Footer */}
      <div style={{
        position: "absolute",
        bottom: isV ? "8%" : "7%",
        left: 0, right: 0, textAlign: "center",
        opacity: Math.max(0, footerS),
        transform: `translateY(${(1 - Math.max(0, footerS)) * 16}px)`,
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: isV ? "13px" : "14px",
          color: "#444",
        }}>
          100% gratuitas · Use agora mesmo
        </div>
      </div>
    </div>
  );
};
