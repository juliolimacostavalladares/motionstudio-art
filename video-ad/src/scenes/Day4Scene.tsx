/**
 * Day 4 — Free Tools
 * Visual: Central "MS" hub node with 4 tool satellites flying in from corners,
 * connected by animated lines. Particles travel along the edges.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const LIME = "#d4e157";

const TOOLS = [
  { name: "Notion", color: "#ffffff", emoji: "📝", angle: 225 },
  { name: "Miro",   color: "#f8c200", emoji: "🗺",  angle: 315 },
  { name: "n8n",    color: "#ea4b71", emoji: "⚡",  angle: 135 },
  { name: "Supabase", color: "#3ecf8e", emoji: "🗄", angle: 45 },
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
  const nodeR = isV ? 44 : 50;
  const hubR = isV ? 52 : 60;

  const camScale = interpolate(frame, [0, 270], [1.0, 1.07], { extrapolateRight: "clamp" });
  const camRotate = interpolate(frame, [0, 270], [0, 1.5], { extrapolateRight: "clamp" });

  // Hub appears first
  const hubS = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 120 } });
  const hubPulse = 1 + 0.05 * Math.sin(frame * 0.12);

  // Headline
  const headlineS = spring({ frame: frame - 180, fps, config: { damping: 16, stiffness: 110 } });

  return (
    <div style={{
      position: "absolute", inset: 0,
      transform: `scale(${camScale}) rotate(${camRotate}deg)`,
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
        opacity: Math.max(0, spring({ frame, fps, config: { damping: 16 } })),
      }}>
        Ferramentas que{" "}
        <span style={{ color: LIME }}>usamos com clientes</span>
      </div>

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {/* Orbit circle guide */}
        <circle
          cx={cx} cy={cy} r={orbitR}
          fill="none"
          stroke={LIME + "08"}
          strokeWidth={1}
          strokeDasharray="6 8"
          opacity={Math.max(0, hubS)}
        />

        {/* Connections + particles */}
        {TOOLS.map((tool, i) => {
          const pos = polarToXY(cx, cy, orbitR, tool.angle);
          const toolS = spring({ frame: frame - (20 + i * 18), fps, config: { damping: 12, stiffness: 130 } });
          const appear = Math.max(0, toolS);

          // Particle traveling along edge
          const particleProgress = (frame * 0.8 + i * 60) % 100 / 100;
          const px = cx + (pos.x - cx) * particleProgress;
          const py = cy + (pos.y - cy) * particleProgress;

          return (
            <g key={i}>
              {/* Line */}
              <line
                x1={cx} y1={cy}
                x2={cx + (pos.x - cx) * appear}
                y2={cy + (pos.y - cy) * appear}
                stroke={`${tool.color}30`}
                strokeWidth={1.5}
              />
              {/* Traveling particle */}
              {appear > 0.5 && (
                <circle cx={px} cy={py} r={3} fill={tool.color} opacity={0.6} />
              )}
              {/* Tool node */}
              <g
                transform={`translate(${pos.x}, ${pos.y})`}
                opacity={appear}
                style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${appear})`, transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                <circle
                  r={nodeR}
                  fill="rgba(10,10,10,0.9)"
                  stroke={tool.color + "55"}
                  strokeWidth={1.5}
                  cx={0} cy={0}
                />
                <text x={0} y={-8} textAnchor="middle" fontSize={isV ? 18 : 20} dominantBaseline="middle">{tool.emoji}</text>
                <text
                  x={0} y={12}
                  textAnchor="middle" dominantBaseline="middle"
                  fontFamily="'Sora', sans-serif"
                  fontWeight="700"
                  fontSize={isV ? 10 : 11}
                  fill={tool.color}
                >
                  {tool.name}
                </text>
              </g>
            </g>
          );
        })}

        {/* Hub — Motion Studio center */}
        <g transform={`translate(${cx}, ${cy})`}>
          {/* Glow rings */}
          {[1.8, 1.4, 1.0].map((scale, i) => (
            <circle
              key={i}
              cx={0} cy={0}
              r={hubR * scale * hubPulse}
              fill="none"
              stroke={LIME + ["14", "22", "33"][i]}
              strokeWidth={1}
              opacity={Math.max(0, hubS)}
            />
          ))}
          {/* Main circle */}
          <circle
            cx={0} cy={0} r={hubR}
            fill={`url(#hubGrad)`}
            opacity={Math.max(0, hubS)}
          />
          <defs>
            <radialGradient id="hubGrad">
              <stop offset="0%" stopColor={LIME} stopOpacity="0.3" />
              <stop offset="100%" stopColor={LIME} stopOpacity="0.08" />
            </radialGradient>
          </defs>
          <circle
            cx={0} cy={0} r={hubR}
            fill="none"
            stroke={LIME}
            strokeWidth={1.5}
            opacity={Math.max(0, hubS)}
          />
          <text x={0} y={-8} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Bricolage Grotesque', sans-serif"
            fontWeight="800" fontSize={isV ? 13 : 14} fill={LIME}
            opacity={Math.max(0, hubS)}
          >
            Motion
          </text>
          <text x={0} y={10} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Bricolage Grotesque', sans-serif"
            fontWeight="800" fontSize={isV ? 13 : 14} fill={LIME}
            opacity={Math.max(0, hubS)}
          >
            Studio
          </text>
        </g>
      </svg>

      {/* Bottom note */}
      <div style={{
        position: "absolute",
        bottom: isV ? "8%" : "7%",
        left: 0, right: 0, textAlign: "center",
        opacity: Math.max(0, headlineS),
        transform: `translateY(${(1 - Math.max(0, headlineS)) * 16}px)`,
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
