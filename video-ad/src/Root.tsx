import "./index.css";
import { Composition } from "remotion";
import { AdVideo } from "./AdVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1:1 Square Feed Ad (LinkedIn / Instagram Feed) */}
      <Composition
        id="linkedin-ad-square"
        component={AdVideo}
        durationInFrames={450} // 15 seconds
        fps={30}
        width={1080}
        height={1080}
      />

      {/* 9:16 Vertical Stories / Reels Ad (Instagram Stories / Reels / LinkedIn Mobile) */}
      <Composition
        id="instagram-ad-vertical"
        component={AdVideo}
        durationInFrames={450} // 15 seconds
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
