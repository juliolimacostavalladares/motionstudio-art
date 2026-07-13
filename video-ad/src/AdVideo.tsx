import React from "react";
import {
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Background } from "./components/Background";
import { Logo } from "./components/Logo";
import { CodeWindow } from "./components/CodeWindow";
import { ServiceCards } from "./components/ServiceCards";
import { Outro } from "./components/Outro";

export const AdVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const isVertical = width < height;

  // Scene timings (total 945 frames = 31.5s @ 30fps)
  const scene1Duration = 210; // 0s - 7.0s
  const scene2Duration = 360; // 7.0s - 19.0s
  const scene3Duration = 180; // 19.0s - 25.0s
  const scene4Duration = 195; // 25.0s - 31.5s

  const scene2Start = scene1Duration;
  const scene3Start = scene2Start + scene2Duration;
  const scene4Start = scene3Start + scene3Duration;

  // Transition Helper: Slide and Fade Out
  const getSceneStyle = (
    startFrame: number,
    duration: number,
    exitDuration = 15,
  ) => {
    const localFrame = frame - startFrame;

    // Entrance slide (0 to 30)
    const enterVal = spring({
      frame: localFrame,
      fps,
      config: { damping: 15, stiffness: 100 },
    });

    // Exit slide/fade (duration - exitDuration to duration)
    const exitVal =
      exitDuration <= 0
        ? 0
        : interpolate(localFrame, [duration - exitDuration, duration], [0, 1], {
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

  // Intro (Scene 1) specific spring animations
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
    <div className="w-full h-full relative text-white select-none overflow-hidden">
      {/* Background layer (runs through the whole video) */}
      <Background />
      {/* Font imports */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Sora:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Sora', sans-serif;
          }
        `}
      </style>
      {/* SCENE 1: Hook & Brand Intro (0s - 3.5s) */}
      <Sequence from={0} durationInFrames={scene1Duration}>
        <div style={getSceneStyle(0, scene1Duration)}>
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
              className={`font-extrabold tracking-tight leading-tight mb-4 ${isVertical ? "text-[38px]" : "text-[52px]"}`}
            >
              Transformamos desafios em{" "}
              <span className="text-[#d4e157]">código</span>
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
              Movimentamos negócios com tecnologia de ponta, processos ágeis e
              foco total em resultados.
            </p>
          </div>
        </div>
      </Sequence>
      {/* SCENE 2: The Core Solution / Mock Code Editor (3.5s - 8s) */}
      <Sequence from={scene2Start} durationInFrames={scene2Duration}>
        <div style={getSceneStyle(scene2Start, scene2Duration)}>
          {isVertical ? (
            // Vertical Layout for Reels/Stories
            <div className="flex flex-col items-center justify-center gap-8 w-full max-w-[450px] px-6 text-center">
              <div className="flex flex-col gap-2">
                <span className="text-[#d4e157] text-[11px] font-extrabold tracking-widest uppercase">
                  Desenvolvimento Ágil
                </span>
                <h2
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  className="text-[32px] font-bold text-white tracking-tight leading-none"
                >
                  Da ideia ao produto em semanas
                </h2>
              </div>
              <CodeWindow delay={10} />
            </div>
          ) : (
            // Square Layout for feeds
            <div className="flex items-center justify-center gap-10 w-full max-w-[900px] px-8 text-left">
              <div className="flex-1 flex flex-col gap-4">
                <span className="text-[#d4e157] text-[12px] font-extrabold tracking-widest uppercase">
                  Desenvolvimento Ágil
                </span>
                <h2
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  className="text-[44px] font-bold text-white tracking-tight leading-none"
                >
                  Da ideia ao produto em semanas
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-[350px]">
                  Utilizamos as tecnologias mais modernas do mercado para
                  entregar código limpo, rápido e focado em escala.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <CodeWindow delay={10} />
              </div>
            </div>
          )}
        </div>
      </Sequence>
      {/* SCENE 3: Services / Value Propositions (8s - 12s) */}
      <Sequence from={scene3Start} durationInFrames={scene3Duration}>
        <div style={getSceneStyle(scene3Start, scene3Duration)}>
          {isVertical ? (
            // Staggered list layout for vertical
            <div className="w-full max-w-[400px] px-6 flex flex-col justify-center items-center h-full">
              <h2
                className="text-[32px] font-bold text-center mb-8 text-white font-sans tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                O que nós <span className="text-[#d4e157]">construímos</span>:
              </h2>
              <div className="flex flex-col gap-3 w-full">
                {[
                  {
                    title: "Web Apps & SaaS",
                    desc: "Plataformas web robustas e escaláveis.",
                  },
                  {
                    title: "Mobile Apps",
                    desc: "iOS e Android nativos e fluidos.",
                  },
                  {
                    title: "MVPs de Alto Impacto",
                    desc: "Validação ágil de ideias.",
                  },
                  {
                    title: "Consultoria Tech",
                    desc: "Arquitetura e direcionamento técnico.",
                  },
                ].map((item, idx) => {
                  const springVal = spring({
                    frame: frame - (scene3Start + 10 + idx * 10),
                    fps,
                    config: { damping: 14 },
                  });
                  return (
                    <div
                      key={idx}
                      style={{
                        transform: `scale(${springVal})`,
                        opacity: springVal,
                      }}
                      className="border border-white/5 bg-neutral-900/40 rounded-xl p-4 flex gap-3 items-center backdrop-blur-md"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-[#d4e157]/10 flex items-center justify-center border border-[#d4e157]/20 text-[#d4e157] font-bold text-[14px]">
                        0{idx + 1}
                      </div>
                      <div className="text-left">
                        <h4
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                          }}
                          className="text-sm font-bold text-white mb-0.5"
                        >
                          {item.title}
                        </h4>
                        <p className="text-[12px] text-neutral-400 leading-none">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Grid layout for square
            <ServiceCards delay={10} />
          )}
        </div>
      </Sequence>
      {/* SCENE 4: Outro / Call To Action (12s - 15s) */}
      <Sequence from={scene4Start} durationInFrames={scene4Duration}>
        <div style={getSceneStyle(scene4Start, scene4Duration, 0)}>
          <Outro delay={10} />
        </div>
      </Sequence>
    </div>
  );
};
