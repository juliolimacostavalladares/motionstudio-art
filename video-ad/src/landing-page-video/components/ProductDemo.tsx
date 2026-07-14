import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../../shared/brand";

export const ProductDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local timeline: 0 to 690 frames (physically 610 to 1300)
  // Scenes timeline:
  // 0 - 170: LP 1 - Ranty (Architecture)
  //   - Transition 1 (150 - 180): Slider rotation
  // 170 - 340: LP 2 - Liquid Brokers (FinTech)
  //   - Transition 2 (320 - 350): Zoom in/out depth
  // 340 - 510: LP 3 - ChronoTask (Productivity)
  //   - Transition 3 (490 - 520): Diagonal Lime Wipe
  // 510 - 690: LP 4 - Redacted (Analytics)

  // Constant slow 3D camera hover effect
  const hoverRotateX = Math.sin(frame * 0.02) * 2.5;
  const hoverRotateY = Math.cos(frame * 0.015) * 3.5;
  const hoverScale = 1 + Math.sin(frame * 0.01) * 0.015;

  // Track active scene and local frames
  let activeScene = 1;
  if (frame >= 170 && frame < 340) activeScene = 2;
  else if (frame >= 340 && frame < 510) activeScene = 3;
  else if (frame >= 510) activeScene = 4;

  // Define transition progresses
  // Transition 1 (Ranty to Liquid Brokers)
  const t1Spring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Transition 2 (Liquid Brokers to ChronoTask)
  const t2Spring = spring({
    frame: frame - 320,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  // Transition 3 (ChronoTask to Redacted)
  const t3Spring = spring({
    frame: frame - 490,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent", // Transparent to show global background
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      {/* Volumetric glow overlay */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 225, 87, 0.03) 0%, transparent 75%)",
          top: "20%",
          left: "30%",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* --- PREVIEW VIEWPORTS CONTAINER --- */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          height: "580px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          perspective: 1200,
        }}
      >
        {/* LP 1: Ranty (Architecture) */}
        {frame < 180 && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              // Transition 1 slide out + 3D rotation left
              transform: `
                rotateX(${hoverRotateX}deg) 
                rotateY(${hoverRotateY - t1Spring * 45}deg) 
                translateX(${t1Spring * -520}px) 
                scale(${hoverScale * (1 - t1Spring * 0.15)})
              `,
              opacity: 1 - t1Spring,
              zIndex: activeScene === 1 ? 10 : 1,
            }}
          >
            <BrowserFrame domain="ranty.co/home" dark={false}>
              <RantyLP localFrame={frame} />
            </BrowserFrame>
          </div>
        )}

        {/* LP 2: Liquid Brokers (FinTech) */}
        {frame >= 150 && frame < 350 && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              // Transition 1 entry + Transition 2 exit (depth scale)
              transform: `
                rotateX(${hoverRotateX}deg)
                rotateY(${hoverRotateY + (1 - t1Spring) * 45 - t2Spring * 15}deg)
                translateX(${(1 - t1Spring) * 520}px)
                scale(${hoverScale * (t1Spring * 0.85 + 0.15) * (1 - t2Spring * 0.5)})
              `,
              opacity: interpolate(frame, [150, 165, 320, 345], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              zIndex: activeScene === 2 ? 10 : 1,
            }}
          >
            <BrowserFrame domain="liquidbrokers.io/trade" dark={true}>
              <LiquidBrokersLP localFrame={frame - 170} />
            </BrowserFrame>
          </div>
        )}

        {/* LP 3: ChronoTask (Productivity) */}
        {frame >= 320 && frame < 520 && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              // Transition 2 entry (exploding zoom) + Transition 3 slide Y
              transform: `
                rotateX(${hoverRotateX - (1 - t2Spring) * 15}deg)
                rotateY(${hoverRotateY}deg)
                scale(${hoverScale * (t2Spring * 0.9 + 0.1)})
                translateY(${t3Spring * -600}px)
              `,
              opacity: interpolate(frame, [320, 335, 490, 515], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              zIndex: activeScene === 3 ? 10 : 1,
            }}
          >
            <BrowserFrame domain="chronotask.app/signup" dark={false}>
              <ChronoTaskLP localFrame={frame - 340} />
            </BrowserFrame>
          </div>
        )}

        {/* LP 4: Redacted (Analytics) */}
        {frame >= 490 && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              // Transition 3 entry (swipes up)
              transform: `
                rotateX(${hoverRotateX}deg)
                rotateY(${hoverRotateY}deg)
                translateY(${(1 - t3Spring) * 600}px)
                scale(${hoverScale})
              `,
              opacity: interpolate(frame, [490, 505], [0, 1], {
                extrapolateLeft: "clamp",
              }),
              zIndex: 10,
            }}
          >
            <BrowserFrame domain="redacted.co/dashboard" dark={false}>
              <RedactedLP localFrame={frame - 510} />
            </BrowserFrame>
          </div>
        )}
      </div>

      {/* --- CINEMATOGRAPHIC WIPE OVERLAY --- */}
      {/* Wipe transition overlay for transition 3 (frames 490 to 520) */}
      {frame >= 490 && frame < 520 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: BRAND.lime,
            transform: `skewX(-15deg) translateX(${interpolate(t3Spring, [0, 1], [600, -600])}px)`,
            zIndex: 100,
            boxShadow: "0 0 100px rgba(212, 225, 87, 0.6)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Dynamic subtitle describing type of landing pages */}
      <div
        style={{
          position: "absolute",
          bottom: "3.5%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          width: "90%",
          zIndex: 50,
        }}
      >
        <span
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            color: BRAND.white,
            backgroundColor: "rgba(6, 6, 8, 0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "8px 18px",
            borderRadius: "30px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
            display: "inline-block",
          }}
        >
          {activeScene === 1 && "Arquitetura Editorial Premium"}
          {activeScene === 2 && "SaaS FinTech Futurista & Dark"}
          {activeScene === 3 && "Productivity SaaS Clean & Texturizado"}
          {activeScene === 4 && "Product Analytics e Conversão de Elite"}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// --- BROWSER FRAME MOCKUP COMPONENT ---
