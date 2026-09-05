"use client";

import type { ReactNode } from "react";
import { Chip } from "./Chip";
import {
  ALL_FORMS,
  ALL_QUESTIONS,
  FORM_BY_ID,
  PERSON_BY_ID,
  TABLE_ROWS,
  TENSE_LABEL,
  linkedPersons,
  personQuizEnglish,
  type FormId,
  type LabelMode,
  type PersonId,
  type QuestionId,
  type Tense,
  type Voice,
} from "@/lib/sarf";
import { cn } from "@/lib/utils";

const QUESTION_CHIPS: { id: QuestionId; label: string }[] = [
  { id: "root", label: "Root" },
  { id: "form", label: "Form" },
  { id: "tense", label: "Tense" },
  { id: "voice", label: "Voice" },
  { id: "person", label: "Person" },
];

const VOICE_CHIPS: { id: Voice; label: string }[] = [
  { id: "active", label: "معلوم" },
  { id: "passive", label: "مجهول" },
];

const COLS = ["Singular", "Dual", "Plural"] as const;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}

export function QuizFilters({
  labelMode,
  enabledQuestions,
  enabledForms,
  enabledTenses,
  enabledVoices,
  enabledPersons,
  onLabelModeChange,
  onToggleQuestion,
  onToggleForm,
  onToggleTense,
  onToggleVoice,
  onTogglePerson,
  onTogglePersonSet,
  onSelectAllQuestions,
  onSelectAllPersons,
}: {
  labelMode: LabelMode;
  enabledQuestions: QuestionId[];
  enabledForms: FormId[];
  enabledTenses: Tense[];
  enabledVoices: Voice[];
  enabledPersons: PersonId[];
  onLabelModeChange: (mode: LabelMode) => void;
  onToggleQuestion: (question: QuestionId) => void;
  onToggleForm: (form: FormId) => void;
  onToggleTense: (tense: Tense) => void;
  onToggleVoice: (voice: Voice) => void;
  onTogglePerson: (person: PersonId) => void;
  onTogglePersonSet: (persons: PersonId[]) => void;
  onSelectAllQuestions: () => void;
  onSelectAllPersons: () => void;
}) {
  return (
    <aside
      data-quiz-filters
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10 lg:sticky lg:top-20 lg:self-start"
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Quiz on
      </p>
      <Field label="Ask about">
        <div className="flex flex-wrap gap-2">
          <Chip
            selected={enabledQuestions.length === ALL_QUESTIONS.length}
            onClick={onSelectAllQuestions}
          >
            All
          </Chip>
          {QUESTION_CHIPS.map((question) => (
            <Chip
              key={question.id}
              selected={enabledQuestions.includes(question.id)}
              onClick={() => onToggleQuestion(question.id)}
            >
              {question.label}
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="Forms">
        <div className="flex flex-wrap gap-2">
          <Chip
            selected={labelMode === "form"}
            onClick={() => onLabelModeChange("form")}
          >
            Form #
          </Chip>
          <Chip
            selected={labelMode === "wazn"}
            onClick={() => onLabelModeChange("wazn")}
            title="Show ف ع ل patterns"
          >
            <span dir="rtl" className="font-arabic">
              وزن
            </span>
          </Chip>
          <Chip
            selected={labelMode === "both"}
            onClick={() => onLabelModeChange("both")}
            title="Show Form number and ف ع ل pattern"
          >
            Both
          </Chip>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {ALL_FORMS.map((form) => {
            const meta = FORM_BY_ID[form];
            const selected = enabledForms.includes(form);
            return (
              <button
                key={form}
                type="button"
                title={meta.waznPast}
                onClick={() => onToggleForm(form)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border px-1 py-1.5 text-xs",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted text-muted-foreground",
                )}
              >
                {meta.roman}
                {labelMode !== "form" ? (
                  <span
                    dir="rtl"
                    className="font-arabic text-[11px] leading-tight"
                  >
                    {meta.waznPast}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Tense">
        <div className="flex flex-wrap gap-2">
          {(["past", "present", "imperative"] as Tense[]).map((tense) => (
            <Chip
              key={tense}
              selected={enabledTenses.includes(tense)}
              onClick={() => onToggleTense(tense)}
            >
              <span className="font-arabic">{TENSE_LABEL[tense]}</span>
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="Voice">
        <div className="flex flex-wrap gap-2">
          {VOICE_CHIPS.map((voice) => (
            <Chip
              key={voice.id}
              selected={enabledVoices.includes(voice.id)}
              onClick={() => onToggleVoice(voice.id)}
            >
              <span className="font-arabic">{voice.label}</span>
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="Persons">
        <PronounGrid
          enabled={enabledPersons}
          onToggle={onTogglePerson}
          onToggleSet={onTogglePersonSet}
          onSelectAll={onSelectAllPersons}
        />
      </Field>
    </aside>
  );
}

function PronounGrid({
  enabled,
  onToggle,
  onToggleSet,
  onSelectAll,
}: {
  enabled: PersonId[];
  onToggle: (person: PersonId) => void;
  onToggleSet: (persons: PersonId[]) => void;
  onSelectAll: () => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1 text-center">
      <button
        type="button"
        className="p-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={onSelectAll}
      >
        All
      </button>
      {COLS.map((col) => (
        <p
          key={col}
          className="p-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          {col}
        </p>
      ))}
      {TABLE_ROWS.map((row) => {
        const cells: (PersonId | null)[] =
          row.label === "1st" ? ["ana", null, "nahnu"] : row.cells;
        return (
          <Row
            key={row.label}
            label={row.label}
            ids={row.cells}
            cells={cells}
            enabled={enabled}
            onToggle={onToggle}
            onToggleSet={onToggleSet}
          />
        );
      })}
    </div>
  );
}

function Row({
  label,
  ids,
  cells,
  enabled,
  onToggle,
  onToggleSet,
}: {
  label: string;
  ids: PersonId[];
  cells: (PersonId | null)[];
  enabled: PersonId[];
  onToggle: (person: PersonId) => void;
  onToggleSet: (persons: PersonId[]) => void;
}) {
  return (
    <>
      <button
        type="button"
        className="p-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        onClick={() => onToggleSet(ids)}
      >
        {label}
      </button>
      {cells.map((id, index) =>
        id ? (
          <button
            key={id}
            type="button"
            title={personQuizEnglish(id)}
            onClick={() => onToggle(id)}
            className={cn(
              "w-full rounded-md border px-1 py-1.5 font-arabic text-sm",
              linkedPersons(id).every((person) => enabled.includes(person))
                ? "border-primary bg-primary/10"
                : "border-transparent bg-muted text-muted-foreground",
            )}
          >
            {PERSON_BY_ID[id].arabic}
          </button>
        ) : (
          <p key={index} className="p-0.5 text-muted-foreground">
            —
          </p>
        ),
      )}
    </>
  );
}
