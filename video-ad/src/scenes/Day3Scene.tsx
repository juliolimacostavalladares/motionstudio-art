/**
 * Day 3 — Engagement
 * Visual: Giant kinetic typography question fills the screen.
 * Words fly in from different directions, massive and dramatic.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MessageSquare, ChevronDown } from "lucide-react";

const LIME = "#d4e157";

const WORDS = ["QUAL", "TRAVA", "SEU", "NEGÓCIO", "HOJE?"];
const DIRECTIONS: [number, number][] = [
  [-1, -1], [1, -0.5], [-0.5, 1], [1, 1], [0, -1],
];

export const Day3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;

  const camScale = interpolate(frame, [0, 270], [1.02, 1.1], { extrapolateRight: "clamp" });

  // Sub question fade in late
  const subS = spring({ frame: frame - 160, fps, config: { damping: 16, stiffness: 100 } });
  // "comenta" pulse
  const commentS = spring({ frame: frame - 190, fps, config: { damping: 12, stiffness: 140 } });
  const commentPulse = frame > 200 ? 1 + 0.06 * Math.sin((frame - 200) * 0.2) : 1;

  // Top badge
  const badgeS = spring({ frame, fps, config: { damping: 14 } });

  const fontSize = isV ? "64px" : "76px";
  const lineH = isV ? 72 : 88;

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      transform: `scale(${camScale})`,
    }}>
      {/* Day badge */}
      <div style={{
        position: "absolute",
        top: 28, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        alignItems: "center",
        gap: 6,
        opacity: Math.max(0, badgeS),
      }}>
        <MessageSquare size={12} color={LIME + "88"} strokeWidth={2} />
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "11px", fontWeight: 700,
          color: LIME + "88", letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}>
          Pergunta do dia
        </div>
      </div>

      {/* Kinetic words — full screen dramatic */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isV ? 4 : 6,
        padding: "0 40px",
      }}>
        {WORDS.map((word, i) => {
          const delay = 10 + i * 18;
          const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 11, stiffness: 160, mass: 0.7 },
          });
          const appear = Math.max(0, s);
          const [dx, dy] = DIRECTIONS[i];
          const tx = (1 - appear) * dx * 80;
          const ty = (1 - appear) * dy * 60;
          const isAccent = word === "NEGÓCIO" || word === "HOJE?";
          return (
            <div
              key={word}
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize,
                lineHeight: `${lineH}px`,
                letterSpacing: "-0.04em",
                color: isAccent ? LIME : "#f0f0f0",
                opacity: appear,
                transform: `translate(${tx}px, ${ty}px)`,
                textShadow: isAccent ? `0 0 60px ${LIME}44` : "none",
                textAlign: "center",
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      {/* Divider line */}
      <div style={{
        width: interpolate(frame, [110, 140], [0, isV ? 200 : 280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        height: 1.5,
        background: `linear-gradient(90deg, transparent, ${LIME}55, transparent)`,
        marginTop: isV ? 20 : 24,
        marginBottom: isV ? 18 : 20,
      }} />

      {/* Sub copy */}
      <div style={{
        opacity: Math.max(0, subS),
        transform: `translateY(${(1 - Math.max(0, subS)) * 16}px)`,
        textAlign: "center",
        fontFamily: "'Sora', sans-serif",
        fontSize: isV ? "15px" : "17px",
        color: "#5a5a5a",
        lineHeight: 1.6,
        maxWidth: isV ? "320px" : "420px",
        padding: "0 20px",
      }}>
        Cada empresa trava de um jeito diferente.
        <br />Conta nos comentários qual é o seu.
      </div>

      {/* Comment CTA */}
      <div style={{
        marginTop: isV ? 20 : 24,
        opacity: Math.max(0, commentS),
        transform: `scale(${Math.max(0, commentS) * commentPulse})`,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: isV ? "18px" : "22px",
        color: LIME,
        letterSpacing: "0.02em",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span>Comenta</span>
        <ChevronDown
          size={isV ? 22 : 26}
          color={LIME}
          strokeWidth={2.5}
          style={{
            display: "inline-block",
            transform: `translateY(${Math.sin(frame * 0.18) * 6}px)`,
          }}
        />
      </div>
    </div>
  );
};
