import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../../shared/brand";

export const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Parte 1 (pós-intro) dura 90 frames (3s)
  // Textura alternando a cada 25 frames
  // 0 - 25: Metálico
  // 25 - 50: Inflável
  // 50 - 75: Pelúcia (Rugoso)
  // 75 - 90: Reveal da logo + Texto "Motion Studio"

  // Animação de Zoom inicial
  // No início, fazemos closes abstratos com zoom alto
  const zoom = interpolate(frame, [0, 70, 90], [2.8, 2.2, 1.0], {
    extrapolateRight: "clamp",
  });

  const panX = interpolate(frame, [0, 25, 50, 75, 90], [40, -30, 20, 0, 0], {
    extrapolateRight: "clamp",
  });

  const panY = interpolate(frame, [0, 25, 50, 75, 90], [-20, 30, -10, 0, 0], {
    extrapolateRight: "clamp",
  });

  // Neon glow que corre pelas bordas
  const neonGlow = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [10, 35]
  );

  // Reveal da logo inteira no final da cena (a partir do frame 70)
  const revealSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const textRevealSpring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Determinar qual filtro aplicar baseado no frame
  let currentFilter = "";
  if (frame < 25) {
    currentFilter = "url(#metallic)";
  } else if (frame < 50) {
    currentFilter = "url(#inflated)";
  } else if (frame < 75) {
    currentFilter = "url(#plush)";
  }

  // Se estiver na fase de reveal final, não usamos mais o zoom/pan maluco e sim a mola final
  const isRevealPhase = frame >= 70;

  const currentZoom = isRevealPhase ? revealSpring : zoom;
  const currentPanX = isRevealPhase ? 0 : panX;
  const currentPanY = isRevealPhase ? 0 : panY;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#111111",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* SVG Filters definitions */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          {/* 1. Filtro Metálico */}
          <filter id="metallic" x="-20%" y="-20%" width="140%" height="140%">
            <feSpecularLighting
              specularConstant="1.5"
              specularExponent="28"
              lightingColor="#ffffff"
              result="specular"
            >
              <feDistantLight azimuth="225" elevation="55" />
            </feSpecularLighting>
            <feComposite
              in="SourceGraphic"
              in2="specular"
              operator="arithmetic"
              k1="0.6"
              k2="0.9"
              k3="0.4"
              k4="0"
              result="lit"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.1  0 1 0 0 0.1  0 0 1 0 0.1  0 0 0 1 0"
              in="lit"
            />
          </filter>

          {/* 2. Filtro Inflável */}
          <filter id="inflated" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feSpecularLighting
              in="blur"
              specularConstant="1.8"
              specularExponent="15"
              lightingColor="#ffffff"
              result="highlight"
            >
              <fePointLight x="100" y="80" z="80" />
            </feSpecularLighting>
            <feComposite
              in="SourceGraphic"
              in2="highlight"
              operator="arithmetic"
              k1="0.5"
              k2="1.0"
              k3="0.8"
              k4="0"
            />
          </filter>

          {/* 3. Filtro Pelúcia (Rugoso) usando SVG Turbulence */}
          <filter id="plush" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.07"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0.9 0 0 0  0 0 0.8 0 0  0 0 0 1 0"
              in="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* Container do Logo com Parallax / Zoom / Transições */}
      <div
        style={{
          transform: `scale(${currentZoom}) translate(${currentPanX}px, ${currentPanY}px)`,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transition: "filter 0.3s ease",
          position: "relative",
          zIndex: 2,
        }}
      >
        <svg
          width={width > height ? "280" : "320"}
          height={width > height ? "280" : "320"}
          viewBox="0 0 200 200"
          style={{
            overflow: "visible",
            filter: `drop-shadow(0 0 ${neonGlow}px rgba(212, 225, 87, 0.4))`,
          }}
        >
          {/* Placa de fundo da Logo */}
          <rect
            width="200"
            height="200"
            rx="44"
            fill="#111111"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2"
            style={{
              opacity: isRevealPhase ? revealSpring : 0.8,
            }}
          />

          {/* Forma Orgânica Lime do Motion Studio com texturas aplicadas */}
          <g
            style={{
              transform: isRevealPhase
                ? `scale(${revealSpring})`
                : "scale(1)",
              transformOrigin: "100px 100px",
            }}
          >
            <path
              d="M100 40C66.86 40 40 66.86 40 100C40 133.14 66.86 160 100 160H160V100C160 66.86 133.14 40 100 40Z"
              fill={BRAND.lime}
              filter={currentFilter}
            />
          </g>

          {/* Recorte circular no meio */}
          <circle
            cx="100"
            cy="100"
            r="25"
            fill="#111111"
            style={{
              opacity: isRevealPhase ? revealSpring : 0.9,
            }}
          />
        </svg>
      </div>

      {/* Texto de Apresentação (Motion Studio) */}
      {frame >= 75 && (
        <div
          style={{
            marginTop: "40px",
            opacity: textRevealSpring,
            transform: `translateY(${(1 - textRevealSpring) * 30}px) scale(${textRevealSpring})`,
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#ffffff",
              fontSize: "44px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              margin: 0,
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            }}
          >
            Motion Studio
          </h1>
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              color: BRAND.lime,
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: "8px",
            }}
          >
            Landing Pages Premium
          </p>
        </div>
      )}
    </div>
  );
};
export default BrandReveal;
