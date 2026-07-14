import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../../shared/brand";

export const ProductDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame runs from 0 to 600 (physically 750 to 1350)
  // Sub-scenes:
  // 0 - 80: Browser window entry (slides up with spring)
  // 80 - 400: Live scroll & Cursor interaction on client's landing page
  // 400 - 600: Transition to "Success conversion analytics"

  // 1. Browser Window Entry
  const browserEntry = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const browserY = (1 - browserEntry) * 400;
  const browserScale = interpolate(browserEntry, [0, 1], [0.85, 1]);

  // 2. Landing Page Scroll inside browser
  // We scroll down from frame 100 to 350
  const scrollTop = interpolate(frame, [100, 350], [0, -260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Virtual Mouse Cursor Movement
  // We move the cursor from the bottom-right corner to the CTA button on the page
  // The CTA button is roughly in the center at Y: 120 (taking scroll into account)
  // Target position: X: 40, Y: 110 (relative to browser center)
  // Path starts at frame 120 and arrives at frame 380
  const mouseActive = frame >= 120 && frame <= 420;
  
  // Curved trajectory using math
  const mouseX = interpolate(frame, [120, 380], [200, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  // We add a slight wave to make the mouse look organic
  const mouseCurveY = Math.sin(interpolate(frame, [120, 380], [0, Math.PI])) * -50;
  const mouseY = interpolate(frame, [120, 380], [350, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) + mouseCurveY;

  // Hover state (active from frame 380 to 400)
  const isHovered = frame >= 380 && frame < 400;
  const hoverScale = spring({
    frame: frame - 380,
    fps,
    config: { damping: 10, stiffness: 150 },
  });
  const ctaButtonScale = isHovered ? interpolate(hoverScale, [0, 1], [1, 1.08]) : 1;

  // 4. Click animation (at frame 400)
  const isClicked = frame >= 400;
  
  const clickSpring = spring({
    frame: frame - 400,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  const pulseScale = interpolate(clickSpring, [0, 1], [0.5, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseOpacity = interpolate(clickSpring, [0, 0.8, 1], [1, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5. Success screen reveal (starts at frame 408)
  const successReveal = spring({
    frame: frame - 408,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // SVG drawing of checkmark
  const checkmarkOffset = interpolate(successReveal, [0, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      {/* Background abstract overlay grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at center, black 50%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 50%, transparent 95%)",
          opacity: 0.8,
        }}
      />

      {/* Volumetric glow on client page elements */}
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 75%)",
          top: "30%",
          left: "40%",
          filter: "blur(40px)",
        }}
      />

      {/* --- BROWSER CONTAINER --- */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "560px",
          backgroundColor: "#0d0e12",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "28px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transform: `translateY(${browserY}px) scale(${browserScale})`,
          boxShadow: "0 35px 70px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Browser Top Bar */}
        <div
          style={{
            backgroundColor: "#16171d",
            height: "44px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            justifyContent: "space-between",
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          {/* OS Buttons */}
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
          </div>
          {/* Address Bar */}
          <div
            style={{
              backgroundColor: "#0d0e12",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "10px",
              padding: "4px 20px",
              fontSize: "11px",
              color: BRAND.gray300,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 500,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>glowskin.co/skincare</span>
          </div>
          <div style={{ width: "42px" }} />
        </div>

        {/* Browser Content Frame */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#0d0e12",
          }}
        >
          {/* --- VIEW 1: THE REAL LANDING PAGE DESIGN --- */}
          {!isClicked && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${scrollTop}px)`,
                display: "flex",
                flexDirection: "column",
                padding: "24px 20px",
              }}
            >
              {/* Client Branding Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <span style={{ fontFamily: "serif", fontSize: "16px", fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>GlowSkin</span>
                <span style={{ fontSize: "10px", fontWeight: 600, color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", padding: "2px 8px", borderRadius: "20px" }}>100% Orgânico</span>
              </div>

              {/* Hero Copy */}
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.15em", textTransform: "uppercase" }}>Fórmula botânica natural</span>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "30px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.1,
                  margin: "8px 0 12px 0",
                  letterSpacing: "-0.02em",
                }}
              >
                Sua pele radiante de forma <span style={{ background: "linear-gradient(90deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>natural</span>.
              </h2>
              <p style={{ fontSize: "12px", color: BRAND.gray300, lineHeight: 1.4, margin: "0 0 24px 0" }}>
                Nutrição profunda e regeneração celular diária através de séruns purificados sem toxinas.
              </p>

              {/* Client CTA Button */}
              <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "40px" }}>
                <button
                  style={{
                    width: "100%",
                    height: "50px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
                    transform: `scale(${ctaButtonScale})`,
                    transition: "transform 0.1s ease",
                  }}
                >
                  Garantir Meu Sérum
                </button>
              </div>

              {/* Features Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "30px" }}>
                <div style={featureCardStyle}>
                  <span style={{ fontSize: "18px", marginBottom: "4px" }}>🌱</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>Ingredientes Puros</span>
                  <span style={{ fontSize: "9px", color: BRAND.gray500 }}>Diretamente da terra</span>
                </div>
                <div style={featureCardStyle}>
                  <span style={{ fontSize: "18px", marginBottom: "4px" }}>✨</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>Luminosidade</span>
                  <span style={{ fontSize: "9px", color: BRAND.gray500 }}>Brilho rejuvenescido</span>
                </div>
              </div>

              {/* Social Proof Review */}
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "16px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#fbbf24", fontSize: "12px", marginBottom: "6px" }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: "11px", color: BRAND.gray300, fontStyle: "italic", margin: 0 }}>
                  "Em apenas 2 semanas meu rosto ganhou um toque macio e viço que eu nunca tinha visto."
                </p>
                <span style={{ display: "block", fontSize: "9px", fontWeight: 700, color: BRAND.gray500, marginTop: "6px" }}>MARIANA R., SÃO PAULO</span>
              </div>
            </div>
          )}

          {/* --- VIEW 2: SUCCESS STATE / ANALYTICS (After Click) --- */}
          {isClicked && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                opacity: successReveal,
                transform: `scale(${interpolate(successReveal, [0, 1], [0.9, 1])})`,
              }}
            >
              {/* Checkmark circle */}
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(34, 197, 94, 0.12)",
                  border: "2.5px solid #22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  transform: `scale(${successReveal})`,
                  boxShadow: "0 0 20px rgba(34, 197, 94, 0.15)",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" strokeDasharray="100" strokeDashoffset={checkmarkOffset} />
                </svg>
              </div>

              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#fff",
                  margin: "0 0 6px 0",
                  textAlign: "center",
                }}
              >
                Conversão Concluída!
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: BRAND.gray300,
                  textAlign: "center",
                  margin: "0 0 30px 0",
                  maxWidth: "260px",
                }}
              >
                Landing page testada e validada com dados reais de usuários.
              </p>

              {/* Conversion metrics box */}
              <div
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "18px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: BRAND.gray300 }}>TAXA DE CONVERSÃO</span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#22c55e" }}>+94.6%</span>
                </div>
                <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <div style={{ width: "94.6%", height: "100%", backgroundColor: "#22c55e", borderRadius: "2px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: BRAND.gray300 }}>CUSTO POR LEAD (CPL)</span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#22c55e" }}>-38.2%</span>
                </div>
              </div>

              {/* Footer attribution */}
              <span
                style={{
                  marginTop: "30px",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: BRAND.gray500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Desenvolvido por Motion Studio
              </span>
            </div>
          )}

          {/* --- VIRTUAL MOUSE CURSOR --- */}
          {mouseActive && (
            <div
              style={{
                position: "absolute",
                left: `${mouseX}px`,
                top: `${mouseY}px`,
                transform: "translate(-8px, -4px)",
                zIndex: 100,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.45))",
                }}
              >
                <path
                  d="M8.2 2.2c-.4 0-.8.2-1 .6-.2.4-.2.8 0 1.2l10 24c.2.4.6.6 1 .6.4 0 .8-.2 1-.6l3.5-8.5 8.5-3.5c.4-.2.6-.6.6-1s-.2-.8-.6-1l-24-10c-.1-.1-.3-.2-.4-.2-.2 0-.4 0-.6.1z"
                  fill="white"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Click ripple waves */}
              {isClicked && frame < 420 && (
                <div
                  style={{
                    transform: `scale(${pulseScale})`,
                    opacity: pulseOpacity,
                    position: "absolute",
                    left: "-8px",
                    top: "-8px",
                  }}
                  className="w-8 h-8 rounded-full border-4 border-[#8b5cf6] bg-[#8b5cf6]/20"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Screen subtitle describing product result */}
      <div
        style={{
          position: "absolute",
          bottom: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          width: "90%",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            color: BRAND.white,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            padding: "8px 18px",
            borderRadius: "30px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            display: "inline-block",
          }}
        >
          {frame < 400 ? "Navegação real e fluxo intuitivo" : "Conversões validadas na prática"}
        </span>
      </div>
    </div>
  );
};

const featureCardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.01)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "12px",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};
