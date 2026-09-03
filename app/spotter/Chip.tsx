import type { ReactNode } from "react";

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
    <button
      type="button"
      title={title}
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm ${
        selected
          ? "border-accent bg-accent-soft text-ink"
          : "border-rule bg-paper text-ink-soft"
      }`}
    >
      {children}
    </button>
  );
}
