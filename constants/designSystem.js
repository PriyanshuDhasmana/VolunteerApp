import { Platform } from "react-native";

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const radii = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 8,
  xl: 8,
  pill: 999,
};

export const typography = {
  hero: { fontSize: 44, lineHeight: 50, fontWeight: "900" },
  h1: { fontSize: 34, lineHeight: 41, fontWeight: "900" },
  h2: { fontSize: 24, lineHeight: 31, fontWeight: "900" },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "900" },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "700" },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "800" },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: "900" },
};

export const breakpoints = {
  phone: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1440,
};

export const zIndex = {
  base: 0,
  sticky: 20,
  overlay: 60,
  toast: 90,
  modal: 100,
};

export const motion = {
  fast: 160,
  base: 220,
  slow: 360,
  easing: "ease",
};

export const palettes = {
  light: {
    mode: "light",
    background: "#F4F7FB",
    backgroundAlt: "#EEF7F5",
    surface: "#FFFDF8",
    surfaceStrong: "#FFFFFF",
    surfaceMuted: "#EEF4FA",
    glass: "rgba(255, 255, 255, 0.78)",
    ink: "#1E293B",
    muted: "#5F6F89",
    faint: "#8793A8",
    line: "rgba(43, 61, 92, 0.11)",
    lineStrong: "rgba(43, 61, 92, 0.18)",
    blue: "#2563B8",
    blueSoft: "#E6F1FF",
    aqua: "#18AFC7",
    aquaSoft: "#E1F9FB",
    red: "#CC3D58",
    redSoft: "#FFE4EA",
    green: "#258B69",
    greenSoft: "#E2F6EE",
    lime: "#6C9E24",
    limeSoft: "#EFF8DD",
    yellow: "#C98916",
    yellowSoft: "#FFF1C7",
    violet: "#7377D8",
    violetSoft: "#E9EBFF",
    pink: "#C94C83",
    pinkSoft: "#FFE8F2",
    success: "#1E8A62",
    warning: "#B87612",
    danger: "#C9344F",
    focus: "#2563B8",
    overlay: "rgba(17, 24, 39, 0.36)",
    textOnAccent: "#FFFFFF",
  },
  dark: {
    mode: "dark",
    background: "#0F1723",
    backgroundAlt: "#13232A",
    surface: "#162131",
    surfaceStrong: "#1C293C",
    surfaceMuted: "#213049",
    glass: "rgba(25, 36, 52, 0.78)",
    ink: "#F3F7FB",
    muted: "#C4CDDB",
    faint: "#93A1B6",
    line: "rgba(214, 228, 245, 0.13)",
    lineStrong: "rgba(214, 228, 245, 0.2)",
    blue: "#74A7FF",
    blueSoft: "#18365F",
    aqua: "#4DD7E6",
    aquaSoft: "#113D45",
    red: "#FF7C96",
    redSoft: "#4C1F2A",
    green: "#6AE0AF",
    greenSoft: "#153F33",
    lime: "#A6DA65",
    limeSoft: "#314119",
    yellow: "#FFD36A",
    yellowSoft: "#4A3814",
    violet: "#AAA7FF",
    violetSoft: "#302F5F",
    pink: "#FF8CC3",
    pinkSoft: "#4C203A",
    success: "#72E1B1",
    warning: "#FFD36A",
    danger: "#FF7C96",
    focus: "#8FBCFF",
    overlay: "rgba(2, 6, 23, 0.62)",
    textOnAccent: "#FFFFFF",
  },
};

export const toneNames = [
  "blue",
  "aqua",
  "red",
  "green",
  "lime",
  "yellow",
  "violet",
  "pink",
];

export function getTone(palette, name = "blue") {
  const normalized = toneNames.includes(name) ? name : "blue";
  return {
    icon: palette[normalized],
    bg: palette[`${normalized}Soft`],
  };
}

export function shadow(palette, level = 1) {
  const dark = palette.mode === "dark";
  const radius = level === 2 ? 24 : 14;
  const opacity = dark ? (level === 2 ? 0.38 : 0.28) : level === 2 ? 0.18 : 0.11;

  if (Platform.OS === "web") {
    const color = dark
      ? `rgba(0, 0, 0, ${opacity})`
      : `rgba(111, 131, 163, ${opacity})`;
    const y = level === 2 ? 14 : 8;
    return {
      boxShadow: `0 ${y}px ${radius}px ${color}`,
    };
  }

  return {
    shadowColor: dark ? "#000000" : "#6F83A3",
    shadowOffset: { width: 0, height: level === 2 ? 14 : 8 },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: level === 2 ? 8 : 4,
  };
}

export function backgroundGradient(palette) {
  if (Platform.OS !== "web") {
    return { backgroundColor: palette.background };
  }

  if (palette.mode === "dark") {
    return {
      backgroundColor: palette.background,
      backgroundImage:
        "linear-gradient(118deg, #0f1723 0%, #13232a 44%, #19233a 100%)",
    };
  }

  return {
    backgroundColor: palette.background,
    backgroundImage:
      "linear-gradient(118deg, #e2fbf6 0%, #edf7ff 38%, #fff7f2 68%, #e9f5ff 100%)",
  };
}

export function responsiveFlags(width) {
  return {
    isTiny: width < 360,
    isPhone: width < breakpoints.phone,
    isMobile: width < breakpoints.tablet,
    isTablet: width >= breakpoints.tablet && width < breakpoints.laptop,
    isCompact: width < breakpoints.laptop,
    isWide: width >= breakpoints.desktop,
  };
}
