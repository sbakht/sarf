"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LabelMode } from "@/lib/sarf";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  readTheme,
  type Theme,
} from "@/lib/theme";

type Settings = {
  showHarakat: boolean;
  labelMode: LabelMode;
  theme: Theme;
  setShowHarakat: (value: boolean) => void;
  setLabelMode: (value: LabelMode) => void;
  setTheme: (value: Theme) => void;
};

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({
  children,
  initialShowHarakat = true,
  initialLabelMode = "both",
}: {
  children: ReactNode;
  initialShowHarakat?: boolean;
  initialLabelMode?: LabelMode;
}) {
  const [showHarakat, setShowHarakat] = useState(initialShowHarakat);
  const [labelMode, setLabelMode] = useState<LabelMode>(initialLabelMode);
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (value: Theme) => {
    setThemeState(value);
    localStorage.setItem(THEME_STORAGE_KEY, value);
    applyTheme(value);
  };

  const value = useMemo(
    () => ({
      showHarakat,
      labelMode,
      theme,
      setShowHarakat,
      setLabelMode,
      setTheme,
    }),
    [showHarakat, labelMode, theme],
  );
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): Settings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
