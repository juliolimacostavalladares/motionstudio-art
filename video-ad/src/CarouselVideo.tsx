import React from "react";
import {
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { Claude, OpenAI } from "@lobehub/icons";
import { Logo } from "./components/Logo";

// ─── Constants ───────────────────────────────────────────────────────────────

const LIME = "#d4e157";
const DARK = "#070707";
const SLIDE_DURATION = 90; // 3 seconds per slide

// ─── Global Design Layout Frame (Catalog Style) ──────────────────────────────

const CarouselFrame: React.FC<{ slideIndex: number; totalSlides: number }> = ({
  slideIndex,
  totalSlides,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: "32px 24px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        pointerEvents: "none",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "12px 16px",
      }}
    >
      {/* Top Header metadata */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "monospace",
          fontSize: "9px",
          color: "rgba(255, 255, 255, 0.35)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
          paddingBottom: "8px",
          width: "100%",
        }}
      >
        <div>©2026 MOTION STUDIO</div>
        <div style={{ color: `${LIME}99` }}>SYSTEM: MULTI-SLIDE</div>
        <div>CAMADA 01</div>
      </div>

      {/* Bottom Footer metadata */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "monospace",
          fontSize: "9px",
          color: "rgba(255, 255, 255, 0.35)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          borderTop: "1px solid rgba(255, 255, 255, 0.03)",
          paddingTop: "8px",
          width: "100%",
        }}
      >
        <div>SOFTWARE HOUSE DE ELITE</div>
        <div style={{ color: LIME, fontWeight: "bold" }}>
          0{slideIndex + 1} / 0{totalSlides}
        </div>
      </div>
    </div>
  );
};

// ─── Slide 1: Cover ─────────────────────────────────────────────────────────

const SlideCover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const subSpring = spring({ frame: frame - 20, fps, config: { damping: 15 } });
  const floatOffset = Math.sin(frame * 0.06) * 10;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: DARK,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
        textAlign: "center",
      }}
    >
      {/* Structural Label */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: LIME,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        GUIA DE ENGENHARIA SAAS
      </div>

      {/* Massive Accent Banner */}
      <div
        style={{
          background: "linear-gradient(90deg, rgba(212,225,87,0.1), rgba(212,225,87,0.02))",
          borderLeft: `4px solid ${LIME}`,
          padding: "16px 24px",
          borderRadius: "0 16px 16px 0",
          marginBottom: "24px",
          transform: `scale(${titleSpring})`,
          opacity: titleSpring,
          width: "100%",
          maxWidth: "480px",
          textAlign: "left",
        }}
      >
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: "28px",
            lineHeight: 1.15,
            color: "#fff",
            textTransform: "uppercase",
          }}
        >
          5 Regras de Código <br />
          Para Escalar seu <span style={{ color: LIME }}>SaaS de IA</span>
        </h1>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "14px",
          color: "#8a8a8a",
          lineHeight: 1.6,
          maxWidth: "440px",
          marginBottom: "40px",
          opacity: subSpring,
          transform: `translateY(${(1 - subSpring) * 15}px)`,
        }}
      >
        O segredo que as agências de wrappers genéricos de R$ 27 não te contam sobre infraestrutura real.
      </p>

      {/* Interactive Floating elements */}
      <div
        style={{
          display: "flex",
          gap: "28px",
          alignItems: "center",
          transform: `translateY(${floatOffset}px)`,
          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
        }}
      >
        <Claude.Color size={44} />
        <Logo size={60} />
        <OpenAI size={44} />
      </div>

      <div
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          color: "rgba(255,255,255,0.2)",
          marginTop: "30px",
        }}
      >
        Arraste para o lado →
      </div>
    </div>
  );
};

// ─── Slide Layout Template ───────────────────────────────────────────────────

interface SlideTemplateProps {
  number: string;
  title: string;
  boldText: string;
  normalText: string;
  children?: React.ReactNode;
}

