"use client";

import { useState, type ReactNode } from "react";
import { ArabicWord } from "@/components/ArabicWord";
import { FormBadge } from "@/components/FormBadge";
import { ParadigmTable } from "@/components/ParadigmTable";
import {
  FORM_BY_ID,
  PERSON_BY_ID,
  ROOTS,
  conjugate,
  rootArabic,
  type FormId,
  type Mood,
  type PersonId,
  type Tense,
  type Voice,
} from "@/lib/sarf";

export function GymView() {
  const [rootId, setRootId] = useState("ktb");
  const [form, setForm] = useState<FormId>(1);
  const [tense, setTense] = useState<Tense>("past");
  const [voice, setVoice] = useState<Voice>("active");
  const [mood, setMood] = useState<Mood>("indicative");
  const [mode, setMode] = useState<"study" | "quiz">("study");
  const [revealedPersons, setRevealedPersons] = useState<Partial<Record<PersonId, boolean>>>({});
  const [selected, setSelected] = useState<PersonId>("huwa");

  const root = ROOTS.find((item) => item.id === rootId) ?? ROOTS[0];
  const forms = root.forms;
  const activeForm = forms.includes(form) ? form : forms[0];
  const input = {
    root: root.letters,
    form: activeForm,
    formIBab: root.formIBab,
    tense,
    voice: tense === "imperative" ? ("active" as const) : voice,
    mood,
    weakness: root.weakness,
  };
  const breakdown = conjugate({ ...input, person: selected });

  function resetCovers() {
    setRevealedPersons({});
  }

  function toggleReveal(person: PersonId) {
    setRevealedPersons((prev) => ({ ...prev, [person]: !prev[person] }));
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Conjugation Gym</p>
        <h1 className="mt-1 text-3xl font-semibold">Produce the table</h1>
      </header>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-rule bg-card p-4">
        <Field label="Root">
          <select
            className="block rounded-xl border border-rule bg-paper px-3 py-2 text-ink"
            value={root.id}
            onChange={(e) => {
              const next = ROOTS.find((item) => item.id === e.target.value) ?? ROOTS[0];
              setRootId(next.id);
              setForm(next.forms[0]);
              resetCovers();
            }}
          >
            {ROOTS.map((item) => (
              <option key={item.id} value={item.id}>
                {rootArabic(item)} — {item.gloss}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Form">
          <select
            className="block rounded-xl border border-rule bg-paper px-3 py-2 text-ink"
            value={activeForm}
            onChange={(e) => {
              setForm(Number(e.target.value) as FormId);
              resetCovers();
            }}
          >
            {forms.map((id) => (
              <option key={id} value={id}>
                Form {FORM_BY_ID[id].roman} · {FORM_BY_ID[id].waznPast}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tense">
          <select
            className="block rounded-xl border border-rule bg-paper px-3 py-2 text-ink"
            value={tense}
            onChange={(e) => {
              setTense(e.target.value as Tense);
              resetCovers();
            }}
          >
            <option value="past">ماضي</option>
            <option value="present">مضارع</option>
            <option value="imperative">أمر</option>
          </select>
        </Field>
        {tense !== "imperative" ? (
          <Field label="Voice">
            <select
              className="block rounded-xl border border-rule bg-paper px-3 py-2 text-ink"
              value={voice}
              onChange={(e) => {
                setVoice(e.target.value as Voice);
                resetCovers();
              }}
            >
              <option value="active">معلوم</option>
              <option value="passive">مجهول</option>
            </select>
          </Field>
        ) : null}
        {tense === "present" ? (
          <Field label="Mood">
            <select
              className="block rounded-xl border border-rule bg-paper px-3 py-2 text-ink"
              value={mood}
              onChange={(e) => {
                setMood(e.target.value as Mood);
                resetCovers();
              }}
            >
              <option value="indicative">مرفوع</option>
              <option value="subjunctive">منصوب</option>
              <option value="jussive">مجزوم</option>
            </select>
          </Field>
        ) : null}
        <div className="ml-auto flex items-end gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm ${mode === "study" ? "bg-accent text-paper" : "border border-rule"}`}
            onClick={() => setMode("study")}
          >
            Study
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm ${mode === "quiz" ? "bg-accent text-paper" : "border border-rule"}`}
            onClick={() => {
              setMode("quiz");
              resetCovers();
            }}
          >
            Quiz
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-ink-soft">
        <FormBadge form={activeForm} />
        <span dir="rtl" className="font-arabic text-lg text-ink">
          {rootArabic(root)}
        </span>
        <span>({root.gloss})</span>
        {mode === "quiz" ? <span>Tap a cell to reveal it. Tap again to hide.</span> : null}
      </div>

      <ParadigmTable
        input={input}
        quiz={mode === "quiz"}
        revealedPersons={revealedPersons}
        selected={selected}
        onSelect={setSelected}
        onToggleReveal={toggleReveal}
      />

      <section className="rounded-2xl border border-rule bg-card p-5">
        <p className="text-xs uppercase tracking-wider text-ink-soft">
          Breakdown · {PERSON_BY_ID[selected].english} ({PERSON_BY_ID[selected].arabic})
        </p>
        <div className="mt-2">
          <ArabicWord slots={breakdown.slots} surface={breakdown.surface} size="lg" />
        </div>
        {breakdown.available ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {breakdown.slots.map((slot, i) => (
              <li
                key={`${slot.kind}-${i}`}
                className="rounded-full bg-paper px-3 py-1 font-arabic text-sm text-ink-soft"
              >
                <span className="text-ink">{slot.text}</span> · {slot.kind}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">No command form for this person.</p>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-xs text-ink-soft">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
