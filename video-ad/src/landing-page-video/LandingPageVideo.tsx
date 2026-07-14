import React from "react";
import { Sequence } from "remotion";
import { LandingPageBackground } from "./components/LandingPageBackground";
import { IntroScene } from "./components/IntroScene";
import { BrandReveal } from "./components/BrandReveal";
import { Manifesto } from "./components/Manifesto";
import { ProductDemo } from "./components/ProductDemo";
import { ClimaxCTA } from "./components/ClimaxCTA";
import { Outro } from "../components/Outro";

export const LandingPageVideo: React.FC = () => {
  return (
    <div
      className="w-full h-full relative select-none overflow-hidden"
      style={{
        backgroundColor: "#060608",
      }}
    >
      {/* Font imports */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Sora:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Sora', sans-serif;
            background-color: #060608;
            margin: 0;
            padding: 0;
          }
        `}
      </style>

      {/* ── BACKGROUND GLOBAL CINEMATOGRÁFICO ───────────────────────────── */}
      <LandingPageBackground />

      {/* ── INTRO: Estilo ad-with-audio-vertical (0s - 7.0s | frames 0 - 210) ──── */}
      <Sequence from={0} durationInFrames={210}>
        <IntroScene />
      </Sequence>

      {/* ── PARTE 1: Close-up Texturas (7.0s - 10s | frames 210 - 300) ─────────── */}
      <Sequence from={210} durationInFrames={90}>
        <BrandReveal />
      </Sequence>

      {/* ── PARTE 2: Identidade e Manifesto (10s - 25s | frames 300 - 750) ─────── */}
      <Sequence from={300} durationInFrames={450}>
        <Manifesto />
      </Sequence>

      {/* ── PARTE 3: Demonstração de Produto & UI (25s - 45s | frames 750 - 1350) ── */}
      <Sequence from={750} durationInFrames={600}>
        <ProductDemo />
      </Sequence>

      {/* ── PARTE 4: Clímax - Flashes e CTAs (45s - 52.5s | frames 1350 - 1575) ──── */}
      <Sequence from={1350} durationInFrames={225}>
        <ClimaxCTA />
      </Sequence>

      {/* ── OUTRO: Estilo ad-with-audio-vertical (52.5s - 59s | frames 1575 - 1770) ── */}
      <Sequence from={1575} durationInFrames={195}>
        <Outro delay={10} />
      </Sequence>
    </div>
  );
};
export default LandingPageVideo;
