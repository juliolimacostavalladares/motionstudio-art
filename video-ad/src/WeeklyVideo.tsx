import React from "react";
import { interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CineBg } from "./shared/CineBg";
import { Intro } from "./shared/Intro";
import { Outro } from "./shared/Outro";
import { Day1Scene } from "./scenes/Day1Scene";
import { Day2Scene } from "./scenes/Day2Scene";
import { Day3Scene } from "./scenes/Day3Scene";
import { Day4Scene } from "./scenes/Day4Scene";
import { Day5Scene } from "./scenes/Day5Scene";
import { Day6Scene } from "./scenes/Day6Scene";
import { Day7Scene } from "./scenes/Day7Scene";

export const INTRO_FRAMES = 75;
export const SCENE_FRAMES = 270;
export const OUTRO_FRAMES = 75;
export const TOTAL_FRAMES = INTRO_FRAMES + SCENE_FRAMES + OUTRO_FRAMES; // 420 frames = 14s

const SCENES = [Day1Scene, Day2Scene, Day3Scene, Day4Scene, Day5Scene, Day6Scene, Day7Scene];

export const DAY_CONFIGS = [
  { day: 1, cta: "Fale com um especialista", metric: "+120% produtividade" },
  { day: 2, cta: "Salva esse vídeo", metric: undefined },
  { day: 3, cta: "Comenta nos posts", metric: undefined },
  { day: 4, cta: "Quer uma análise gratuita?", metric: "100% gratuitas" },
  { day: 5, cta: "Comece seu projeto", metric: "5 semanas" },
  { day: 6, cta: "Quer o mesmo resultado?", metric: "3 semanas" },
  { day: 7, cta: "Conta pra gente", metric: undefined },
];

interface WeeklyVideoProps {
  day: number;      // 1–7
  cta: string;
  metric?: string;
}

// Progress bar reads global frame
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, TOTAL_FRAMES], [0, 100], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      height: 3,
      background: "rgba(255,255,255,0.05)",
      zIndex: 20,
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: `linear-gradient(90deg, #d4e15780, #d4e157)`,
        boxShadow: "0 0 12px #d4e15766",
        transition: "none",
      }} />
    </div>
  );
};

// Fade wrapper between scenes
const FadeIn: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => {
  const frame = useCurrentFrame();
  const localF = frame - from;
  const fadeIn = interpolate(localF, [0, 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const fadeOut = interpolate(localF, [dur - 12, dur], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <Sequence from={from} durationInFrames={dur}>
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(fadeIn, fadeOut) }}>
        {children}
      </div>
    </Sequence>
  );
};

export const WeeklyVideo: React.FC<WeeklyVideoProps> = ({ day, cta, metric }) => {
  const Scene = SCENES[day - 1];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Sora:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Background — always visible */}
      <CineBg />

      {/* Progress bar — always visible */}
      <ProgressBar />

      {/* Intro: 0 → 75 */}
      <FadeIn from={0} dur={INTRO_FRAMES}>
        <Intro />
      </FadeIn>

      {/* Scene: 75 → 345 */}
      <FadeIn from={INTRO_FRAMES} dur={SCENE_FRAMES}>
        <Scene />
      </FadeIn>

      {/* Outro: 345 → 420 */}
      <FadeIn from={INTRO_FRAMES + SCENE_FRAMES} dur={OUTRO_FRAMES}>
        <Outro cta={cta} metric={metric} />
      </FadeIn>
    </div>
  );
};
