import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from "remotion";
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
  const hoverRotateX = Math.sin(frame * 0.02) * 2.2;
  const hoverRotateY = Math.cos(frame * 0.015) * 3.2;
  const hoverScale = 1 + Math.sin(frame * 0.01) * 0.012;

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
        backgroundColor: "transparent",
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
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 225, 87, 0.04) 0%, transparent 75%)",
          top: "15%",
          left: "25%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* --- PREVIEW VIEWPORTS CONTAINER (LARGER PREVIEW DESKTOP 960px) --- */}
      <div
        style={{
          width: "960px",
          height: "620px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          perspective: 1500,
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
                translateX(${t1Spring * -1100}px) 
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
                translateX(${(1 - t1Spring) * 1100}px)
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
                translateY(${t3Spring * -800}px)
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
                translateY(${(1 - t3Spring) * 800}px)
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
      {frame >= 490 && frame < 520 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: BRAND.lime,
            transform: `skewX(-15deg) translateX(${interpolate(t3Spring, [0, 1], [1200, -1200])}px)`,
            zIndex: 100,
            boxShadow: "0 0 120px rgba(212, 225, 87, 0.7)",
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
            fontSize: "15px",
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
          {activeScene === 1 && "Arquitetura Editorial Premium (Ranty)"}
          {activeScene === 2 && "SaaS FinTech Futurista & Dark (Liquid Brokers)"}
          {activeScene === 3 && "Productivity SaaS Clean & Organizado (ChronoTask)"}
          {activeScene === 4 && "Product Analytics e Conversão de Elite (Redacted)"}
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
        backgroundColor: dark ? "#060608" : "#ffffff",
        border: dark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.06)",
        borderRadius: "28px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 40px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          backgroundColor: dark ? "#0f1013" : "#f1f3f5",
          height: "44px",
          borderBottom: dark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          justifyContent: "space-between",
          flexShrink: 0,
          zIndex: 20,
        }}
      >
        {/* OS Buttons */}
        <div style={{ display: "flex", gap: "7px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
        </div>
        {/* Address Field */}
        <div
          style={{
            backgroundColor: dark ? "#060608" : "#ffffff",
            border: dark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.04)",
            borderRadius: "10px",
            padding: "4px 20px",
            fontSize: "11px",
            color: dark ? BRAND.gray300 : BRAND.gray700,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 500,
            width: "240px",
            justifyContent: "center",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{domain}</span>
        </div>
        <div style={{ width: "45px" }} />
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
  const scrollTop = interpolate(localFrame, [15, 140], [0, -220], {
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
        padding: "30px 40px 80px 40px",
        backgroundColor: "#f4ede4", // Beige editorial background
        minHeight: "100%",
        color: "#2f2d2b",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 800, letterSpacing: "0.05em" }}>RANTY</span>
        <div style={{ display: "flex", gap: "24px", fontSize: "12px", fontWeight: 600 }}>
          <span>Services</span>
          <span>Homes</span>
          <span>About us</span>
          <span>Cases</span>
          <span style={{ borderBottom: "1.5px solid #2f2d2b", paddingBottom: "2px" }}>CONTACT US</span>
        </div>
      </div>

      {/* Main Row */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "40px" }}>
        {/* Copy Column */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "64px",
              fontWeight: 400,
              lineHeight: 0.95,
              margin: "0 0 16px 0",
              letterSpacing: "-0.04em",
            }}
          >
            THE <br />
            PERFECT <br />
            HOME®
          </h1>
          <span style={{ fontSize: "14px", color: BRAND.gray500, letterSpacing: "0.05em", marginBottom: "30px" }}>
            / We craft custom homes /
          </span>
          <button
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#2f2d2b",
              color: "#f4ede4",
              border: "none",
              borderRadius: "30px",
              padding: "14px 44px",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow: "0 10px 25px rgba(47, 45, 43, 0.15)",
              cursor: "pointer",
            }}
          >
            START
          </button>
        </div>

        {/* Hero Card Column (Mockup image based on actual generated asset) */}
        <div
          style={{
            flex: 1.1,
            transform: `scale(${rightEntrance}) translateX(${(1 - rightEntrance) * 100}px)`,
            opacity: rightEntrance,
            position: "relative",
          }}
        >
          {/* Card containing generated Modern House image */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "28px",
              padding: "16px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              border: "1px solid rgba(0,0,0,0.02)",
            }}
          >
            {/* Pill badges */}
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={rantyBadge}>Interior</span>
              <span style={rantyBadge}>Design</span>
              <span style={{ ...rantyBadge, backgroundColor: "#2f2d2b", color: "#fff" }}>3D</span>
            </div>
            
            <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>Unique design & ergonomics</span>

            {/* Generated House Image Integration */}
            <div
              style={{
                width: "100%",
                height: "220px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                position: "relative",
              }}
            >
              <img
                src={staticFile("ranty_modern_house.jpg")}
                alt="Ranty Modern House"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Floating Roomtour card on top of the image */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "-15px",
              width: "120px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "8px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "9px", fontWeight: 800, color: BRAND.gray500, letterSpacing: "0.05em" }}>ROOMTOUR</span>
            <img
              src={staticFile("ranty_roomtour.jpg")}
              alt="Roomtour"
              style={{ width: "100%", height: "70px", borderRadius: "10px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* Material cards bottom row */}
      <div style={{ display: "flex", gap: "20px", marginTop: "60px" }}>
        {/* Floating Card Left */}
        <div style={{ flex: 1.2, backgroundColor: "#bc9f87", borderRadius: "24px", padding: "20px 24px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "16px", fontWeight: 700, display: "block", marginBottom: "6px" }}>We use best materials!</span>
            <span style={{ fontSize: "11px", opacity: 0.85, display: "block" }}>Working with verified suppliers.</span>
          </div>
        </div>
        {/* Text Right */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: "-6px", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#bfb6ae", border: "2px solid #fff" }} />
            <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: BRAND.gray700, border: "2px solid #fff", marginLeft: "-6px" }} />
            <span style={{ fontSize: "20px", fontWeight: 800, marginLeft: "10px" }}>12m+</span>
          </div>
          <span style={{ fontSize: "11px", color: BRAND.gray500, fontWeight: 500 }}>Customers satisfied with custom comfort.</span>
        </div>
      </div>
    </div>
  );
};
const rantyBadge: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  padding: "3px 12px",
  borderRadius: "12px",
  backgroundColor: "#f4ede4",
  color: "#2f2d2b",
  border: "1px solid rgba(0,0,0,0.05)",
};

