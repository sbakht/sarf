"use client";

import type { ReactNode } from "react";
import { Chip } from "../Chip";
import { RoundControls } from "../SpotterChrome";
import { SpotterCard } from "../SpotterCard";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
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
import { useSpotterQuiz } from "../useSpotterQuiz";
import { cn } from "@/lib/utils";

export type Quiz = ReturnType<typeof useSpotterQuiz>;

export type VariantProps = {
  quiz: Quiz;
  onLabelModeChange: (mode: LabelMode) => void;
};

export const QUESTION_CHIPS: { id: QuestionId; label: string }[] = [
  { id: "root", label: "Root" },
  { id: "form", label: "Form" },
  { id: "tense", label: "Tense" },
  { id: "voice", label: "Voice" },
  { id: "person", label: "Person" },
];

export const VOICE_CHIPS: { id: Voice; label: string }[] = [
  { id: "active", label: "معلوم" },
  { id: "passive", label: "مجهول" },
];

export const COLS = ["Singular", "Dual", "Plural"] as const;

export const COL_IDS: Record<(typeof COLS)[number], PersonId[]> = {
  Singular: ["huwa", "hiya", "anta", "anti", "ana"],
  Dual: ["huma_m", "huma_f", "antuma_m", "antuma_f"],
  Plural: ["hum", "hunna", "antum", "antunna", "nahnu"],
};

export function mergePersons(enabled: PersonId[], add: PersonId[]) {
  const set = new Set([...enabled, ...add]);
  return ALL_PERSON_IDS.filter((id) => set.has(id));
}

export function personOn(enabled: PersonId[], id: PersonId) {
  return linkedPersons(id).every((person) => enabled.includes(person));
}

export function togglePersonSet(enabled: PersonId[], ids: PersonId[]) {
  const allOn = ids.every((id) => enabled.includes(id));
  if (allOn) {
    const next = enabled.filter((id) => !ids.includes(id));
    return next.length === 0 ? null : next;
  }
  return mergePersons(enabled, ids);
}

export function applyPersonSet(quiz: Quiz, ids: PersonId[]) {
  const next = togglePersonSet(quiz.enabledPersons, ids);
  if (next) quiz.applyFilters({ enabledPersons: next });
}

export function LabelModeChips({
  labelMode,
  onChange,
}: {
  labelMode: LabelMode;
  onChange: (mode: LabelMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip selected={labelMode === "form"} onClick={() => onChange("form")}>
        Form #
      </Chip>
      <Chip selected={labelMode === "wazn"} onClick={() => onChange("wazn")}>
        <span dir="rtl" className="font-arabic">
          وزن
        </span>
      </Chip>
      <Chip selected={labelMode === "both"} onClick={() => onChange("both")}>
        Both
      </Chip>
    </div>
  );
}

export function QuestionChips({ quiz }: { quiz: Quiz }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip
        selected={quiz.enabledQuestions.length === ALL_QUESTIONS.length}
        onClick={quiz.selectAllQuestions}
      >
        All
      </Chip>
      {QUESTION_CHIPS.map((question) => (
        <Chip
          key={question.id}
          selected={quiz.enabledQuestions.includes(question.id)}
          onClick={() => quiz.toggleQuestion(question.id)}
        >
          {question.label}
        </Chip>
      ))}
    </div>
  );
}

export function TenseChips({ quiz }: { quiz: Quiz }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(["past", "present", "imperative"] as Tense[]).map((tense) => (
        <Chip
          key={tense}
          selected={quiz.enabledTenses.includes(tense)}
          onClick={() => quiz.toggleTense(tense)}
        >
          <span className="font-arabic">{TENSE_LABEL[tense]}</span>
        </Chip>
      ))}
    </div>
  );
}

export function VoiceChips({ quiz }: { quiz: Quiz }) {
  return (
    <div className="flex flex-wrap gap-2">
      {VOICE_CHIPS.map((voice) => (
        <Chip
          key={voice.id}
          selected={quiz.enabledVoices.includes(voice.id)}
          onClick={() => quiz.toggleVoice(voice.id)}
        >
          <span className="font-arabic">{voice.label}</span>
        </Chip>
      ))}
    </div>
  );
}

export function FormPad({
  quiz,
  cols = 5,
  showLabels = true,
}: {
  quiz: Quiz;
  cols?: 2 | 5 | 10;
  showLabels?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-1.5",
        cols === 2 && "grid-cols-2",
        cols === 5 && "grid-cols-5",
        cols === 10 && "grid-cols-5 sm:grid-cols-10",
      )}
    >
      {ALL_FORMS.map((form) => (
        <FormTile
          key={form}
          form={form}
          selected={quiz.enabledForms.includes(form)}
          showWazn={showLabels && quiz.labelMode !== "form"}
          onClick={() => quiz.toggleForm(form)}
        />
      ))}
    </div>
  );
}

