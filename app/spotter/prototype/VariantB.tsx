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

export function VariantB({ quiz, onLabelModeChange }: VariantProps) {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHead
        kicker="Prototype B"
        title="Name what you see"
        extra={<WeakAndScore quiz={quiz} />}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(18rem,22rem)]">
        <div className="flex flex-col gap-6">
          <Drill quiz={quiz} />
        </div>
        <aside
          data-spotter-filters
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10 lg:sticky lg:top-20 lg:self-start"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Pool
          </p>
          <QuestionChips quiz={quiz} />
          <LabelModeChips
            labelMode={quiz.labelMode}
            onChange={onLabelModeChange}
          />
          <FormPad quiz={quiz} cols={5} />
          <div className="flex flex-col gap-2">
            <TenseChips quiz={quiz} />
            <VoiceChips quiz={quiz} />
          </div>
          <PronounGrid quiz={quiz} size="sm" columns />
        </aside>
      </div>
    </div>
  );
}