const SlideTemplate: React.FC<SlideTemplateProps> = ({
  number,
  title,
  boldText,
  normalText,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({ frame, fps, config: { damping: 15 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: DARK,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 48px",
        textAlign: "left",
      }}
    >
      {/* Top Tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
          opacity: anim,
          transform: `translateY(${(1 - anim) * -15}px)`,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: "bold",
            color: "#000",
            background: LIME,
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          {number}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          ENGENHARIA DE SAAS
        </span>
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: "24px",
          color: "#fff",
          marginBottom: "20px",
          lineHeight: 1.25,
          opacity: anim,
          transform: `translateY(${(1 - anim) * -10}px)`,
        }}
      >
        {title}
      </h2>

      {/* Main explanation card */}
      <div
        style={{
          background: "rgba(255,255,255,0.015)",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
          opacity: anim,
          transform: `scale(${0.95 + 0.05 * anim})`,
        }}
      >
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "13.5px",
            color: "#c0c0c0",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: LIME }}>{boldText} </strong>
          {normalText}
        </p>
      </div>

      {/* Custom Graphic Slot */}
      <div
        style={{
          width: "100%",
          height: "140px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: anim,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ─── Slide 2: Redis Cache ────────────────────────────────────────────────────

const SlideRedis: React.FC = () => {
  return (
    <SlideTemplate
      number="01"
      title="Não chame a API da OpenAI de forma direta e repetida"
      boldText="Implemente cache inteligente de prompts."
      normalText="Perguntas idênticas não precisam queimar créditos da API. Use Redis para interceptar requisições repetidas e reduza seus custos de tokens em até 70%."
    >
      {/* Code window mock */}
      <div
        style={{
          background: "rgba(10,10,10,0.85)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "12px 16px",
          width: "100%",
          maxWidth: "400px",
          fontFamily: "monospace",
          fontSize: "10px",
          textAlign: "left",
          color: "#e2e8f0",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ color: "#48bb78", marginBottom: "4px" }}>{`// Redis Cache Interceptor`}</div>
        <div>
          <span style={{ color: "#d69e2e" }}>const</span> cachedResponse ={" "}
          <span style={{ color: "#3182ce" }}>await</span> redis.get(promptKey);
        </div>
        <div style={{ margin: "3px 0" }}>
          <span style={{ color: "#d69e2e" }}>if</span> (cachedResponse){" "}
          <span style={{ color: "#d4e157" }}>return</span> JSON.parse(cachedResponse);
        </div>
        <div>
          <span style={{ color: "#48bb78" }}>{`// Se cache miss, chama LLM...`}</span>
        </div>
      </div>
    </SlideTemplate>
  );
};

// ─── Slide 3: Background Jobs ────────────────────────────────────────────────

const SlideQueue: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame * 0.15) % 3;

  return (
    <SlideTemplate
      number="02"
      title="Desassocie tarefas pesadas da Request HTTP"
      boldText="Use filas em background (BullMQ)."
      normalText="Processar geração de áudio, vídeo ou RAG pesado no endpoint principal derruba seu servidor. Devolva um status 202 imediatamente e processe na fila com workers dedicados."
    >
      {/* Structured queue visualizer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255,255,255,0.01)",
          border: "1px solid rgba(255,255,255,0.03)",
          borderRadius: "12px",
          padding: "16px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "10px",
            background: step === 0 ? "rgba(212,225,87,0.1)" : "transparent",
            borderColor: step === 0 ? LIME : "rgba(255,255,255,0.08)",
            color: step === 0 ? LIME : "#aaa",
          }}
        >
          HTTP Request
        </div>
        <div style={{ color: LIME }}>→</div>
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "10px",
            background: step === 1 ? "rgba(212,225,87,0.1)" : "transparent",
            borderColor: step === 1 ? LIME : "rgba(255,255,255,0.08)",
            color: step === 1 ? LIME : "#aaa",
          }}
        >
          Redis Queue
        </div>
        <div style={{ color: LIME }}>→</div>
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "10px",
            background: step === 2 ? "rgba(212,225,87,0.1)" : "transparent",
            borderColor: step === 2 ? LIME : "rgba(255,255,255,0.08)",
            color: step === 2 ? LIME : "#aaa",
          }}
        >
          Worker Process
        </div>
      </div>
    </SlideTemplate>
  );
};

// ─── Slide 4: Multi-LLM Fallback ─────────────────────────────────────────────

const SlideFallback: React.FC = () => {
  return (
    <SlideTemplate
      number="03"
      title="Crie redundância automática de provedores"
      boldText="Não dependa de uma única API de IA."
      normalText="A API da OpenAI cai. O Claude oscila. Monte rotas de fallback em seu servidor: caso a chamada principal lance timeout, o fluxo chaveia instantaneamente para outro provedor."
    >
      {/* Fallback mock display */}
      <div
        style={{
          background: "rgba(10,10,10,0.85)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "12px 16px",
          width: "100%",
          maxWidth: "400px",
          fontFamily: "monospace",
          fontSize: "9.5px",
          textAlign: "left",
          color: "#e2e8f0",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div>
          <span style={{ color: "#d69e2e" }}>try</span> {`{`}
        </div>
        <div style={{ textIndent: "15px" }}>
          <span style={{ color: "#3182ce" }}>return await</span> callOpenAI();
        </div>
        <div>
          {`}`} <span style={{ color: "#d69e2e" }}>catch</span> (err) {`{`}
        </div>
        <div style={{ textIndent: "15px", color: LIME }}>
          <span style={{ color: "#48bb78" }}>// Fallback instantâneo</span>
        </div>
        <div style={{ textIndent: "15px" }}>
          <span style={{ color: "#3182ce" }}>return await</span> callAnthropicClaude();
        </div>
        <div>{`}`}</div>
      </div>
    </SlideTemplate>
  );
};

// ─── Slide 5: Streaming UX ───────────────────────────────────────────────────

const SlideStreaming: React.FC = () => {
  const frame = useCurrentFrame();
  const text = "A engenharia do seu SaaS determina o sucesso do seu produto digital...";
  const chars = Math.min(text.length, Math.floor(frame * 0.45));

  return (
    <SlideTemplate
      number="04"
      title="Aguardar 10 segundos destrói sua taxa de retenção"
      boldText="Implemente Server-Sent Events (SSE)."
      normalText="Ver uma tela de loading estática frustra seu usuário. Transmita as respostas da IA palavra por palavra, trazendo percepção de velocidade imediata ao produto."
    >
      {/* Streaming simulator box */}
      <div
        style={{
          border: "1px solid rgba(212,225,87,0.2)",
          borderRadius: "12px",
          background: "rgba(5,5,5,0.9)",
          padding: "16px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontSize: "8px",
            color: LIME,
            fontFamily: "monospace",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}
        >
          • STREAMING ACTIVE
        </div>
        <div
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "12px",
            color: "#e0e0e0",
            lineHeight: 1.5,
            minHeight: "40px",
          }}
        >
          {text.substring(0, chars)}
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "12px",
              background: LIME,
              marginLeft: "2px",
            }}
          />
        </div>
      </div>
    </SlideTemplate>
  );
};

