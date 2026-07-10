import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface ServiceCardsProps {
  delay?: number;
}

export const ServiceCards: React.FC<ServiceCardsProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const services = [
    {
      title: "Web Apps",
      desc: "SaaS e plataformas web robustas e escaláveis.",
      icon: (
        <svg
          className="w-8 h-8 text-[#d4e157]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Mobile Apps",
      desc: "Experiências nativas fluidas para iOS e Android.",
      icon: (
        <svg
          className="w-8 h-8 text-[#d4e157]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "MVPs de Alto Impacto",
      desc: "Validação rápida de ideias no mercado.",
      icon: (
        <svg
          className="w-8 h-8 text-[#d4e157]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Consultoria Tech",
      desc: "Arquitetura e direcionamento para sua equipe.",
      icon: (
        <svg
          className="w-8 h-8 text-[#d4e157]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-[900px] px-8 flex flex-col justify-center items-center h-full">
      {/* Title that animations in first */}
      <h2 
        className="text-[32px] md:text-[40px] font-bold text-center mb-10 text-white font-sans tracking-tight"
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          opacity: spring({ frame: frame - delay, fps, config: { damping: 15 } }),
          transform: `translateY(${10 * (1 - spring({ frame: frame - delay, fps, config: { damping: 15 } }))}px)`,
        }}
      >
        O que nós <span className="text-[#d4e157]">construímos</span>:
      </h2>

      {/* Grid containing services */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {services.map((service, idx) => {
          const cardDelay = delay + 15 + idx * 10;
          const cardSpring = spring({
            frame: frame - cardDelay,
            fps,
            config: { mass: 0.8, damping: 14, stiffness: 100 },
          });

          return (
            <div
              key={idx}
              style={{
                transform: `scale(${cardSpring}) translateY(${(1 - cardSpring) * 30}px)`,
                opacity: cardSpring,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
              className="border border-white/5 bg-neutral-900/40 rounded-2xl p-6 text-left flex flex-col gap-3 backdrop-blur-md"
            >
              <div className="h-12 w-12 rounded-xl bg-[#d4e157]/10 flex items-center justify-center border border-[#d4e157]/20">
                {service.icon}
              </div>
              <div>
                <h3 
                  className="text-lg font-bold text-white mb-1 font-sans"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {service.title}
                </h3>
                <p 
                  className="text-[13px] text-neutral-400 leading-normal font-sans"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {service.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
