"use client";

import type { ConjugateResult } from "@/lib/sarf";
import { ArabicWord } from "./ArabicWord";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card size="sm" className="bg-muted ring-0">
      <CardContent>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {english}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{title}</p>
        <div className="mt-2">
          <ArabicWord slots={result.slots} surface={result.surface} size="lg" />
        </div>
      </CardContent>
    </Card>
  );
}
