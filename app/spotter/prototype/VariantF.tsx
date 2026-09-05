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

export function VariantF({ quiz, onLabelModeChange }: VariantProps) {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHead
        kicker="Prototype F"
        title="Name what you see"
        extra={<WeakAndScore quiz={quiz} />}
      />
      <Drill quiz={quiz} />
      <section
        data-spotter-filters
        className="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10"
      >
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Configure the pool
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <QuestionChips quiz={quiz} />
          <TenseChips quiz={quiz} />
          <VoiceChips quiz={quiz} />
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">Forms</p>
              <LabelModeChips
                labelMode={quiz.labelMode}
                onChange={onLabelModeChange}
              />
            </div>
            <FormPad quiz={quiz} cols={5} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Persons</p>
            <PronounGrid quiz={quiz} size="md" columns />
          </div>
        </div>
      </section>
    </div>
  );
}