// ─────────────────────────────────────────────────────────────────────────────
interface BrowserProps {
  children: React.ReactNode;
  domain: string;
  dark: boolean;
}
const BrowserFrame: React.FC<BrowserProps> = ({ children, domain, dark }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: dark ? "#0a0b0d" : "#f8f9fa",
        border: dark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: "24px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          backgroundColor: dark ? "#111216" : "#eaecef",
          height: "40px",
          borderBottom: dark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          justifyContent: "space-between",
          flexShrink: 0,
          zIndex: 20,
        }}
      >
        {/* OS Buttons */}
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
        </div>
        {/* Address Field */}
        <div
          style={{
            backgroundColor: dark ? "#0a0b0d" : "#ffffff",
            border: dark ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid rgba(0, 0, 0, 0.04)",
            borderRadius: "8px",
            padding: "3px 18px",
            fontSize: "10px",
            color: dark ? BRAND.gray300 : BRAND.gray700,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: 500,
            width: "160px",
            justifyContent: "center",
          }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{domain}</span>
        </div>
        <div style={{ width: "35px" }} />
      </div>
      {/* Content */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// --- LP 1: RANTY (ARCHITECTURE) ---
// ─────────────────────────────────────────────────────────────────────────────
const RantyLP: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  // Autoscroll down from localFrame 10 to 140
  const scrollTop = interpolate(localFrame, [15, 140], [0, -160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slide-in for right elements
  const rightEntrance = spring({
    frame: localFrame - 10,
    fps: 30,
    config: { damping: 12, stiffness: 90 },
  });

  return (
    <div
      style={{
        transform: `translateY(${scrollTop}px)`,
        padding: "24px 20px 60px 20px",
        backgroundColor: "#f4ede4", // Beige editorial background
        minHeight: "100%",
        color: "#2f2d2b",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: 800, letterSpacing: "0.05em" }}>RANTY</span>
        <div style={{ display: "flex", gap: "12px", fontSize: "10px", fontWeight: 600 }}>
          <span>Services</span>
          <span>Homes</span>
          <span style={{ borderBottom: "1.5px solid #2f2d2b" }}>Contact Us</span>
        </div>
      </div>

      {/* Main Row */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
        {/* Copy Column */}
        <div style={{ flex: 1.1, display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "36px",
              fontWeight: 400,
              lineHeight: 1.05,
              margin: "0 0 10px 0",
              letterSpacing: "-0.03em",
            }}
          >
            THE <br />
            PERFECT <br />
            HOME®
          </h1>
          <span style={{ fontSize: "10px", color: BRAND.gray500, letterSpacing: "0.05em", marginBottom: "20px" }}>
            / We craft custom homes /
          </span>
          <button
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#2f2d2b",
              color: "#f4ede4",
              border: "none",
              borderRadius: "24px",
              padding: "10px 28px",
              fontSize: "11px",
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(47, 45, 43, 0.15)",
            }}
          >
            START
          </button>
        </div>

        {/* Hero Card Column */}
        <div
          style={{
            flex: 0.9,
            transform: `scale(${rightEntrance}) translateX(${(1 - rightEntrance) * 80}px)`,
            opacity: rightEntrance,
          }}
        >
          {/* Card containing 3D House mockup */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "12px",
              boxShadow: "0 15px 30px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              border: "1px solid rgba(0,0,0,0.02)",
            }}
          >
            {/* Pill badges */}
            <div style={{ display: "flex", gap: "5px" }}>
              <span style={rantyBadge}>Interior</span>
              <span style={rantyBadge}>Design</span>
              <span style={{ ...rantyBadge, backgroundColor: "#2f2d2b", color: "#fff" }}>3D</span>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700 }}>Unique design & ergonomics</span>

            {/* Rendered House SVG */}
            <div
              style={{
                width: "100%",
                height: "110px",
                backgroundColor: "#e0dcd3",
                borderRadius: "14px",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 180 110" fill="none">
                {/* Sky & sun */}
                <rect width="100%" height="100%" fill="url(#rantysky)" />
                <circle cx="140" cy="30" r="15" fill="#fdf0d5" opacity="0.8" />
                {/* Mountains */}
                <path d="M-20 110 L40 60 L110 110 Z" fill="#b0aba2" />
                <path d="M50 110 L130 50 L200 110 Z" fill="#a49e95" />
                {/* House geometry */}
                <rect x="30" y="55" width="110" height="45" rx="6" fill="#f3efe8" />
                <rect x="30" y="55" width="110" height="20" rx="3" fill="#2f2d2b" opacity="0.85" />
                {/* Wooden panels */}
                <rect x="35" y="77" width="50" height="23" fill="#d29062" />
                <line x1="45" y1="77" x2="45" y2="100" stroke="#b17245" />
                <line x1="55" y1="77" x2="55" y2="100" stroke="#b17245" />
                <line x1="65" y1="77" x2="65" y2="100" stroke="#b17245" />
                <line x1="75" y1="77" x2="75" y2="100" stroke="#b17245" />
                {/* Windows and doors */}
                <rect x="95" y="77" width="35" height="23" rx="2" fill="#2f2d2b" />
                <rect x="100" y="81" width="12" height="19" fill="#ffeaa7" opacity="0.8" />
                <rect x="114" y="81" width="12" height="19" fill="#ffeaa7" opacity="0.8" />
                {/* Balcony */}
                <rect x="30" y="70" width="110" height="3" fill="#ffffff" />
                <defs>
                  <linearGradient id="rantysky" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#f3efe8" />
                    <stop offset="1" stopColor="#d5d0c5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Material cards bottom row */}
      <div style={{ display: "flex", gap: "10px", marginTop: "35px" }}>
        {/* Floating Card Left */}
        <div style={{ flex: 1, backgroundColor: "#bc9f87", borderRadius: "18px", padding: "12px", color: "#fff" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>We use best materials!</span>
          <span style={{ fontSize: "8px", opacity: 0.8, display: "block" }}>Working with verified suppliers.</span>
        </div>
        {/* Text Right */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: "-6px", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#bfb6ae", border: "1px solid #fff" }} />
            <span style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: BRAND.gray700, border: "1px solid #fff", marginLeft: "-4px" }} />
            <span style={{ fontSize: "12px", fontWeight: 800, marginLeft: "6px" }}>12m+</span>
          </div>
          <span style={{ fontSize: "8px", color: BRAND.gray500 }}>Customers satisfied.</span>
        </div>
      </div>
    </div>
  );
};
const rantyBadge: React.CSSProperties = {
  fontSize: "8px",
  fontWeight: 700,
  padding: "2px 8px",
  borderRadius: "10px",
  backgroundColor: "#f4ede4",
  color: "#2f2d2b",
  border: "1px solid rgba(0,0,0,0.05)",
};

// ─────────────────────────────────────────────────────────────────────────────
// --- LP 2: LIQUID BROKERS (FINTECH DARK) ---
// ─────────────────────────────────────────────────────────────────────────────
const LiquidBrokersLP: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  // Floating deformation of the metal blob using Math.sin
  const scaleX = 1 + Math.sin(localFrame * 0.06) * 0.05;
  const scaleY = 1 + Math.cos(localFrame * 0.07) * 0.05;
  const rotateBall = localFrame * 0.4;

  // Spring entrance for glassmorphic elements
  const itemsEntrance = spring({
    frame: localFrame,
    fps: 30,
    config: { damping: 14, stiffness: 80 },
  });

  return (
    <div
      style={{
        padding: "24px 20px",
        backgroundColor: "#0d0e12", // Clean dark-mode background
        height: "100%",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "-0.02em" }}>Liquid Brokers</span>
        <button
          style={{
            backgroundColor: "#ffffff",
            color: "#0d0e12",
            border: "none",
            borderRadius: "16px",
            padding: "5px 12px",
            fontSize: "9px",
            fontWeight: 800,
          }}
        >
          Sign up
        </button>
      </div>

      {/* Core Typography */}
      <div style={{ textAlign: "center", marginTop: "20px", zIndex: 10 }}>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "26px",
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 6px 0",
            letterSpacing: "-0.03em",
          }}
        >
          Elevate Your <br />
          Trading Experience
        </h2>
        <p style={{ fontSize: "10px", color: BRAND.gray300, maxWidth: "260px", margin: "0 auto 15px auto" }}>
          Unlock your trading potential in a fully regulated environment.
        </p>
        <button
          style={{
            backgroundColor: "#ffffff",
            border: "none",
            color: "#0d0e12",
            borderRadius: "20px",
            padding: "8px 20px",
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          Sign Up & Trade
        </button>
      </div>

      {/* 3D Liquid/Chrome Blob simulation using gradients and css scale */}
      <div
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          bottom: "-50px",
          left: "50%",
          transform: `translateX(-50%) scale(${scaleX}, ${scaleY}) rotate(${rotateBall}deg)`,
          background: "radial-gradient(circle at 35% 35%, #f59e0b 0%, #1e3a8a 40%, #0d0e12 90%)",
          borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
          filter: "blur(2px)",
          boxShadow: "0 0 40px rgba(245, 158, 11, 0.15), inset 0 0 30px rgba(255,255,255,0.2)",
          opacity: 0.85,
          zIndex: 1,
        }}
      />

      {/* Floating Glassmorphic Indicators */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", zIndex: 10 }}>
        {/* Left card */}
        <div
          style={{
            ...glassCard,
            transform: `scale(${itemsEntrance}) translateY(${(1 - itemsEntrance) * 40}px)`,
            opacity: itemsEntrance,
          }}
        >
          <span style={{ fontSize: "7px", color: BRAND.gray500, display: "block" }}>TRADING PAIRS</span>
          <span style={{ fontSize: "9px", fontWeight: 700, display: "block", marginTop: "2px" }}>Unparalleled Access</span>
        </div>
        {/* Right card */}
        <div
          style={{
            ...glassCard,
            transform: `scale(${itemsEntrance}) translateY(${(1 - itemsEntrance) * 40}px)`,
            opacity: itemsEntrance,
            textAlign: "right",
          }}
        >
          <span style={{ fontSize: "7px", color: BRAND.gray500, display: "block" }}>LIVE STATUS</span>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#f59e0b", display: "block", marginTop: "2px" }}>96%</span>
        </div>
      </div>
    </div>
  );
};
const glassCard: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "14px",
  padding: "10px 14px",
  width: "110px",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

