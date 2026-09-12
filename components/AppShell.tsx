"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Settings, Sun } from "lucide-react";
import { ColorLegend } from "./ArabicWord";
import { useSettings } from "./SettingsProvider";
import { SliderSelect } from "./SliderSelect";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ARABIC_FONT_SIZE_OPTIONS = [
  { value: "12", label: "12px" },
  { value: "14", label: "14px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
  { value: "20", label: "20px" },
  { value: "24", label: "24px" },
];

const NAV = [
  { href: "/landing", label: "Home" },
  { href: "/lessons", label: "Lessons" },
  { href: "/weak", label: "Weak" },
  { href: "/atlas", label: "Atlas" },
  { href: "/gym", label: "Gym" },
  { href: "/", label: "Quiz" },
  { href: "/lab", label: "Lab" },
];

const BARE_ROUTES = ["/"];

function isBareRoute(pathname: string): boolean {
  return BARE_ROUTES.some((route) =>
    route === "/"
      ? pathname === "/"
      : pathname === route || pathname.startsWith(`${route}/`),
  );
}

function navActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SettingsPanel() {
  const { arabicFontSize, setArabicFontSize } = useSettings();

  return (
    <div className="flex flex-col gap-4">
      <SliderSelect
        label="Arabic font size"
        options={ARABIC_FONT_SIZE_OPTIONS}
        value={arabicFontSize}
        onValueChange={setArabicFontSize}
      />
      <p
        className="font-arabic-face flex h-20 items-center justify-center rounded-lg border border-border bg-card px-4 text-center leading-none"
        style={{ fontSize: `${arabicFontSize}px` }}
      >
        فَعَلَ
      </p>
      <p className="text-xs text-muted-foreground">
        Prototype: scales all Arabic on the page relative to 16px (current
        sizes).
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare = isBareRoute(pathname);
  const { resolvedTheme, setTheme } = useTheme();

  const brand = (
    <>
      <span className="font-arabic text-2xl text-primary">صرف</span>
      <span className="text-sm font-medium tracking-wide text-muted-foreground">
        Sarf Trainer
      </span>
    </>
  );

  return (
    <div className="flex min-h-full min-w-0 flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          {bare ? (
            <div className="flex items-baseline gap-2">{brand}</div>
          ) : (
            <Link href="/" className="flex items-baseline gap-2">
              {brand}
            </Link>
          )}
          {!bare && (
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
          )}
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
            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="rounded-full"
                    aria-label="Settings"
                  />
                }
              >
                <Settings className="size-3.5" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Live prototype — scales every Arabic size on the page.
                  </DialogDescription>
                </DialogHeader>
                <SettingsPanel />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-8">
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
