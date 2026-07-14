import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../../shared/brand";

export const ClimaxCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame runs from 0 to 540 (physically 939 to 1480)
  // Each phrase has a custom duration matched to the actual wav voiceover duration!
  const phrases = [
    { text: "Quer mais leads?", highlight: "leads?" },
    { text: "Quer vender mais?", highlight: "vender mais?" },
    { text: "Criamos sua Landing Page", highlight: "Landing Page" },
    { text: "Design exclusivo e premium", highlight: "exclusivo" },
    { text: "Código ultra rápido", highlight: "ultra rápido" },
    { text: "Performance máxima de vendas", highlight: "Performance" },
    { text: "Pronto para decolar?", highlight: "decolar?" },
    { text: "Fale com um especialista!", highlight: "especialista!" }
  ];

  const phraseDurations = [52, 56, 68, 97, 70, 84, 51, 63];

  // Calculate active phrase index and local offset dynamically
  let phraseIndex = 0;
  let accumulatedFrames = 0;
  for (let i = 0; i < phraseDurations.length; i++) {
    if (frame < accumulatedFrames + phraseDurations[i]) {
      phraseIndex = i;
      break;
    }
    accumulatedFrames += phraseDurations[i];
    if (i === phraseDurations.length - 1) {
      phraseIndex = i;
    }
  }

  const current = phrases[phraseIndex];
  const localFrame = frame - accumulatedFrames;
  const currentDuration = phraseDurations[phraseIndex];

  // Spring zoom-in for the active phrase
  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 11, stiffness: 140 },
  });

  // Entrance and exit fade matching custom duration
  const opacity = interpolate(localFrame, [0, 4, currentDuration - 4, currentDuration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle pulsating ambient background glow (slower and softer)
  const glowOpacity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.02, 0.08]
  );

  // Divide the phrase into words to highlight the target word
  const words = current.text.split(" ");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 30px",
      }}
    >
      {/* Background Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at center, black 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 95%)",
          opacity: 0.8,
        }}
      />

      {/* Ambient Pulsating Lime Light in center */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${BRAND.lime} 0%, transparent 70%)`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(50px)",
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Kinetic Word Assembly */}
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
          textAlign: "center",
          zIndex: 10,
          width: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "46px",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {words.map((word, index) => {
            const isHighlight = current.highlight.toLowerCase().includes(word.replace(/[?.!,]/g, "").toLowerCase());
            return (
              <span
                key={index}
                style={{
                  color: isHighlight ? BRAND.lime : "#ffffff",
                  display: "inline-block",
                  marginRight: "10px",
                  textShadow: isHighlight ? `0 0 30px ${BRAND.lime}44` : "none",
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>
      </div>
    </div>
  );
};
export default ClimaxCTA;
