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

  // Track active scene
  let activeScene = 1;
  if (frame >= 170 && frame < 340) activeScene = 2;
  else if (frame >= 340 && frame < 510) activeScene = 3;
  else if (frame >= 510) activeScene = 4;

  // Define transition progresses
  const t1Spring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const t2Spring = spring({
    frame: frame - 320,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

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

      {/* --- PREVIEW VIEWPORTS CONTAINER --- */}
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
  // Deep scroll Y to show custom project gallery, testimonial, and footer
  const scrollTop = interpolate(localFrame, [15, 145], [0, -650], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightEntrance = spring({
    frame: localFrame - 10,
    fps: 30,
    config: { damping: 12, stiffness: 90 },
  });

  return (
    <div
      style={{
        transform: `translateY(${scrollTop}px)`,
        padding: "30px 40px 100px 40px",
        backgroundColor: "#f4ede4", // Beige editorial background
        minHeight: "1550px", // Giant height to avoid white spaces on scroll!
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
              border: "1px solid #2f2d2b",
              borderRadius: "30px",
              padding: "14px 44px",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow: "0 10px 25px rgba(47, 45, 43, 0.1)",
              cursor: "pointer",
            }}
          >
            START
          </button>
        </div>

        {/* Hero Card Column */}
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

            {/* Generated House Image */}
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

          {/* Floating Roomtour card */}
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

      {/* Materials Row */}
      <div style={{ display: "flex", gap: "20px", marginTop: "60px", marginBottom: "60px" }}>
        <div style={{ flex: 1.2, backgroundColor: "#bc9f87", borderRadius: "24px", padding: "20px 24px", color: "#fff" }}>
          <span style={{ fontSize: "16px", fontWeight: 700, display: "block", marginBottom: "6px" }}>We use best materials!</span>
          <span style={{ fontSize: "11px", opacity: 0.85, display: "block" }}>Working with verified suppliers.</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: "-6px", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#bfb6ae", border: "2px solid #fff" }} />
            <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: BRAND.gray700, border: "2px solid #fff", marginLeft: "-6px" }} />
            <span style={{ fontSize: "20px", fontWeight: 800, marginLeft: "10px" }}>12m+</span>
          </div>
          <span style={{ fontSize: "11px", color: BRAND.gray500, fontWeight: 500 }}>Customers satisfied.</span>
        </div>
      </div>

      {/* PROJECTS SHOWCASE GRID (PREVENTS EMPTY ON SCROLL) */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: 400, marginBottom: "24px", letterSpacing: "-0.02em" }}>
          Our Latest Projects
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <img src={staticFile("ranty_pool.jpg")} alt="Ranty Infinity Pool" style={rantyProjectImg} />
            <span style={{ fontSize: "14px", fontWeight: 750 }}>Infinity Pool Horizon</span>
            <span style={{ fontSize: "11px", color: BRAND.gray500 }}>Sunset Vista Villa</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <img src={staticFile("ranty_concrete.jpg")} alt="Ranty Concrete Detail" style={rantyProjectImg} />
            <span style={{ fontSize: "14px", fontWeight: 750 }}>Minimalist Concrete Villa</span>
            <span style={{ fontSize: "11px", color: BRAND.gray500 }}>Urban Oasis House</span>
          </div>
        </div>

        {/* Elegant Quote */}
        <div style={{ borderLeft: "3.5px solid #2f2d2b", paddingLeft: "20px", margin: "40px 0", fontStyle: "italic", fontSize: "18px", color: BRAND.gray700, fontFamily: "Georgia, serif" }}>
          "Combining nature and modern engineering to build custom luxury homes that last forever."
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "30px", marginTop: "50px", fontSize: "12px", color: BRAND.gray500 }}>
          <span>RANTY ARCHITECTS &copy; 2026</span>
          <span>TERMS & PRIVACY</span>
        </div>
      </div>
    </div>
  );
};
const rantyProjectImg: React.CSSProperties = {
  width: "100%",
  height: "170px",
  borderRadius: "16px",
  objectFit: "cover",
  boxShadow: "0 10px 20px rgba(0,0,0,0.03)",
};

