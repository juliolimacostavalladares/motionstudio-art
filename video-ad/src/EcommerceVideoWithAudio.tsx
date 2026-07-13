import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EcommerceVideo } from "./EcommerceVideo";

// ─── Timeline (30fps, 945 frames = 31.5s) ────────────────────────────────────
// Cena 1 (0s - 7.0s)    → "narracao-eco-1.wav" (~4.14s)
// Cena 2 (7.0s - 19.0s)  → "narracao-eco-2.wav" (~6.10s)
// Cena 3 (19.0s - 25.0s) → "narracao-eco-3.wav" (~4.28s)
// Cena 4 (25.0s - 31.5s) → "narracao-eco-4.wav" (~4.01s)

const NARR1_START = 15;   // frame 15 (0.5s)
const NARR2_START = 225;  // frame 225 (7.5s)
const NARR3_START = 585;  // frame 585 (19.5s)
const NARR4_START = 765;  // frame 765 (25.5s)

const MUSIC_FADE_IN_END   = 30;  // frame (1s)
const MUSIC_FADE_OUT_START = 885; // frame (29.5s)
const TOTAL_FRAMES = 945;

export const EcommerceVideoWithAudio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Trilha sonora: volume de 16% no topo, fade-in inicial, fade-out terminal
  const musicVolume = interpolate(
    frame,
    [0, MUSIC_FADE_IN_END, MUSIC_FADE_OUT_START, TOTAL_FRAMES],
    [0, 0.16, 0.16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      {/* ── Vídeo Visual Completo (EcommerceVideo) ────────────────────── */}
      <EcommerceVideo />

      {/* ── Trilha Sonora de Fundo ──────────────────────────────────────── */}
      <Audio
        src={staticFile("Trilha Sonora para Video Ad.mp3")}
        volume={musicVolume}
        startFrom={0}
      />

      {/* ── Narração 1: Abertura (Cena 1) ───────────────────────────────── */}
      <Sequence from={NARR1_START} durationInFrames={Math.ceil(4.14 * fps)}>
        <Audio
          src={staticFile("narracao-eco-1.wav")}
          volume={1.3}
        />
      </Sequence>

      {/* ── Narração 2: Meio 1 (Cena 2) ─────────────────────────────────── */}
      <Sequence from={NARR2_START} durationInFrames={Math.ceil(6.10 * fps)}>
        <Audio
          src={staticFile("narracao-eco-2.wav")}
          volume={1.3}
        />
      </Sequence>

      {/* ── Narração 3: Meio 2 (Cena 3) ─────────────────────────────────── */}
      <Sequence from={NARR3_START} durationInFrames={Math.ceil(4.28 * fps)}>
        <Audio
          src={staticFile("narracao-eco-3.wav")}
          volume={1.3}
        />
      </Sequence>

      {/* ── Narração 4: Finalização (Cena 4) ────────────────────────────── */}
      <Sequence from={NARR4_START} durationInFrames={Math.ceil(4.01 * fps)}>
        <Audio
          src={staticFile("narracao-eco-4.wav")}
          volume={1.3}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
