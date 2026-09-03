"use client";

import { stripHarakat } from "@/lib/sarf";
import type { MorphemeSlot, SlotKind } from "@/lib/sarf";
import { useSettings } from "./SettingsProvider";

const KIND_CLASS: Record<SlotKind, string> = {
  f: "text-fa font-semibold",
  a: "text-ayn font-semibold",
  l: "text-lam font-semibold",
  extra: "text-extra font-semibold underline decoration-dotted decoration-2 underline-offset-4",
  prefix: "text-affix font-normal opacity-80",
  suffix: "text-affix font-normal opacity-80",
};

export function ArabicWord({
  slots,
  surface,
  className = "",
  size = "md",
  highlight,
}: {
  slots?: MorphemeSlot[];
  surface?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  highlight?: SlotKind[];
}) {
  const { showHarakat } = useSettings();
  const sizeClass = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl",
  }[size];
  const marked = new Set(highlight ?? []);

  if (!slots || slots.length === 0) {
    const text = surface ?? "—";
    return (
      <span dir="rtl" className={`font-arabic ${sizeClass} ${className}`}>
        {showHarakat ? text : stripHarakat(text)}
      </span>
    );
  }

  return (
    <span dir="rtl" className={`font-arabic ${sizeClass} ${className} tracking-wide`}>
      {slots.map((slot, i) => (
        <span
          key={`${slot.kind}-${i}`}
          className={`${KIND_CLASS[slot.kind]}${
            marked.has(slot.kind) ? " rounded-sm bg-paper-deep/80 px-0.5 ring-1 ring-rule" : ""
          }`}
        >
          {showHarakat ? slot.text : stripHarakat(slot.text)}
        </span>
      ))}
    </span>
  );
}

export function ColorLegend({ compact = false }: { compact?: boolean }) {
  const items = [
    { label: "ف", cls: KIND_CLASS.f, name: "1st radical" },
    { label: "ع", cls: KIND_CLASS.a, name: "2nd radical" },
    { label: "ل", cls: KIND_CLASS.l, name: "3rd radical" },
    { label: "زائد", cls: KIND_CLASS.extra, name: "form extra" },
    { label: "ضمير", cls: KIND_CLASS.prefix, name: "person affix" },
  ];
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1 ${compact ? "text-xs" : "text-sm"} text-ink-soft`}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className={`font-arabic text-base ${item.cls}`}>{item.label}</span>
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
}
