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

export function VariantE({ quiz, onLabelModeChange }: VariantProps) {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHead
        kicker="Prototype E"
        title="Name what you see"
        extra={<WeakAndScore quiz={quiz} />}
      />
      <div className="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)_minmax(0,1.1fr)]">
        <aside
          data-spotter-filters
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/10"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Ask / time
          </p>
          <QuestionChips quiz={quiz} />
          <TenseChips quiz={quiz} />
          <VoiceChips quiz={quiz} />
        </aside>
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/10">
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
        </section>
        <div className="flex flex-col gap-6">
          <Drill quiz={quiz} />
        </div>
      </div>
    </div>
  );
}
