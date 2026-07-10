/**
 * Day 2 — Organic / Educational
 * Visual: 3 sonar-ping signals pulse outward from 3 alert nodes,
 * each revealing a warning sign text as the ring expands.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const LIME = "#d4e157";
const SIGNS = [
  { num: "01", text: "3+ planilhas para o\nmesmo processo", color: "#e53e3e" },
  { num: "02", text: "Dados perdidos entre\nWhatsApp e e-mail", color: "#dd6b20" },
  { num: "03", text: "Escalar = contratar,\nnunca automatizar", color: "#805ad5" },
];

const Sonar: React.FC<{
  cx: number; cy: number; color: string;
  startFrame: number; label: string; num: string;
  isV: boolean;
}> = ({ cx, cy, color, startFrame, label, num, isV }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const S = spring({ frame: frame - startFrame, fps, config: { damping: 14, stiffness: 100 } });
  const appear = Math.max(0, S);

  // 3 ripple rings at different phases
  const rings = [0, 18, 36];

  return (
    <g>
      {/* Ripple rings */}
      {rings.map((offset, i) => {
        const ringFrame = frame - startFrame - offset;
        if (ringFrame < 0) return null;
        const rippleProgress = interpolate(ringFrame % 80, [0, 80], [0, 1], { extrapolateRight: "clamp" });
        const rippleR = interpolate(rippleProgress, [0, 1], [20, 90]);
        const rippleOpacity = interpolate(rippleProgress, [0, 0.5, 1], [0.5, 0.2, 0]);
        return (
          <circle
            key={i}
            cx={cx} cy={cy}
            r={rippleR}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            opacity={rippleOpacity * appear}
          />
        );
      })}

      {/* Core node */}
      <circle
        cx={cx} cy={cy} r={20}
        fill={color + "22"}
        stroke={color}
        strokeWidth={1.5}
        opacity={appear}
      />
      <text
        x={cx} y={cy + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Bricolage Grotesque', sans-serif"
        fontWeight="800"
        fontSize={isV ? 10 : 11}
        fill={color}
        opacity={appear}
      >
        {num}
      </text>

      {/* Label box */}
      <g opacity={interpolate(frame - startFrame - 30, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <rect
          x={cx - (isV ? 68 : 76)} y={cy + 30}
          width={isV ? 136 : 152} height={isV ? 36 : 40}
          rx={8}
          fill="rgba(10,10,10,0.85)"
          stroke={color + "44"}
          strokeWidth={1}
        />
        {label.split("\n").map((line, li) => (
          <text
            key={li}
            x={cx} y={cy + 30 + (isV ? 12 : 14) + li * (isV ? 13 : 14)}
            textAnchor="middle"
            fontFamily="'Sora', sans-serif"
            fontWeight="600"
            fontSize={isV ? 9 : 10}
            fill="#cccccc"
          >
            {line}
          </text>
        ))}
      </g>
    </g>
  );
};

export const Day2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;
  const W = width;
  const H = height;

  const camScale = interpolate(frame, [0, 270], [1.0, 1.06], { extrapolateRight: "clamp" });

  // Layout: triangle formation
  const positions = isV
    ? [{ cx: W * 0.5, cy: H * 0.28 }, { cx: W * 0.25, cy: H * 0.58 }, { cx: W * 0.75, cy: H * 0.58 }]
    : [{ cx: W * 0.2, cy: H * 0.45 }, { cx: W * 0.5, cy: H * 0.3 }, { cx: W * 0.8, cy: H * 0.45 }];

  const headlineS = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 110 } });
  const outroS = spring({ frame: frame - 200, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{
      position: "absolute", inset: 0,
      transform: `scale(${camScale})`,
    }}>
      {/* Headline */}
      <div style={{
        position: "absolute",
        top: isV ? 36 : 28, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: isV ? "20px" : "24px",
        color: "#f0f0f0",
        letterSpacing: "-0.02em",
        opacity: Math.max(0, headlineS),
        transform: `translateY(${(1 - Math.max(0, headlineS)) * -16}px)`,
        padding: "0 40px",
      }}>
        3 sinais que seu negócio precisa de um{" "}
        <span style={{ color: LIME }}>sistema</span>
      </div>

      {/* SVG scene */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {/* Connecting lines between nodes */}
        {positions.map((pa, i) =>
          positions.slice(i + 1).map((pb, j) => {
            const lineIn = interpolate(frame - (40 + (i + j) * 20), [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <line key={`${i}-${j}`}
                x1={pa.cx} y1={pa.cy}
                x2={pa.cx + (pb.cx - pa.cx) * lineIn}
                y2={pa.cy + (pb.cy - pa.cy) * lineIn}
                stroke={LIME + "18"}
                strokeWidth={1}
                strokeDasharray="6 6"
              />
            );
          })
        )}

        {SIGNS.map((sign, i) => (
          <Sonar
            key={i}
            cx={positions[i].cx}
            cy={positions[i].cy}
            color={sign.color}
            startFrame={20 + i * 45}
            label={sign.text}
            num={sign.num}
            isV={isV}
          />
        ))}
      </svg>

      {/* Bottom CTA */}
      <div style={{
        position: "absolute",
        bottom: isV ? "8%" : "7%",
        left: 0, right: 0,
        textAlign: "center",
        opacity: Math.max(0, outroS),
        transform: `translateY(${(1 - Math.max(0, outroS)) * 20}px)`,
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: isV ? "12px" : "13px",
          color: "#444",
          letterSpacing: "0.06em",
        }}>
          💾 Salva esse vídeo para compartilhar
        </div>
      </div>
    </div>
  );
};
