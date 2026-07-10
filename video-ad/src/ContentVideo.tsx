import React from "react";
import {
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoConfig } from "./content/configs";
import { Background } from "./components/Background";
import { Logo } from "./components/Logo";

// ─── Helpers ────────────────────────────────────────────────────────────────

function useEntrance(delayFrames: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.7 },
  });
  return {
    opacity: Math.max(0, s),
    translateY: (1 - Math.max(0, s)) * 30,
    scale: Math.max(0, s),
  };
}

function useExit(startFrame: number, durationFrames: number) {
  const frame = useCurrentFrame();
  const exitStart = durationFrames - 18;
  const exitVal = interpolate(frame - startFrame, [exitStart, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity: 1 - exitVal, translateY: exitVal * -30 };
}

// ─── Scene 1: Hook ──────────────────────────────────────────────────────────

const SceneHook: React.FC<{ config: VideoConfig; isVertical: boolean }> = ({
  config,
  isVertical,
}) => {
  const badge = useEntrance(0);
  const logo = useEntrance(8);
  const line0 = useEntrance(18);
  const line1 = useEntrance(26);
  const sub = useEntrance(36);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: isVertical ? "0 48px" : "0 60px",
        height: "100%",
        maxWidth: isVertical ? "460px" : "700px",
        margin: "0 auto",
      }}
    >
      {/* Badge */}
      <div
        style={{
          opacity: badge.opacity,
          transform: `scale(${badge.scale})`,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(212,225,87,0.10)",
          border: "1px solid rgba(212,225,87,0.22)",
          borderRadius: "100px",
          padding: "7px 16px",
          fontSize: "12px",
          fontWeight: 700,
          color: "#d4e157",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "28px",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#d4e157",
            display: "inline-block",
          }}
        />
        {config.badge}
      </div>

      {/* Logo */}
      <div style={{ opacity: logo.opacity, transform: `scale(${logo.scale})`, marginBottom: "24px" }}>
        <Logo size={isVertical ? 110 : 90} />
      </div>

      {/* Headline */}
      {config.headlineLines.map((line, i) => {
        const anim = i === 0 ? line0 : line1;
        const isAccent = i === config.accentLineIndex;
        return (
          <div
            key={i}
            style={{
              opacity: anim.opacity,
              transform: `translateY(${anim.translateY}px)`,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: isVertical ? "38px" : "52px",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: isAccent ? "#d4e157" : "#f5f5f5",
              marginBottom: "6px",
            }}
          >
            {line}
          </div>
        );
      })}

      {/* Sub copy */}
      <p
        style={{
          opacity: sub.opacity,
          transform: `translateY(${sub.translateY}px)`,
          fontFamily: "'Sora', sans-serif",
          fontSize: isVertical ? "14px" : "16px",
          color: "#a3a3a3",
          lineHeight: 1.65,
          marginTop: "20px",
          maxWidth: "420px",
        }}
      >
        {config.subCopy}
      </p>
    </div>
  );
};

// ─── Scene 2: Content Items ──────────────────────────────────────────────────

