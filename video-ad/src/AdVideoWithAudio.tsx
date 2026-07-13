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
import { AdVideo } from "./AdVideo";

// ─── Timeline (30fps, 945 frames = 31.5s) ────────────────────────────────────
// Cena 1 (0s - 7.0s)    → "narracao-cena-1.wav" (~5.92s)
// Cena 2 (7.0s - 19.0s)  → "narracao-cena-2.wav" (~7.04s)
// Cena 3 (19.0s - 25.0s) → "narracao-cena-3.wav" (~4.88s)
// Cena 4 (25.0s - 31.5s) → "narracao-cena-4.wav" (~5.32s)

const NARR1_START = 15;   // frame 15 (0.5s)
const NARR2_START = 225;  // frame 225 (7.5s)
const NARR3_START = 585;  // frame 585 (19.5s)
const NARR4_START = 765;  // frame 765 (25.5s)

const MUSIC_FADE_IN_END   = 30;  // frame (1s)
const MUSIC_FADE_OUT_START = 885; // frame (29.5s)
const TOTAL_FRAMES = 945;

export const AdVideoWithAudio: React.FC = () => {
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
      {/* ── Vídeo Visual Completo (AdVideo) ─────────────────────────────── */}
      <AdVideo />

      {/* ── Trilha Sonora de Fundo ──────────────────────────────────────── */}
      <Audio
        src={staticFile("Trilha Sonora para Video Ad.mp3")}
        volume={musicVolume}
        startFrom={0}
      />

      {/* ── Narração 1: Abertura (Cena 1) ───────────────────────────────── */}
      <Sequence from={NARR1_START} durationInFrames={Math.ceil(5.92 * fps)}>
        <Audio
          src={staticFile("narracao-cena-1.wav")}
          volume={1.3}
        />
      </Sequence>

      {/* ── Narração 2: Meio 1 (Cena 2) ─────────────────────────────────── */}
      <Sequence from={NARR2_START} durationInFrames={Math.ceil(7.04 * fps)}>
        <Audio
          src={staticFile("narracao-cena-2.wav")}
          volume={1.3}
        />
      </Sequence>

      {/* ── Narração 3: Meio 2 (Cena 3) ─────────────────────────────────── */}
      <Sequence from={NARR3_START} durationInFrames={Math.ceil(4.88 * fps)}>
        <Audio
          src={staticFile("narracao-cena-3.wav")}
          volume={1.3}
        />
      </Sequence>

      {/* ── Narração 4: Finalização (Cena 4) ────────────────────────────── */}
      <Sequence from={NARR4_START} durationInFrames={Math.ceil(5.32 * fps)}>
        <Audio
          src={staticFile("narracao-cena-4.wav")}
          volume={1.3}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
