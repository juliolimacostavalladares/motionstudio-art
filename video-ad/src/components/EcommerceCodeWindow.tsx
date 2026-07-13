import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate, staticFile } from "remotion";

interface EcommerceCodeWindowProps {
  delay?: number;
}

// ─── Ecommerce Code Tokens ──────────────────────────────────────────────────
const CODE_LINES = [
  { tokens: [{ t: "const ", c: "kw" }, { t: "store", c: "var" }, { t: " = ", c: "op" }, { t: "createStore", c: "fn" }, { t: "({", c: "punct" }] },
  { tokens: [{ t: "  niche", c: "key" }, { t: ": ", c: "op" }, { t: '"premium"', c: "str" }, { t: ",", c: "punct" }] },
  { tokens: [{ t: "  design", c: "key" }, { t: ": ", c: "op" }, { t: '"exclusivo"', c: "str" }, { t: ",", c: "punct" }] },
  { tokens: [{ t: "  checkout", c: "key" }, { t: ": ", c: "op" }, { t: '"transparente"', c: "str" }, { t: ",", c: "punct" }] },
  { tokens: [{ t: "  scale", c: "key" }, { t: ": ", c: "op" }, { t: '"ilimitada"', c: "str" }] },
  { tokens: [{ t: "});", c: "punct" }] },
  { tokens: [] },
  { tokens: [{ t: "// Lançando e-commerce", c: "comment" }] },
  { tokens: [{ t: "store", c: "var" }, { t: ".", c: "op" }, { t: "goLive", c: "fn" }, { t: "();", c: "punct" }] },
];

const COLOR_MAP: Record<string, string> = {
  kw:      "#d4e157",   // keyword  → lime
  var:     "#e2e8f0",   // variable → white-ish
  fn:      "#60a5fa",   // function → blue
  key:     "#f472b6",   // object key → pink
  str:     "#86efac",   // string → green
  op:      "#94a3b8",   // operator → slate
  punct:   "#64748b",   // punctuation → dim slate
  comment: "#475569",   // comment → dark slate italic
};

const FULL_TEXT = CODE_LINES.map((l) => l.tokens.map((t) => t.t).join("")).join("\n");

function buildCharTimings(text: string, baseFramesPerChar: number): number[] {
  const timings: number[] = [];
  let cumulative = 0;
  for (let i = 0; i < text.length; i++) {
    let speed = baseFramesPerChar;
    if (i > 0 && (text[i - 1] === "," || text[i - 1] === "{" || text[i - 1] === "}")) {
      speed *= 2.2;
    } else if (i > 0 && text[i - 1] === "\n") {
      speed *= 1.8;
    }
    const variance = 0.8 + ((i * 17 + 3) % 5) * 0.09;
    cumulative += speed * variance;
    timings.push(cumulative);
  }
  return timings;
}

const BASE_FRAMES_PER_CHAR = 1.05;

const renderSyntaxLine = (
  lineTokens: { t: string; c: string }[],
  visibleChars: number
) => {
  let remaining = visibleChars;
  return lineTokens.map((token, ti) => {
    if (remaining <= 0) return null;
    const visible = token.t.slice(0, remaining);
    remaining -= token.t.length;
    const color = COLOR_MAP[token.c] ?? "#e2e8f0";
    const isItalic = token.c === "comment";
    return (
      <span
        key={ti}
        style={{
          color,
          fontStyle: isItalic ? "italic" : "normal",
          fontWeight: token.c === "kw" ? 700 : token.c === "fn" ? 600 : 400,
        }}
      >
        {visible}
      </span>
    );
  });
};

