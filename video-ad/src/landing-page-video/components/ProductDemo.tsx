import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../../shared/brand";

export const ProductDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame runs from 0 to 600 (physically 750 to 1350)
  // Sub-scenes:
  // 0 - 300: Scrolling UI Grid (vertical scrolling with speed interpolate)
  // 300 - 600: Zoom highlight on 3D Floating Checkout Card with SVG graph animation

  // Grid scrolling interpolation
  const gridY = interpolate(frame, [0, 300], [0, -320], {
    extrapolateRight: "clamp",
  });

  const gridScale = interpolate(frame, [0, 20, 280, 300], [0.8, 1, 1, 0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gridOpacity = interpolate(frame, [0, 20, 280, 300], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card highlight springs (starts at local frame 300)
  const cardEntrance = spring({
    frame: frame - 300,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const graphEntrance = spring({
    frame: frame - 330,
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  const buttonEntrance = spring({
    frame: frame - 360,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  // 3D Perspective Rotation
  const rotateX = interpolate(frame, [300, 600], [18, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotateY = interpolate(frame, [300, 600], [-25, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SVG Line Animation
  // strokeDashoffset goes from 300 (hidden) to 0 (fully drawn)
  const strokeOffset = interpolate(graphEntrance, [0, 1], [300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Button glow animation
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [5, 20]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BRAND.black,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 30px",
      }}
    >
      {/* Background abstract elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 225, 87, 0.05) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* --- SCENE 1: SCROLLING GRID (0 - 300) --- */}
      {frame < 300 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            opacity: gridOpacity,
            transform: `scale(${gridScale}) translateY(${gridY}px)`,
            paddingTop: "60px",
          }}
        >
          {/* Card Mockup 1 */}
          <div style={mockupStyle}>
            <div style={headerStyle}>
              <div style={dotsStyle} />
              <span style={titleStyle}>Métricas de Conversão</span>
            </div>
            <div style={contentStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                <span style={{ fontSize: "28px", fontWeight: 800, color: BRAND.lime }}>+142%</span>
                <span style={{ fontSize: "11px", color: BRAND.gray300 }}>LEADS GERADOS</span>
              </div>
              <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                <div style={{ width: "78%", height: "100%", backgroundColor: BRAND.lime, borderRadius: "2px" }} />
              </div>
            </div>
          </div>

          {/* Card Mockup 2 */}
          <div style={mockupStyle}>
            <div style={headerStyle}>
              <div style={dotsStyle} />
              <span style={titleStyle}>Landing Page SaaS</span>
            </div>
            <div style={{ ...contentStyle, padding: "16px" }}>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
                O próximo nível para seu negócio.
              </div>
              <p style={{ fontSize: "11px", color: BRAND.gray300, margin: 0, lineHeight: 1.4 }}>
                Design autoral construído para obter os melhores resultados do seu tráfego pago.
              </p>
              <div style={{ display: "flex", gap: "6px", marginTop: "14px" }}>
                <div style={{ flex: 1, height: "24px", borderRadius: "6px", backgroundColor: BRAND.lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: BRAND.black2 }}>Começar Agora</div>
                <div style={{ flex: 1, height: "24px", borderRadius: "6px", backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 600 }}>Saiba Mais</div>
              </div>
            </div>
          </div>

          {/* Card Mockup 3 */}
          <div style={mockupStyle}>
            <div style={headerStyle}>
              <div style={dotsStyle} />
              <span style={titleStyle}>Checkout de Alta Conversão</span>
            </div>
            <div style={contentStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "#1c1c1e", border: "1px solid rgba(255,255,255,0.05)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: 700 }}>Ebook Premium</div>
                  <div style={{ fontSize: "10px", color: BRAND.gray300 }}>R$ 47,00</div>
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: BRAND.lime, backgroundColor: "rgba(212,225,87,0.1)", padding: "4px 8px", borderRadius: "6px" }}>1-Click</div>
              </div>
            </div>
          </div>

          {/* Card Mockup 4 */}
          <div style={mockupStyle}>
            <div style={headerStyle}>
              <div style={dotsStyle} />
              <span style={titleStyle}>Performance & SEO</span>
            </div>
            <div style={contentStyle}>
              <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: BRAND.white }}>99/100</div>
                  <div style={{ fontSize: "9px", color: BRAND.gray300, textTransform: "uppercase" }}>Mobile speed score</div>
                </div>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: BRAND.lime }} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: BRAND.lime }}>Excelente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SCENE 2: 3D CARD ZOOM HIGHLIGHT (300 - 600) --- */}
      {frame >= 300 && (
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            opacity: cardEntrance,
            transform: `scale(${interpolate(cardEntrance, [0, 1], [0.6, 1.0])}) translateY(${(1 - cardEntrance) * 100}px)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* 3D Wrapper */}
          <div
            style={{
              width: "100%",
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformOrigin: "center center",
              backgroundColor: "rgba(17, 17, 17, 0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "28px",
              padding: "24px",
              boxShadow: `
                0 30px 60px rgba(0, 0, 0, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                0 0 50px rgba(212, 225, 87, 0.03)
              `,
            }}
          >
            {/* Header window */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                paddingBottom: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: BRAND.gray300,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                checkout.motionstudio.art
              </span>
              <div style={{ width: "42px" }} />
            </div>

            {/* Product details */}
            <div style={{ marginBottom: "20px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: BRAND.lime,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Resumo do Pedido
              </span>
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "24px",
                  fontWeight: 800,
                  margin: 0,
                  color: "#ffffff",
                }}
              >
                Landing Page Premium
              </h3>
              <p style={{ fontSize: "13px", color: BRAND.gray300, marginTop: "4px", marginBottom: 0 }}>
                Projeto personalizado e de alta conversão.
              </p>
            </div>

            {/* Price list */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.04)",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "24px",
                transform: `translateY(${(1 - graphEntrance) * 20}px)`,
                opacity: graphEntrance,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ color: BRAND.gray300 }}>Desenho Estrutural</span>
                <span>R$ 0,00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ color: BRAND.gray300 }}>Copywriting Persuasivo</span>
                <span>Incluso</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ color: BRAND.gray300 }}>Desenvolvimento Remotion/React</span>
                <span>Incluso</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span>Taxa de Conversão</span>
                <span style={{ color: BRAND.lime }}>+84.7% média</span>
              </div>
            </div>

            {/* SVG Conversion graph climbing */}
            <div
              style={{
                height: "80px",
                width: "100%",
                position: "relative",
                marginBottom: "24px",
                opacity: graphEntrance,
                transform: `translateY(${(1 - graphEntrance) * 15}px)`,
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 300 80"
                style={{ overflow: "visible" }}
              >
                {/* SVG path of the graph */}
                <path
                  d="M 10 70 Q 70 60 110 40 T 210 20 T 290 8"
                  fill="none"
                  stroke={BRAND.lime}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="300"
                  strokeDashoffset={strokeOffset}
                  style={{
                    filter: "drop-shadow(0 4px 10px rgba(212, 225, 87, 0.4))",
                  }}
                />
                {/* Dots along the path */}
                {graphEntrance > 0.9 && (
                  <>
                    <circle cx="290" cy="8" r="5" fill="#ffffff" />
                    <circle
                      cx="290"
                      cy="8"
                      r="12"
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.4)"
                      strokeWidth="2"
                      style={{
                        animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                      }}
                    />
                  </>
                )}
                {/* Grid guidelines */}
                <line x1="10" y1="70" x2="290" y2="70" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="10" y1="40" x2="290" y2="40" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="10" y1="10" x2="290" y2="10" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "0px",
                  fontSize: "10px",
                  fontWeight: 700,
                  backgroundColor: BRAND.lime,
                  color: BRAND.black,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  opacity: graphEntrance,
                }}
              >
                Lead Peak
              </span>
            </div>

            {/* Neon lime button */}
            <div
              style={{
                width: "100%",
                opacity: buttonEntrance,
                transform: `scale(${buttonEntrance}) translateY(${(1 - buttonEntrance) * 15}px)`,
              }}
            >
              <button
                style={{
                  width: "100%",
                  height: "54px",
                  borderRadius: "14px",
                  backgroundColor: BRAND.lime,
                  border: "none",
                  fontSize: "15px",
                  fontWeight: 800,
                  color: BRAND.black2,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  boxShadow: `0 0 ${glowIntensity}px rgba(212, 225, 87, 0.45)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>Garantir Minha Landing Page</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// CSS styles
const mockupStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "360px",
  backgroundColor: "#171717",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: "16px",
  marginBottom: "16px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const dotsStyle: React.CSSProperties = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  boxShadow: "10px 0 0 rgba(255, 255, 255, 0.15), 20px 0 0 rgba(255, 255, 255, 0.15)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  color: BRAND.gray300,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginLeft: "24px",
};

const contentStyle: React.CSSProperties = {
  padding: "14px 18px",
};
