import React from "react";
import {
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoConfig } from "./content/configs";

// ─── Constants ───────────────────────────────────────────────────────────────

const LIME = "#d4e157";
const DARK = "#0a0a0a";
const SCENE1 = 120; // 4s — Hook
const SCENE2 = 195; // 6.5s — Content
const SCENE3 = 105; // 3.5s — Outro
export const TOTAL = SCENE1 + SCENE2 + SCENE3; // 420 frames = 14s @ 30fps

// ─── Camera drift hook ────────────────────────────────────────────────────────

function useCamera() {
  const frame = useCurrentFrame();
  // Very slow zoom-in over entire video
  const scale = interpolate(frame, [0, TOTAL], [1.0, 1.09], {
    extrapolateRight: "clamp",
  });
  // Gentle sinusoidal drift
  const tx = interpolate(Math.sin(frame * 0.006), [-1, 1], [-14, 14]);
  const ty = interpolate(Math.cos(frame * 0.008), [-1, 1], [-10, 10]);
  return { scale, tx, ty };
}

// ─── Background with parallax ─────────────────────────────────────────────────

const CinematicBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = useCamera();

  // Background moves at 40% of camera speed = parallax
  const bgTx = cam.tx * 0.4;
  const bgTy = cam.ty * 0.4;

  // Gentle orb pulse
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.04);
  const pulse2 = 0.9 + 0.1 * Math.cos(frame * 0.035);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: DARK,
        overflow: "hidden",
      }}
    >
      {/* Animated gradient orbs */}
      <div
        style={{
          position: "absolute",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(212,225,87,${0.07 * pulse}) 0%, transparent 65%)`,
          left: `calc(15% + ${bgTx}px)`,
          top: `calc(15% + ${bgTy}px)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(212,225,87,${0.05 * pulse2}) 0%, transparent 60%)`,
          right: `calc(10% + ${-bgTx}px)`,
          bottom: `calc(8% + ${-bgTy}px)`,
          transform: "translate(50%, 50%)",
          filter: "blur(50px)",
        }}
      />
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 85%)",
        }}
      />
      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
};

// ─── Progress bar ─────────────────────────────────────────────────────────────

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, TOTAL], [0, 100], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "rgba(255,255,255,0.06)",
        zIndex: 20,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${LIME}aa, ${LIME})`,
          boxShadow: `0 0 12px ${LIME}66`,
        }}
      />
    </div>
  );
};

// ─── Kinetic word reveal ──────────────────────────────────────────────────────

interface WordRevealProps {
  text: string;
  startFrame: number;
  wordDelay?: number;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
  accentWords?: string[];
}

const WordReveal: React.FC<WordRevealProps> = ({
  text,
  startFrame,
  wordDelay = 5,
  style,
  wordStyle,
  accentWords = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <span style={{ display: "inline", ...style }}>
      {words.map((word, i) => {
        const s = spring({
          frame: frame - startFrame - i * wordDelay,
          fps,
          config: { damping: 14, stiffness: 180, mass: 0.5 },
        });
        const opacity = Math.max(0, s);
        const ty = (1 - Math.max(0, s)) * 28;
        const isAccent = accentWords.indexOf(word.replace(/[.,!?]/g, "")) !== -1;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${ty}px)`,
              color: isAccent ? LIME : undefined,
              marginRight: "0.25em",
              ...wordStyle,
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

// ─── Line accent ─────────────────────────────────────────────────────────────

const AccentLine: React.FC<{ startFrame: number; width?: string }> = ({
  startFrame,
  width = "48px",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - startFrame, fps, config: { damping: 18, stiffness: 160 } });
  return (
    <div
      style={{
        height: "2px",
        width,
        background: `linear-gradient(90deg, ${LIME}, transparent)`,
        borderRadius: "2px",
        boxShadow: `0 0 10px ${LIME}44`,
        opacity: Math.max(0, s),
        transform: `scaleX(${Math.max(0, s)})`,
        transformOrigin: "left",
        margin: "10px 0 10px",
      }}
    />
  );
};

// ─── Scene 1: Hook ────────────────────────────────────────────────────────────

const SceneHook: React.FC<{ config: VideoConfig; isVertical: boolean }> = ({
  config,
  isVertical,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCamera();

  const badgeS = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${cam.scale}) translate(${cam.tx * 0.6}px, ${cam.ty * 0.6}px)`,
        padding: isVertical ? "0 52px" : "0 72px",
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(212,225,87,0.08)",
          border: `1px solid ${LIME}28`,
          borderRadius: "100px",
          padding: "7px 18px",
          fontSize: "11px",
          fontWeight: 700,
          color: LIME,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: "32px",
          fontFamily: "'Sora', sans-serif",
          opacity: Math.max(0, badgeS),
          transform: `translateY(${(1 - Math.max(0, badgeS)) * -20}px)`,
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: LIME }} />
        {config.typeLabel}
      </div>

      {/* Kinetic headline */}
      <div
        style={{
          textAlign: "center",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: isVertical ? "42px" : "58px",
          lineHeight: 1.05,
          letterSpacing: "-0.035em",
          color: "#f0f0f0",
        }}
      >
        {config.headlineLines.map((line, i) => (
          <div key={i} style={{ display: "block" }}>
            <WordReveal
              text={line}
              startFrame={10 + i * 18}
              wordDelay={6}
              accentWords={i === config.accentLineIndex ? line.split(" ") : []}
              wordStyle={{
                color: i === config.accentLineIndex ? LIME : "#f0f0f0",
              }}
            />
          </div>
        ))}
      </div>

      <AccentLine startFrame={30} width="60px" />

      {/* Sub copy */}
      <div
        style={{
          textAlign: "center",
          maxWidth: isVertical ? "360px" : "560px",
        }}
      >
        <WordReveal
          text={config.subCopy}
          startFrame={38}
          wordDelay={3}
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: isVertical ? "15px" : "17px",
            color: "#8a8a8a",
            lineHeight: 1.7,
          }}
        />
      </div>
    </div>
  );
};

