"use client";

import type { ReactNode } from "react";
import { Chip } from "./Chip";
import { cn } from "@/lib/utils";

/** Grid-tile Chip for Forms / Pronouns cells (stacked bilingual labels). */
export function TileChip({
  selected,
  onClick,
  title,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Chip
      selected={selected}
      onClick={onClick}
      title={title}
      className={cn(
        "w-full min-w-0 flex-col whitespace-normal rounded-lg px-1 text-xs",
        className,
      )}
    >
      {children}
    </Chip>
  );
}
