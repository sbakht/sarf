"use client";

import { CompareTable, WordCard, analog, live } from "../examples";

export function MudafArticle({ kicker = "Chapter 06" }: { kicker?: string }) {
  return (
    <article className="flex min-w-0 w-full max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-1 text-3xl font-semibold">Mudaf</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          مضاعف is doubled: the second and third radicals are the same letter.
          Classically it is still صحيح, but it is the first analog you will
          “hear” as wrong. Two identical consonants next to each other want to
          assimilate.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Vowelled last letter → shadda</h2>
        <p className="leading-7 text-muted-foreground">
          The analog of مدّ past هو is{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            مَدَدَ
          </span>
          . When the last letter is vowelled, the two د letters collapse:{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            مَدَّ
          </span>
          . Present{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يَمُدُّ
          </span>{" "}
          does the same, and the theme vowel moves onto ف.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard label="analog مَدَدَ" result={analog("mdd")} />
          <WordCard label="actual مَدَّ" result={live("mdd")} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Still last letter → split</h2>
        <p className="leading-7 text-muted-foreground">
          When the last letter has sukūn, assimilation is blocked. أنا is{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            مَدَدْتُ
          </span>{" "}
          — exactly the sound analog. هن{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يَمْدُدْنَ
          </span>{" "}
          splits too. Command أنتَ is often the assimilated jussive{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            مُدَّ
          </span>{" "}
          because the last letter is vowelled in that dialect of the table; if a
          form stays still, it will split.
        </p>
        <CompareTable
          rootId="mdd"
          rows={[
            { label: "ماضي هو" },
            { label: "ماضي أنا", spec: { person: "ana" } },
            { label: "مضارع هو", spec: { tense: "present" } },
            { label: "مضارع هن", spec: { tense: "present", person: "hunna" } },
            {
              label: "أمر أنتَ",
              spec: { tense: "imperative", person: "anta" },
            },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">The same test as أجوف</h2>
        <p className="leading-7 text-muted-foreground">
          You already used “is the last letter still?” for hollow verbs. مضاعف
          uses that test for a different reason: shadda needs a vowel to sit on.
          If you remember only one sentence:{" "}
          <span className="text-foreground">
            vowelled last letter assimilates; still last letter splits.
          </span>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          Compare the analog مَدَدَ / يَمْدُدُ with the actual cell. Pick shadda
          or no change.
        </p>
      </section>
    </article>
  );
}
