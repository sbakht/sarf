"use client";

import type { ConjugateResult } from "@/lib/sarf";
import { ArabicWord } from "./ArabicWord";

export function MorphCard({
  english,
  title,
  result,
}: Readonly<{
  english: string;
  title: string;
  result: ConjugateResult;
}>) {
  return (
    <div className="rounded-2xl bg-paper p-4">
      <p className="text-xs uppercase tracking-wider text-ink-soft">{english}</p>
      <p className="mt-1 text-xs text-ink-soft">{title}</p>
      <div className="mt-2">
        <ArabicWord slots={result.slots} surface={result.surface} size="lg" />
      </div>
    </div>
  );
}
