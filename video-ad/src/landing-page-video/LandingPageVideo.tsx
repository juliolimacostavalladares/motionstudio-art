import React from "react";
import { Sequence } from "remotion";
import { BrandReveal } from "./components/BrandReveal";
import { Manifesto } from "./components/Manifesto";
import { ProductDemo } from "./components/ProductDemo";
import { ClimaxCTA } from "./components/ClimaxCTA";

export const LandingPageVideo: React.FC = () => {

  // TIMINGS (Total 1770 frames = 59s @ 30fps)
  const part1Start = 0;
  const part1Duration = 300; // 10s (0s - 10s)

  const part2Start = part1Start + part1Duration;
  const part2Duration = 450; // 15s (10s - 25s)

  const part3Start = part2Start + part2Duration;
  const part3Duration = 600; // 20s (25s - 45s)

  const part4Start = part3Start + part3Duration;
  const part4Duration = 420; // 14s (45s - 59s)

  return (
    <div
      className="w-full h-full relative select-none overflow-hidden"
      style={{
        backgroundColor: "#111111",
      }}
    >
      {/* Font imports */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Sora:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Sora', sans-serif;
            background-color: #111111;
            margin: 0;
            padding: 0;
          }
        `}
      </style>

      {/* PARTE 1: O Despertar da Marca (0s - 10s) */}
      <Sequence from={part1Start} durationInFrames={part1Duration}>
        <BrandReveal />
      </Sequence>

      {/* PARTE 2: Identidade e Manifesto (10s - 25s) */}
      <Sequence from={part2Start} durationInFrames={part2Duration}>
        <Manifesto />
      </Sequence>

      {/* PARTE 3: Demonstração de Produto & UI (25s - 45s) */}
      <Sequence from={part3Start} durationInFrames={part3Duration}>
        <ProductDemo />
      </Sequence>

      {/* PARTE 4: Clímax e CTA (45s - 59s) */}
      <Sequence from={part4Start} durationInFrames={part4Duration}>
        <ClimaxCTA />
      </Sequence>
    </div>
  );
};
export default LandingPageVideo;
