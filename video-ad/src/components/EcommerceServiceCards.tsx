import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface EcommerceServiceCardsProps {
  delay?: number;
}

export const EcommerceServiceCards: React.FC<EcommerceServiceCardsProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const services = [
    {
      title: "Checkout Transparente",
      desc: "Integração fluida, segura e otimizada para conversão.",
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Design Exclusivo",
      desc: "Interfaces premium e personalizadas para a sua marca.",
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Gestão Descomplicada",
      desc: "Painel administrativo intuitivo para controlar vendas.",
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: "Performance & Escala",
      desc: "Lojas extremamente rápidas preparadas para Black Friday.",
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
  ];

  return (
    <div className="w-full max-w-[900px] px-8 flex flex-col justify-center items-center h-full">
      {/* Title */}
      <h2 
        className="text-[32px] md:text-[40px] font-bold text-center mb-10 text-white font-sans tracking-tight"
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          opacity: spring({ frame: frame - delay, fps, config: { damping: 15 } }),
          transform: `translateY(${10 * (1 - spring({ frame: frame - delay, fps, config: { damping: 15 } }))}px)`,
        }}
      >
        Lojas completas e <span className="text-[#d4e157]">integradas</span>:
      </h2>

      {/* Grid */}
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
