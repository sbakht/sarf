"use client";

import { CompareTable, WordCard, live } from "../examples";

export function MahmuzArticle({ kicker = "Chapter 07" }: { kicker?: string }) {
  return (
    <article className="flex min-w-0 w-full max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-1 text-3xl font-semibold">Mahmuz</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          مهموز has a hamza in the root. Most cells are the sound template you
          already know, with the hamza sitting on أ, و, ي, or the line. A few
          cells contract or go irregular. Learn those exceptions against the
          analog, not as a new conjugation system.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Most of أخذ is sound</h2>
        <p className="leading-7 text-muted-foreground">
          Past هو{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            أَخَذَ
          </span>{" "}
          is the analog. Present هو{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يَأْخُذُ
          </span>{" "}
          is the analog. The two cells everyone remembers are the contractions:
        </p>
        <CompareTable
          rootId="axd"
          rows={[
            { label: "ماضي هو" },
            { label: "مضارع هو", spec: { tense: "present" } },
            { label: "مضارع أنا", spec: { tense: "present", person: "ana" } },
            {
              label: "أمر أنتَ",
              spec: { tense: "imperative", person: "anta" },
            },
          ]}
        />
        <p className="leading-7 text-muted-foreground">
          Present I: prefix أَ + first radical أْ contract to madda,{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            آخُذُ
          </span>
          . Command of أخذ is irregular{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            خُذْ
          </span>{" "}
          — the hamza (and the wasl) is gone. Do not invent خُذْ for سأل or قرأ.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">The seat of hamza</h2>
        <p className="leading-7 text-muted-foreground">
          When a vowel next to the hamza changes, the chair changes. Kasra
          prefers ي (ئ), ḍamma prefers و (ؤ), fatḥa prefers alif (أ), and a
          preceding alif often puts hamza on the line (ء). You do not need a new
          person table — you need to recast the same radical.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard
            label="قُرِئَ · seating after kasra"
            result={live("qrA", { voice: "passive" })}
          />
          <WordCard
            label="سُئِلَ · middle hamza"
            result={live("sAl", { voice: "passive" })}
          />
          <WordCard
            label="يُقْرِئُ · Form IV"
            result={live("qrA", { form: 4, tense: "present" })}
          />
          <WordCard
            label="تَسَاءَلَ · hamza on the line"
            result={live("sAl", { form: 6 })}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Read, ask, take</h2>
        <p className="leading-7 text-muted-foreground">
          لام مهموز قرأ keeps أ in{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            يَقْرَأُ
          </span>
          . عين مهموز سأل is{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            سَأَلَ
          </span>
          . فاء مهموز أخذ is the one with the famous command. Name the slot
          first, then ask whether this cell is analog, seating, madda, or خذ.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <WordCard label="أخذ" result={live("axd")} />
          <WordCard label="سأل" result={live("sAl")} />
          <WordCard label="قرأ" result={live("qrA")} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          Most answers will be “no change”. Stay honest about that — the skill
          is spotting آخذ and خذ when they appear, not mutating every hamza.
        </p>
      </section>
    </article>
  );
}
