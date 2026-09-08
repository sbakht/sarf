"use client";

import { ArabicWord } from "@/components/ArabicWord";
import {
  conjugate,
  getRoot,
  type ConjugateResult,
  type Mood,
  type PersonId,
  type Tense,
  type Voice,
} from "@/lib/sarf";

export type CellSpec = {
  tense?: Tense;
  person?: PersonId;
  mood?: Mood;
  voice?: Voice;
  form?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
};

export function live(rootId: string, spec: CellSpec = {}): ConjugateResult {
  const root = getRoot(rootId);
  return conjugate({
    root: root.letters,
    form: spec.form ?? 1,
    formIBab: root.formIBab,
    tense: spec.tense ?? "past",
    voice: spec.voice ?? "active",
    person: spec.person ?? "huwa",
    mood: spec.mood ?? "indicative",
    weakness: root.weakness,
  });
}

export function analog(rootId: string, spec: CellSpec = {}): ConjugateResult {
  const root = getRoot(rootId);
  return conjugate({
    root: root.letters,
    form: spec.form ?? 1,
    formIBab: root.formIBab,
    tense: spec.tense ?? "past",
    voice: spec.voice ?? "active",
    person: spec.person ?? "huwa",
    mood: spec.mood ?? "indicative",
    weakness: "sound",
    asSoundAnalog: true,
  });
}

export function WordCard({
  label,
  result,
  note,
}: {
  label: string;
  result: ConjugateResult;
  note?: string;
}) {
  return (
    <div className="rounded-xl bg-muted p-4 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2">
        <ArabicWord slots={result.slots} surface={result.surface} size="lg" />
      </div>
      {note ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p>
      ) : null}
    </div>
  );
}

export function CompareRow({
  label,
  rootId,
  spec = {},
}: {
  label: string;
  rootId: string;
  spec?: CellSpec;
}) {
  const actual = live(rootId, spec);
  const sound = analog(rootId, spec);
  const rule = actual.mutations[0]?.rule;
  return (
    <tr className="border-t border-border align-top">
      <th className="p-3 text-start text-sm font-medium">{label}</th>
      <td className="p-3 text-center">
        <ArabicWord slots={sound.slots} surface={sound.surface} />
      </td>
      <td className="p-3 text-center">
        <ArabicWord slots={actual.slots} surface={actual.surface} />
      </td>
      <td className="p-3 text-start text-sm text-muted-foreground">
        {rule ??
          (actual.surface === sound.surface
            ? "Same as the sound analog — you already know this cell."
            : "")}
      </td>
    </tr>
  );
}

export function CompareTable({
  rootId,
  rows,
}: {
  rootId: string;
  rows: { label: string; spec?: CellSpec }[];
}) {
  const root = getRoot(rootId);
  return (
    <div className="min-w-0 w-full overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[36rem] text-center">
        <caption className="bg-muted/80 p-3 text-start text-sm text-muted-foreground">
          <span dir="rtl" className="font-arabic text-base text-foreground">
            {root.letters.join(" ")}
          </span>{" "}
          · {root.gloss}
        </caption>
        <thead>
          <tr className="bg-muted/80 text-xs uppercase tracking-wider text-muted-foreground">
            <th className="p-3 text-start font-medium">Cell</th>
            <th className="p-3 font-medium">Sound analog</th>
            <th className="p-3 font-medium">Actual</th>
            <th className="p-3 text-start font-medium">What changed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <CompareRow
              key={row.label}
              label={row.label}
              rootId={rootId}
              spec={row.spec}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const DIAGNOSTIC_ROWS: { label: string; spec?: CellSpec }[] = [
  { label: "ماضي هو" },
  { label: "ماضي هي", spec: { person: "hiya" } },
  { label: "ماضي أنا", spec: { person: "ana" } },
  { label: "مضارع هو", spec: { tense: "present" } },
  {
    label: "مجزوم هو",
    spec: { tense: "present", mood: "jussive" },
  },
  { label: "أمر أنتَ", spec: { tense: "imperative", person: "anta" } },
];
