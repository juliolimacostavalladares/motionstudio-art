import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CodeWindowProps {
  delay?: number;
}

export const CodeWindow: React.FC<CodeWindowProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation for the window
  const windowScale = spring({
    frame: frame - delay,
    fps,
    config: { mass: 0.8, damping: 14, stiffness: 100 },
  });

  const windowScaleVal = Math.max(0, windowScale);

  // Typing logic
  const codeLines = [
    'const motion = build({',
    '  focus: "resultado",',
    '  process: "transparente",',
    '  delivery: "ágil",',
    '  support: "contínuo"',
    '});',
    '',
    '// Movimentando negócios',
    'motion.launch();',
  ];

  // Total characters to type
  const fullText = codeLines.join("\n");
  const typingStartFrame = delay + 25;
  const charsTyped = Math.floor(
    interpolate(frame - typingStartFrame, [0, 90], [0, fullText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Format code helper for coloring
  const renderTypedCode = (text: string) => {
    // Split the typed portion into lines
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // Very basic syntax highlighting based on keywords
      const words = line.split(" ");
      return (
        <div key={lineIdx} className="min-h-[1.5em] font-mono text-[13px] leading-relaxed">
          {words.map((word, wordIdx) => {
            let color = "text-neutral-300"; // default
            let isString = false;
            
            // Check if string literal
            if (word.includes('"')) {
              color = "text-sky-300"; // string color
              isString = true;
            }

            if (!isString) {
              if (word === "const" || word === "const\n") {
                color = "text-[#d4e157] font-semibold";
              } else if (word.includes("build") || word.includes("launch")) {
                color = "text-blue-400";
              } else if (word.startsWith("//")) {
                color = "text-neutral-500 italic";
              }
            }

            return (
              <span key={wordIdx} className={color}>
                {word}
                {wordIdx < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
      );
    });
  };

  // Cursor blinking
  const showCursor = Math.floor((frame - delay) / 8) % 2 === 0 && frame < typingStartFrame + 105;

  // Running output (launches after typing is done)
  const isLaunched = frame > typingStartFrame + 100;
  const launchProgress = spring({
    frame: frame - (typingStartFrame + 100),
    fps,
    config: { mass: 0.5, damping: 10, stiffness: 120 },
  });

  // Floating tags spring animations
  const tag1Scale = spring({
    frame: frame - (typingStartFrame + 110),
    fps,
    config: { mass: 0.7, damping: 12, stiffness: 110 },
  });

  const tag2Scale = spring({
    frame: frame - (typingStartFrame + 125),
    fps,
    config: { mass: 0.7, damping: 12, stiffness: 110 },
  });

  // Gentle float for tag 1
  const tag1Float = Math.sin(frame * 0.05) * 4;
  // Gentle float for tag 2
  const tag2Float = Math.cos(frame * 0.05) * 4;

  return (
    <div
      style={{
        transform: `scale(${windowScaleVal})`,
        transformOrigin: "center center",
      }}
      className="relative w-full max-w-[480px] px-4"
    >
      {/* Main Glassmorphic window */}
      <div
        className="w-full rounded-3xl border border-white/10 bg-neutral-900/60 p-6 shadow-2xl backdrop-blur-xl"
        style={{
          boxShadow: "0 30px 70px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Header Mac-like buttons */}
        <div className="flex gap-2 mb-5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Code Block Container */}
        <div className="relative font-mono min-h-[170px] select-none text-left">
          {renderTypedCode(fullText.substring(0, charsTyped))}
          {showCursor && (
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "15px",
                backgroundColor: "#d4e157",
                marginLeft: "2px",
                verticalAlign: "middle",
              }}
            />
          )}
        </div>

        {/* Execution Output Panel */}
        {isLaunched && (
          <div
            style={{
              transform: `scale(${launchProgress})`,
              transformOrigin: "top center",
              opacity: launchProgress,
            }}
            className="mt-4 border-t border-white/5 pt-4 text-left font-mono text-[12px]"
          >
            <div className="flex items-center gap-2 text-[#d4e157]">
              <span className="h-2 w-2 rounded-full bg-[#d4e157] animate-pulse" />
              <span>[SUCCESS] Product launched successfully!</span>
            </div>
            <div className="text-neutral-500 mt-1 pl-4">
              &gt; Delivery in production.
            </div>
          </div>
        )}
      </div>

      {/* Floating tags */}
      {tag1Scale > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "-15px",
            right: "0px",
            transform: `scale(${tag1Scale}) translateY(${tag1Float}px)`,
            zIndex: 10,
          }}
          className="rounded-xl border border-white/10 bg-[#111111] px-4 py-2 text-[12px] font-semibold text-[#d4e157] shadow-xl"
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
            zIndex: 10,
          }}
          className="rounded-xl border border-[#d4e157]/20 bg-[#111111] px-4 py-2 text-[12px] font-semibold text-white shadow-xl"
        >
          Entrega em semanas
        </div>
      )}
    </div>
  );
};
