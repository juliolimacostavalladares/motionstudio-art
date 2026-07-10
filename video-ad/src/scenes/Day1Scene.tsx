/**
 * Day 1 — Paid Ad
 * ANTES (caos monocromático, na paleta da marca) → flash → DEPOIS (sistema limpo conectado)
 * Colors: brand-only — grays for chaos, lime for order.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BRAND, LIME, LIME_20, LIME_40, LIME_55,
  BORDER_DEFAULT, BORDER_LIME,
  STROKE, RADIUS,
} from "../shared/brand";

// Chaos boxes — brand grays only
const CHAOS_BOXES = [
  { x: 10, y: 20, w: 28, h: 11, rot: -7  },
  { x: 48, y: 12, w: 22, h: 13, rot:  6  },
  { x: 6,  y: 48, w: 24, h: 10, rot: -5  },
  { x: 34, y: 40, w: 30, h: 12, rot:  8  },
  { x: 66, y: 28, w: 20, h: 14, rot: -11 },
  { x: 18, y: 66, w: 26, h: 10, rot:  5  },
  { x: 54, y: 57, w: 22, h: 13, rot: -4  },
  { x: 76, y: 50, w: 18, h: 10, rot:  9  },
];

const CLEAN_NODES = [
  { x: 50, y: 16, label: "Vendas"    },
  { x: 18, y: 46, label: "Gestão"    },
  { x: 82, y: 46, label: "Finanças"  },
  { x: 32, y: 76, label: "Suporte"   },
  { x: 68, y: 76, label: "Automação" },
];
const CONNECTIONS: [number, number][] = [[0,1],[0,2],[0,3],[0,4],[1,3],[2,4]];

export const Day1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;
  const W = width;
  const H = height;

  const CHAOS_END  = 95;
  const FLASH      = 112;
  const CLEAN_START = 118;
  const TEXT_START  = 188;

  // Gentle camera drift
  const camScale = interpolate(frame, [0, 270], [1.0, 1.08], { extrapolateRight: "clamp" });
  const camTx    = Math.sin(frame * 0.007) * 8;

  // Opacity phases
  const chaosIn  = interpolate(frame, [0, 28], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chaosOut = interpolate(frame, [CHAOS_END, FLASH], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chaosOp  = Math.min(chaosIn, chaosOut);

  const flashOp = (frame >= FLASH - 4 && frame <= FLASH + 12)
    ? interpolate(frame, [FLASH - 4, FLASH, FLASH + 12], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const cleanFade = interpolate(frame, [CLEAN_START, CLEAN_START + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Labels
  const antesS  = spring({ frame: frame - 8,           fps, config: { damping: 16, stiffness: 110 } });
  const depoisS = spring({ frame: frame - CLEAN_START,  fps, config: { damping: 14, stiffness: 120 } });

  // Headline
  const headlineS = spring({ frame: frame - TEXT_START,      fps, config: { damping: 14, stiffness: 110 } });
  const subS      = spring({ frame: frame - TEXT_START - 22, fps, config: { damping: 16, stiffness: 100 } });

  const labelFs = isV ? "18px" : "20px";
  const headlineFs = isV ? "20px" : "24px";
  const nodeR  = isV ? 30 : 36;
  const nodeLabelFs = isV ? "11px" : "12px";

  return (
    <div style={{
      position: "absolute", inset: 0,
      transform: `scale(${camScale}) translateX(${camTx}px)`,
    }}>
      {/* ── ANTES label ───────────────────────────────────── */}
      <div style={{
        position: "absolute", top: isV ? 42 : 34, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800, fontSize: labelFs,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: BRAND.gray500,
        opacity: Math.max(0, antesS) * chaosOp,
        transform: `scale(${Math.max(0, antesS)})`,
      }}>
        ANTES
      </div>

      {/* ── CHAOS boxes (monochromatic brand palette) ───── */}
      <div style={{ position: "absolute", inset: 0, opacity: chaosOp }}>
        {CHAOS_BOXES.map((box, i) => {
          const boxIn = spring({ frame: frame - i * 6, fps, config: { damping: 10, stiffness: 200 } });
          const wobble = Math.sin(frame * 0.055 + i) * 1.5;
          // Alternate between dark surfaces — no random hues
          const bg = i % 2 === 0 ? BRAND.gray800 : BRAND.gray900;
          const border = i % 3 === 0 ? BRAND.gray700 : BRAND.gray800;
          return (
            <div key={i} style={{
              position: "absolute",
              left: `${box.x}%`, top: `${box.y + 8}%`,
              width: `${box.w}%`, height: `${box.h}%`,
              background: bg,
              border: `${STROKE.normal}px solid ${border}`,
              borderRadius: RADIUS.sm,
              transform: `rotate(${box.rot + wobble}deg) scale(${Math.max(0, boxIn)})`,
              opacity: Math.max(0, boxIn) * 0.9,
            }} />
          );
        })}
        <div style={{
          position: "absolute", bottom: "16%", left: 0, right: 0,
          textAlign: "center",
          fontFamily: "'Sora', sans-serif", fontSize: isV ? "12px" : "13px",
          color: BRAND.gray700,
        }}>
          Dados dispersos · Sem integração · Retrabalho constante
        </div>
      </div>

      {/* ── Flash transition ───────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        background: BRAND.lime, opacity: flashOp * 0.25,
        pointerEvents: "none",
      }} />

      {/* ── DEPOIS: brand-aligned network ─────────────────── */}
      <div style={{ position: "absolute", inset: 0, opacity: cleanFade }}>
        {/* DEPOIS label */}
        <div style={{
          position: "absolute", top: isV ? 42 : 34, left: 0, right: 0,
          textAlign: "center",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800, fontSize: labelFs,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: LIME,
          opacity: Math.max(0, depoisS),
          transform: `scale(${Math.max(0, depoisS)})`,
        }}>
          DEPOIS
        </div>

        {/* SVG connections */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {CONNECTIONS.map(([a, b], i) => {
            const na = CLEAN_NODES[a], nb = CLEAN_NODES[b];
            const lineProgress = interpolate(
              frame - (CLEAN_START + 12 + i * 13),
              [0, 22], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const ax = (na.x / 100) * W, ay = (na.y / 100 + 0.08) * H;
            const bx = (nb.x / 100) * W, by = (nb.y / 100 + 0.08) * H;
            return (
              <g key={i}>
                <line
                  x1={ax} y1={ay}
                  x2={ax + (bx - ax) * lineProgress}
                  y2={ay + (by - ay) * lineProgress}
                  stroke={LIME_40} strokeWidth={STROKE.normal}
                  strokeDasharray="5 5"
                />
                {lineProgress > 0.6 && (
                  <circle
                    cx={ax + (bx - ax) * lineProgress}
                    cy={ay + (by - ay) * lineProgress}
                    r={4} fill={LIME} opacity={0.7}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {CLEAN_NODES.map((node, i) => {
          const ns = spring({ frame: frame - (CLEAN_START + 10 + i * 11), fps, config: { damping: 12, stiffness: 150 } });
          const appear = Math.max(0, ns);
          const glowP = 0.3 + 0.2 * Math.sin(frame * 0.09 + i);
          const isHub = i === 0;
          return (
            <div key={i} style={{
              position: "absolute",
              left: `${node.x}%`, top: `${node.y + 8}%`,
              transform: `translate(-50%, -50%) scale(${appear})`,
              opacity: appear,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: nodeR * 2, height: nodeR * 2, borderRadius: "50%",
                background: isHub ? LIME : BRAND.black2,
                border: `${STROKE.strong}px solid ${isHub ? LIME : BORDER_LIME}`,
                boxShadow: isHub
                  ? `0 0 ${28 * glowP}px ${LIME_40}`
                  : `0 0 ${14 * glowP}px ${LIME_20}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800, fontSize: nodeLabelFs,
                  color: isHub ? BRAND.black2 : LIME,
                }}>
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Headline */}
        <div style={{
          position: "absolute", bottom: "8%", left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: Math.max(0, headlineS),
          transform: `translateY(${(1 - Math.max(0, headlineS)) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800, fontSize: headlineFs,
            color: BRAND.white, letterSpacing: "-0.025em",
            textAlign: "center", padding: "0 40px",
          }}>
            Tudo conectado e{" "}
            <span style={{ color: LIME }}>sob controle</span>
          </div>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontSize: isV ? "12px" : "13px",
            color: BRAND.gray500,
            opacity: Math.max(0, subS),
          }}>
            Software desenvolvido para o seu processo real
          </div>
        </div>
      </div>
    </div>
  );
};