// ─── Scene 2: Content items ────────────────────────────────────────────────────

const SceneItems: React.FC<{ config: VideoConfig; isVertical: boolean }> = ({
  config,
  isVertical,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCamera();
  // Camera pans slightly down on this scene for depth
  const camOffset = interpolate(frame, [0, SCENE2], [0, 18], { extrapolateRight: "clamp" });

  const titleS = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${cam.scale}) translate(${cam.tx * 0.5}px, ${cam.ty * 0.5 + camOffset}px)`,
        padding: isVertical ? "0 40px" : "0 60px",
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 700,
          fontSize: isVertical ? "22px" : "28px",
          color: LIME,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: "6px",
          opacity: Math.max(0, titleS),
          transform: `translateY(${(1 - Math.max(0, titleS)) * 16}px)`,
        }}
      >
        {config.scene2Title}
      </h2>
      <AccentLine startFrame={4} width="100%" />

      {/* Items — single column always for cinematic feel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isVertical ? "12px" : "14px",
          width: "100%",
          maxWidth: isVertical ? "480px" : "720px",
        }}
      >
        {config.items.map((item, idx) => {
          const delay = 14 + idx * 14;
          const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 130, mass: 0.6 },
          });
          const opacity = Math.max(0, s);
          const tx = (1 - Math.max(0, s)) * -40;

          return (
            <div
              key={idx}
              style={{
                opacity,
                transform: `translateX(${tx}px)`,
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                background: item.highlight
                  ? "rgba(212,225,87,0.05)"
                  : "rgba(255,255,255,0.025)",
                borderLeft: `2.5px solid ${item.highlight ? LIME : "rgba(255,255,255,0.1)"}`,
                borderRadius: "0 12px 12px 0",
                padding: isVertical ? "14px 18px" : "16px 22px",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: isVertical ? "22px" : "26px",
                  color: item.highlight ? LIME : "rgba(255,255,255,0.5)",
                  minWidth: "32px",
                  lineHeight: 1,
                  marginTop: "2px",
                }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 700,
                    fontSize: isVertical ? "14px" : "16px",
                    color: item.highlight ? LIME : "#e8e8e8",
                    lineHeight: 1.3,
                    marginBottom: item.sub ? "4px" : 0,
                  }}
                >
                  {item.text}
                </div>
                {item.sub && (
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: isVertical ? "11px" : "12px",
                      color: "#5a5a5a",
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

// ─── Scene 3: Outro ──────────────────────────────────────────────────────────

const SceneOutro: React.FC<{ config: VideoConfig; isVertical: boolean }> = ({
  config,
  isVertical,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCamera();

  // Camera zooms back out slightly for outro reveal
  const zoomOut = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const outroScale = interpolate(Math.max(0, zoomOut), [0, 1], [0.96, 1]);

  const logoS = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const metricS = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 140 } });
  const ctaS = spring({ frame: frame - 28, fps, config: { damping: 14, stiffness: 130 } });
  const urlS = spring({ frame: frame - 42, fps, config: { damping: 16, stiffness: 110 } });

  // Pulsing glow on metric
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.14);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transform: `scale(${cam.scale * outroScale}) translate(${cam.tx * 0.4}px, ${cam.ty * 0.4}px)`,
        padding: isVertical ? "0 52px" : "0 72px",
      }}
    >
      {/* Logo mark */}
      <svg
        width={isVertical ? "64" : "54"}
        height={isVertical ? "64" : "54"}
        viewBox="0 0 200 200"
        style={{
          opacity: Math.max(0, logoS),
          transform: `scale(${Math.max(0, logoS)})`,
          marginBottom: "12px",
        }}
      >
        <rect width="200" height="200" rx="44" fill="#111" stroke="#222" strokeWidth="2" />
        <path
          d="M100 40C66.86 40 40 66.86 40 100C40 133.14 66.86 160 100 160H160V100C160 66.86 133.14 40 100 40Z"
          fill={LIME}
        />
        <circle cx="100" cy="100" r="25" fill="#111" />
      </svg>

      {/* Brand */}
      <div
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: isVertical ? "28px" : "36px",
          letterSpacing: "-0.03em",
          color: "#f0f0f0",
          marginBottom: "24px",
          opacity: Math.max(0, logoS),
        }}
      >
        Motion <span style={{ color: LIME }}>Studio</span>
      </div>

      {/* Metric */}
      {config.metric && (
        <div
          style={{
            opacity: Math.max(0, metricS),
            transform: `scale(${Math.max(0, metricS)})`,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: isVertical ? "42px" : "52px",
            color: LIME,
            letterSpacing: "-0.04em",
            textShadow: `0 0 ${40 * glow}px ${LIME}55`,
            marginBottom: "8px",
          }}
        >
          {config.metric}
        </div>
      )}

      {/* CTA headline */}
      <div
        style={{
          maxWidth: isVertical ? "360px" : "480px",
          marginBottom: "18px",
        }}
      >
        <WordReveal
          text={config.ctaHeadline}
          startFrame={28}
          wordDelay={4}
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700,
            fontSize: isVertical ? "22px" : "28px",
            color: "#e8e8e8",
            lineHeight: 1.2,
          }}
        />
      </div>

      {/* CTA label — text only, no button */}
      <div
        style={{
          opacity: Math.max(0, ctaS),
          transform: `translateY(${(1 - Math.max(0, ctaS)) * 20}px)`,
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          fontSize: isVertical ? "16px" : "18px",
          color: LIME,
          letterSpacing: "0.02em",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {config.ctaLabel}
        <span
          style={{
            display: "inline-block",
            transform: `translateX(${4 * Math.sin(frame * 0.18)}px)`,
          }}
        >
          →
        </span>
      </div>

      {/* Footer note */}
      {config.footerNote && (
        <div
          style={{
            opacity: Math.max(0, urlS) * 0.5,
            fontFamily: "'Sora', sans-serif",
            fontSize: "11px",
            color: "#555",
            marginBottom: "6px",
          }}
        >
          {config.footerNote}
        </div>
      )}

      {/* URL */}
      <div
        style={{
          opacity: Math.max(0, urlS),
          fontFamily: "'Sora', sans-serif",
          fontSize: "13px",
          color: "#3a3a3a",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        motionstudio.art
      </div>
    </div>
  );
};

// ─── Scene transition fade ────────────────────────────────────────────────────

const FadeScene: React.FC<{
  from: number;
  duration: number;
  children: React.ReactNode;
}> = ({ from, duration, children }) => {
  const frame = useCurrentFrame();

  // Fade in first 10 frames, fade out last 14 frames
  const localFrame = frame - from;
  const fadeIn = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const fadeOut = interpolate(localFrame, [duration - 14, duration], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <Sequence from={from} durationInFrames={duration}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </Sequence>
  );
};

// ─── Top bar ─────────────────────────────────────────────────────────────────

const TopBar: React.FC<{ config: VideoConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: 28,
        right: 28,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 15,
        opacity: Math.max(0, s),
        transform: `translateY(${(1 - Math.max(0, s)) * -16}px)`,
      }}
    >
      {/* Day label */}
      <div
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          color: "#3a3a3a",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Dia {config.day} · {config.dayLabel}
      </div>

      {/* Badge */}
      <div
        style={{
          background: "rgba(212,225,87,0.06)",
          border: `1px solid ${LIME}22`,
          borderRadius: "100px",
          padding: "4px 12px",
          fontFamily: "'Sora', sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          color: `${LIME}cc`,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {config.badge}
      </div>
    </div>
  );
};

// ─── Main export ─────────────────────────────────────────────────────────────

export const ContentVideo: React.FC<{ config: VideoConfig }> = ({ config }) => {
  const { width, height } = useVideoConfig();
  const isVertical = width < height;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Sora', sans-serif",
        color: "#f0f0f0",
      }}
    >
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Sora:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Background always visible */}
      <CinematicBackground />

      {/* Top bar */}
      <TopBar config={config} />

      {/* Scene 1 — Hook */}
      <FadeScene from={0} duration={SCENE1}>
        <SceneHook config={config} isVertical={isVertical} />
      </FadeScene>

      {/* Scene 2 — Items */}
      <FadeScene from={SCENE1} duration={SCENE2}>
        <SceneItems config={config} isVertical={isVertical} />
      </FadeScene>

      {/* Scene 3 — Outro */}
      <FadeScene from={SCENE1 + SCENE2} duration={SCENE3}>
        <SceneOutro config={config} isVertical={isVertical} />
      </FadeScene>

      {/* Progress bar */}
      <ProgressBar />
    </div>
  );
};
