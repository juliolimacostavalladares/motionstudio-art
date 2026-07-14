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
      {/* Toca de forma livre e integral a partir do frame 0 */}
      <Sequence from={0}>
        <Audio src={staticFile("tts-intro.wav")} volume={1.3} />
      </Sequence>

      {/* ── Narração 2: Cena 2 (Manifesto B2B) ─────────────────────────── */}
      {/* Sincronizado para começar exatamente no frame 210 do Manifesto visual */}
      <Sequence from={210}>
        <Audio src={staticFile("tts-manifesto.wav")} volume={1.3} />
      </Sequence>

      {/* ── Narração 3: Cena 3 (Demonstração Desktop) ───────────────────── */}
      {/* Toca a partir do frame 610 do ProductDemo visual */}
      <Sequence from={610}>
        <Audio src={staticFile("tts-demo.wav")} volume={1.3} />
      </Sequence>

      {/* ── Narração 4: Cena 4 (Clímax Cinético 8-Fases) ───────────────── */}
      {/* Cada gatilho de fala inicia exatamente na entrada da frase correspondente */}
      <Sequence from={1300}>
        <Audio src={staticFile("tts-climax1.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1334}>
        <Audio src={staticFile("tts-climax2.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1368}>
        <Audio src={staticFile("tts-climax3.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1402}>
        <Audio src={staticFile("tts-climax4.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1436}>
        <Audio src={staticFile("tts-climax5.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1470}>
        <Audio src={staticFile("tts-climax6.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1504}>
        <Audio src={staticFile("tts-climax7.wav")} volume={1.3} />
      </Sequence>

      <Sequence from={1538}>
        <Audio src={staticFile("tts-climax8.wav")} volume={1.3} />
      </Sequence>

      {/* ── Narração 5: Cena 5 (Outro/Fechamento) ──────────────────────── */}
      {/* Sincronizado para começar no frame 1585 com o delay visual do fechamento */}
      <Sequence from={1585}>
        <Audio src={staticFile("tts-outro.wav")} volume={1.3} />
      </Sequence>
    </AbsoluteFill>
  );
};
export default LandingPageVideoWithAudio;