// ─────────────────────────────────────────────────────────────────────────────
// --- LP 3: CHRONOTASK (PRODUCTIVITY LIGHT) ---
// ─────────────────────────────────────────────────────────────────────────────
const ChronoTaskLP: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  // Elements fly-in with different spring delays
  const noteEntrance = spring({
    frame: localFrame - 5,
    fps: 30,
    config: { damping: 11, stiffness: 90 },
  });
  const taskEntrance = spring({
    frame: localFrame - 20,
    fps: 30,
    config: { damping: 12, stiffness: 90 },
  });
  const remindersEntrance = spring({
    frame: localFrame - 35,
    fps: 30,
    config: { damping: 13, stiffness: 95 },
  });

  return (
    <div
      style={{
        padding: "24px 20px",
        backgroundColor: "#fafafb",
        // Dotted grid overlay
        backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        height: "100%",
        color: "#18181b",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ display: "flex", gap: "3px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#18181b" }} />
          </span>
          <span style={{ fontSize: "11px", fontWeight: 800 }}>ChronoTask</span>
        </div>
        <span style={{ fontSize: "9px", fontWeight: 700, color: "#3b82f6" }}>Get demo</span>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginTop: "15px", zIndex: 10 }}>
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            lineHeight: 1.15,
            margin: "0 0 6px 0",
            letterSpacing: "-0.03em",
          }}
        >
          Think, plan, and track <br />
          <span style={{ color: BRAND.gray500 }}>all in one place</span>
        </h3>
        <button
          style={{
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "6px 16px",
            fontSize: "9px",
            fontWeight: 700,
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
          }}
        >
          Get free demo
        </button>
      </div>

      {/* Floating UI Components */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", zIndex: 10, marginTop: "20px" }}>
        {/* Yellow Note (Left) */}
        <div
          style={{
            backgroundColor: "#fef08a", // Yellow
            borderRadius: "8px",
            padding: "8px",
            width: "90px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
            transform: `rotate(-4deg) scale(${noteEntrance})`,
            opacity: noteEntrance,
          }}
        >
          <span style={{ fontSize: "8px", fontWeight: 700, display: "block", color: "#854d0e", marginBottom: "4px" }}>
            Take Notes
          </span>
          <span style={{ fontSize: "6px", color: "#854d0e", opacity: 0.8 }}>
            Keep track of crucial details easily.
          </span>
        </div>

        {/* Task Checklist (Right) */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "10px",
            width: "120px",
            boxShadow: "0 15px 25px rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.03)",
            transform: `scale(${taskEntrance}) translateY(${(1 - taskEntrance) * 30}px)`,
            opacity: taskEntrance,
          }}
        >
          <span style={{ fontSize: "8px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Today's Tasks</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", border: "1px solid #3b82f6", display: "inline-block", backgroundColor: "#3b82f6" }} />
              <span style={{ fontSize: "6px", textDecoration: "line-through", color: BRAND.gray300 }}>Design PPT</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", border: "1px solid #3b82f6", display: "inline-block", backgroundColor: localFrame >= 70 ? "#3b82f6" : "transparent" }} />
              <span style={{ fontSize: "6px", color: localFrame >= 70 ? BRAND.gray300 : "#18181b", textDecoration: localFrame >= 70 ? "line-through" : "none" }}>Coding Landing Page</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integration icons (Bottom Row) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginTop: "15px",
          opacity: remindersEntrance,
          transform: `scale(${remindersEntrance})`,
        }}
      >
        <span style={{ fontSize: "8px", color: BRAND.gray500, fontWeight: 700 }}>100+ Integrations</span>
        <div style={{ display: "flex", gap: "5px" }}>
          <span style={integrationIcon}>✉️</span>
          <span style={integrationIcon}>💬</span>
          <span style={integrationIcon}>📅</span>
        </div>
      </div>
    </div>
  );
};
const integrationIcon: React.CSSProperties = {
  width: "16px",
  height: "16px",
  borderRadius: "4px",
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0,0,0,0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "8px",
};

