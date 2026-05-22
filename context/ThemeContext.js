import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform, useColorScheme } from "react-native";
import {
  breakpoints,
  motion,
  palettes,
  radii,
  spacing,
  typography,
  zIndex,
} from "../constants/designSystem";

const storageKey = "volunteerapp.themeMode";

const ThemeContext = createContext(null);

function readStoredMode() {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === "dark" || stored === "light" || stored === "system"
      ? stored
      : null;
  } catch (error) {
    return null;
  }
}

function writeStoredMode(mode) {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, mode);
  } catch (error) {
    // Preference persistence is best effort on platforms without storage access.
  }
}

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState("system");

  useEffect(() => {
    const storedMode = readStoredMode();
    if (storedMode) {
      setModeState(storedMode);
    }
  }, []);

  const resolvedMode = mode === "system" ? systemScheme || "light" : mode;
  const colors = palettes[resolvedMode] || palettes.light;

  const setMode = useCallback((nextMode) => {
    setModeState(nextMode);
    writeStoredMode(nextMode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(resolvedMode === "dark" ? "light" : "dark");
  }, [resolvedMode, setMode]);

  const value = useMemo(
    () => ({
      mode,
      resolvedMode,
      isDark: resolvedMode === "dark",
      colors,
      spacing,
      radii,
      typography,
      breakpoints,
      motion,
      zIndex,
      setMode,
      toggleMode,
    }),
    [colors, mode, resolvedMode, setMode, toggleMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useVolunteerTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useVolunteerTheme must be used within ThemeProvider");
  }
  return context;
}
