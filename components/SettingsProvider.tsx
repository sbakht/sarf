"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LabelMode } from "@/lib/sarf";

type Settings = {
  showHarakat: boolean;
  labelMode: LabelMode;
  setShowHarakat: (value: boolean) => void;
  setLabelMode: (value: LabelMode) => void;
};

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({
  children,
  initialShowHarakat = true,
  initialLabelMode = "form",
}: {
  children: ReactNode;
  initialShowHarakat?: boolean;
  initialLabelMode?: LabelMode;
}) {
  const [showHarakat, setShowHarakat] = useState(initialShowHarakat);
  const [labelMode, setLabelMode] = useState<LabelMode>(initialLabelMode);
  const value = useMemo(
    () => ({ showHarakat, labelMode, setShowHarakat, setLabelMode }),
    [showHarakat, labelMode],
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