const SceneItems: React.FC<{ config: VideoConfig; isVertical: boolean }> = ({
  config,
  isVertical,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isVertical ? "0 36px" : "0 60px",
        height: "100%",
        width: "100%",
        maxWidth: isVertical ? "480px" : "860px",
        margin: "0 auto",
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: isVertical ? "26px" : "34px",
          fontWeight: 700,
          color: "#f5f5f5",
          textAlign: "center",
          marginBottom: isVertical ? "24px" : "28px",
          letterSpacing: "-0.02em",
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 20}px)`,
        }}
      >
        {config.scene2Title}
      </h2>

      {/* Items grid — 2 cols on square, 1 col on vertical */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isVertical ? "1fr" : "1fr 1fr",
          gap: isVertical ? "12px" : "16px",
          width: "100%",
        }}
      >
        {config.items.map((item, idx) => {
          const s = spring({
            frame: frame - (10 + idx * 8),
            fps,
            config: { damping: 13, stiffness: 110 },
          });

          return (
            <div
              key={idx}
              style={{
                opacity: Math.max(0, s),
                transform: `scale(${Math.max(0, s)}) translateY(${(1 - Math.max(0, s)) * 20}px)`,
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                background: item.highlight
                  ? "rgba(212,225,87,0.07)"
                  : "rgba(255,255,255,0.03)",
                border: item.highlight
                  ? "1px solid rgba(212,225,87,0.25)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
                padding: isVertical ? "14px 16px" : "18px 20px",
              }}
            >
              {/* Icon / number */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: "10px",
                  background: item.highlight
                    ? "rgba(212,225,87,0.15)"
                    : "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 800,
                  color: item.highlight ? "#d4e157" : "#f5f5f5",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  border: item.highlight ? "1px solid rgba(212,225,87,0.2)" : "none",
                }}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: isVertical ? "13px" : "15px",
                    fontWeight: 700,
                    color: item.highlight ? "#d4e157" : "#f5f5f5",
                    marginBottom: "3px",
                    lineHeight: 1.3,
                  }}
                >
                  {item.text}
                </div>
                {item.sub && (
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: isVertical ? "11px" : "12px",
                      color: "#737373",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.sub}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Scene 3: CTA ───────────────────────────────────────────────────────────

const SceneCta: React.FC<{ config: VideoConfig; isVertical: boolean }> = ({
  config,
  isVertical,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = useEntrance(0);
  const title = useEntrance(12);
  const btn = spring({ frame: frame - 24, fps, config: { damping: 10, stiffness: 130, mass: 0.6 } });
  const foot = useEntrance(38);

  // Gentle pulse on button
  const pulse = Math.sin(frame * 0.12) * 0.02 + 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: isVertical ? "0 48px" : "0 60px",
        height: "100%",
        maxWidth: isVertical ? "460px" : "680px",
        margin: "0 auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          opacity: logo.opacity,
          transform: `scale(${logo.scale})`,
          marginBottom: "16px",
        }}
      >
        <Logo size={isVertical ? 100 : 80} />
      </div>

      {/* Brand name */}
      <div
        style={{
          opacity: logo.opacity,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: "24px",
          color: "#f5f5f5",
          letterSpacing: "-0.02em",
          marginBottom: "24px",
        }}
      >
        Motion <span style={{ color: "#d4e157" }}>Studio</span>
      </div>

      {/* CTA Headline */}
      <h2
        style={{
          opacity: title.opacity,
          transform: `translateY(${title.translateY}px)`,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: isVertical ? "28px" : "36px",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "#f5f5f5",
          marginBottom: "28px",
          maxWidth: "400px",
        }}
      >
        {config.ctaHeadline}
      </h2>

      {/* Metric badge */}
      {config.metric && (
        <div
          style={{
            opacity: Math.max(0, btn),
            fontFamily: "'Sora', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: "#d4e157",
            background: "rgba(212,225,87,0.08)",
            border: "1px solid rgba(212,225,87,0.2)",
            borderRadius: "100px",
            padding: "6px 16px",
            marginBottom: "16px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {config.metric}
        </div>
      )}

      {/* CTA Button */}
      <button
        style={{
          opacity: Math.max(0, btn),
          transform: `scale(${Math.max(0, btn) * pulse})`,
          background: "#d4e157",
          color: "#111111",
          border: "none",
          borderRadius: "12px",
          padding: "16px 36px",
          fontSize: "15px",
          fontWeight: 700,
          fontFamily: "'Sora', sans-serif",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(212,225,87,0.25)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {config.ctaLabel}
        <span style={{ fontSize: "18px" }}>→</span>
      </button>

      {/* Footer note */}
      {config.footerNote && (
        <p
          style={{
            opacity: foot.opacity,
            fontFamily: "'Sora', sans-serif",
            fontSize: "12px",
            color: "#525252",
            marginBottom: "4px",
          }}
        >
          {config.footerNote}
        </p>
      )}

      {/* URL */}
      <span
        style={{
          opacity: foot.opacity,
          fontFamily: "'Sora', sans-serif",
          fontSize: "13px",
          color: "#404040",
          fontWeight: 600,
          letterSpacing: "0.06em",
        }}
      >
        motionstudio.art
      </span>
    </div>
  );
};

// ─── Scene Wrapper with fade transition ──────────────────────────────────────

interface WrappedSceneProps {
  from: number;
  duration: number;
  children: React.ReactNode;
}

const WrappedScene: React.FC<WrappedSceneProps> = ({ from, duration, children }) => {
  const exit = useExit(from, duration);
  return (
    <Sequence from={from} durationInFrames={duration}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: exit.opacity,
          transform: `translateY(${exit.translateY}px)`,
        }}
      >
        {children}
      </div>
    </Sequence>
  );
};

// ─── Day label chip ───────────────────────────────────────────────────────────

const DayChip: React.FC<{ config: VideoConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 15 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        right: 28,
        opacity: Math.max(0, s),
        transform: `scale(${Math.max(0, s)})`,
        background: "rgba(10,10,10,0.7)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "100px",
        padding: "6px 14px",
        fontSize: "11px",
        fontWeight: 600,
        color: "#a3a3a3",
        fontFamily: "'Sora', sans-serif",
        backdropFilter: "blur(8px)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span style={{ color: "#d4e157", fontWeight: 800 }}>Dia {config.day}</span>
      · {config.dayLabel}
    </div>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

const SCENE1 = 105; // 3.5s
const SCENE2 = 135; // 4.5s
const SCENE3 = 90;  // 3s
const TOTAL = SCENE1 + SCENE2 + SCENE3; // 330 frames = 11s

export const ContentVideo: React.FC<{ config: VideoConfig }> = ({ config }) => {
  const { width, height } = useVideoConfig();
  const isVertical = width < height;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", color: "#f5f5f5" }}>
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Sora:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Background always on */}
      <Background />

      {/* Day chip */}
      <DayChip config={config} />

      {/* Scene 1: Hook */}
      <WrappedScene from={0} duration={SCENE1}>
        <SceneHook config={config} isVertical={isVertical} />
      </WrappedScene>

      {/* Scene 2: Items */}
      <WrappedScene from={SCENE1} duration={SCENE2}>
        <SceneItems config={config} isVertical={isVertical} />
      </WrappedScene>

      {/* Scene 3: CTA */}
      <WrappedScene from={SCENE1 + SCENE2} duration={SCENE3}>
        <SceneCta config={config} isVertical={isVertical} />
      </WrappedScene>
    </div>
  );
};

export { TOTAL };
