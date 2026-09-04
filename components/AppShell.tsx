"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ColorLegend } from "./ArabicWord";
import { useSettings } from "./SettingsProvider";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/atlas", label: "Atlas" },
  { href: "/gym", label: "Gym" },
  { href: "/spotter", label: "Spotter" },
  { href: "/lab", label: "Lab" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { showHarakat, setShowHarakat, labelMode, setLabelMode } =
    useSettings();

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-rule bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-arabic text-2xl text-accent">صرف</span>
            <span className="text-sm font-medium tracking-wide text-ink-soft">
              Sarf Trainer
            </span>
          </Link>
          <nav className="flex flex-wrap gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-accent text-paper"
                      : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowHarakat(!showHarakat)}
              className="rounded-full border border-rule px-3 py-1.5 text-ink-soft hover:border-accent"
            >
              Harakat {showHarakat ? "on" : "off"}
            </button>
            <button
              type="button"
              onClick={() =>
                setLabelMode(
                  labelMode === "form"
                    ? "wazn"
                    : labelMode === "wazn"
                      ? "both"
                      : "form",
                )
              }
              className="rounded-full border border-rule px-3 py-1.5 text-ink-soft hover:border-accent"
            >
              Labels:{" "}
              {labelMode === "form"
                ? "Form I–X"
                : labelMode === "wazn"
                  ? "وزن"
                  : "Both"}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-rule px-4 py-3">
        <div className="mx-auto flex max-w-6xl justify-end">
          <ColorLegend compact />
        </div>
      </footer>
    </div>
  );
}
