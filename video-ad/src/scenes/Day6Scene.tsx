/**
 * Day 6 — Case Study
 * Visual: 3 hero metrics count up dramatically from 0.
 * Each card scales in with overshoot, number ticks up with easing.
 * "3 SEMANAS" is the main hero with a circular progress ring.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const LIME = "#d4e157";

function countUp(frame: number, startFrame: number, duration: number, from: number, to: number) {
  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(from + (to - from) * progress);
}

// Circular progress ring component
const Ring: React.FC<{ cx: number; cy: number; r: number; progress: number; color: string }> = ({
  cx, cy, r, progress, color,
}) => {
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - progress);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color + "18"} strokeWidth={6} />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90, ${cx}, ${cy})`}
        style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
      />
    </g>
  );
};

export const Day6Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;
  const W = width;
  const H = height;

  const camScale = interpolate(frame, [0, 270], [1.0, 1.08], { extrapolateRight: "clamp" });
  const camTy = interpolate(frame, [0, 270], [0, -18], { extrapolateRight: "clamp" });

  // Headline
  const headS = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });

  // Hero metric — "3 SEMANAS"
  const heroS = spring({ frame: frame - 20, fps, config: { damping: 11, stiffness: 140, mass: 0.6 } });
  const heroPulse = frame > 60 ? 1 + 0.04 * Math.sin((frame - 60) * 0.13) : 1;
  const ringProgress = interpolate(frame, [20, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Card metrics
  const card1S = spring({ frame: frame - 100, fps, config: { damping: 11, stiffness: 150 } });
  const card2S = spring({ frame: frame - 130, fps, config: { damping: 11, stiffness: 150 } });
  const card3S = spring({ frame: frame - 160, fps, config: { damping: 11, stiffness: 150 } });

  const usersCount = countUp(frame, 100, 60, 0, 40);
  const investCount = countUp(frame, 130, 60, 0, 28);
  const seedCount = countUp(frame, 160, 50, 0, 100);

  // Tagline
  const tagS = spring({ frame: frame - 210, fps, config: { damping: 16 } });

  const heroFontSize = isV ? "88px" : "100px";
  const ringR = isV ? 72 : 82;
  const ringCx = W * 0.5;
  const ringCy = isV ? H * 0.36 : H * 0.4;

  const cards = [
    { label: "+40", sub: "primeiros usuários", color: "#38a169", s: card1S },
    { label: `R$${investCount}k`, sub: "investimento total", color: "#3182ce", s: card2S },
    { label: `${seedCount}%`, sub: "meta de captação", color: "#805ad5", s: card3S },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center",
      transform: `scale(${camScale}) translateY(${camTy}px)`,
    }}>
      {/* Headline */}
      <div style={{
        position: "absolute",
        top: isV ? 36 : 28, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800, fontSize: isV ? "20px" : "24px",
        color: "#f0f0f0", letterSpacing: "-0.02em",
        opacity: Math.max(0, headS),
        padding: "0 40px",
      }}>
        Case real: <span style={{ color: LIME }}>MVP validado em 3 semanas</span>
      </div>

      {/* Hero ring + number */}
      <div style={{
        position: "absolute",
        top: isV ? H * 0.2 : H * 0.22,
        left: "50%", transform: `translateX(-50%)`,
        display: "flex", flexDirection: "column",
        alignItems: "center",
      }}>
        <svg width={ringR * 2 + 20} height={ringR * 2 + 20} style={{ overflow: "visible" }}>
          <Ring
            cx={ringR + 10} cy={ringR + 10}
            r={ringR}
            progress={ringProgress}
            color={LIME}
          />
          {/* Glow */}
          <circle
            cx={ringR + 10} cy={ringR + 10}
            r={ringR * 0.72}
            fill={LIME + "08"}
          />
          {/* Number inside ring */}
          <text
            x={ringR + 10} y={ringR + 6}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Bricolage Grotesque', sans-serif"
            fontWeight="800"
            fontSize={isV ? 52 : 60}
            fill={LIME}
            opacity={Math.max(0, heroS) * heroPulse}
          >
            3
          </text>
          <text
            x={ringR + 10} y={ringR + (isV ? 42 : 48)}
            textAnchor="middle"
            fontFamily="'Sora', sans-serif"
            fontWeight="700"
            fontSize={isV ? 12 : 13}
            fill={LIME + "cc"}
          >
            SEMANAS
          </text>
        </svg>
      </div>

      {/* Metric cards */}
      <div style={{
        position: "absolute",
        top: isV ? H * 0.6 : H * 0.58,
        left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        gap: isV ? 10 : 14,
        padding: "0 28px",
      }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            flex: 1, maxWidth: isV ? 140 : 160,
            background: "rgba(12,12,12,0.92)",
            border: `1px solid ${card.color}33`,
            borderRadius: 12,
            padding: isV ? "14px 10px" : "16px 14px",
            textAlign: "center",
            opacity: Math.max(0, card.s),
            transform: `scale(${Math.max(0, card.s)}) translateY(${(1 - Math.max(0, card.s)) * 30}px)`,
          }}>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: isV ? "28px" : "32px",
              color: card.color,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: 4,
            }}>
              {i === 0 ? `+${usersCount}` : card.label}
            </div>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: isV ? "10px" : "11px",
              color: "#555",
            }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute",
        bottom: isV ? "6%" : "5%",
        left: 0, right: 0, textAlign: "center",
        opacity: Math.max(0, tagS),
        transform: `translateY(${(1 - Math.max(0, tagS)) * 16}px)`,
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: isV ? "13px" : "14px",
          color: "#444",
        }}>
          Seu projeto pode ser o próximo
        </div>
      </div>
    </div>
  );
};
