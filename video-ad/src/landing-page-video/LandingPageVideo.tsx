import React from "react";
import { Sequence } from "remotion";
import { Intro } from "../shared/Intro";
import { Outro } from "../shared/Outro";
import { BrandReveal } from "./components/BrandReveal";
import { Manifesto } from "./components/Manifesto";
import { ProductDemo } from "./components/ProductDemo";
import { ClimaxCTA } from "./components/ClimaxCTA";

export const LandingPageVideo: React.FC = () => {
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

      {/* ── INTRO: Padrão Motion Studio (0s - 2.5s) ──────────────────── */}
      <Sequence from={0} durationInFrames={75}>
        <Intro />
      </Sequence>

      {/* ── PARTE 1: O Despertar da Marca - Texturas (2.5s - 10s) ────────── */}
      <Sequence from={75} durationInFrames={225}>
        <BrandReveal />
      </Sequence>

      {/* ── PARTE 2: Identidade e Manifesto (10s - 25s) ────────────────── */}
      <Sequence from={300} durationInFrames={450}>
        <Manifesto />
      </Sequence>

      {/* ── PARTE 3: Demonstração de Produto & UI (25s - 45s) ────────────── */}
      <Sequence from={750} durationInFrames={600}>
        <ProductDemo />
      </Sequence>

      {/* ── PARTE 4: Clímax - Flashes e CTAs (45s - 56.5s) ─────────────── */}
      <Sequence from={1350} durationInFrames={345}>
        <ClimaxCTA />
      </Sequence>

      {/* ── OUTRO: Padrão Motion Studio (56.5s - 59s) ──────────────────── */}
      <Sequence from={1695} durationInFrames={75}>
        <Outro cta="Crie sua Landing Page" metric="+84.7% Leads" />
      </Sequence>
    </div>
  );
};
export default LandingPageVideo;
