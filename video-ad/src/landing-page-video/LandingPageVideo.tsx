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

      {/* ── INTRO: Estilo ad-with-audio-vertical (0s - 7.66s | frames 0 - 230) ──── */}
      <Sequence from={0} durationInFrames={230}>
        <IntroScene />
      </Sequence>

      {/* ── PARTE 1: Identidade e Manifesto (7.66s - 19.66s | frames 230 - 590) ───── */}
      <Sequence from={230} durationInFrames={360}>
        <Manifesto />
      </Sequence>

      {/* ── PARTE 2: Demonstração de Produto & UI (19.66s - 31.30s | frames 590 - 939) ─ */}
      <Sequence from={590} durationInFrames={349}>
        <ProductDemo />
      </Sequence>

      {/* ── PARTE 3: Clímax - Flashes e CTAs (31.30s - 49.33s | frames 939 - 1480) ── */}
      <Sequence from={939} durationInFrames={541}>
        <ClimaxCTA />
      </Sequence>

      {/* ── OUTRO: Estilo ad-with-audio-vertical (49.33s - 59s | frames 1480 - 1770) ── */}
      <Sequence from={1480} durationInFrames={290}>
        <Outro delay={10} showCaption={false} />
      </Sequence>
    </div>
  );
};
export default LandingPageVideo;
