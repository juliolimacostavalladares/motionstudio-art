import React from "react";
import { Composition } from "remotion";
import { AdVideo } from "./AdVideo";
import { ContentVideo, TOTAL } from "./ContentVideo";
import { VIDEOS } from "./content/configs";

// Original ad constants (hardcoded — AdVideo has no named exports)
const AD_DURATION = 450; // 15s @ 30fps
const AD_FPS = 30;
const AD_WIDTH = 1080;
const AD_HEIGHT = 1080;


export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Original ads ──────────────────────────────────────────── */}
      <Composition
        id="linkedin-ad-square"
        component={AdVideo}
        durationInFrames={AD_DURATION}
        fps={AD_FPS}
        width={AD_WIDTH}
        height={AD_HEIGHT}
        defaultProps={{ format: "square" as const }}
      />
      <Composition
        id="instagram-ad-vertical"
        component={AdVideo}
        durationInFrames={AD_DURATION}
        fps={AD_FPS}
        width={AD_WIDTH}
        height={1920}
        defaultProps={{ format: "vertical" as const }}
      />

      {/* ── 7-Day Content Calendar — Square (1080×1080) ───────────── */}
      {VIDEOS.map((config) => (
        <Composition
          key={`${config.id}-square`}
          id={`${config.id}-square`}
          component={ContentVideo}
          durationInFrames={TOTAL}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{ config }}
        />
      ))}

      {/* ── 7-Day Content Calendar — Vertical (1080×1920) ────────── */}
      {VIDEOS.map((config) => (
        <Composition
          key={`${config.id}-vertical`}
          id={`${config.id}-vertical`}
          component={ContentVideo}
          durationInFrames={TOTAL}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ config }}
        />
      ))}
    </>
  );
};
