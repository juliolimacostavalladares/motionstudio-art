import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Logo } from "../../components/Logo";
import { BRAND } from "../../shared/brand";

export const ClimaxCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame runs from 0 to 420 (physically 1350 to 1770)
  // Sub-scenes:
  // 0 - 240: Fast cuts / Flashing frames with text (0.0s - 8.0s)
  // 240 - 420: Final Outro screen (8.0s - 14.0s)

  // 1. Fast Cuts (0 - 240)
  // We change the flash phrase every 30 frames (1 second at 30fps)
  const phrases = [
    "SUA MARCA",
    "SEU PRODUTO",
    "SUA LANDING PAGE",
    "DESIGN AUTORAL",
    "VELOCIDADE MÁXIMA",
    "ALTÍSSIMA CONVERSÃO",
    "PRONTO PARA VENDER?",
    "PRONTO PARA DECOLAR?"
  ];

  const phraseIndex = Math.min(
    Math.floor(frame / 30),
    phrases.length - 1
  );

  const currentPhrase = phrases[phraseIndex];

  // Alternates black and lime color every 15 frames for flashing impact
  const isLimeBg = Math.floor(frame / 15) % 2 === 0;

  // 2. Final Outro (240 - 420)
  const outroFrame = frame - 240;

  const logoReveal = spring({
    frame: outroFrame - 10,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const text1Reveal = spring({
    frame: outroFrame - 25,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const text2Reveal = spring({
    frame: outroFrame - 35,
    fps,
    config: { damping: 15, stiffness: 85 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BRAND.black,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* --- PHASE 1: FLASH CUTS --- */}
      {frame < 240 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: isLimeBg ? BRAND.lime : BRAND.black,
            color: isLimeBg ? BRAND.black : BRAND.white,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.0,
              margin: 0,
              textTransform: "uppercase",
              transform: `scale(${interpolate(frame % 30, [0, 5, 30], [0.85, 1.05, 1], { extrapolateRight: "clamp" })})`,
              textShadow: isLimeBg ? "none" : `0 0 30px ${BRAND.lime}22`,
            }}
          >
            {currentPhrase}
          </h2>
        </div>
      )}

      {/* --- PHASE 2: OUTRO --- */}
      {frame >= 240 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Logo animation */}
          <div
            style={{
              transform: `scale(${logoReveal})`,
              opacity: logoReveal,
              marginBottom: "30px",
            }}
          >
            <Logo size={180} />
          </div>

          {/* Cascading texts */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: "#ffffff",
                fontSize: "44px",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                margin: 0,
                opacity: text1Reveal,
                transform: `translateY(${(1 - text1Reveal) * 20}px)`,
              }}
            >
              Motion Studio
            </h1>

            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                color: BRAND.lime,
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                marginTop: "10px",
                marginBottom: 0,
                opacity: text2Reveal,
                transform: `translateY(${(1 - text2Reveal) * 15}px)`,
              }}
            >
              motionstudio.art
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