// ─────────────────────────────────────────────────────────────────────────────
// --- LP 2: LIQUID BROKERS (FINTECH DARK) ---
// ─────────────────────────────────────────────────────────────────────────────
const LiquidBrokersLP: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  // Slow scroll Y
  const scrollTop = interpolate(localFrame, [40, 140], [0, -320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const itemsEntrance = spring({
    frame: localFrame,
    fps: 30,
    config: { damping: 14, stiffness: 80 },
  });

  return (
    <div
      style={{
        transform: `translateY(${scrollTop}px)`,
        padding: "30px 40px 100px 40px",
        backgroundColor: "#08090c",
        minHeight: "1200px", // Extended to avoid white areas when scrolling!
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header - relative positioned to sit over blob */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", position: "relative", zIndex: 10 }}>
        <span style={{ fontSize: "16px", fontWeight: 850, letterSpacing: "-0.03em" }}>Liquid Brokers</span>
        <div style={{ display: "flex", gap: "24px", fontSize: "11px", color: BRAND.gray300 }}>
          <span>About</span>
          <span>Trading</span>
          <span>Contact</span>
          <span>FAQ</span>
        </div>
        <button style={{ backgroundColor: "#ffffff", color: "#08090c", border: "none", borderRadius: "20px", padding: "7px 18px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}>
          Sign up
        </button>
      </div>

      {/* Core Typography - relative positioned to sit over blob */}
      <div style={{ textAlign: "left", marginTop: "30px", marginBottom: "40px", position: "relative", zIndex: 10, maxWidth: "460px" }}>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "44px",
            fontWeight: 800,
            lineHeight: 1.05,
            margin: "0 0 12px 0",
            letterSpacing: "-0.04em",
            textShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          Elevate Your <br />
          Trading Experience
        </h2>
        <p style={{ fontSize: "13px", color: BRAND.gray300, margin: "0 0 24px 0", lineHeight: 1.4, textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>
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
            boxShadow: "0 15px 30px rgba(255,255,255,0.08)",
            cursor: "pointer",
          }}
        >
          Sign Up & Trade
        </button>
      </div>

      {/* Generated Liquid Metal Blob (Positioned absolutely behind text, shifted right to prevent text overlap) */}
      <div
        style={{
          position: "absolute",
          width: "380px",
          height: "380px",
          top: "160px",
          right: "-30px",
          transform: "none",
          zIndex: 1, // Stays beneath relative text
          pointerEvents: "none",
          opacity: 0.85,
        }}
      >
        <img
          src={staticFile("liquid_metal_blob.jpg")}
          alt="Liquid Metal Blob"
          style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "screen" }}
        />
      </div>

      {/* Glassmorphic Indicators */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", zIndex: 10, marginTop: "40px", marginBottom: "80px" }}>
        <div
          style={{
            ...glassCardStyle,
            transform: `scale(${itemsEntrance}) translateY(${(1 - itemsEntrance) * 40}px)`,
            opacity: itemsEntrance,
          }}
        >
          <span style={{ fontSize: "8px", color: BRAND.gray500, display: "block", fontWeight: 700, letterSpacing: "0.05em" }}>TRADING PAIRS</span>
          <span style={{ fontSize: "13px", fontWeight: 800, display: "block", marginTop: "3px" }}>Unparalleled Access</span>
        </div>
        <div
          style={{
            ...glassCardStyle,
            transform: `scale(${itemsEntrance}) translateY(${(1 - itemsEntrance) * 40}px)`,
            opacity: itemsEntrance,
            textAlign: "right",
          }}
        >
          <span style={{ fontSize: "8px", color: BRAND.gray500, display: "block", fontWeight: 700, letterSpacing: "0.05em" }}>LIVE ACCURACY</span>
          <span style={{ fontSize: "16px", fontWeight: 850, color: "#f59e0b", display: "block", marginTop: "3px" }}>96%</span>
        </div>
      </div>

      {/* CRYPTO SUPPORTED ASSETS (REDEFINED ULTRA-PREMIUM GRID) */}
      <div style={{ zIndex: 10, marginTop: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <span style={{ fontSize: "9px", fontWeight: 800, backgroundColor: "#22c55e", color: "#000", padding: "3px 8px", borderRadius: "10px", letterSpacing: "0.05em" }}>REALTIME FEED</span>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "28px", fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>
            Supported Markets
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* BTC Card */}
          <div style={cryptoCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#f59e0b", display: "inline-block" }} />
                <span style={{ fontSize: "14px", fontWeight: 800 }}>BTC / USD</span>
              </div>
              <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 800 }}>+2.45% ↗</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: 900, fontFamily: "monospace", color: "#fff" }}>$64,820.50</span>
            
            {/* Sparkline Graph SVG */}
            <div style={{ width: "100%", height: "30px", marginTop: "12px", opacity: 0.8 }}>
              <svg width="100%" height="100%" viewBox="0 0 200 30">
                <path d="M0 25 Q 40 10 80 20 T 160 5 T 200 15" fill="none" stroke="#22c55e" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* ETH Card */}
          <div style={cryptoCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#6366f1", display: "inline-block" }} />
                <span style={{ fontSize: "14px", fontWeight: 800 }}>ETH / USD</span>
              </div>
              <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 800 }}>+1.82% ↗</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: 900, fontFamily: "monospace", color: "#fff" }}>$3,450.20</span>

            {/* Sparkline Graph SVG */}
            <div style={{ width: "100%", height: "30px", marginTop: "12px", opacity: 0.8 }}>
              <svg width="100%" height="100%" viewBox="0 0 200 30">
                <path d="M0 20 Q 50 25 100 10 T 160 15 T 200 5" fill="none" stroke="#22c55e" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Volume Flow Box - Glassmorphic */}
        <div style={{ marginTop: "40px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "24px", borderRadius: "24px", textAlign: "center", backdropFilter: "blur(12px)" }}>
          <span style={{ fontSize: "11px", color: BRAND.gray500, letterSpacing: "0.15em", fontWeight: 700 }}>24H AGGREGATE TRADING VOLUME</span>
          <span style={{ display: "block", fontSize: "32px", fontWeight: 900, color: "#f59e0b", marginTop: "6px", fontFamily: "monospace" }}>$4,842,910,240+ USD</span>
        </div>
      </div>
    </div>
  );
};
const cryptoCardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: "20px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

