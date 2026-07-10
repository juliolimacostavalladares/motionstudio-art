import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo } from "./Logo";

interface OutroProps {
  delay?: number;
}

export const Outro: React.FC<OutroProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations using springs
  const logoScale = spring({
    frame: frame - delay,
    fps,
    config: { mass: 0.8, damping: 12, stiffness: 100 },
  });

  const titleScale = spring({
    frame: frame - (delay + 10),
    fps,
    config: { mass: 0.7, damping: 11, stiffness: 110 },
  });

  const textScale = spring({
    frame: frame - (delay + 20),
    fps,
    config: { mass: 0.7, damping: 11, stiffness: 110 },
  });

  const ctaScale = spring({
    frame: frame - (delay + 30),
    fps,
    config: { mass: 0.8, damping: 10, stiffness: 120 },
  });

  // Pulse effect for the button
  const buttonPulse = Math.sin((frame - (delay + 30)) * 0.1) * 0.03 + 1;

  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-6 max-w-[500px]">
      {/* Animated Logo */}
      <div 
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoScale,
          marginBottom: "16px",
        }}
      >
        <Logo size={120} />
      </div>

      {/* Brand Title */}
      <h1
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          transform: `scale(${titleScale})`,
          opacity: titleScale,
        }}
        className="text-[36px] font-extrabold text-white tracking-tight leading-none mb-4"
      >
        Motion <span className="text-[#d4e157]">Studio</span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'Sora', sans-serif",
          transform: `translateY(${(1 - textScale) * 15}px)`,
          opacity: textScale,
        }}
        className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-[340px]"
      >
        Transformamos desafios de negócio em soluções de tecnologia sob medida.
      </p>

      {/* Button CTA */}
      <div
        style={{
          transform: `scale(${ctaScale * buttonPulse})`,
          opacity: ctaScale,
        }}
        className="w-full flex justify-center mb-6"
      >
        <button
          className="btn btn-primary px-8 py-4 font-bold rounded-xl text-neutral-900 bg-[#d4e157] shadow-[0_8px_32px_rgba(212,225,87,0.25)] flex items-center gap-3 cursor-pointer border-none text-[15px]"
          style={{
            fontFamily: "'Sora', sans-serif",
          }}
        >
          <span>Falar com especialista</span>
          <svg
            className="w-5 h-5 text-neutral-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>

      {/* URL */}
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          opacity: spring({ frame: frame - (delay + 45), fps, config: { damping: 15 } }),
        }}
        className="text-[14px] text-neutral-500 tracking-wider font-semibold"
      >
        motionstudio.com.br
      </span>
    </div>
  );
};
