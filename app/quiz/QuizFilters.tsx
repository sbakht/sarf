"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Chip } from "./Chip";
import {
  ALL_FORMS,
  ALL_QUESTIONS,
  FORM_BY_ID,
  PERSON_BY_ID,
  TABLE_ROWS,
  TENSE_LABEL,
  linkedPersons,
  type FormId,
  type LabelMode,
  type PersonId,
  type QuestionId,
  type Tense,
  type Voice,
} from "@/lib/sarf";
import { cn } from "@/lib/utils";

const QUESTION_CHIPS: {
  id: QuestionId;
  english: string;
  arabic: string;
}[] = [
  { id: "root", english: "Root", arabic: "الجذر" },
  { id: "form", english: "Form", arabic: "الوزن" },
  { id: "tense", english: "Tense", arabic: "الزمن" },
  { id: "voice", english: "Voice", arabic: "البناء" },
  { id: "person", english: "Pronoun", arabic: "الضمير" },
];

const TENSE_EN: Record<Tense, string> = {
  past: "Past",
  present: "Present",
  imperative: "Imperative",
};

const VOICE_EN: Record<Voice, string> = {
  active: "Active",
  passive: "Passive",
};

const VOICE_AR: Record<Voice, string> = {
  active: "معلوم",
  passive: "مجهول",
};

const COLS: { english: string; arabic: string }[] = [
  { english: "Singular", arabic: "مفرد" },
  { english: "Dual", arabic: "مثنى" },
  { english: "Plural", arabic: "جمع" },
];

/** Filter-grid English — keep dual 2nd person gender-specific; quiz answers still use personQuizEnglish. */
function personFilterEnglish(id: PersonId): string {
  if (id === "antuma_m") return "you dual (m)";
  if (id === "antuma_f") return "you dual (f)";
  return PERSON_BY_ID[id].english;
}

function showEnglish(mode: LabelMode): boolean {
  return mode === "form" || mode === "both";
}

function showArabic(mode: LabelMode): boolean {
  return mode === "wazn" || mode === "both";
}

function ModeText({
  mode,
  english,
  arabic,
  className,
}: {
  mode: LabelMode;
  english: string;
  arabic: string;
  className?: string;
}) {
  const en = showEnglish(mode);
  const ar = showArabic(mode);

  if (en && ar) {
    return (
      <span
        className={cn(
          "inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5",
          className,
        )}
      >
        <span dir="rtl" className="font-arabic">
          {arabic}
        </span>
        <span className="text-muted-foreground">{english}</span>
      </span>
    );
  }

  if (ar) {
    return (
      <span dir="rtl" className={cn("font-arabic", className)}>
        {arabic}
      </span>
    );
  }

  return <span className={className}>{english}</span>;
}

