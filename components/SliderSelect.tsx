"use client";

import { useId } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SliderSelectOption = {
  value: string;
  label: string;
};

export function SliderSelect({
  options,
  value,
  onValueChange,
  label,
  className,
  id: idProp,
}: {
  options: SliderSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  className?: string;
  id?: string;
}) {
  const generatedId = useId();
  const labelId = idProp ?? generatedId;
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const resolved = options[index] ?? options[0];
  const max = Math.max(0, options.length - 1);

  if (!resolved) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-3">
        {label ? (
          <p id={labelId} className="text-sm font-medium text-foreground">
            {label}
          </p>
        ) : (
          <span id={labelId} className="sr-only">
            Value
          </span>
        )}
        <Select
          value={resolved.value}
          items={options.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          onValueChange={(next) => {
            if (!next) return;
            onValueChange(next);
          }}
        >
          <SelectTrigger
            size="sm"
            className="bg-muted"
            aria-labelledby={labelId}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Slider
        min={0}
        max={max}
        step={1}
        value={[index]}
        aria-labelledby={labelId}
        onValueChange={(next) => {
          const nextIndex = Array.isArray(next) ? next[0] : next;
          if (typeof nextIndex !== "number") return;
          const option = options[nextIndex];
          if (option) onValueChange(option.value);
        }}
      />
    </div>
  );
}
