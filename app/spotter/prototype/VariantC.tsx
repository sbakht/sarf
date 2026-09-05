"use client";

import { WeakAndScore } from "../SpotterChrome";
import {
  Drill,
  FormPad,
  LabelModeChips,
  PageHead,
  PronounGrid,
  QuestionChips,
  TenseChips,
  VoiceChips,
  type VariantProps,
} from "./shared";

export function VariantC({ quiz, onLabelModeChange }: VariantProps) {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHead kicker="Prototype C" title="Name what you see" />
      <div className="grid gap-6 lg:grid-cols-[minmax(20rem,26rem)_1fr]">
        <aside
          data-spotter-filters
          className="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10 lg:sticky lg:top-20 lg:self-start"
        >
          <p className="mb-3 text-sm font-medium">Persons</p>
          <PronounGrid quiz={quiz} size="lg" columns />
        </aside>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/10">
            <QuestionChips quiz={quiz} />
            <div className="flex flex-wrap items-center gap-2">
              <LabelModeChips
                labelMode={quiz.labelMode}
                onChange={onLabelModeChange}
              />
              <TenseChips quiz={quiz} />
              <VoiceChips quiz={quiz} />
            </div>
            <FormPad quiz={quiz} cols={10} showLabels={quiz.labelMode !== "form"} />
          </div>
          <WeakAndScore quiz={quiz} />
          <Drill quiz={quiz} />
        </div>
      </div>
    </div>
  );
}
