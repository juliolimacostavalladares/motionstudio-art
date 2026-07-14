import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../../shared/brand";

export const ClimaxCTA: React.FC = () => {
  const frame = useCurrentFrame();

  // Local frame runs from 0 to 345 (physically 1350 to 1695)
  // We change the flash phrase every 30 frames (1 second at 30fps)
  const phrases = [
    "QUER MAIS CLIENTES?",
    "PRECISA DE UMA LANDING PAGE?",
    "CRIAMOS PARA VOCÊ",
    "DESIGN EXCLUSIVO",
    "CÓDIGO ULTRA RÁPIDO",
    "PERFORMANCE MÁXIMA",
    "ALTA CONVERSÃO",
    "MUDANÇA DE PATAMAR",
    "PRONTO PARA DECOLAR?",
    "PRONTO PARA CONVERTER?",
    "VEJA OS RESULTADOS",
    "FALE CONOSCO"
  ];

  const phraseIndex = Math.min(
    Math.floor(frame / 30),
    phrases.length - 1
  );

  const currentPhrase = phrases[phraseIndex];

  // Alternates black and lime color every 15 frames for flashing impact
  const isLimeBg = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: isLimeBg ? BRAND.lime : BRAND.black,
        color: isLimeBg ? BRAND.black : BRAND.white,
        position: "relative",
        overflow: "hidden",
        display: "flex",
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
  );
};
