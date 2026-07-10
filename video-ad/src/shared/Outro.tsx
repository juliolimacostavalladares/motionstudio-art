import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const LIME = "#d4e157";

interface OutroProps {
  cta: string;
  metric?: string;
}

export const Outro: React.FC<OutroProps> = ({ cta, metric }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isV = width < height;

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const logoS = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 120 } });
  const metricS = spring({ frame: frame - 16, fps, config: { damping: 11, stiffness: 150, mass: 0.5 } });
  const ctaS = spring({ frame: frame - 26, fps, config: { damping: 14, stiffness: 130 } });
  const urlS = spring({ frame: frame - 38, fps, config: { damping: 16, stiffness: 110 } });

  // Pulsing arrow
  const arrowX = Math.sin(frame * 0.16) * 5;
  // Glow pulse on metric
  const metricGlow = metric ? (0.4 + 0.4 * Math.sin(frame * 0.14)) : 0;
  // Logo pulse
  const pulse = frame > 30 ? 1 + 0.03 * Math.sin((frame - 30) * 0.16) : 1;

  const logoSize = isV ? 72 : 60;

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center",
      opacity: fadeIn,
      padding: isV ? "0 52px" : "0 64px",
    }}>
      {/* Logo */}
      <div style={{
        transform: `scale(${Math.max(0, logoS) * pulse})`,
        opacity: Math.max(0, logoS),
        marginBottom: 14,
      }}>
        <svg width={logoSize} height={logoSize} viewBox="0 0 200 200" overflow="visible">
          <defs>
            <filter id="glow-outro">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <rect width="200" height="200" rx="48" fill="#111" stroke="#1e1e1e" strokeWidth="2" />
          <path
            d="M100 40C66.86 40 40 66.86 40 100C40 133.14 66.86 160 100 160H160V100C160 66.86 133.14 40 100 40Z"
            fill={LIME}
            style={{ filter: "url(#glow-outro)" }}
          />
          <circle cx="100" cy="100" r="26" fill="#111" />
        </svg>
      </div>

      {/* Brand */}
      <div style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: isV ? 28 : 24,
        letterSpacing: "-0.03em",
        color: "#f0f0f0",
        opacity: Math.max(0, logoS),
        marginBottom: metric ? 20 : 24,
      }}>
        Motion <span style={{ color: LIME }}>Studio</span>
      </div>

      {/* Metric — big hero number */}
      {metric && (
        <div style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: isV ? 52 : 60,
          letterSpacing: "-0.05em",
          color: LIME,
          opacity: Math.max(0, metricS),
          transform: `scale(${Math.max(0, metricS)})`,
          textShadow: `0 0 ${40 * metricGlow}px ${LIME}88`,
          lineHeight: 1,
          marginBottom: 16,
        }}>
          {metric}
        </div>
      )}

      {/* CTA */}
      <div style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 700,
        fontSize: isV ? 22 : 26,
        color: "#e8e8e8",
        opacity: Math.max(0, ctaS),
        transform: `translateY(${(1 - Math.max(0, ctaS)) * 18}px)`,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        maxWidth: isV ? 340 : 460,
        marginBottom: 18,
      }}>
        {cta}{" "}
        <span style={{
          color: LIME,
          display: "inline-block",
          transform: `translateX(${arrowX}px)`,
        }}>→</span>
      </div>

      {/* Divider */}
      <div style={{
        width: 40, height: 1.5,
        background: `linear-gradient(90deg, transparent, ${LIME}66, transparent)`,
        marginBottom: 14,
        opacity: Math.max(0, urlS),
      }} />

      {/* URL */}
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 600,
        fontSize: isV ? 14 : 13,
        color: "#3c3c3c",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        opacity: Math.max(0, urlS),
        transform: `translateY(${(1 - Math.max(0, urlS)) * 10}px)`,
      }}>
        motionstudio.art
      </div>
    </div>
  );
};
