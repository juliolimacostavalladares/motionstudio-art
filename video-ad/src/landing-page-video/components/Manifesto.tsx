import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../../shared/brand";

export const Manifesto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frames for this scene (total 450 frames: from 300 to 750)
  // Sub-scenes:
  // 0 - 200: Color Palette
  // 200 - 330: Kinetic Typography / Manifesto
  // 330 - 450: Typographic Split Screen (Bricolage vs Sora)

  // 1. Color Palette Animation
  const colors = [
    { name: "Lime", hex: BRAND.lime, textHex: "#111111" },
    { name: "Neutral 950", hex: "#171717", textHex: "#ffffff" },
    { name: "Black", hex: BRAND.black2, textHex: BRAND.lime },
    { name: "White", hex: BRAND.white, textHex: "#111111" },
    { name: "Gray 700", hex: BRAND.gray700, textHex: "#ffffff" },
  ];

  // 2. Typographic Split Screen Springs
  const splitEntrance = spring({
    frame: frame - 335,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BRAND.black,
        color: "#ffffff",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* --- SUB-SCENE 1: Color Palette (0 - 200) --- */}
      {frame < 200 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "0 40px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "36px",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "10px",
              letterSpacing: "-0.03em",
              textAlign: "center",
              transform: `translateY(${interpolate(frame, [0, 30], [20, 0], { extrapolateRight: "clamp" })}px)`,
              opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            Nossa Identidade
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: BRAND.gray300,
              marginBottom: "40px",
              textAlign: "center",
              transform: `translateY(${interpolate(frame, [5, 35], [20, 0], { extrapolateRight: "clamp" })}px)`,
              opacity: interpolate(frame, [5, 35], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            Cores curadas para converter e impressionar.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "12px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            {colors.map((color, index) => {
              // Staggered springs for each card
              const cardSpring = spring({
                frame: frame - (15 + index * 10),
                fps,
                config: { damping: 12, stiffness: 100 },
              });

              const opacity = cardSpring;
              const translateX = (1 - cardSpring) * 100;

              return (
                <div
                  key={color.name}
                  style={{
                    backgroundColor: color.hex,
                    color: color.textHex,
                    padding: "20px 24px",
                    borderRadius: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 700,
                    opacity,
                    transform: `translateX(${translateX}px)`,
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{color.name}</span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                      opacity: 0.8,
                    }}
                  >
                    {color.hex.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SUB-SCENE 2: Kinetic Typography / Manifesto (200 - 330) --- */}
      {frame >= 200 && frame < 330 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "0 30px",
            textAlign: "center",
            backgroundColor: frame % 15 < 2 ? BRAND.lime : BRAND.black,
            color: frame % 15 < 2 ? BRAND.black : "#ffffff",
          }}
        >
          {frame < 265 ? (
            <div key="text1">
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "44px",
                  fontWeight: 800,
                  display: "block",
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  transform: `scale(${spring({ frame: frame - 200, fps, config: { damping: 10, stiffness: 120 } })})`,
                }}
              >
                Sua landing page
              </span>
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "56px",
                  fontWeight: 800,
                  color: frame % 15 < 2 ? BRAND.black : BRAND.lime,
                  display: "block",
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  marginTop: "10px",
                  transform: `scale(${spring({ frame: frame - 215, fps, config: { damping: 10, stiffness: 120 } })})`,
                }}
              >
                premium
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 400,
                  display: "block",
                  color: BRAND.gray300,
                  marginTop: "20px",
                  transform: `translateY(${interpolate(frame - 200, [0, 30], [20, 0], { extrapolateRight: "clamp" })}px)`,
                  opacity: interpolate(frame - 200, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
                }}
              >
                entregue em semanas.
              </span>
            </div>
          ) : (
            <div key="text2">
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "48px",
                  fontWeight: 800,
                  display: "block",
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  transform: `scale(${spring({ frame: frame - 265, fps, config: { damping: 10, stiffness: 120 } })})`,
                }}
              >
                Design exclusivo.
              </span>
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "56px",
                  fontWeight: 800,
                  color: frame % 15 < 2 ? BRAND.black : BRAND.lime,
                  display: "block",
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  marginTop: "15px",
                  transform: `scale(${spring({ frame: frame - 280, fps, config: { damping: 10, stiffness: 120 } })})`,
                }}
              >
                Conversão Máxima.
              </span>
            </div>
          )}
        </div>
      )}

      {/* --- SUB-SCENE 3: Typographic Split Screen (330 - 450) --- */}
      {frame >= 330 && (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* Lado Esquerdo - Preto */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#111111",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              transform: `translateX(${(1 - splitEntrance) * -100}%)`,
              opacity: splitEntrance,
            }}
          >
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "120px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              Aa
            </span>
            <span
              style={{
                marginTop: "20px",
                fontSize: "13px",
                fontWeight: 600,
                color: BRAND.gray300,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Bricolage
            </span>
            <span style={{ fontSize: "11px", color: BRAND.gray500 }}>
              (Títulos Fortes)
            </span>
          </div>

          {/* Lado Direito - Branco */}
          <div
            style={{
              flex: 1,
              backgroundColor: BRAND.white,
              color: "#111111",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transform: `translateX(${(1 - splitEntrance) * 100}%)`,
              opacity: splitEntrance,
            }}
          >
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "120px",
                fontWeight: 300,
                color: "#111111",
                lineHeight: 1,
              }}
            >
              Aa
            </span>
            <span
              style={{
                marginTop: "20px",
                fontSize: "13px",
                fontWeight: 600,
                color: BRAND.gray700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Sora
            </span>
            <span style={{ fontSize: "11px", color: BRAND.gray500 }}>
              (Leitura Fluida)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