function FormTile({
  form,
  selected,
  showWazn,
  onClick,
}: {
  form: FormId;
  selected: boolean;
  showWazn: boolean;
  onClick: () => void;
}) {
  const meta = FORM_BY_ID[form];
  return (
    <button
      type="button"
      title={meta.waznPast}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border px-1 py-1.5 text-xs",
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {meta.roman}
      {showWazn ? (
        <span dir="rtl" className="font-arabic text-[11px] leading-tight">
          {meta.waznPast}
        </span>
      ) : null}
    </button>
  );
}

export function PronounGrid({
  quiz,
  size = "md",
  columns = false,
}: {
  quiz: Quiz;
  size?: "sm" | "md" | "lg";
  columns?: boolean;
}) {
  const cell =
    size === "lg"
      ? "min-h-14 px-2 py-3 text-xl"
      : size === "md"
        ? "px-1.5 py-2 text-base"
        : "px-1 py-1.5 text-sm";

  return (
    <div className="grid grid-cols-4 gap-1 text-center">
      <button
        type="button"
        className="p-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={quiz.selectAllPersons}
      >
        All
      </button>
      {COLS.map((col) =>
        columns ? (
          <button
            key={col}
            type="button"
            className="p-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
            onClick={() => applyPersonSet(quiz, COL_IDS[col])}
          >
            {col}
          </button>
        ) : (
          <p
            key={col}
            className="p-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
          >
            {col}
          </p>
        ),
      )}
      {TABLE_ROWS.map((row) => (
        <Row
          key={row.label}
          label={row.label}
          ids={row.cells}
          quiz={quiz}
          cell={cell}
        />
      ))}
    </div>
  );
}

function Row({
  label,
  ids,
  quiz,
  cell,
}: {
  label: string;
  ids: PersonId[];
  quiz: Quiz;
  cell: string;
}) {
  const cells: (PersonId | null)[] =
    label === "1st" ? ["ana", null, "nahnu"] : ids;
  return (
    <>
      <button
        type="button"
        className="p-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        onClick={() => applyPersonSet(quiz, ids)}
      >
        {label}
      </button>
      {cells.map((id, index) =>
        id ? (
          <PersonCell key={id} id={id} quiz={quiz} className={cell} />
        ) : (
          <p key={index} className="p-0.5 text-muted-foreground">
            —
          </p>
        ),
      )}
    </>
  );
}

function PersonCell({
  id,
  quiz,
  className,
}: {
  id: PersonId;
  quiz: Quiz;
  className: string;
}) {
  const on = personOn(quiz.enabledPersons, id);
  return (
    <button
      type="button"
      onClick={() => quiz.togglePerson(id)}
      className={cn(
        "w-full rounded-md border font-arabic",
        className,
        on
          ? "border-primary bg-primary/10"
          : "border-transparent bg-muted text-muted-foreground",
      )}
    >
      {PERSON_BY_ID[id].arabic}
    </button>
  );
}

export function Drill({ quiz }: { quiz: Quiz }) {
  return (
    <>
      <SpotterCard
        prompt={quiz.prompt}
        result={quiz.result}
        feedback={quiz.feedback}
        showColors={quiz.showColors}
        done={quiz.done}
      />
      <RoundControls quiz={quiz} />
    </>
  );
}

export function summarizeQuiz(quiz: Quiz) {
  const ask =
    quiz.enabledQuestions.length === ALL_QUESTIONS.length
      ? "all questions"
      : quiz.enabledQuestions.join(", ");
  const forms = quiz.enabledForms.map((id) => FORM_BY_ID[id].roman).join(" ");
  const tenses = quiz.enabledTenses.map((tense) => TENSE_LABEL[tense]).join(" ");
  const voices = quiz.enabledVoices
    .map((voice) => (voice === "active" ? "معلوم" : "مجهول"))
    .join(" ");
  return `Ask: ${ask} · Forms ${forms} · ${tenses} · ${voices} · Persons ${quiz.enabledPersons.length}/${ALL_PERSON_IDS.length}`;
}

export function PageHead({
  kicker = "Pattern Spotter",
  title,
  extra,
}: {
  kicker?: string;
  title: string;
  extra?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
      </div>
      {extra}
    </header>
  );
}
