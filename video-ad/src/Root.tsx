import React from "react";
import { Composition } from "remotion";
import { AdVideo } from "./AdVideo";
import { AdVideoWithAudio } from "./AdVideoWithAudio";
import { EcommerceVideo } from "./EcommerceVideo";
import { EcommerceVideoWithAudio } from "./EcommerceVideoWithAudio";
import { WeeklyVideo, TOTAL_FRAMES, DAY_CONFIGS } from "./WeeklyVideo";
import { LandingPageVideo } from "./landing-page-video/LandingPageVideo";
import { LandingPageVideoWithAudio } from "./landing-page-video/LandingPageVideoWithAudio";
import { ContentVideo } from "./ContentVideo";
import { AI_VIDEOS } from "./content/aiConfigs";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Com áudio (narração + trilha) ─────────────────────────────── */}
      <Composition
        id="ad-with-audio-square"
        component={AdVideoWithAudio}
        durationInFrames={945}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="ad-with-audio-vertical"
        component={AdVideoWithAudio}
        durationInFrames={945}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Original brand ads (sem áudio) ───────────────────────────── */}
      <Composition
        id="linkedin-ad-square"
        component={AdVideo}
        durationInFrames={945}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ format: "square" as const }}
      />
      <Composition
        id="instagram-ad-vertical"
        component={AdVideo}
        durationInFrames={945}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ format: "vertical" as const }}
      />

      {/* ── E-commerce Ads (com áudio) ────────────────────────────────── */}
      <Composition
        id="ecommerce-ad-square"
        component={EcommerceVideoWithAudio}
        durationInFrames={1142}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="ecommerce-ad-vertical"
        component={EcommerceVideoWithAudio}
        durationInFrames={1142}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── TikTok (1080x1920 vertical) ──────────────────────────────── */}
      <Composition
        id="ecommerce-tiktok"
        component={EcommerceVideoWithAudio}
        durationInFrames={1142}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Instagram Reels (1080x1920 vertical) ─────────────────────── */}
      <Composition
        id="ecommerce-instagram-reels"
        component={EcommerceVideoWithAudio}
        durationInFrames={1142}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Instagram Feed (1080x1080 square) ────────────────────────── */}
      <Composition
        id="ecommerce-instagram-feed"
        component={EcommerceVideoWithAudio}
        durationInFrames={1142}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* ── E-commerce Ads (sem áudio) ────────────────────────────────── */}
      <Composition
        id="ecommerce-linkedin-ad-square"
        component={EcommerceVideo}
        durationInFrames={1142}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="ecommerce-instagram-ad-vertical"
        component={EcommerceVideo}
        durationInFrames={1142}
        fps={30}
        width={1080}
        height={1920}
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

      {/* ── Landing Page Video (Com e sem áudio) ──────────────────────── */}
      <Composition
        id="landing-page-ad-vertical"
        component={LandingPageVideo}
        durationInFrames={1770}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="landing-page-ad-square"
        component={LandingPageVideo}
        durationInFrames={1770}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="landing-page-ad-with-audio-vertical"
        component={LandingPageVideoWithAudio}
        durationInFrames={1770}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="landing-page-ad-with-audio-square"
        component={LandingPageVideoWithAudio}
        durationInFrames={1770}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* ── AI Tips Compositions (com ContentVideo template) ────────── */}
      {AI_VIDEOS.map((config) => (
        <React.Fragment key={config.id}>
          <Composition
            id={`${config.id}-vertical`}
            component={ContentVideo}
            durationInFrames={420} // 14 seconds
            fps={30}
            width={1080}
            height={1920} // Vertical Reels
            defaultProps={{ config }}
          />
          <Composition
            id={`${config.id}-square`}
            component={ContentVideo}
            durationInFrames={420} // 14 seconds
            fps={30}
            width={1080}
            height={1080} // Square Feed
            defaultProps={{ config }}
          />
        </React.Fragment>
      ))}
    </>
  );
};
