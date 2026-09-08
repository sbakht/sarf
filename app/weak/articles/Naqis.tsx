"use client";

import { CompareTable, WordCard, analog, live } from "../examples";

export function NaqisArticle({ kicker = "Chapter 05" }: { kicker?: string }) {
  return (
    <article className="flex min-w-0 w-full max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-1 text-3xl font-semibold">Naqis</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          ناقص is defective: the last radical is و or ي. This is the type with
          the most person-by-person changes. You already know the sound endings.
          The weak letter either becomes a mater, drops, or — in the cells you
          already produce well — stays as و / ي with sukūn.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Past: three snapshots</h2>
        <p className="leading-7 text-muted-foreground">
          هو turns the last radical into alif (و-root) or alif maqṣūra (ي-root):
          دَعَا, رَمَى. هي drops it before feminine ت: دَعَتْ, رَمَتْ. أنا and
          the other still endings look like sound verbs — the original letter
          returns: دَعَوْتُ, رَمَيْتُ. That last cell is the analog; do not
          “fix” it.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <WordCard label="دعا · هو" result={live("d3w")} />
          <WordCard label="دعت · هي" result={live("d3w", { person: "hiya" })} />
          <WordCard
            label="دعوت · أنا"
            result={live("d3w", { person: "ana" })}
          />
        </div>
        <CompareTable
          rootId="d3w"
          rows={[
            { label: "ماضي هو" },
            { label: "ماضي هي", spec: { person: "hiya" } },
            { label: "ماضي أنا", spec: { person: "ana" } },
            { label: "ماضي هم", spec: { person: "hum" } },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">
          Present: long vowel, then drop
        </h2>
        <p className="leading-7 text-muted-foreground">
          Indicative هو is a long vowel letter matching the theme: يَدْعُو,
          يَرْمِي. Jussive and command drop that letter: يَدْعُ, اُدْعُ. Before
          a و or ي person ending the last radical also drops (يَدْعُونَ,
          تَدْعِينَ), and the prefix/theme vowel may adjust. Dual keeps a
          vowelled glide: يَدْعُوَانِ.
        </p>
        <CompareTable
          rootId="d3w"
          rows={[
            { label: "مضارع هو", spec: { tense: "present" } },
            {
              label: "مجزوم هو",
              spec: { tense: "present", mood: "jussive" },
            },
            { label: "مضارع هم", spec: { tense: "present", person: "hum" } },
            { label: "مضارع أنتِ", spec: { tense: "present", person: "anti" } },
            {
              label: "أمر أنتَ",
              spec: { tense: "imperative", person: "anta" },
            },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">ي-roots and the passive</h2>
        <p className="leading-7 text-muted-foreground">
          رمى is the ي twin of دعا. Present يَرْمِي, they يَرْمُونَ (the kasra
          becomes ḍamma before و). Passive past is always with yāʾ: دُعِيَ,
          رُمِيَ. Present passive is alif maqṣūra: يُدْعَى.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard label="رمى" result={live("rmy")} />
          <WordCard label="يرمي" result={live("rmy", { tense: "present" })} />
          <WordCard label="دعي" result={live("d3w", { voice: "passive" })} />
          <WordCard
            label="يدعى"
            result={live("d3w", { tense: "present", voice: "passive" })}
          />
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Analog of رمى past هو is رَمَيَ — the ي is still sitting there. The
          mutation is exactly that last letter becoming ى.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard label="analog رَمَيَ" result={analog("rmy")} />
          <WordCard label="actual رَمَى" result={live("rmy")} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          For each cell, start from the analog. Did the last letter become alif,
          drop, become a long vowel, or stay as in a sound verb?
        </p>
      </section>
    </article>
  );
}
