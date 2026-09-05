"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ColorLegend } from "./ArabicWord";
import { useSettings } from "./SettingsProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/lessons", label: "Lessons" },
  { href: "/atlas", label: "Atlas" },
  { href: "/gym", label: "Gym" },
  { href: "/spotter", label: "Spotter" },
  { href: "/lab", label: "Lab" },
];

const BARE_ROUTES = ["/quiz"];

function isBareRoute(pathname: string): boolean {
  return BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function navActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { showHarakat, setShowHarakat, labelMode, setLabelMode } =
    useSettings();
  const { resolvedTheme, setTheme } = useTheme();

  if (isBareRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-arabic text-2xl text-primary">صرف</span>
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              Sarf Trainer
            </span>
          </Link>
          <nav className="flex flex-wrap gap-1">
            {NAV.map((item) => {
              const active = navActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    buttonVariants({
                      variant: active ? "default" : "ghost",
                      size: "sm",
                    }),
                    "rounded-full",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-3"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle dark mode"
            >
              <Sun className="size-3.5 dark:hidden" />
              <Moon className="hidden size-3.5 dark:block" />
              Dark <span className="dark:hidden">off</span>
              <span className="hidden dark:inline">on</span>
            </Button>
            <Toggle
              pressed={showHarakat}
              onPressedChange={setShowHarakat}
              variant="outline"
              size="sm"
              className="rounded-full px-3"
            >
              Harakat {showHarakat ? "on" : "off"}
            </Toggle>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-3"
              onClick={() =>
                setLabelMode(
                  labelMode === "form"
                    ? "wazn"
                    : labelMode === "wazn"
                      ? "both"
                      : "form",
                )
              }
            >
              Labels:{" "}
              {labelMode === "form"
                ? "Form I–X"
                : labelMode === "wazn"
                  ? "وزن"
                  : "Both"}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
      <footer className="px-4 py-3">
        <Separator className="mb-3" />
        <div className="mx-auto flex max-w-6xl justify-end">
          <ColorLegend compact />
        </div>
      </footer>
    </div>
  );
}
