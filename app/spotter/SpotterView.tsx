"use client";

// PROTOTYPE: six split + pronoun-grid layouts, switchable via ?variant=, on /spotter.
import { useSearchParams } from "next/navigation";
import { useSettings } from "@/components/SettingsProvider";
import { PrototypeSwitcher } from "@/components/PrototypeSwitcher";
import { useSpotterQuiz } from "./useSpotterQuiz";
import { VariantA } from "./prototype/VariantA";
import { VariantB } from "./prototype/VariantB";
import { VariantC } from "./prototype/VariantC";
import { VariantD } from "./prototype/VariantD";
import { VariantE } from "./prototype/VariantE";
import { VariantF } from "./prototype/VariantF";
import { summarizeQuiz } from "./prototype/shared";

const VARIANTS = [
  { key: "A", name: "Filter rail" },
  { key: "B", name: "Quiz first" },
  { key: "C", name: "Persons hero" },
  { key: "D", name: "Toolbar + desk" },
  { key: "E", name: "Three panes" },
  { key: "F", name: "Quiz on top" },
];

export function SpotterView() {
  const quiz = useSpotterQuiz();
  const { setLabelMode } = useSettings();
  const searchParams = useSearchParams();
  const variant = searchParams.get("variant") ?? "A";
  const props = { quiz, onLabelModeChange: setLabelMode };

  return (
    <>
      {variant === "B" ? (
        <VariantB {...props} />
      ) : variant === "C" ? (
        <VariantC {...props} />
      ) : variant === "D" ? (
        <VariantD {...props} />
      ) : variant === "E" ? (
        <VariantE {...props} />
      ) : variant === "F" ? (
        <VariantF {...props} />
      ) : (
        <VariantA {...props} />
      )}
      <PrototypeSwitcher
        variants={VARIANTS}
        current={VARIANTS.some((item) => item.key === variant) ? variant : "A"}
        state={summarizeQuiz(quiz)}
      />
    </>
  );
}