// ─── Slide 6: Vector Database ────────────────────────────────────────────────

const SlideVector: React.FC = () => {
  return (
    <SlideTemplate
      number="05"
      title="Pare de contratar serviços vetoriais caros à toa"
      boldText="Use pgvector local ou Qdrant."
      normalText="Para a maioria dos RAGs e buscas semânticas internas, você não precisa de serviços externos milionários. Instale a extensão pgvector no seu Postgres ou use Qdrant localmente."
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            flex: 1,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px",
            padding: "12px",
            background: "rgba(255,255,255,0.01)",
            textAlign: "center",
          }}
        >
          <div style={{ color: LIME, fontSize: "16px", fontWeight: "bold", marginBottom: "4px" }}>PostgreSQL</div>
          <div style={{ fontSize: "9px", color: "#888" }}>+ pgvector Extension</div>
        </div>
        <div
          style={{
            flex: 1,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px",
            padding: "12px",
            background: "rgba(255,255,255,0.01)",
            textAlign: "center",
          }}
        >
          <div style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", marginBottom: "4px" }}>Qdrant</div>
          <div style={{ fontSize: "9px", color: "#888" }}>Local Vector DB Docker</div>
        </div>
      </div>
    </SlideTemplate>
  );
};

// ─── Slide 7: CTA Outro ───────────────────────────────────────────────────────

const SlideCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 12 } });
  const textSpring = spring({ frame: frame - 15, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: DARK,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
        textAlign: "center",
      }}
    >
      {/* Animated logo mark */}
      <div
        style={{
          transform: `scale(${logoSpring})`,
          opacity: logoSpring,
          marginBottom: "20px",
        }}
      >
        <Logo size={90} />
      </div>

      {/* Brand Name */}
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: "26px",
          color: "#fff",
          marginBottom: "12px",
        }}
      >
        Motion <span style={{ color: LIME }}>Studio</span>
      </h2>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 700,
          fontSize: "20px",
          color: LIME,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: "16px",
          opacity: textSpring,
        }}
      >
        Quer construir um SaaS de elite?
      </h3>

      {/* Body */}
      <p
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "13px",
          color: "#8a8a8a",
          lineHeight: 1.6,
          maxWidth: "400px",
          marginBottom: "32px",
          opacity: textSpring,
        }}
      >
        Desenvolvemos a infraestrutura, integrações de IA e arquitetura customizada do seu produto digital em tempo recorde.
      </p>

      {/* CTA Button */}
      <div
        style={{
          background: LIME,
          color: "#000",
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          fontSize: "14px",
          padding: "12px 28px",
          borderRadius: "8px",
          boxShadow: `0 8px 24px ${LIME}33`,
          opacity: textSpring,
          transform: `translateY(${(1 - textSpring) * 15}px)`,
        }}
      >
        Falar com os especialistas →
      </div>

      <div
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          color: "rgba(255,255,255,0.3)",
          marginTop: "24px",
          letterSpacing: "0.1em",
        }}
      >
        MOTIONSTUDIO.ART
      </div>
    </div>
  );
};

// ─── Main Carousel Export ────────────────────────────────────────────────────

export const CarouselVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const activeSlide = Math.floor(frame / SLIDE_DURATION);
  const totalSlides = 7;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: DARK,
        overflow: "hidden",
      }}
    >
      {/* Global Design perimeter layout frame */}
      <CarouselFrame slideIndex={activeSlide} totalSlides={totalSlides} />

      {/* Grid overlay aesthetics */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      {/* Slide Sequences */}
      <Sequence from={0} durationInFrames={SLIDE_DURATION}>
        <SlideCover />
      </Sequence>

      <Sequence from={SLIDE_DURATION * 1} durationInFrames={SLIDE_DURATION}>
        <SlideRedis />
      </Sequence>

      <Sequence from={SLIDE_DURATION * 2} durationInFrames={SLIDE_DURATION}>
        <SlideQueue />
      </Sequence>

      <Sequence from={SLIDE_DURATION * 3} durationInFrames={SLIDE_DURATION}>
        <SlideFallback />
      </Sequence>

      <Sequence from={SLIDE_DURATION * 4} durationInFrames={SLIDE_DURATION}>
        <SlideStreaming />
      </Sequence>

      <Sequence from={SLIDE_DURATION * 5} durationInFrames={SLIDE_DURATION}>
        <SlideVector />
      </Sequence>

      <Sequence from={SLIDE_DURATION * 6} durationInFrames={SLIDE_DURATION}>
        <SlideCTA />
      </Sequence>
    </div>
  );
};
