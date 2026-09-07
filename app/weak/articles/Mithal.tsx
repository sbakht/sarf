"use client";

import { CompareTable, WordCard, analog, live } from "../examples";

export function MithalArticle({ kicker = "Chapter 03" }: { kicker?: string }) {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-1 text-3xl font-semibold">Mithal</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          مثال means the first radical is و (most common) or ي. Form I past is
          the sound template you already know. The mutation is almost only
          present and command: that initial wāw drops.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Past is not the trap</h2>
        <p className="leading-7 text-muted-foreground">
          وَعَدَ looks like نَصَرَ with a و in slot ف. If you only drilled past
          هو, you would never notice a weak verb. The analog and the actual
          match:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard label="analog" result={analog("w3d")} />
          <WordCard label="actual وَعَدَ" result={live("w3d")} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Present and command drop و</h2>
        <p className="leading-7 text-muted-foreground">
          In Form I active present the first radical sits with sukūn after the
          prefix: the analog of يعد would be{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يَوْعِدُ
          </span>
          . Arabic does not keep that cluster. The و drops and you get{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يَعِدُ
          </span>
          . The command is built from the jussive, so it drops too:{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            عِدْ
          </span>
          .
        </p>
        <CompareTable
          rootId="w3d"
          rows={[
            { label: "ماضي هو" },
            { label: "مضارع هو", spec: { tense: "present" } },
            { label: "مضارع أنا", spec: { tense: "present", person: "ana" } },
            {
              label: "أمر أنتَ",
              spec: { tense: "imperative", person: "anta" },
            },
            {
              label: "مضارع مجهول",
              spec: { tense: "present", voice: "passive" },
            },
          ]}
        />
        <p className="leading-7 text-muted-foreground">
          The passive{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يُوعَدُ
          </span>{" "}
          keeps the wāw — the prefix vowel is ḍamma, so the first radical is not
          a problem cluster. Do not over-drop.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Same drop on وجد</h2>
        <p className="leading-7 text-muted-foreground">
          وجد “find” is the same family: وَجَدَ → يَجِدُ → جِدْ.
        </p>
        <CompareTable
          rootId="wjd"
          rows={[
            { label: "ماضي هو" },
            { label: "مضارع هو", spec: { tense: "present" } },
            {
              label: "أمر أنتَ",
              spec: { tense: "imperative", person: "anta" },
            },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Derived forms keep the و</h2>
        <p className="leading-7 text-muted-foreground">
          The famous drop is a Form I story. Form IV أَوْعَدَ / يُوعِدُ and Form
          X اِسْتَوْعَدَ keep the first radical. If you already produce مزيد فيه
          sound verbs, keep producing them — just leave the و in slot ف.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard
            label="Form IV أَوْعَدَ"
            result={live("w3d", { form: 4 })}
          />
          <WordCard
            label="Form IV يُوعِدُ"
            result={live("w3d", { form: 4, tense: "present" })}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          Start from the analog of وعد / وجد. Pick the actual surface, then name
          the rule: no change, or initial wāw drops.
        </p>
      </section>
    </article>
  );
}
