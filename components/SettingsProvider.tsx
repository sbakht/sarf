"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LabelMode } from "@/lib/sarf";

/** Baseline px for scale — matches default “16px” setting (scale 1). */
export const ARABIC_FONT_SIZE_BASE = 16;

type Settings = {
  showHarakat: boolean;
  labelMode: LabelMode;
  /** Prototype: absolute px choice that scales all `.font-arabic` live. */
  arabicFontSize: string;
  setShowHarakat: (value: boolean) => void;
  setLabelMode: (value: LabelMode) => void;
  setArabicFontSize: (value: string) => void;
};

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({
  children,
  initialShowHarakat = true,
  initialLabelMode = "both",
  initialArabicFontSize = String(ARABIC_FONT_SIZE_BASE),
}: {
  children: ReactNode;
  initialShowHarakat?: boolean;
  initialLabelMode?: LabelMode;
  initialArabicFontSize?: string;
}) {
  const [showHarakat, setShowHarakat] = useState(initialShowHarakat);
  const [labelMode, setLabelMode] = useState<LabelMode>(initialLabelMode);
  const [arabicFontSize, setArabicFontSize] = useState(initialArabicFontSize);

  useEffect(() => {
    const px = Number(arabicFontSize);
    const scale =
      Number.isFinite(px) && px > 0 ? px / ARABIC_FONT_SIZE_BASE : 1;
    document.documentElement.style.setProperty(
      "--arabic-font-scale",
      String(scale),
    );
  }, [arabicFontSize]);

  const value = useMemo(
    () => ({
      showHarakat,
      labelMode,
      arabicFontSize,
      setShowHarakat,
      setLabelMode,
      setArabicFontSize,
    }),
    [showHarakat, labelMode, arabicFontSize],
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
