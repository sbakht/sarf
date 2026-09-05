"use client";

import type { ReactNode } from "react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

export function Chip({
  selected,
  onClick,
  title,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <Toggle
      pressed={selected}
      onPressedChange={() => onClick()}
      title={title}
      variant="outline"
      size="sm"
      className={cn(
        "rounded-full bg-muted text-muted-foreground",
        "aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-foreground",
        "data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-foreground",
      )}
    >
      {children}
    </Toggle>
  );
}
