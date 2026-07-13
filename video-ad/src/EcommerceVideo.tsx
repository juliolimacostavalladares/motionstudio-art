import React from "react";
import {
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { Background } from "./components/Background";
import { Logo } from "./components/Logo";
import { EcommerceShowcase } from "./components/EcommerceShowcase";
import { Outro } from "./components/Outro";

export const EcommerceVideo: React.FC = () => {
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
      {/* Background layer */}
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

      {/* SCENE 1: Hook & Brand Intro (0s - 7.0s) */}
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
              E-commerce Premium
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
              Seu e-commerce premium em{" "}
              <span className="text-[#d4e157]">semanas</span>
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
              Criamos lojas virtuais completas, com design exclusivo, checkout transparente e integradas para vender.
            </p>
          </div>
        </div>
      </Sequence>

      {/* ─── SCENE 2 & 3 UNIFIED MIDDLE SEQUENCE (7.0s - 25.0s) ─── */}
      {/* Aqui o EcommerceShowcase fica persistente na tela com animações e câmera contínuas */}
      <Sequence from={scene2Start} durationInFrames={scene2Duration + scene3Duration}>
        <div className="absolute inset-0 w-full h-full flex justify-center items-center">
          
          {isVertical ? (
            // Layout Vertical (Reels/Stories)
            <div className="relative w-full h-full flex flex-col justify-between items-center py-20 px-6 text-center">
              
              {/* Textos da Cena 2 */}
              {frame >= scene2Start && frame < scene3Start && (() => {
                const localFrame = frame - scene2Start;
                // Staggered exit: title exits first, then subtitle
                const exitProgress = interpolate(localFrame, [scene2Duration - 20, scene2Duration], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.25, 1, 0.5, 1),
                });
                const titleOpacity = interpolate(exitProgress, [0, 0.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const subtitleOpacity = interpolate(exitProgress, [0.3, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const titleY = exitProgress * -25;
                const subtitleY = exitProgress * -18;
                // Entrance
                const enterProgress = interpolate(localFrame, [0, 18], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.25, 1, 0.5, 1),
                });
                const enterTitleY = (1 - enterProgress) * 20;
                const enterSubY = (1 - interpolate(localFrame, [5, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1) })) * 15;

                return (
                  <div className="flex flex-col gap-2 z-10">
                    <span
                      style={{
                        opacity: subtitleOpacity * enterProgress,
                        transform: `translateY(${subtitleY + enterSubY}px)`,
                      }}
                      className="text-[#d4e157] text-[11px] font-extrabold tracking-widest uppercase"
                    >
                      Desenvolvimento Sob Medida
                    </span>
                    <h2
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        opacity: titleOpacity * enterProgress,
                        transform: `translateY(${titleY + enterTitleY}px)`,
                      }}
                      className="text-[30px] font-bold text-white tracking-tight leading-none"
                    >
                      Sua loja pronta de verdade
                    </h2>
                  </div>
                );
              })()}

              {/* Textos da Cena 3 */}
              {frame >= scene3Start && frame < scene4Start && (() => {
                const localFrame = frame - scene3Start;
                // Staggered exit
                const exitProgress = interpolate(localFrame, [scene3Duration - 20, scene3Duration], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.25, 1, 0.5, 1),
                });
                const titleOpacity = interpolate(exitProgress, [0, 0.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const subtitleOpacity = interpolate(exitProgress, [0.3, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const titleY = exitProgress * -25;
                const subtitleY = exitProgress * -18;
                // Entrance with stagger
                const enterProgress = interpolate(localFrame, [0, 18], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.25, 1, 0.5, 1),
                });
                const enterTitleY = (1 - enterProgress) * 20;
                const enterSubY = (1 - interpolate(localFrame, [5, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1) })) * 15;

                return (
                  <div className="flex flex-col gap-2 z-10">
                    <span
                      style={{
                        opacity: subtitleOpacity * enterProgress,
                        transform: `translateY(${subtitleY + enterSubY}px)`,
                      }}
                      className="text-[#d4e157] text-[11px] font-extrabold tracking-widest uppercase"
                    >
                      Funcionalidades Inclusas
                    </span>
                    <h2
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        opacity: titleOpacity * enterProgress,
                        transform: `translateY(${titleY + enterTitleY}px)`,
                      }}
                      className="text-[30px] font-bold text-white tracking-tight leading-none"
                    >
                      Lojas rápidas e integradas
                    </h2>
                  </div>
                );
              })()}

              {/* Elemento Visual Central: Showcase Contínuo */}
              <div className="w-full flex-grow flex justify-center items-center my-6">
                <EcommerceShowcase />
              </div>

              <div className="h-10" /> {/* Spacer inferior */}
            </div>
          ) : (
            // Layout Quadrado (Feed)
            <div className="w-full max-w-[960px] px-8 flex items-center justify-between gap-12 text-left h-full">
              
              {/* Painel Esquerdo: Textos dinâmicos baseados no tempo */}
              <div className="w-[42%] flex flex-col justify-center h-full">
                
                {/* Texto da Cena 2 */}
                {frame >= scene2Start && frame < scene3Start && (() => {
                  const localFrame = frame - scene2Start;
                  const exitProgress = interpolate(localFrame, [scene2Duration - 20, scene2Duration], [0, 1], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp",
                    easing: Easing.bezier(0.25, 1, 0.5, 1),
                  });
                  const tagOpacity = interpolate(exitProgress, [0, 0.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const titleOpacity = interpolate(exitProgress, [0, 0.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const descOpacity = interpolate(exitProgress, [0.15, 0.75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const exitX = exitProgress * -20;
                  // Entrance with stagger
                  const enterTag = interpolate(localFrame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1) });
                  const enterTitle = interpolate(localFrame, [3, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1) });
                  const enterDesc = interpolate(localFrame, [8, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1) });

                  return (
                    <div className="flex flex-col gap-4">
                      <span
                        style={{ opacity: tagOpacity * enterTag, transform: `translateX(${exitX + (1 - enterTag) * -15}px)` }}
                        className="text-[#d4e157] text-[12px] font-extrabold tracking-widest uppercase"
                      >
                        Desenvolvimento Sob Medida
                      </span>
                      <h2
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", opacity: titleOpacity * enterTitle, transform: `translateX(${exitX + (1 - enterTitle) * -12}px)` }}
                        className="text-[42px] font-bold text-white tracking-tight leading-none"
                      >
                        Sua loja pronta de verdade
                      </h2>
                      <p
                        style={{ opacity: descOpacity * enterDesc, transform: `translateX(${exitX + (1 - enterDesc) * -10}px)` }}
                        className="text-neutral-400 text-[14px] leading-relaxed"
                      >
                        Criação de e-commerce completo com tecnologia de ponta, checkout seguro e otimização para vendas em semanas.
                      </p>
                    </div>
                  );
                })()}

                {/* Texto da Cena 3 */}
                {frame >= scene3Start && frame < scene4Start && (() => {
                  const localFrame = frame - scene3Start;
                  const exitProgress = interpolate(localFrame, [scene3Duration - 20, scene3Duration], [0, 1], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp",
                    easing: Easing.bezier(0.25, 1, 0.5, 1),
                  });
                  const tagOpacity = interpolate(exitProgress, [0, 0.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const titleOpacity = interpolate(exitProgress, [0, 0.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const descOpacity = interpolate(exitProgress, [0.15, 0.75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const exitX = exitProgress * -20;
                  // Entrance with stagger
                  const enterTag = interpolate(localFrame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1) });
                  const enterTitle = interpolate(localFrame, [3, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1) });
                  const enterDesc = interpolate(localFrame, [8, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1) });

                  return (
                    <div className="flex flex-col gap-4">
                      <span
                        style={{ opacity: tagOpacity * enterTag, transform: `translateX(${exitX + (1 - enterTag) * -15}px)` }}
                        className="text-[#d4e157] text-[12px] font-extrabold tracking-widest uppercase"
                      >
                        Tecnologia de Alta Conversão
                      </span>
                      <h2
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", opacity: titleOpacity * enterTitle, transform: `translateX(${exitX + (1 - enterTitle) * -12}px)` }}
                        className="text-[42px] font-bold text-white tracking-tight leading-none"
                      >
                        Completo e integrado
                      </h2>
                      <p
                        style={{ opacity: descOpacity * enterDesc, transform: `translateX(${exitX + (1 - enterDesc) * -10}px)` }}
                        className="text-neutral-400 text-[14px] leading-relaxed"
                      >
                        Lojas virtuais extremamente rápidas, integradas com meios de pagamento e preparadas para faturar alto.
                      </p>
                    </div>
                  );
                })()}

              </div>

              {/* Painel Direito: Showcase Contínuo */}
              <div className="w-[58%] h-full flex justify-center items-center">
                <EcommerceShowcase />
              </div>

            </div>
          )}

        </div>
      </Sequence>

      {/* SCENE 4: Outro / Call To Action (25.0s - 31.5s) */}
      <Sequence from={scene4Start} durationInFrames={scene4Duration}>
        <div style={getSceneStyle(scene4Start, scene4Duration, 0)}>
          <Outro delay={10} />
        </div>
      </Sequence>
    </div>
  );
};

