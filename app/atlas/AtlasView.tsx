"use client";

import { useMemo, useState } from "react";
import { ArabicWord } from "@/components/ArabicWord";
import { FormBadge } from "@/components/FormBadge";
import { MorphCard } from "@/components/MorphCard";
import { VoiceKey } from "@/components/VoiceKey";
import { useSettings } from "@/components/SettingsProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  BAB_BY_ID,
  FORM_I_ABWAB,
  FORMS,
  ROOTS,
  conjugate,
  formLabel,
  hasMorphologicalPassive,
  rootArabic,
  type FormIBab,
  type FormId,
  type RootEntry,
} from "@/lib/sarf";

const TEMPLATE: [string, string, string] = ["ف", "ع", "ل"];

function exampleRoot(form: FormId, bab?: FormIBab): RootEntry {
  const match = ROOTS.find((root) => {
    if (!root.forms.includes(form)) return false;
    if (form === 1 && bab)
      return root.formIBab === bab && root.weakness === "sound";
    return (
      root.weakness === "sound" || (form !== 1 && root.forms.includes(form))
    );
  });
  return match ?? ROOTS[0];
}

export function AtlasView() {
  const { labelMode } = useSettings();
  const [form, setForm] = useState<FormId>(1);
  const [bab, setBab] = useState<FormIBab>("nasara");
  const [rootId, setRootId] = useState("ktb");

  const rootsForForm = useMemo(
    () =>
      ROOTS.filter((root) => {
        if (!root.forms.includes(form)) return false;
        if (form === 1) return root.formIBab === bab;
        return true;
      }),
    [form, bab],
  );

  const selectedRoot =
    rootsForForm.find((r) => r.id === rootId) ??
    rootsForForm[0] ??
    exampleRoot(form, bab);
  const formIBab = form === 1 ? bab : selectedRoot.formIBab;

  const showPassive = hasMorphologicalPassive(form);

  const samples = {
    past: conjugate({
      root: selectedRoot.letters,
      form,
      formIBab,
      tense: "past",
      voice: "active",
      person: "huwa",
    }),
    present: conjugate({
      root: selectedRoot.letters,
      form,
      formIBab,
      tense: "present",
      voice: "active",
      person: "huwa",
    }),
    command: conjugate({
      root: selectedRoot.letters,
      form,
      formIBab,
      tense: "imperative",
      voice: "active",
      person: "anta",
    }),
    pastPassive: conjugate({
      root: selectedRoot.letters,
      form,
      formIBab,
      tense: "past",
      voice: "passive",
      person: "huwa",
    }),
    presentPassive: conjugate({
      root: selectedRoot.letters,
      form,
      formIBab,
      tense: "present",
      voice: "passive",
      person: "huwa",
    }),
  };

  const meta = FORMS.find((item) => item.id === form)!;
  const babMeta = BAB_BY_ID[bab];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="kicker">Form Atlas</p>
        <h1 className="mt-1 text-3xl font-semibold">The map of الأوزان</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Each card is a pattern, not a word. Open one, then drop a real root
          through it.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FORMS.map((item) => {
          const active = form === item.id;
          const preview = conjugate({
            root: TEMPLATE,
            form: item.id,
            formIBab: item.id === 1 ? bab : "nasara",
            tense: "past",
            voice: "active",
            person: "huwa",
            asSoundAnalog: true,
            weakness: "sound",
          });
          return (
            <Button
              key={item.id}
              variant="outline"
              onClick={() => setForm(item.id)}
              className={cn(
                "h-auto flex-col items-start gap-0 whitespace-normal rounded-xl p-4 text-left",
                active && "border-primary bg-primary/10 hover:bg-primary/10",
              )}
            >
              <p className="text-xs text-muted-foreground">
                {formLabel(item.id, labelMode)}
              </p>
              <div className="mt-2">
                <ArabicWord slots={preview.slots} size="lg" />
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {item.meaning}
              </p>
            </Button>
          );
        })}
      </div>

      {form === 1 ? (
        <div>
          <h2 className="mb-3 text-sm uppercase tracking-wider text-muted-foreground">
            Form I abwab
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {FORM_I_ABWAB.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                onClick={() => {
                  setBab(item.id);
                  const next = ROOTS.find(
                    (r) => r.forms.includes(1) && r.formIBab === item.id,
                  );
                  if (next) setRootId(next.id);
                }}
                className={cn(
                  "h-auto flex-col items-start gap-0 whitespace-normal rounded-xl px-4 py-3 text-left",
                  bab === item.id &&
                    "border-primary bg-primary/10 hover:bg-primary/10",
                )}
              >
                <p className="font-arabic text-lg">{item.nameAr}</p>
                <p className="text-xs text-muted-foreground">
                  {item.waznPast} / {item.waznPresent} · {item.nameEn}
                </p>
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <Card>
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <FormBadge form={form} />
              <p className="mt-2 max-w-xl text-muted-foreground">{meta.meaning}</p>
              {form === 1 ? (
                <p className="mt-1 font-arabic text-muted-foreground">
                  {babMeta.nameAr} — {babMeta.waznPast} / {babMeta.waznPresent}
                </p>
              ) : null}
            </div>
            <label className="text-sm text-muted-foreground">
              Root
              <Select
                value={selectedRoot.id}
                items={rootsForForm.map((root) => ({
                  value: root.id,
                  label: `${rootArabic(root)} — ${root.gloss}`,
                }))}
                onValueChange={(value) => {
                  if (value) setRootId(value);
                }}
              >
                <SelectTrigger className="mt-1 h-9 min-w-44 bg-muted font-arabic text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rootsForForm.map((root) => (
                    <SelectItem
                      key={root.id}
                      value={root.id}
                      className="font-arabic"
                    >
                      {rootArabic(root)} — {root.gloss}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MorphCard
              english="past"
              title="ماضي معلوم · هو"
              result={samples.past}
            />
            <MorphCard
              english="present"
              title="مضارع معلوم · هو"
              result={samples.present}
            />
            <MorphCard
              english="imperative"
              title="أمر · أنتَ"
              result={samples.command}
            />
          </div>

          {showPassive ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <MorphCard
                english="past"
                title="ماضي مجهول · هو"
                result={samples.pastPassive}
              />
              <MorphCard
                english="present"
                title="مضارع مجهول · هو"
                result={samples.presentPassive}
              />
              <Card size="sm" className="bg-muted ring-0">
                <CardContent>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    imperative
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">أمر · مجهول</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    أمر has no مجهول.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Form IX has no useful morphological مجهول.
            </p>
          )}
        </CardContent>
      </Card>

      <VoiceKey form={form} formIBab={formIBab} />
    </div>
  );
}