export const EcommerceCodeWindow: React.FC<EcommerceCodeWindowProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance scaling
  const windowScale = spring({
    frame: frame - delay,
    fps,
    config: { mass: 0.9, damping: 18, stiffness: 85 },
  });

  const charTimings = React.useMemo(
    () => buildCharTimings(FULL_TEXT, BASE_FRAMES_PER_CHAR),
    []
  );

  const typingStartFrame = delay + 25;
  const elapsed = frame - typingStartFrame;

  let charsTyped = 0;
  if (elapsed > 0) {
    for (let i = 0; i < charTimings.length; i++) {
      if (charTimings[i] <= elapsed) charsTyped = i + 1;
      else break;
    }
  }
  charsTyped = Math.min(charsTyped, FULL_TEXT.length);

  const isTypingDone = charsTyped >= FULL_TEXT.length;
  const cursorVisible = !isTypingDone && Math.floor(elapsed / 8) % 2 === 0;

  let remaining = charsTyped;
  const charsPerLine = CODE_LINES.map((line) => {
    const lineLen = line.tokens.length
      ? line.tokens.reduce((s, t) => s + t.t.length, 0)
      : 0;
    const vis = Math.max(0, Math.min(lineLen, remaining));
    remaining = Math.max(0, remaining - lineLen - 1);
    return vis;
  });

  // 3D Flip Timings (Calibrated for 360 frames)
  const flipTriggerFrame = delay + 185;
  const flipSpring = spring({
    frame: frame - flipTriggerFrame,
    fps,
    config: { mass: 1.5, damping: 24, stiffness: 35 },
  });
  
  const rotationY = interpolate(flipSpring, [0, 1], [0, 180]);

  // Floating tags appear after flip starts
  const dbElementStart = flipTriggerFrame + 22;
  const tag1Scale = spring({
    frame: frame - (dbElementStart + 32),
    fps,
    config: { mass: 0.8, damping: 14, stiffness: 95 },
  });
  const tag2Scale = spring({
    frame: frame - (dbElementStart + 42),
    fps,
    config: { mass: 0.8, damping: 14, stiffness: 95 },
  });

  const tag1Float = Math.sin(frame * 0.05) * 4;
  const tag2Float = Math.cos(frame * 0.05) * 4;

  return (
    <div
      style={{
        transform: `scale(${Math.max(0, windowScale)})`,
        transformOrigin: "center center",
        perspective: 1200,
      }}
      className="relative w-full max-w-[480px] h-[340px] px-4"
    >
      {/* 3D Container */}
      <div
        style={{
          transform: `rotateY(${rotationY}deg)`,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
        }}
        className="relative transition-transform duration-75"
      >
        
        {/* FRONT: Code Editor */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
          }}
          className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-neutral-900/80 p-6 backdrop-blur-xl flex flex-col justify-start"
        >
          <div className="flex gap-2 mb-5 shrink-0">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-auto text-[10px] text-neutral-500 font-mono tracking-wide">
              store.js
            </span>
          </div>

          <div className="relative font-mono select-none text-left flex-grow">
            {CODE_LINES.map((line, li) => (
              <div
                key={li}
                className="min-h-[1.5em] text-[13px] leading-relaxed"
              >
                <span
                  className="inline-block w-5 mr-3 text-right text-[10px] select-none"
                  style={{ color: "#475569" }}
                >
                  {li + 1}
                </span>

                {line.tokens.length === 0
                  ? "\u00A0"
                  : renderSyntaxLine(line.tokens, charsPerLine[li] ?? 0)}

                {!isTypingDone &&
                  cursorVisible &&
                  li === CODE_LINES.findIndex((_, i) => (charsPerLine[i] ?? 0) < (CODE_LINES[i].tokens.reduce((s,t)=>s+t.t.length,0) || 0)) && (
                    <span className="inline-block w-1.5 h-3.5 bg-[#d4e157] ml-0.5 align-middle rounded-sm" />
                  )}
              </div>
            ))}

            {isTypingDone && cursorVisible && (
              <span className="inline-block w-1.5 h-3.5 bg-[#d4e157] ml-0.5 align-middle rounded-sm" />
            )}
          </div>
        </div>

        {/* BACK: Finished Ecommerce Mockup */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
          }}
          className="absolute inset-0 w-full h-full rounded-3xl border border-[#d4e157]/20 bg-neutral-950/90 overflow-hidden flex items-center justify-center p-0.5"
        >
          <img
            src={staticFile("original-f09ad4491cf30c1628e68083ad7d12ad.webp")}
            alt="Ecommerce Premium Platform"
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>

      </div>

      {/* Floating tags */}
      {tag1Scale > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "-15px",
            right: "0px",
            transform: `scale(${tag1Scale}) translateY(${tag1Float}px)`,
            zIndex: 30,
          }}
          className="rounded-xl border border-white/10 bg-[#111111] px-4 py-2 text-[12px] font-semibold text-[#d4e157] shadow-2xl"
        >
          Vendas no Ar
        </div>
      )}

      {tag2Scale > 0.01 && (
        <div
          style={{
            position: "absolute",
            bottom: "-15px",
            left: "-5px",
            transform: `scale(${tag2Scale}) translateY(${tag2Float}px)`,
            zIndex: 30,
          }}
          className="rounded-xl border border-[#d4e157]/20 bg-[#111111] px-4 py-2 text-[12px] font-semibold text-white shadow-2xl"
        >
          Ecommerce Completo
        </div>
      )}
    </div>
  );
};