function Field({
  mode,
  english,
  arabic,
  subtitle,
  children,
}: {
  mode: LabelMode;
  english: string;
  arabic: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-medium">
          <ModeText mode={mode} english={english} arabic={arabic} />
        </p>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function BilingualLabel({
  mode,
  english,
  arabic,
  arabicClassName,
}: {
  mode: LabelMode;
  english: string;
  arabic: string;
  arabicClassName?: string;
}) {
  const en = showEnglish(mode);
  const ar = showArabic(mode);

  if (en && ar) {
    return (
      <span className="inline-flex items-baseline gap-1.5 leading-none">
        <span dir="rtl" className={cn("font-arabic text-sm", arabicClassName)}>
          {arabic}
        </span>
        <span className="text-[11px] text-muted-foreground">{english}</span>
      </span>
    );
  }

  if (ar) {
    return (
      <span dir="rtl" className={cn("font-arabic", arabicClassName)}>
        {arabic}
      </span>
    );
  }

  return <span>{english}</span>;
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
  collapsible = false,
  summary,
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
  /** Mobile: one card that expands/collapses. */
  collapsible?: boolean;
  summary?: string;
}) {
  const [open, setOpen] = useState(!collapsible);
  const showBody = !collapsible || open;

  const labelToggle = (
    <div
      className="flex flex-wrap justify-end gap-1.5"
      role="group"
      aria-label="Filter labels"
    >
      <Chip
        selected={labelMode === "form"}
        onClick={() => onLabelModeChange("form")}
      >
        English
      </Chip>
      <Chip
        selected={labelMode === "wazn"}
        onClick={() => onLabelModeChange("wazn")}
      >
        Arabic
      </Chip>
      <Chip
        selected={labelMode === "both"}
        onClick={() => onLabelModeChange("both")}
      >
        Both
      </Chip>
    </div>
  );

  const fields = (
    <>
      <Field
        mode={labelMode}
        english="Questions"
        arabic="الأسئلة"
        subtitle="Steps that appear in each round"
      >
        <div className="flex flex-wrap gap-2">
          <Chip
            selected={enabledQuestions.length === ALL_QUESTIONS.length}
            onClick={onSelectAllQuestions}
          >
            <ModeText mode={labelMode} english="All" arabic="الكل" />
          </Chip>
          {QUESTION_CHIPS.map((question) => (
            <Chip
              key={question.id}
              selected={enabledQuestions.includes(question.id)}
              onClick={() => onToggleQuestion(question.id)}
            >
              <ModeText
                mode={labelMode}
                english={question.english}
                arabic={question.arabic}
              />
            </Chip>
          ))}
        </div>
      </Field>
      <Field
        mode={labelMode}
        english="Forms"
        arabic="الأوزان"
        subtitle="Which verb forms can appear"
      >
        <div className="grid grid-cols-5 gap-1.5">
          {ALL_FORMS.map((form) => {
            const meta = FORM_BY_ID[form];
            const selected = enabledForms.includes(form);
            return (
              <button
                key={form}
                type="button"
                title={
                  labelMode === "form"
                    ? `Form ${meta.roman}`
                    : labelMode === "wazn"
                      ? meta.waznPast
                      : `Form ${meta.roman} · ${meta.waznPast}`
                }
                onClick={() => onToggleForm(form)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border px-1 py-1.5 text-xs",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted text-muted-foreground",
                )}
              >
                {showEnglish(labelMode) ? meta.roman : null}
                {showArabic(labelMode) ? (
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
      <Field
        mode={labelMode}
        english="Tense"
        arabic="الزمن"
        subtitle="Which tenses can appear"
      >
        <div className="flex flex-wrap gap-2">
          {(["past", "present", "imperative"] as Tense[]).map((tense) => (
            <Chip
              key={tense}
              selected={enabledTenses.includes(tense)}
              onClick={() => onToggleTense(tense)}
            >
              <BilingualLabel
                mode={labelMode}
                english={TENSE_EN[tense]}
                arabic={TENSE_LABEL[tense]}
              />
            </Chip>
          ))}
        </div>
      </Field>
      <Field
        mode={labelMode}
        english="Voice"
        arabic="البناء"
        subtitle="Active, passive, or both"
      >
        <div className="flex flex-wrap gap-2">
          {(["active", "passive"] as Voice[]).map((voice) => (
            <Chip
              key={voice}
              selected={enabledVoices.includes(voice)}
              onClick={() => onToggleVoice(voice)}
            >
              <BilingualLabel
                mode={labelMode}
                english={VOICE_EN[voice]}
                arabic={VOICE_AR[voice]}
              />
            </Chip>
          ))}
        </div>
      </Field>
      <Field
        mode={labelMode}
        english="Pronouns"
        arabic="الضمائر"
        subtitle="Which pronouns can appear"
      >
        <PronounGrid
          labelMode={labelMode}
          enabled={enabledPersons}
          onToggle={onTogglePerson}
          onToggleSet={onTogglePersonSet}
          onSelectAll={onSelectAllPersons}
        />
      </Field>
    </>
  );

  return (
    <aside
      data-quiz-filters
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card ring-1 ring-foreground/10",
        collapsible ? "gap-0" : "gap-5 p-4 lg:sticky lg:top-20 lg:self-start",
      )}
    >
      {collapsible ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-start gap-3 px-4 py-3 text-start"
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Filters
            </p>
            {summary && !open ? (
              <p className="mt-0.5 truncate text-sm text-foreground">
                {summary}
              </p>
            ) : null}
          </div>
          <ChevronDown
            className={cn(
              "mt-0.5 size-5 shrink-0 text-muted-foreground transition",
              open && "rotate-180",
            )}
          />
        </button>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Filters
          </p>
          {labelToggle}
        </div>
      )}

      {showBody ? (
        <div
          className={cn("flex flex-col gap-5", collapsible && "px-4 pt-1 pb-4")}
        >
          {collapsible ? labelToggle : null}
          {fields}
        </div>
      ) : null}
    </aside>
  );
}

function PronounGrid({
  labelMode,
  enabled,
  onToggle,
  onToggleSet,
  onSelectAll,
}: {
  labelMode: LabelMode;
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
        <ModeText mode={labelMode} english="All" arabic="الكل" />
      </button>
      {COLS.map((col) => (
        <p
          key={col.english}
          className="p-1 text-[10px] font-medium tracking-wider text-muted-foreground"
        >
          <ModeText
            mode={labelMode}
            english={col.english}
            arabic={col.arabic}
          />
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
            labelMode={labelMode}
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
  labelMode,
  enabled,
  onToggle,
  onToggleSet,
}: {
  label: string;
  ids: PersonId[];
  cells: (PersonId | null)[];
  labelMode: LabelMode;
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
            title={`${PERSON_BY_ID[id].arabic} · ${personFilterEnglish(id)}`}
            onClick={() => onToggle(id)}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-0.5 rounded-md border px-1 py-1.5 text-xs leading-tight",
              linkedPersons(id).every((person) => enabled.includes(person))
                ? "border-primary bg-primary/10"
                : "border-transparent bg-muted text-muted-foreground",
            )}
          >
            {showArabic(labelMode) ? (
              <span dir="rtl" className="font-arabic text-sm">
                {PERSON_BY_ID[id].arabic}
              </span>
            ) : null}
            {showEnglish(labelMode) ? (
              <span className="text-[10px] text-muted-foreground">
                {personFilterEnglish(id)}
              </span>
            ) : null}
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
