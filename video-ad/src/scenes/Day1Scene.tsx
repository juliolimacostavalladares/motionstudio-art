/**
 * Day 1 — Paid Ad
 * Visual: ANTES (caos de processos) → flash → DEPOIS (sistema conectado)
 * A split-screen morphing from chaotic scattered boxes to a clean connected flow.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const LIME = "#d4e157";

const CHAOS_BOXES = [
  { x: 18, y: 22, w: 26, h: 10, color: "#e53e3e", rot: -8 },
  { x: 52, y: 14, w: 20, h: 12, color: "#dd6b20", rot: 5 },
  { x: 10, y: 52, w: 22, h: 9, color: "#805ad5", rot: -4 },
  { x: 38, y: 44, w: 28, h: 11, color: "#3182ce", rot: 7 },
  { x: 68, y: 32, w: 18, h: 14, color: "#e53e3e", rot: -12 },
  { x: 22, y: 70, w: 24, h: 10, color: "#d69e2e", rot: 6 },
  { x: 56, y: 60, w: 20, h: 12, color: "#319795", rot: -3 },
  { x: 78, y: 54, w: 16, h: 10, color: "#805ad5", rot: 9 },
];

const CLEAN_NODES = [
  { x: 50, y: 15, label: "Vendas" },
  { x: 20, y: 45, label: "Gestão" },
  { x: 80, y: 45, label: "Finanças" },
  { x: 35, y: 75, label: "Suporte" },
  { x: 65, y: 75, label: "Automação" },
];

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 3], [2, 4],
];

export const Day1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;
  const W = width;
  const H = height;

  // Phase timings
  const CHAOS_END = 100;
  const FLASH = 115;
  const CLEAN_START = 120;
  const TEXT_START = 190;
  const END = 270;

  // Camera slow zoom
  const camScale = interpolate(frame, [0, END], [1, 1.07], { extrapolateRight: "clamp" });
  const camTx = interpolate(Math.sin(frame * 0.008), [-1, 1], [-10, 10]);

  // CHAOS phase
  const chaosIn = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chaosOut = interpolate(frame, [CHAOS_END, FLASH], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chaosOpacity = Math.min(chaosIn, chaosOut);

  // Flash
  const flashOpacity = frame >= FLASH - 5 && frame <= FLASH + 10
    ? interpolate(frame, [FLASH - 5, FLASH, FLASH + 10], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // CLEAN phase
  const cleanFade = interpolate(frame, [CLEAN_START, CLEAN_START + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label entrance
  const antesS = spring({ frame: frame - 10, fps, config: { damping: 16 } });
  const depoisS = spring({ frame: frame - CLEAN_START, fps, config: { damping: 14 } });

  // Headline
  const headlineS = spring({ frame: frame - TEXT_START, fps, config: { damping: 14, stiffness: 120 } });
  const subS = spring({ frame: frame - TEXT_START - 20, fps, config: { damping: 16, stiffness: 100 } });

  const fontSize = isV ? "13px" : "14px";
  const nodeR = isV ? 26 : 30;
  const nodeFontSize = isV ? "9px" : "10px";

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      transform: `scale(${camScale}) translateX(${camTx}px)`,
    }}>
      <div style={{ width: "100%", height: "100%", position: "relative" }}>

        {/* ── ANTES label ─────────────────────────────────── */}
        <div style={{
          position: "absolute", top: isV ? 40 : 32, left: "50%",
          transform: `translateX(-50%) scale(${Math.max(0, antesS)})`,
          opacity: Math.max(0, antesS) * chaosOpacity,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800, fontSize: isV ? "18px" : "20px",
          color: "#e53e3e", letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          ANTES
        </div>

        {/* ── CHAOS boxes ──────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, opacity: chaosOpacity }}>
          {CHAOS_BOXES.map((box, i) => {
            const boxIn = spring({ frame: frame - i * 7, fps, config: { damping: 10, stiffness: 180 } });
            const wobble = Math.sin(frame * 0.06 + i) * 2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${box.x}%`, top: `${box.y + 8}%`,
                  width: `${box.w}%`, height: `${box.h}%`,
                  background: box.color + "33",
                  border: `2px solid ${box.color}`,
                  borderRadius: 6,
                  transform: `rotate(${box.rot + wobble}deg) scale(${Math.max(0, boxIn)})`,
                  opacity: Math.max(0, boxIn) * 0.85,
                }}
              />
            );
          })}
          {/* Chaos label arrows (crossed) */}
          <div style={{
            position: "absolute", bottom: "18%", left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Sora', sans-serif", fontSize,
            color: "#555", textAlign: "center",
          }}>
            Dados em todo lugar · Sem integração · Retrabalho
          </div>
        </div>

        {/* ── FLASH ──────────────────────────────────────── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "#fff",
          opacity: flashOpacity * 0.7,
          pointerEvents: "none",
        }} />

        {/* ── DEPOIS: clean connected network ──────────────── */}
        <div style={{ position: "absolute", inset: 0, opacity: cleanFade }}>
          {/* DEPOIS label */}
          <div style={{
            position: "absolute", top: isV ? 40 : 32, left: "50%",
            transform: `translateX(-50%) scale(${Math.max(0, depoisS)})`,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800, fontSize: isV ? "18px" : "20px",
            color: LIME, letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            DEPOIS
          </div>

          {/* SVG connections */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {CONNECTIONS.map(([a, b], i) => {
              const na = CLEAN_NODES[a];
              const nb = CLEAN_NODES[b];
              const lineProgress = interpolate(
                frame - (CLEAN_START + 10 + i * 14),
                [0, 25],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const ax = (na.x / 100) * W;
              const ay = (na.y / 100 + 0.08) * H;
              const bx = (nb.x / 100) * W;
              const by = (nb.y / 100 + 0.08) * H;
              const mx = ax + (bx - ax) * lineProgress;
              const my = ay + (by - ay) * lineProgress;
              return (
                <g key={i}>
                  <line
                    x1={ax} y1={ay} x2={mx} y2={my}
                    stroke={`${LIME}40`} strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  {lineProgress > 0.5 && (
                    <circle cx={mx} cy={my} r={3} fill={LIME} opacity={0.6} />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {CLEAN_NODES.map((node, i) => {
            const ns = spring({
              frame: frame - (CLEAN_START + 8 + i * 12),
              fps,
              config: { damping: 12, stiffness: 140 },
            });
            const glowPulse = 0.3 + 0.2 * Math.sin(frame * 0.1 + i);
            return (
              <div key={i} style={{
                position: "absolute",
                left: `${node.x}%`, top: `${node.y + 8}%`,
                transform: `translate(-50%, -50%) scale(${Math.max(0, ns)})`,
                opacity: Math.max(0, ns),
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                {/* Node circle */}
                <div style={{
                  width: nodeR * 2, height: nodeR * 2, borderRadius: "50%",
                  background: i === 0
                    ? `radial-gradient(circle, ${LIME}cc, ${LIME}88)`
                    : "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${i === 0 ? LIME : LIME + "55"}`,
                  boxShadow: `0 0 ${20 * glowPulse}px ${LIME}${i === 0 ? "55" : "22"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800, fontSize: nodeFontSize,
                    color: i === 0 ? "#111" : LIME,
                  }}>
                    {node.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Bottom tagline */}
          <div style={{
            position: "absolute", bottom: "10%", left: 0, right: 0,
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 8,
            opacity: Math.max(0, headlineS),
            transform: `translateY(${(1 - Math.max(0, headlineS)) * 20}px)`,
          }}>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800, fontSize: isV ? "20px" : "24px",
              color: "#f0f0f0", letterSpacing: "-0.02em",
              textAlign: "center",
            }}>
              Tudo conectado, automático e{" "}
              <span style={{ color: LIME }}>sob controle</span>
            </div>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: isV ? "12px" : "13px",
              color: "#555",
              opacity: Math.max(0, subS),
            }}>
              Software desenvolvido para o seu processo real
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
