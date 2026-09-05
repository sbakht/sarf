"use client";

import type { ReactNode } from "react";
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

export function VariantA({ quiz, onLabelModeChange }: VariantProps) {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHead kicker="Prototype A" title="Name what you see" />
      <div className="grid gap-6 lg:grid-cols-[minmax(18rem,22rem)_1fr]">
        <aside
          data-spotter-filters
          className="flex flex-col gap-5 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10 lg:sticky lg:top-20 lg:self-start"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Quiz on
          </p>
          <Field label="Ask about">
            <QuestionChips quiz={quiz} />
          </Field>
          <Field label="Forms">
            <LabelModeChips
              labelMode={quiz.labelMode}
              onChange={onLabelModeChange}
            />
            <div className="mt-2">
              <FormPad quiz={quiz} />
            </div>
          </Field>
          <Field label="Tense">
            <TenseChips quiz={quiz} />
          </Field>
          <Field label="Voice">
            <VoiceChips quiz={quiz} />
          </Field>
          <Field label="Persons">
            <PronounGrid quiz={quiz} size="sm" />
          </Field>
        </aside>
        <div className="flex flex-col gap-6">
          <WeakAndScore quiz={quiz} />
          <Drill quiz={quiz} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}
