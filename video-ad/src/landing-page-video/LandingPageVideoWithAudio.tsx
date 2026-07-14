import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
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

      {/* ── Narração 1: Cena 1 (Intro) ─────────────────────────────────── */}
      <Sequence from={0} durationInFrames={160}>
        <Audio src={staticFile("tts-intro.wav")} volume={1.3} />
      </Sequence>

      {/* ── Narração 2: Cena 2 (Manifesto B2B) ─────────────────────────── */}
      <Sequence from={160} durationInFrames={450}>
        <Audio src={staticFile("tts-manifesto.wav")} volume={1.3} />
      </Sequence>

      {/* ── Narração 3: Cena 4 (Clímax Cinético 8-Fases) ───────────────── */}
      {/* Cada frase tem duração de 34 frames (1.13s) no ritmo da música */}
      <Sequence from={1300} durationInFrames={34}>
        <Audio src={staticFile("tts-climax1.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1334} durationInFrames={34}>
        <Audio src={staticFile("tts-climax2.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1368} durationInFrames={34}>
        <Audio src={staticFile("tts-climax3.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1402} durationInFrames={34}>
        <Audio src={staticFile("tts-climax4.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1436} durationInFrames={34}>
        <Audio src={staticFile("tts-climax5.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1470} durationInFrames={34}>
        <Audio src={staticFile("tts-climax6.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1504} durationInFrames={34}>
        <Audio src={staticFile("tts-climax7.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1538} durationInFrames={34}>
        <Audio src={staticFile("tts-climax8.wav")} volume={1.3} />
      </Sequence>

      {/* ── Narração 4: Cena 5 (Outro/Fechamento com 10f de delay) ────── */}
      <Sequence from={1585} durationInFrames={185}>
        <Audio src={staticFile("tts-outro.wav")} volume={1.3} />
      </Sequence>
    </AbsoluteFill>
  );
};
export default LandingPageVideoWithAudio;
