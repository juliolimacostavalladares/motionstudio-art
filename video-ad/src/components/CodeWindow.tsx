import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface CodeWindowProps {
  delay?: number;
}

// ─── Code Token Definitions ────────────────────────────────────────────────
const CODE_LINES = [
  { tokens: [{ t: "const ", c: "kw" }, { t: "motion", c: "var" }, { t: " = ", c: "op" }, { t: "build", c: "fn" }, { t: "({", c: "punct" }] },
  { tokens: [{ t: "  focus", c: "key" }, { t: ": ", c: "op" }, { t: '"resultado"', c: "str" }, { t: ",", c: "punct" }] },
  { tokens: [{ t: "  process", c: "key" }, { t: ": ", c: "op" }, { t: '"transparente"', c: "str" }, { t: ",", c: "punct" }] },
  { tokens: [{ t: "  delivery", c: "key" }, { t: ": ", c: "op" }, { t: '"ágil"', c: "str" }, { t: ",", c: "punct" }] },
  { tokens: [{ t: "  support", c: "key" }, { t: ": ", c: "op" }, { t: '"contínuo"', c: "str" }] },
  { tokens: [{ t: "});", c: "punct" }] },
  { tokens: [] },
  { tokens: [{ t: "// Movimentando negócios", c: "comment" }] },
  { tokens: [{ t: "motion", c: "var" }, { t: ".", c: "op" }, { t: "launch", c: "fn" }, { t: "();", c: "punct" }] },
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

// Custom timings for quick human-like typing simulation
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

// Slower base speed for natural relaxed typing inside 225 frames scene
const BASE_FRAMES_PER_CHAR = 0.85;

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

export const CodeWindow: React.FC<CodeWindowProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Window Entrance Scale Animation - smoother physics
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

  // Typist Character Count
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

  // Map flat character count to lines
  let remaining = charsTyped;
  const charsPerLine = CODE_LINES.map((line) => {
    const lineLen = line.tokens.length
      ? line.tokens.reduce((s, t) => s + t.t.length, 0)
      : 0;
    const vis = Math.max(0, Math.min(lineLen, remaining));
    remaining = Math.max(0, remaining - lineLen - 1);
    return vis;
  });

  // ─── 3D Flip Timings (Calibrated for 360 frames) ─────────────────────────
  // Typing starts at 35. Takes ~152 frames, ending around frame 187.
  // We trigger the flip starting at frame 195.
  const flipTriggerFrame = delay + 185;
  const flipSpring = spring({
    frame: frame - flipTriggerFrame,
    fps,
    config: { mass: 1.5, damping: 24, stiffness: 35 }, // Highly cinematic relaxed flip
  });
  
  // Rotates exactly 180 degrees
  const rotationY = interpolate(flipSpring, [0, 1], [0, 180]);

  // Inner components animations inside the dashboard (verso)
  const dashboardActive = frame > flipTriggerFrame + 18;
  const dbElementStart = flipTriggerFrame + 22;

  // Spring values for the dashboard charts and widgets - smoother transition
  const widgetScale = spring({
    frame: frame - dbElementStart,
    fps,
    config: { mass: 0.9, damping: 15, stiffness: 80 },
  });

  // 5 bar chart heights springs - gentle staggered rise
  const bar1 = spring({ frame: frame - (dbElementStart + 8), fps, config: { damping: 16, stiffness: 70 } });
  const bar2 = spring({ frame: frame - (dbElementStart + 13), fps, config: { damping: 16, stiffness: 70 } });
  const bar3 = spring({ frame: frame - (dbElementStart + 18), fps, config: { damping: 16, stiffness: 70 } });
  const bar4 = spring({ frame: frame - (dbElementStart + 23), fps, config: { damping: 16, stiffness: 70 } });
  const bar5 = spring({ frame: frame - (dbElementStart + 28), fps, config: { damping: 16, stiffness: 70 } });

  // Floating tags appear last
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
      {/* ── 3D Card Container ────────────────────────────────────────────── */}
      <div
        style={{
          transform: `rotateY(${rotationY}deg)`,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
        }}
        className="relative transition-transform duration-75"
      >
        
        {/* ── FRONT FACE: Code Editor ────────────────────────────────────── */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
          }}
          className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-neutral-900/80 p-6 backdrop-blur-xl flex flex-col justify-start"
        >
          {/* Header OS-like indicators */}
          <div className="flex gap-2 mb-5 shrink-0">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-auto text-[10px] text-neutral-500 font-mono tracking-wide">
              motion.js
            </span>
          </div>

          {/* Typing Area */}
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

                {/* Cursor placement inside lines */}
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

        {/* ── BACK FACE: Complete Modern Platform App ───────────────────── */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
          }}
          className="absolute inset-0 w-full h-full rounded-3xl border border-[#d4e157]/20 bg-neutral-950/90 p-5 backdrop-blur-2xl flex flex-col justify-between"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-lg bg-[#d4e157] flex items-center justify-center text-[10px] font-black text-black">
                M
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight">
                Motion Analytics
              </span>
            </div>
            
            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest">
                LIVE
              </span>
            </div>
          </div>

          {/* Metrics Overview Row */}
          {dashboardActive && (
            <div
              style={{ transform: `scale(${widgetScale})` }}
              className="grid grid-cols-2 gap-3 my-3"
            >
              {/* Metric Card 1 */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left">
                <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wide">
                  Faturamento
                </span>
                <div className="text-[17px] font-black text-white mt-0.5">
                  R$ 142.850
                </div>
                <span className="text-[9px] font-bold text-emerald-400">
                  +48.2% este mês
                </span>
              </div>

              {/* Metric Card 2 */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left">
                <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wide">
                  Conversão
                </span>
                <div className="text-[17px] font-black text-[#d4e157] mt-0.5">
                  4.85%
                </div>
                <span className="text-[9px] font-bold text-neutral-400">
                  Uptime 99.98%
                </span>
              </div>
            </div>
          )}

          {/* Bar Chart Section */}
          {dashboardActive && (
            <div className="flex-grow flex flex-col justify-end bg-neutral-900/30 rounded-xl border border-white/5 p-3">
              <div className="flex items-end justify-between h-[80px] px-2 gap-2">
                {[
                  { height: 42, color: "#cbd5e1", springVal: bar1 },
                  { height: 68, color: "#94a3b8", springVal: bar2 },
                  { height: 55, color: "#64748b", springVal: bar3 },
                  { height: 95, color: "#a3e635", springVal: bar4 },
                  { height: 110, color: "#d4e157", springVal: bar5 },
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    className="flex-grow rounded-md relative overflow-hidden"
                    style={{
                      height: `${bar.height * bar.springVal}px`,
                      backgroundColor: bar.color,
                      opacity: bar.springVal,
                      transition: "background-color 0.3s",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-neutral-500 font-semibold mt-2 px-1">
                <span>Semana 1</span>
                <span>Semana 2</span>
                <span>Semana 3</span>
                <span>Semana 4</span>
                <span>Lançamento</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Floating Tags (Outside the 3D element so they float overlays) ── */}
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
          +120% eficiência
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
          Entrega em semanas
        </div>
      )}
    </div>
  );
};
