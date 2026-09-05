"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PrototypeVariant = { key: string; name: string };

export function PrototypeSwitcher({
  variants,
  current,
  state,
}: {
  variants: PrototypeVariant[];
  current: string;
  state?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const index = Math.max(
    0,
    variants.findIndex((variant) => variant.key === current),
  );
  const active = variants[index] ?? variants[0];

  const go = useCallback(
    (nextIndex: number) => {
      const wrapped = (nextIndex + variants.length) % variants.length;
      const next = variants[wrapped];
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", next.key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams, variants],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!(event.key === "ArrowLeft" || event.key === "ArrowRight")) return;
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }
      event.preventDefault();
      go(index + (event.key === "ArrowRight" ? 1 : -1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
      {state ? (
        <p className="max-w-3xl rounded-lg bg-foreground/90 px-3 py-1.5 font-mono text-[11px] leading-snug text-background">
          {state}
        </p>
      ) : null}
      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-foreground px-1.5 py-1.5 text-background shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full hover:bg-background/15"
          onClick={() => go(index - 1)}
          aria-label="Previous variant"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="min-w-52 px-2 text-center text-sm font-medium">
          {active.key} — {active.name}
        </p>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full hover:bg-background/15"
          onClick={() => go(index + 1)}
          aria-label="Next variant"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