// ─────────────────────────────────────────────────────────────────────────────
// --- LP 3: CHRONOTASK (PRODUCTIVITY LIGHT) ---
// ─────────────────────────────────────────────────────────────────────────────
const ChronoTaskLP: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const scrollTop = interpolate(localFrame, [40, 140], [0, -320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        transform: `translateY(${scrollTop}px)`,
        padding: "30px 40px 100px 40px",
        backgroundColor: "#fafafb",
        backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.035) 1.5px, transparent 1.5px)",
        backgroundSize: "20px 20px",
        minHeight: "1200px", // Extended to prevent empty spaces!
        color: "#18181b",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
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
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#3b82f6" }}>Get demo</span>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "40px" }}>
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
        <button style={{ backgroundColor: "#3b82f6", color: "#ffffff", border: "none", borderRadius: "12px", padding: "10px 24px", fontSize: "11px", fontWeight: 700, boxShadow: "0 6px 18px rgba(59, 130, 246, 0.25)" }}>
          Get free demo
        </button>
      </div>

      {/* Floating UI Components */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "10px", marginBottom: "50px", position: "relative" }}>
        {/* Yellow Note (With realistic pin) */}
        <div
          style={{
            backgroundColor: "#fef08a",
            borderRadius: "12px",
            padding: "16px",
            width: "150px",
            boxShadow: "0 15px 30px rgba(133,77,14,0.08), 0 2px 4px rgba(133,77,14,0.05)",
            transform: `rotate(-4deg) scale(${noteEntrance})`,
            opacity: noteEntrance,
            position: "relative",
          }}
        >
          {/* Alfinete SVG 3D */}
          <div style={{ position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" fill="#ef4444" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))" />
              <circle cx="10" cy="10" r="3" fill="#ff8787" />
            </svg>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 800, display: "block", color: "#854d0e", marginBottom: "6px" }}>Take Notes</span>
          <span style={{ fontSize: "9px", color: "#854d0e", opacity: 0.8, lineHeight: 1.3, display: "block" }}>
            Take notes to keep track of crucial details, and accomplish more tasks with ease.
          </span>
        </div>

        {/* Task Checklist */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            padding: "16px",
            width: "190px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.03)",
            transform: `scale(${taskEntrance}) translateY(${(1 - taskEntrance) * 35}px)`,
            opacity: taskEntrance,
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 800, display: "block", marginBottom: "10px" }}>Today's Tasks</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", border: "1px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#3b82f6" }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span style={{ fontSize: "10px", textDecoration: "line-through", color: BRAND.gray300 }}>Design PPT #4</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", border: "1px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: localFrame >= 70 ? "#3b82f6" : "transparent" }}>
                {localFrame >= 70 && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
              </span>
              <span style={{ fontSize: "10px", color: localFrame >= 70 ? BRAND.gray300 : "#18181b", textDecoration: localFrame >= 70 ? "line-through" : "none" }}>Coding Landing Page</span>
            </div>
          </div>
        </div>

        {/* Relógio Glassmorphic */}
        <div
          style={{
            width: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${remindersEntrance}) rotate(3deg)`,
            opacity: remindersEntrance,
            backgroundColor: "#ffffff",
            padding: "12px",
            borderRadius: "20px",
            boxShadow: "0 25px 45px rgba(0,0,0,0.07)",
            border: "1px solid rgba(0,0,0,0.03)",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "8px", fontWeight: 800, color: BRAND.gray500, letterSpacing: "0.05em" }}>REMINDER</span>
          <img src={staticFile("chronotask_clock_icon.jpg")} alt="3D Clock Icon" style={{ width: "100%", height: "80px", borderRadius: "12px", objectFit: "cover" }} />
        </div>
      </div>

      {/* PRODUCTIVITY GRAPH & FEATURES (PREVENTS EMPTY ON SCROLL) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
        <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.03em" }}>
          Performance Tracker
        </h4>
        <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "24px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 15px 35px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <div>
              <span style={{ fontSize: "10px", color: BRAND.gray500, fontWeight: 700, letterSpacing: "0.05em" }}>WEEKLY SCORE</span>
              <span style={{ display: "block", fontSize: "24px", fontWeight: 900, color: "#3b82f6" }}>+48.6% Growth</span>
            </div>
            <span style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", fontSize: "12px", fontWeight: 700, padding: "5px 12px", borderRadius: "12px" }}>Active</span>
          </div>

          {/* Sparkline Graph with grid lines */}
          <div style={{ width: "100%", height: "80px", opacity: 0.9, position: "relative" }}>
            {/* Background Grid Lines */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
              <div style={{ borderBottom: "1px dashed rgba(0,0,0,0.05)", height: 0 }} />
              <div style={{ borderBottom: "1px dashed rgba(0,0,0,0.05)", height: 0 }} />
              <div style={{ borderBottom: "1px dashed rgba(0,0,0,0.05)", height: 0 }} />
            </div>
            
            <svg width="100%" height="100%" viewBox="0 0 400 80" style={{ position: "relative", zIndex: 2 }}>
              <path d="M 0 70 Q 100 30 200 50 T 400 15" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 0 70 Q 100 30 200 50 T 400 15 L 400 80 L 0 80 Z" fill="url(#graphgrad)" opacity="0.12" />
              <defs>
                <linearGradient id="graphgrad" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// --- LP 4: REDACTED (ANALYTICS GREEN LANDSCAPE) ---
// ─────────────────────────────────────────────────────────────────────────────
const RedactedLP: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const dashSpring = spring({
    frame: localFrame - 25,
    fps: 30,
    config: { damping: 12, stiffness: 80 },
  });

  const dashY = (1 - dashSpring) * 180;

  // Fade in for social proof logos
  const logoFade = interpolate(localFrame, [40, 70], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Header - relative positioned to sit over hills */}
      <div style={{ display: "flex", justifyContent: "space-between", zIndex: 10, position: "relative" }}>
        <span style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "-0.04em" }}>redacted</span>
        <div style={{ display: "flex", gap: "24px", fontSize: "11px", color: BRAND.gray500, fontWeight: 600 }}>
          <span>Features</span>
          <span>Pricing</span>
          <span>Docs</span>
          <span>Status</span>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: "#84cc16", color: "#000", padding: "5px 14px", borderRadius: "12px" }}>
          Get started
        </span>
      </div>

      {/* Hero Copy - relative positioned to sit over hills and remain fully visible! */}
      <div style={{ textAlign: "center", marginTop: "30px", zIndex: 10, position: "relative" }}>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "36px",
            fontWeight: 800,
            lineHeight: 1.05,
            margin: "0 0 8px 0",
            letterSpacing: "-0.04em",
            color: "#0f172a",
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

      {/* Generated Green Hills Landscape (XP Style) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "280px", // Reduced height slightly to avoid covering text/buttons!
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <img
          src={staticFile("redacted_green_hills.jpg")}
          alt="Green Hills Landscape"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Social Proof brand names overlay on bottom hills */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
          display: "flex",
          gap: "28px",
          alignItems: "center",
          opacity: logoFade,
          width: "90%",
          justifyContent: "center",
        }}
      >
        <span style={brandLogos}>vimeo</span>
        <span style={brandLogos}>Uber</span>
        <span style={brandLogos}>stripe</span>
        <span style={brandLogos}>Google</span>
        <span style={brandLogos}>Revolut</span>
      </div>

      {/* Dashboard Mockup rising from behind front hills */}
      <div
        style={{
          width: "74%",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -15px 40px rgba(0,0,0,0.08)",
          padding: "16px 18px 0 18px",
          height: "170px",
          alignSelf: "center",
          transform: `translateY(${dashY}px)`,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Dashboard header bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#fbbf24" }} />
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
            <span style={{ fontSize: "10px", fontWeight: 800, marginLeft: "4px" }}>Campaign Revenue Signals</span>
          </div>
          <span style={{ fontSize: "8px", color: BRAND.gray300, fontWeight: 600 }}>Filter by active</span>
        </div>
        {/* Mock content list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", borderBottom: "1px solid #f8fafc", paddingBottom: "6px" }}>
            <span style={{ fontWeight: 700, color: "#334155" }}>1. @erik.awesome</span>
            <span style={{ color: "#22c55e", fontWeight: 800 }}>$42,800 Revenue</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", borderBottom: "1px solid #f8fafc", paddingBottom: "6px" }}>
            <span style={{ fontWeight: 700, color: "#334155" }}>2. @amou.travels</span>
            <span style={{ color: "#22c55e", fontWeight: 800 }}>$18,400 Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
};
const brandLogos: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#ffffff",
  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  letterSpacing: "-0.02em",
  opacity: 0.8,
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
const glassCardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "18px",
  padding: "14px 20px",
  width: "160px",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};
