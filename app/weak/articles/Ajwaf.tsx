"use client";

import { CompareTable, WordCard, analog, live } from "../examples";

export function AjwafArticle({ kicker = "Chapter 04" }: { kicker?: string }) {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-1 text-3xl font-semibold">Ajwaf</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          أجوف is the hollow verb: the middle radical is و or ي. Two rules cover
          almost every Form I cell. If you already know sound past and present,
          you only have to decide whether the last letter is still.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Rule 1 — two vowels collapse</h2>
        <p className="leading-7 text-muted-foreground">
          When the middle radical and the last letter are both vowelled, they do
          not stay as two syllables. They collapse into a long vowel. The analog{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            قَوَلَ
          </span>{" "}
          becomes{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            قَالَ
          </span>
          . Present{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يَقْوُلُ
          </span>{" "}
          becomes{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يَقُولُ
          </span>
          .
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard label="analog past هو" result={analog("qwl")} />
          <WordCard label="actual قَالَ" result={live("qwl")} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">
          Rule 2 — a still last letter shortens
        </h2>
        <p className="leading-7 text-muted-foreground">
          When the last radical has sukūn (أنا, أنتَ, هن, jussive هو, command
          أنتَ, …), the long vowel cannot stand. The hollow letter drops and the
          first letter takes a short vowel:{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            قُلْتُ
          </span>
          ,{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يَقُلْ
          </span>
          ,{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            قُلْ
          </span>
          . Feminine{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            قُولِي
          </span>{" "}
          keeps the long vowel because ل is vowelled again.
        </p>
        <CompareTable
          rootId="qwl"
          rows={[
            { label: "ماضي هو" },
            { label: "ماضي أنا", spec: { person: "ana" } },
            { label: "ماضي هن", spec: { person: "hunna" } },
            { label: "مضارع هو", spec: { tense: "present" } },
            {
              label: "مجزوم هو",
              spec: { tense: "present", mood: "jussive" },
            },
            { label: "مضارع هن", spec: { tense: "present", person: "hunna" } },
            {
              label: "أمر أنتَ",
              spec: { tense: "imperative", person: "anta" },
            },
            {
              label: "أمر أنتِ",
              spec: { tense: "imperative", person: "anti" },
            },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">The quality of the long vowel</h2>
        <p className="leading-7 text-muted-foreground">
          قال is a و-root on the نصر باب, so present is wāw: يَقُولُ. باع is a
          ي-root on ضرب, so يَبِيعُ. خاف is hollow on فرح, so the present stays
          alif: يَخَافُ. Past أنا takes the matching short vowel: قُلْتُ,
          بِعْتُ, خِفْتُ. Passive hollow is kasra + yāʾ: قِيلَ, بِيعَ, خِيفَ.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <WordCard label="باع" result={live("by3")} />
          <WordCard label="يبيع" result={live("by3", { tense: "present" })} />
          <WordCard label="بعت" result={live("by3", { person: "ana" })} />
          <WordCard label="خاف" result={live("xwf")} />
          <WordCard label="يخاف" result={live("xwf", { tense: "present" })} />
          <WordCard label="خيف" result={live("xwf", { voice: "passive" })} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">
          Forms that keep a doubled middle
        </h2>
        <p className="leading-7 text-muted-foreground">
          Forms II, III, V, VI, IX do not run this collapse — the middle letter
          is busy (shadda or alif). Form IV and X do: أراد / يريد / أردت, أقام /
          أقِمْ. This chapter drills Form I; remember the same still-vs-vowelled
          test when you meet those forms later.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          Look at the analog. If the last letter is still, pick the shortened
          form. If both letters are vowelled, pick the long vowel.
        </p>
      </section>
    </article>
  );
}
