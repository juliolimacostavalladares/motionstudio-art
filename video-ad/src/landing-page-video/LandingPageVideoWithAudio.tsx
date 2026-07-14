import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { LandingPageVideo } from "./LandingPageVideo";

const TOTAL_FRAMES = 1770; // 59s @ 30fps
const MUSIC_FADE_IN_END = 30; // frame (1s)
const MUSIC_FADE_OUT_START = 1710; // frame (57s)

export const LandingPageVideoWithAudio: React.FC = () => {
  const frame = useCurrentFrame();

  // Trilha sonora: volume de 16% no topo, fade-in inicial, fade-out terminal
  const musicVolume = interpolate(
    frame,
    [0, MUSIC_FADE_IN_END, MUSIC_FADE_OUT_START, TOTAL_FRAMES],
    [0, 0.16, 0.16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      {/* ── Vídeo Visual Completo (LandingPageVideo) ───────────────────── */}
      <LandingPageVideo />

      {/* ── Trilha Sonora de Fundo ─────────────────────────────────────── */}
      <Audio
        src={staticFile("Trilha Sonora para Video Ad.mp3")}
        volume={musicVolume}
        startFrom={0}
      />
    </AbsoluteFill>
  );
};
export default LandingPageVideoWithAudio;
