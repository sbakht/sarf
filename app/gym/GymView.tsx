"use client";

import { useState, type ReactNode } from "react";
import { ArabicWord } from "@/components/ArabicWord";
import { FormBadge } from "@/components/FormBadge";
import { ParadigmTable } from "@/components/ParadigmTable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const [revealedPersons, setRevealedPersons] = useState<
    Partial<Record<PersonId, boolean>>
  >({});
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
        <p className="kicker">Conjugation Gym</p>
        <h1 className="mt-1 text-3xl font-semibold">Produce the table</h1>
      </header>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3">
          <Field label="Root">
            <Select
              value={root.id}
              items={ROOTS.map((item) => ({
                value: item.id,
                label: `${rootArabic(item)} — ${item.gloss}`,
              }))}
              onValueChange={(value) => {
                if (!value) return;
                const next = ROOTS.find((item) => item.id === value) ?? ROOTS[0];
                setRootId(next.id);
                setForm(next.forms[0]);
                resetCovers();
              }}
            >
              <SelectTrigger className="min-w-40 bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOTS.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {rootArabic(item)} — {item.gloss}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Form">
            <Select
              value={String(activeForm)}
              items={forms.map((id) => ({
                value: String(id),
                label: `Form ${FORM_BY_ID[id].roman} · ${FORM_BY_ID[id].waznPast}`,
              }))}
              onValueChange={(value) => {
                if (!value) return;
                setForm(Number(value) as FormId);
                resetCovers();
              }}
            >
              <SelectTrigger className="min-w-36 bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {forms.map((id) => (
                  <SelectItem key={id} value={String(id)}>
                    Form {FORM_BY_ID[id].roman} · {FORM_BY_ID[id].waznPast}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tense">
            <Select
              value={tense}
              items={[
                { value: "past", label: "ماضي" },
                { value: "present", label: "مضارع" },
                { value: "imperative", label: "أمر" },
              ]}
              onValueChange={(value) => {
                if (!value) return;
                setTense(value as Tense);
                resetCovers();
              }}
            >
              <SelectTrigger className="min-w-28 bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="past">ماضي</SelectItem>
                <SelectItem value="present">مضارع</SelectItem>
                <SelectItem value="imperative">أمر</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {tense !== "imperative" ? (
            <Field label="Voice">
              <Select
                value={voice}
                items={[
                  { value: "active", label: "معلوم" },
                  { value: "passive", label: "مجهول" },
                ]}
                onValueChange={(value) => {
                  if (!value) return;
                  setVoice(value as Voice);
                  resetCovers();
                }}
              >
                <SelectTrigger className="min-w-28 bg-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">معلوم</SelectItem>
                  <SelectItem value="passive">مجهول</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          ) : null}
          {tense === "present" ? (
            <Field label="Mood">
              <Select
                value={mood}
                items={[
                  { value: "indicative", label: "مرفوع" },
                  { value: "subjunctive", label: "منصوب" },
                  { value: "jussive", label: "مجزوم" },
                ]}
                onValueChange={(value) => {
                  if (!value) return;
                  setMood(value as Mood);
                  resetCovers();
                }}
              >
                <SelectTrigger className="min-w-28 bg-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indicative">مرفوع</SelectItem>
                  <SelectItem value="subjunctive">منصوب</SelectItem>
                  <SelectItem value="jussive">مجزوم</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          ) : null}
          <div className="ml-auto">
            <ToggleGroup
              value={[mode]}
              onValueChange={(values) => {
                const next = values[0] as "study" | "quiz" | undefined;
                if (!next) return;
                setMode(next);
                if (next === "quiz") resetCovers();
              }}
              variant="outline"
              spacing={0}
              className="rounded-full"
            >
              <ToggleGroupItem
                value="study"
                className="rounded-full px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Study
              </ToggleGroupItem>
              <ToggleGroupItem
                value="quiz"
                className="rounded-full px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Quiz
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <FormBadge form={activeForm} />
        <span dir="rtl" className="font-arabic text-lg text-foreground">
          {rootArabic(root)}
        </span>
        <span>({root.gloss})</span>
        {mode === "quiz" ? (
          <span>Tap a cell to reveal it. Tap again to hide.</span>
        ) : null}
      </div>

      <ParadigmTable
        input={input}
        quiz={mode === "quiz"}
        revealedPersons={revealedPersons}
        selected={selected}
        onSelect={setSelected}
        onToggleReveal={toggleReveal}
      />

      <Card>
        <CardContent>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Breakdown · {PERSON_BY_ID[selected].english} (
            {PERSON_BY_ID[selected].arabic})
          </p>
          <div className="mt-2">
            <ArabicWord
              slots={breakdown.slots}
              surface={breakdown.surface}
              size="lg"
            />
          </div>
          {breakdown.available ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {breakdown.slots.map((slot, i) => (
                <li
                  key={`${slot.kind}-${i}`}
                  className="rounded-full bg-muted px-3 py-1 font-arabic text-sm text-muted-foreground"
                >
                  <span className="text-foreground">{slot.text}</span> ·{" "}
                  {slot.kind}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No command form for this person.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-xs text-muted-foreground">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
