import React from "react";
import { Composition } from "remotion";
import { AdVideo } from "./AdVideo";
import { WeeklyVideo, TOTAL_FRAMES, DAY_CONFIGS } from "./WeeklyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Original brand ads ──────────────────────────────────────── */}
      <Composition
        id="linkedin-ad-square"
        component={AdVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ format: "square" as const }}
      />
      <Composition
        id="instagram-ad-vertical"
        component={AdVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ format: "vertical" as const }}
      />

      {/* ── 7-Day Calendar — Square 1080×1080 ───────────────────────── */}
      {DAY_CONFIGS.map(({ day, cta, metric }) => (
        <Composition
          key={`day${day}-square`}
          id={`day${day}-square`}
          component={WeeklyVideo}
          durationInFrames={TOTAL_FRAMES}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{ day, cta, metric }}
        />
      ))}

      {/* ── 7-Day Calendar — Vertical 1080×1920 ─────────────────────── */}
      {DAY_CONFIGS.map(({ day, cta, metric }) => (
        <Composition
          key={`day${day}-vertical`}
          id={`day${day}-vertical`}
          component={WeeklyVideo}
          durationInFrames={TOTAL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ day, cta, metric }}
        />
      ))}
    </>
  );
};
