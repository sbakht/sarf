"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArabicWord } from "@/components/ArabicWord";
import { useSettings } from "@/components/SettingsProvider";
import { Card, CardContent } from "@/components/ui/card";
import {
  conjugate,
  formLabel,
  hasMorphologicalPassive,
  type FormIBab,
  type FormId,
  type MorphemeSlot,
  type SlotKind,
  type Voice,
} from "@/lib/sarf";

const TEMPLATE: [string, string, string] = ["ف", "ع", "ل"];
const KTB: [string, string, string] = ["ك", "ت", "ب"];
const ILM: [string, string, string] = ["ع", "ل", "م"];

const CUE_NAME = {
  fatha: "فتحة",
  damma: "ضمة",
  kasra: "كسرة",
} as const;

function verb(
  root: [string, string, string],
  form: FormId,
  tense: "past" | "present",
  voice: Voice,
  bab: FormIBab = "nasara",
) {
  return conjugate({
    root,
    form,
    formIBab: bab,
    tense,
    voice,
    person: "huwa",
    asSoundAnalog: true,
    weakness: "sound",
  });
}

function Example({
  label,
  slots,
  surface,
  highlight,
  voice,
}: {
  label: string;
  slots: MorphemeSlot[];
  surface: string;
  highlight: SlotKind[];
  voice: Voice;
}) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">
        <ArabicWord
          slots={slots}
          surface={surface}
          size="md"
          highlight={highlight}
        />
      </div>
      <p className="mt-1 font-arabic text-sm text-muted-foreground">
        {voice === "active" ? "معلوم" : "مجهول"}
      </p>
    </div>
  );
}

function Branch({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-4">
      <h3 className="font-arabic text-xl">{title}</h3>
      {children}
    </div>
  );
}

export function VoiceKey({
  form = 1,
  formIBab = "nasara",
  compact = false,
}: {
  form?: FormId;
  formIBab?: FormIBab;
  compact?: boolean;
}) {
  const { showHarakat, labelMode } = useSettings();
  const showPassive = hasMorphologicalPassive(form);
  const pastHighlight: SlotKind[] =
    form === 1 ? ["f", "a"] : ["extra", "f", "a"];
  const presentHighlight: SlotKind[] = ["prefix", "a"];

  const livePastActive = verb(TEMPLATE, form, "past", "active", formIBab);
  const livePastPassive = verb(TEMPLATE, form, "past", "passive", formIBab);
  const livePresentActive = verb(TEMPLATE, form, "present", "active", formIBab);
  const livePresentPassive = verb(
    TEMPLATE,
    form,
    "present",
    "passive",
    formIBab,
  );

  const kataba = verb(KTB, 1, "past", "active");
  const kutiba = verb(KTB, 1, "past", "passive");
  const yaktubu = verb(KTB, 1, "present", "active");
  const yuktabu = verb(KTB, 1, "present", "passive");
  const yuallimu = verb(ILM, 2, "present", "active");

  const body = (
    <>
      <p className="kicker">Voice key</p>
      <h2 className="mt-1 text-2xl font-semibold">معلوم or مجهول?</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground leading-7">
        This reads morphological voice from vowels, not meaning. Form VII إنفعل
        can feel “passive” but is still معلوم here.
      </p>

      {!showHarakat ? (
        <p className="mt-3 rounded-xl border border-energy/40 bg-energy/10 px-4 py-3 text-sm text-energy">
          Turn Harakat on. This key has nothing to read without vowels.
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Branch title="مضارع">
          <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm leading-6 text-muted-foreground">
            <li>
              Look at the person prefix{" "}
              <span className="text-affix">(أ / ت / ي / ن)</span>.
            </li>
            <li>
              <span className="font-arabic text-base text-foreground">
                {CUE_NAME.fatha} َ
              </span>{" "}
              → معلوم
            </li>
            <li>
              <span className="font-arabic text-base text-foreground">
                {CUE_NAME.damma} ُ
              </span>{" "}
              → inspect <span className="font-arabic text-ayn">ع</span>
              <ul className="mt-1 list-disc space-y-1 ps-4">
                <li>
                  <span className="font-arabic text-base text-foreground">
                    {CUE_NAME.kasra} ِ
                  </span>{" "}
                  → معلوم (II, III, IV)
                </li>
                <li>
                  <span className="font-arabic text-base text-foreground">
                    {CUE_NAME.fatha} َ
                  </span>{" "}
                  → مجهول
                </li>
              </ul>
            </li>
          </ol>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Example
              label="fatha prefix"
              slots={yaktubu.slots}
              surface={yaktubu.surface}
              highlight={presentHighlight}
              voice="active"
            />
            <Example
              label="damma + kasra"
              slots={yuallimu.slots}
              surface={yuallimu.surface}
              highlight={presentHighlight}
              voice="active"
            />
            <Example
              label="damma + fatha"
              slots={yuktabu.slots}
              surface={yuktabu.surface}
              highlight={presentHighlight}
              voice="passive"
            />
          </div>
        </Branch>

        <Branch title="ماضي">
          <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm leading-6 text-muted-foreground">
            <li>
              Opening {CUE_NAME.damma} ُ and{" "}
              <span className="font-arabic text-ayn">ع</span> with{" "}
              {CUE_NAME.kasra} ِ → مجهول
            </li>
            <li>Anything else → معلوم</li>
            <li>
              باب فرح{" "}
              <span className="font-arabic text-foreground">فَعِلَ</span> has
              kasra on ع but fatha on the first letter — still معلوم.
            </li>
          </ol>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Example
              label="fatha then theme"
              slots={kataba.slots}
              surface={kataba.surface}
              highlight={["f", "a"]}
              voice="active"
            />
            <Example
              label="damma then kasra"
              slots={kutiba.slots}
              surface={kutiba.surface}
              highlight={["f", "a"]}
              voice="passive"
            />
          </div>
        </Branch>
      </div>

      {!compact && showPassive ? (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            This form · {formLabel(form, labelMode)}
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Example
              label="وزن past معلوم"
              slots={livePastActive.slots}
              surface={livePastActive.surface}
              highlight={pastHighlight}
              voice="active"
            />
            <Example
              label="وزن past مجهول"
              slots={livePastPassive.slots}
              surface={livePastPassive.surface}
              highlight={pastHighlight}
              voice="passive"
            />
            <Example
              label="وزن present معلوم"
              slots={livePresentActive.slots}
              surface={livePresentActive.surface}
              highlight={presentHighlight}
              voice="active"
            />
            <Example
              label="وزن present مجهول"
              slots={livePresentPassive.slots}
              surface={livePresentPassive.surface}
              highlight={presentHighlight}
              voice="passive"
            />
          </div>
          {form === 3 || form === 6 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Forms III and VI swap alif for wāw in past مجهول (
              <span className="font-arabic">فُوعِلَ / تُفُوعِلَ</span>
              ).
            </p>
          ) : null}
        </div>
      ) : null}

      {!showPassive ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Form IX has no useful morphological مجهول.
        </p>
      ) : null}

      <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
        <li>أمر has no مجهول.</li>
        <li>
          أجوف past مجهول does not keep the opening damma: analog{" "}
          <span className="font-arabic text-foreground">قُوِلَ</span> surfaces
          as <span className="font-arabic text-foreground">قِيلَ</span>. See{" "}
          <Link href="/lab" className="text-energy underline">
            Lab
          </Link>
          .
        </li>
      </ul>
    </>
  );

  if (compact) return <section>{body}</section>;

  return (
    <Card>
      <CardContent>{body}</CardContent>
    </Card>
  );
}
