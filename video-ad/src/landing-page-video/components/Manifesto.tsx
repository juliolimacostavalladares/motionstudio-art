import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../../shared/brand";

export const Manifesto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frames for this scene (total 360 frames: from 230 to 590)
  // Sub-scenes:
  // 0 - 220: Kinetic Typography / Manifesto (without color palette)
  // 220 - 360: Typographic Split Screen (Bricolage vs Sora)

  // Typographic Split Screen Springs
  const splitEntrance = spring({
    frame: frame - 225,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        color: "#ffffff",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* --- SUB-SCENE 1: Kinetic Typography / Manifesto (0 - 220) --- */}
      {frame < 220 && (
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
            backgroundColor: "transparent",
            color: "#ffffff",
          }}
        >
          {frame < 110 ? (
            <div key="text1">
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "44px",
                  fontWeight: 800,
                  display: "block",
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  transform: `scale(${spring({ frame, fps, config: { damping: 10, stiffness: 120 } })})`,
                }}
              >
                Criamos sua
              </span>
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "56px",
                  fontWeight: 800,
                  color: BRAND.lime,
                  display: "block",
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  marginTop: "10px",
                  transform: `scale(${spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 120 } })})`,
                }}
              >
                landing page
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 400,
                  display: "block",
                  color: BRAND.gray300,
                  marginTop: "20px",
                  transform: `translateY(${interpolate(frame, [0, 30], [20, 0], { extrapolateRight: "clamp" })}px)`,
                  opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
                }}
              >
                focada em alta conversão.
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
                  transform: `scale(${spring({ frame: frame - 110, fps, config: { damping: 10, stiffness: 120 } })})`,
                }}
              >
                Design autoral.
              </span>
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "56px",
                  fontWeight: 800,
                  color: BRAND.lime,
                  display: "block",
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  marginTop: "15px",
                  transform: `scale(${spring({ frame: frame - 125, fps, config: { damping: 10, stiffness: 120 } })})`,
                }}
              >
                Código premium.
              </span>
            </div>
          )}
        </div>
      )}

      {/* --- SUB-SCENE 2: Typographic Split Screen (220 - 360) --- */}
      {frame >= 220 && (
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