// ─────────────────────────────────────────────────────────────────────────────
// --- LP 2: LIQUID BROKERS (FINTECH DARK) ---
// ─────────────────────────────────────────────────────────────────────────────
const LiquidBrokersLP: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  // Constant rotation and pulsing scale for the metallic blob
  const rotateBall = localFrame * 0.25;
  const pulseBlob = 1 + Math.sin(localFrame * 0.05) * 0.03;

  // Spring entrance for glassmorphic elements
  const itemsEntrance = spring({
    frame: localFrame,
    fps: 30,
    config: { damping: 14, stiffness: 80 },
  });

  return (
    <div
      style={{
        padding: "30px 40px",
        backgroundColor: "#08090c", // Rich deep space dark
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
        <span style={{ fontSize: "16px", fontWeight: 850, letterSpacing: "-0.03em" }}>Liquid Brokers</span>
        <div style={{ display: "flex", gap: "24px", fontSize: "11px", color: BRAND.gray300 }}>
          <span>About</span>
          <span>Trading</span>
          <span>Contact</span>
          <span>FAQ</span>
        </div>
        <button
          style={{
            backgroundColor: "#ffffff",
            color: "#08090c",
            border: "none",
            borderRadius: "20px",
            padding: "7px 18px",
            fontSize: "11px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Sign up
        </button>
      </div>

      {/* Core Typography */}
      <div style={{ textAlign: "center", marginTop: "40px", zIndex: 10 }}>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "44px",
            fontWeight: 800,
            lineHeight: 1.05,
            margin: "0 0 12px 0",
            letterSpacing: "-0.04em",
          }}
        >
          Elevate Your <br />
          Trading Experience
        </h2>
        <p style={{ fontSize: "13px", color: BRAND.gray300, maxWidth: "340px", margin: "0 auto 24px auto", lineHeight: 1.4 }}>
          Unlock your trading potential in a fully regulated environment, powered by Liquid Brokers.
        </p>
        <button
          style={{
            backgroundColor: "#ffffff",
            border: "none",
            color: "#08090c",
            borderRadius: "24px",
            padding: "12px 36px",
            fontSize: "12px",
            fontWeight: 800,
            boxShadow: "0 15px 30px rgba(255,255,255,0.06)",
            cursor: "pointer",
          }}
        >
          Sign Up & Trade
        </button>
      </div>

      {/* Generated Liquid Metal Blob Integration */}
      <div
        style={{
          position: "absolute",
          width: "480px",
          height: "480px",
          bottom: "-180px",
          left: "50%",
          transform: `translateX(-50%) scale(${pulseBlob}) rotate(${rotateBall}deg)`,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.85,
        }}
      >
        <img
          src={staticFile("liquid_metal_blob.jpg")}
          alt="Liquid Metal Blob"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Floating Glassmorphic Indicators */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", zIndex: 10 }}>
        {/* Left card */}
        <div
          style={{
            ...glassCardStyle,
            transform: `scale(${itemsEntrance}) translateY(${(1 - itemsEntrance) * 40}px)`,
            opacity: itemsEntrance,
          }}
        >
          <span style={{ fontSize: "8px", color: BRAND.gray500, display: "block", fontWeight: 700, letterSpacing: "0.05em" }}>TRADING PAIRS</span>
          <span style={{ fontSize: "12px", fontWeight: 700, display: "block", marginTop: "3px" }}>Unparalleled Access</span>
        </div>
        {/* Right card */}
        <div
          style={{
            ...glassCardStyle,
            transform: `scale(${itemsEntrance}) translateY(${(1 - itemsEntrance) * 40}px)`,
            opacity: itemsEntrance,
            textAlign: "right",
          }}
        >
          <span style={{ fontSize: "8px", color: BRAND.gray500, display: "block", fontWeight: 700, letterSpacing: "0.05em" }}>LIVE ACCURACY</span>
          <span style={{ fontSize: "15px", fontWeight: 800, color: "#f59e0b", display: "block", marginTop: "3px" }}>96%</span>
        </div>
      </div>
    </div>
  );
};
const glassCardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "18px",
  padding: "14px 20px",
  width: "160px",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
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
    frame: localFrame - 15,
    fps: 30,
    config: { damping: 12, stiffness: 90 },
  });
  const remindersEntrance = spring({
    frame: localFrame - 25,
    fps: 30,
    config: { damping: 13, stiffness: 95 },
  });

  return (
    <div
      style={{
        padding: "30px 40px",
        backgroundColor: "#fafafb",
        // Dotted grid overlay
        backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.035) 1.5px, transparent 1.5px)",
        backgroundSize: "20px 20px",
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
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "flex", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#18181b" }} />
          </span>
          <span style={{ fontSize: "14px", fontWeight: 800 }}>ChronoTask</span>
        </div>
        <div style={{ display: "flex", gap: "24px", fontSize: "12px", color: BRAND.gray500, fontWeight: 500 }}>
          <span>Features</span>
          <span>Solutions</span>
          <span>Resources</span>
          <span>Pricing</span>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#3b82f6", cursor: "pointer" }}>Get demo</span>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginTop: "30px", zIndex: 10 }}>
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "38px",
            fontWeight: 800,
            lineHeight: 1.15,
            margin: "0 0 10px 0",
            letterSpacing: "-0.04em",
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
            borderRadius: "12px",
            padding: "10px 24px",
            fontSize: "11px",
            fontWeight: 700,
            boxShadow: "0 6px 18px rgba(59, 130, 246, 0.25)",
            cursor: "pointer",
          }}
        >
          Get free demo
        </button>
      </div>

      {/* Floating UI Components */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", zIndex: 10, marginTop: "10px" }}>
        {/* Yellow Note (Left) */}
        <div
          style={{
            backgroundColor: "#fef08a", // Yellow
            borderRadius: "12px",
            padding: "14px",
            width: "140px",
            boxShadow: "0 12px 25px rgba(0,0,0,0.05)",
            transform: `rotate(-4deg) scale(${noteEntrance})`,
            opacity: noteEntrance,
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 800, display: "block", color: "#854d0e", marginBottom: "6px" }}>
            Take Notes
          </span>
          <span style={{ fontSize: "9px", color: "#854d0e", opacity: 0.8, lineHeight: 1.3, display: "block" }}>
            Take notes to keep track of crucial details, and accomplish more tasks with ease.
          </span>
        </div>

        {/* Task Checklist (Right) */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            padding: "16px",
            width: "180px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
            border: "1px solid rgba(0,0,0,0.03)",
            transform: `scale(${taskEntrance}) translateY(${(1 - taskEntrance) * 35}px)`,
            opacity: taskEntrance,
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 800, display: "block", marginBottom: "8px" }}>Today's Tasks</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "3px", border: "1px solid #3b82f6", display: "inline-block", backgroundColor: "#3b82f6" }} />
              <span style={{ fontSize: "9px", textDecoration: "line-through", color: BRAND.gray300 }}>Design PPT #4</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "3px", border: "1px solid #3b82f6", display: "inline-block", backgroundColor: localFrame >= 70 ? "#3b82f6" : "transparent" }} />
              <span style={{ fontSize: "9px", color: localFrame >= 70 ? BRAND.gray300 : "#18181b", textDecoration: localFrame >= 70 ? "line-through" : "none" }}>Coding Landing Page</span>
            </div>
          </div>
        </div>

        {/* Generated 3D Glassmorphic Clock Reminder (Far Right/Top) */}
        <div
          style={{
            width: "110px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${remindersEntrance}) rotate(3deg)`,
            opacity: remindersEntrance,
            backgroundColor: "#ffffff",
            padding: "10px",
            borderRadius: "18px",
            boxShadow: "0 15px 30px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.03)",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "8px", fontWeight: 800, color: BRAND.gray500 }}>REMINIDER</span>
          <img
            src={staticFile("chronotask_clock_icon.jpg")}
            alt="3D Clock Icon"
            style={{ width: "100%", height: "80px", borderRadius: "10px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Integration icons (Bottom Row) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px",
          marginTop: "10px",
          opacity: remindersEntrance,
          transform: `scale(${remindersEntrance})`,
        }}
      >
        <span style={{ fontSize: "10px", color: BRAND.gray500, fontWeight: 750 }}>100+ Integrations</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={integrationIconStyle}>✉️</span>
          <span style={integrationIconStyle}>💬</span>
          <span style={integrationIconStyle}>📅</span>
        </div>
      </div>
    </div>
  );
};
const integrationIconStyle: React.CSSProperties = {
  width: "24px",
  height: "24px",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0,0,0,0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
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

  const dashY = (1 - dashSpring) * 180;

  return (
    <div
      style={{
        backgroundColor: "#f3f6f5",
        height: "100%",
        color: "#0f172a",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "30px 40px 0 40px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", zIndex: 10 }}>
        <span style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "-0.04em" }}>redacted</span>
        <div style={{ display: "flex", gap: "24px", fontSize: "11px", color: BRAND.gray500, fontWeight: 600 }}>
          <span>Features</span>
          <span>Pricing</span>
          <span>Docs</span>
          <span>Status</span>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: "#84cc16", color: "#000", padding: "5px 14px", borderRadius: "12px", cursor: "pointer" }}>
          Get started
        </span>
      </div>

      {/* Hero Copy */}
      <div style={{ textAlign: "center", marginTop: "30px", zIndex: 10 }}>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "36px",
            fontWeight: 800,
            lineHeight: 1.05,
            margin: "0 0 8px 0",
            letterSpacing: "-0.04em",
          }}
        >
          The fastest tool to see <br />
          where you're losing clients
        </h2>
        <p style={{ fontSize: "12px", color: BRAND.gray500, maxWidth: "380px", margin: "0 auto 16px auto", lineHeight: 1.3 }}>
          Redacted turns product behavior into clear signals, helping you spot risk early.
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
          <button style={{ backgroundColor: "#84cc16", border: "none", color: "#000", fontSize: "10px", fontWeight: 800, borderRadius: "8px", padding: "8px 18px", cursor: "pointer" }}>
            Start for free →
          </button>
          <button style={{ backgroundColor: "#0f172a", border: "none", color: "#fff", fontSize: "10px", fontWeight: 800, borderRadius: "8px", padding: "8px 18px", cursor: "pointer" }}>
            Talk to us
          </button>
        </div>
      </div>

      {/* Generated Windows XP Green Hills Landscape Integration */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "300px",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <img
          src={staticFile("redacted_green_hills.jpg")}
          alt="Green Hills Landscape"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            verticalAlign: "bottom",
          }}
        />
      </div>

      {/* Dashboard Mockup rising from behind front hills */}
      <div
        style={{
          width: "74%",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -15px 40px rgba(0,0,0,0.08)",
          padding: "12px 16px 0 16px",
          height: "160px",
          alignSelf: "center",
          transform: `translateY(${dashY}px)`,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Dashboard header bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
          <span style={{ fontSize: "9px", fontWeight: 800 }}>Campaign Revenue Signals</span>
          <span style={{ fontSize: "8px", color: BRAND.gray300 }}>Filter by active</span>
        </div>
        {/* Mock content list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", borderBottom: "1px solid #f8fafc", paddingBottom: "4px" }}>
            <span style={{ fontWeight: 700 }}>1. @erik.awesome</span>
            <span style={{ color: "#22c55e", fontWeight: 700 }}>$42,800 Revenue</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", borderBottom: "1px solid #f8fafc", paddingBottom: "4px" }}>
            <span style={{ fontWeight: 700 }}>2. @amou.travels</span>
            <span style={{ color: "#22c55e", fontWeight: 700 }}>$18,400 Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
};
