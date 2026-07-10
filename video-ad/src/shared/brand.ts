/**
 * Motion Studio — Design Tokens
 * Source of truth extracted from site/index.html CSS variables.
 * All motion design components must import from here.
 */

// ── Colors ──────────────────────────────────────────────────────────────────
export const BRAND = {
  black:   "#0a0a0a",
  black2:  "#111111",
  lime:    "#d4e157",
  limeDark:"#b5c63e",
  white:   "#f5f5f5",
  gray100: "#e5e5e5",
  gray300: "#a3a3a3",
  gray500: "#737373",
  gray700: "#404040",
  gray800: "#262626",
  gray900: "#171717",
} as const;

// ── Opacity shortcuts ────────────────────────────────────────────────────────
export const LIME          = BRAND.lime;
export const LIME_08       = `${BRAND.lime}14`;  // 8%
export const LIME_12       = `${BRAND.lime}1f`;  // 12%
export const LIME_20       = `${BRAND.lime}33`;  // 20%
export const LIME_30       = `${BRAND.lime}4d`;  // 30%
export const LIME_40       = `${BRAND.lime}66`;  // 40%
export const LIME_55       = `${BRAND.lime}8c`;  // 55%

export const BORDER_DEFAULT = "rgba(255,255,255,0.08)";
export const BORDER_ACCENT  = "rgba(212,225,87,0.22)";
export const BORDER_LIME    = "rgba(212,225,87,0.45)";

// ── Logo mark SVG path (200×200 viewBox) ────────────────────────────────────
export const LOGO_PATH =
  "M100 40C66.86 40 40 66.86 40 100C40 133.14 66.86 160 100 160H160V100C160 66.86 133.14 40 100 40Z";

// ── Stroke weights ──────────────────────────────────────────────────────────
export const STROKE = {
  decorative: 1,
  thin:       1.5,
  normal:     2,
  strong:     2.5,
  bold:       3,
  hero:       4,
} as const;

// ── Border radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  sm:  8,
  md:  14,
  lg:  20,
  xl:  28,
} as const;

// ── Typography sizes (px) ────────────────────────────────────────────────────
export const TYPE = {
  label:     10,
  caption:   11,
  body:      13,
  bodyLg:    15,
  subhead:   17,
  headline:  22,
  display:   36,
  hero:      64,
} as const;
