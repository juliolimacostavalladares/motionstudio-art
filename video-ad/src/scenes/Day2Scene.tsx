/**
 * Day 2 — Organic / Educational
 * 3 sonar-ping signals — lime palette only with opacity variations.
 * No off-brand hues. Larger nodes, thicker strokes.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bookmark } from "lucide-react";
import {
  BRAND, LIME, LIME_20, LIME_40,
  BORDER_LIME, STROKE,
} from "../shared/brand";

// All lime-family — no foreign hues
const SIGNALS = [
  { num: "01", text: "3 ou mais planilhas\npara o mesmo processo" },
  { num: "02", text: "Dados perdidos entre\nWhatsApp e e-mail"    },
  { num: "03", text: "Escalar = contratar,\nnunca automatizar"     },
];

const SonarNode: React.FC<{
  cx: number; cy: number;
  startFrame: number;
  label: string; num: string;
  isV: boolean;
  /** 1.0, 0.7 or 0.45 — opacity tiers within lime palette */
  tier: number;
}> = ({ cx, cy, startFrame, label, num, isV, tier }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const S = spring({ frame: frame - startFrame, fps, config: { damping: 14, stiffness: 100 } });
  const appear = Math.max(0, S);

  const rings = [0, 20, 40];
  const nodeR = isV ? 32 : 38;
  const cardW = isV ? 150 : 172;
  const cardH = isV ? 44 : 50;
  const strokeC = `rgba(212,225,87,${tier})`;
  const glowC   = `rgba(212,225,87,${tier * 0.15})`;

  return (
    <g>
      {/* Sonar rings */}
      {rings.map((offset, i) => {
        const rf = frame - startFrame - offset;
        if (rf < 0) return null;
        const rp = (rf % 90) / 90;
        return (
          <circle key={i}
            cx={cx} cy={cy}
            r={interpolate(rp, [0, 1], [nodeR, nodeR * 2.8])}
            fill="none"
            stroke={strokeC}
            strokeWidth={STROKE.thin}
            opacity={interpolate(rp, [0, 0.45, 1], [0.55, 0.18, 0])}
          />
        );
      })}

      {/* Glow halo */}
      <circle cx={cx} cy={cy} r={nodeR * 1.6} fill={glowC} opacity={appear} />

      {/* Main node */}
      <circle
        cx={cx} cy={cy} r={nodeR}
        fill={BRAND.black2}
        stroke={strokeC}
        strokeWidth={STROKE.strong}
        opacity={appear}
      />

      {/* Number */}
      <text
        x={cx} y={cy + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Bricolage Grotesque', sans-serif"
        fontWeight="800"
        fontSize={isV ? 14 : 16}
        fill={`rgba(212,225,87,${tier})`}
        opacity={appear}
      >
        {num}
      </text>

      {/* Label card */}
      {(() => {
        const labelOp = interpolate(frame - startFrame - 28, [0, 22], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <g opacity={labelOp}>
            <rect
              x={cx - cardW / 2} y={cy + nodeR + 12}
              width={cardW} height={cardH}
              rx={8}
              fill={BRAND.black2}
              stroke={BORDER_LIME}
              strokeWidth={STROKE.normal}
            />
            {label.split("\n").map((line, li) => (
              <text key={li}
                x={cx}
                y={cy + nodeR + 12 + (isV ? 14 : 16) + li * (isV ? 14 : 16)}
                textAnchor="middle"
                fontFamily="'Sora', sans-serif"
                fontWeight="600"
                fontSize={isV ? 10 : 11}
                fill={BRAND.gray300}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })()}
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

  // Triangle formation
  const positions = isV
    ? [{ cx: W * 0.5, cy: H * 0.27 }, { cx: W * 0.22, cy: H * 0.57 }, { cx: W * 0.78, cy: H * 0.57 }]
    : [{ cx: W * 0.18, cy: H * 0.48 }, { cx: W * 0.5,  cy: H * 0.30 }, { cx: W * 0.82, cy: H * 0.48 }];

  // Opacity tiers — all lime, different intensities
  const tiers = [1.0, 0.65, 0.38];

  const headlineS = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const footerS   = spring({ frame: frame - 205, fps, config: { damping: 14 } });

  const headlineFs = isV ? "19px" : "22px";

  return (
    <div style={{
      position: "absolute", inset: 0,
      transform: `scale(${camScale})`,
    }}>
      {/* Headline */}
      <div style={{
        position: "absolute", top: isV ? 38 : 30, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800, fontSize: headlineFs,
        color: BRAND.white, letterSpacing: "-0.025em",
        opacity: Math.max(0, headlineS),
        transform: `translateY(${(1 - Math.max(0, headlineS)) * -14}px)`,
        padding: "0 44px",
      }}>
        3 sinais que seu negócio precisa de um{" "}
        <span style={{ color: LIME }}>sistema</span>
      </div>

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Connecting lines */}
        {positions.map((pa, i) =>
          positions.slice(i + 1).map((pb, j) => {
            const lp = interpolate(frame - (35 + (i + j) * 18), [0, 22], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <line key={`${i}-${j}`}
                x1={pa.cx} y1={pa.cy}
                x2={pa.cx + (pb.cx - pa.cx) * lp}
                y2={pa.cy + (pb.cy - pa.cy) * lp}
                stroke={LIME_20} strokeWidth={STROKE.normal}
                strokeDasharray="6 8"
              />
            );
          })
        )}

        {SIGNALS.map((sig, i) => (
          <SonarNode
            key={i}
            cx={positions[i].cx} cy={positions[i].cy}
            startFrame={18 + i * 42}
            label={sig.text} num={sig.num}
            isV={isV}
            tier={tiers[i]}
          />
        ))}
      </svg>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: isV ? "7%" : "6%",
        left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
        opacity: Math.max(0, footerS),
        transform: `translateY(${(1 - Math.max(0, footerS)) * 16}px)`,
      }}>
        <Bookmark size={isV ? 14 : 15} color={BRAND.gray700} strokeWidth={2} />
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: isV ? "12px" : "13px",
          color: BRAND.gray700,
          letterSpacing: "0.04em",
        }}>
          Salva esse vídeo para compartilhar
        </div>
      </div>
    </div>
  );
};
