import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Logo } from "../../components/Logo";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = width < height;
  const duration = 210;

  // Transition Helper: Slide and Fade Out
  const getSceneStyle = () => {
    // Entrance slide (0 to 30)
    const enterVal = spring({
      frame,
      fps,
      config: { damping: 15, stiffness: 100 },
    });

    // Exit slide/fade (duration - 15 to duration)
    const exitVal = interpolate(frame, [duration - 15, duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const opacity = enterVal * (1 - exitVal);
    const translateY = (1 - enterVal) * 50 + exitVal * -50;

    return {
      opacity,
      transform: `translateY(${translateY}px)`,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute" as const,
      inset: 0,
    };
  };

  // Spring animations
  const logoScale = spring({
    frame,
    fps,
    config: { mass: 0.8, damping: 12 },
  });

  const headerSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15 },
  });

  const textSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15 },
  });

  return (
    <div style={getSceneStyle()} className="text-white">
      <div
        className={`flex flex-col items-center text-center px-8 ${isVertical ? "max-w-[450px]" : "max-w-[700px]"}`}
      >
        {/* Pulsing Status Badge */}
        <div
          style={{
            opacity: headerSpring,
            transform: `scale(${headerSpring})`,
          }}
          className="inline-flex items-center gap-2 rounded-full border border-[#d4e157]/20 bg-[#d4e157]/10 px-4 py-1.5 text-[12px] font-bold text-[#d4e157] mb-6 tracking-wide uppercase"
        >
          <span className="h-2 w-2 rounded-full bg-[#d4e157] animate-ping" />
          Software House Sob Medida
        </div>

        {/* Bouncy Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoScale,
            marginBottom: "24px",
          }}
        >
          <Logo size={140} />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            transform: `translateY(${(1 - headerSpring) * 20}px)`,
            opacity: headerSpring,
          }}
          className={`font-extrabold tracking-tight leading-tight mb-4 ${isVertical ? "text-[36px]" : "text-[52px]"}`}
        >
          Sua landing page de{" "}
          <span className="text-[#d4e157]">alta conversão</span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            transform: `translateY(${(1 - textSpring) * 15}px)`,
            opacity: textSpring,
          }}
          className="text-neutral-400 text-sm md:text-base leading-relaxed"
        >
          Desenvolvemos landing pages premium sob medida para decolar os leads e as vendas do seu negócio.
        </p>
      </div>
    </div>
  );
};
