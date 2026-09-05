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

export function VariantD({ quiz, onLabelModeChange }: VariantProps) {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHead
        kicker="Prototype D"
        title="Name what you see"
        extra={<WeakAndScore quiz={quiz} />}
      />
      <div
        data-spotter-filters
        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/10"
      >
        <div className="flex flex-wrap items-start gap-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Ask
            </p>
            <QuestionChips quiz={quiz} />
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Tense
            </p>
            <TenseChips quiz={quiz} />
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Voice
            </p>
            <VoiceChips quiz={quiz} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Forms
            </p>
            <LabelModeChips
              labelMode={quiz.labelMode}
              onChange={onLabelModeChange}
            />
          </div>
          <FormPad quiz={quiz} cols={10} />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10">
          <p className="mb-3 text-sm font-medium">Persons</p>
          <PronounGrid quiz={quiz} size="md" columns />
        </section>
        <div className="flex flex-col gap-6">
          <Drill quiz={quiz} />
        </div>
      </div>
    </div>
  );
}