// ─────────────────────────────────────────────────────────────────────────────
// --- LP 4: REDACTED (ANALYTICS GREEN LANDSCAPE) ---
// ─────────────────────────────────────────────────────────────────────────────
const RedactedLP: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  // Dashboard slides up from the bottom with a delay
  const dashSpring = spring({
    frame: localFrame - 25,
    fps: 30,
    config: { damping: 12, stiffness: 80 },
  });

  const dashY = (1 - dashSpring) * 110;

  return (
    <div
      style={{
        backgroundColor: "#f4f7f6",
        height: "100%",
        color: "#0f172a",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 20px 0 20px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <span style={{ fontSize: "12px", fontWeight: 900, letterSpacing: "-0.03em" }}>redacted</span>
        <span style={{ fontSize: "9px", fontWeight: 700, backgroundColor: "#a3e635", color: "#000", padding: "4px 10px", borderRadius: "10px" }}>
          Get started
        </span>
      </div>

      {/* Hero Copy */}
      <div style={{ textAlign: "center", marginTop: "15px", zIndex: 10 }}>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 6px 0",
            letterSpacing: "-0.03em",
          }}
        >
          The fastest tool to see <br />
          where you're losing clients
        </h2>
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "10px" }}>
          <button style={{ backgroundColor: "#a3e635", border: "none", color: "#000", fontSize: "8px", fontWeight: 800, borderRadius: "6px", padding: "5px 12px" }}>
            Start for free →
          </button>
          <button style={{ backgroundColor: "#0f172a", border: "none", color: "#fff", fontSize: "8px", fontWeight: 800, borderRadius: "6px", padding: "5px 12px" }}>
            Talk to us
          </button>
        </div>
      </div>

      {/* Background Stylized 2D/3D Green Hills */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "220px",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 420 220" preserveAspectRatio="none" fill="none">
          {/* Back hills - Olive shade */}
          <path d="M-20 220 C 80 140, 200 130, 310 180 C 370 200, 410 170, 440 220 Z" fill="#65a30d" opacity="0.65" />
          {/* Middle hills - Grass shade */}
          <path d="M-10 220 C 110 160, 220 180, 320 140 C 380 120, 410 160, 440 220 Z" fill="#4d7c0f" />
          {/* Front hills - Vibrant lime shade */}
          <path d="M-20 220 C 50 180, 150 160, 260 190 C 340 210, 390 190, 440 220 Z" fill="#84cc16" opacity="0.9" />
        </svg>
      </div>

      {/* Dashboard Mockup rising from behind front hills */}
      <div
        style={{
          width: "82%",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderRadius: "14px 14px 0 0",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.08)",
          padding: "8px 10px 0 10px",
          height: "100px",
          alignSelf: "center",
          transform: `translateY(${dashY}px)`,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        {/* Dashboard header bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "4px" }}>
          <span style={{ fontSize: "6px", fontWeight: 700 }}>Influencer Campaigns</span>
          <span style={{ fontSize: "5px", color: BRAND.gray300 }}>Filter by views</span>
        </div>
        {/* Mock content grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "5px", borderBottom: "1px solid #f8fafc", paddingBottom: "3px" }}>
            <span style={{ fontWeight: 600 }}>1. @erik.awesome</span>
            <span style={{ color: "#22c55e" }}>$42,800 Revenue</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "5px" }}>
            <span style={{ fontWeight: 600 }}>2. @amou.travels</span>
            <span style={{ color: "#22c55e" }}>$18,400 Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
};
