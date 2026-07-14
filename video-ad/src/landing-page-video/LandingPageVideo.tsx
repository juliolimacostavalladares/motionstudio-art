import React from "react";
import { Sequence } from "remotion";
import { LandingPageBackground } from "./components/LandingPageBackground";
import { IntroScene } from "./components/IntroScene";
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

      {/* ── PARTE 1: Identidade e Manifesto (7.0s - 20.3s | frames 210 - 610) ───── */}
      <Sequence from={210} durationInFrames={400}>
        <Manifesto />
      </Sequence>

      {/* ── PARTE 2: Demonstração de Produto & UI (20.3s - 43.3s | frames 610 - 1300) ─ */}
      <Sequence from={610} durationInFrames={690}>
        <ProductDemo />
      </Sequence>

      {/* ── PARTE 3: Clímax - Flashes e CTAs (43.3s - 52.5s | frames 1300 - 1575) ── */}
      <Sequence from={1300} durationInFrames={275}>
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
