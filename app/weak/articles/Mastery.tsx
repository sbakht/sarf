"use client";

import { COURSE_KIND_META, COURSE_KINDS } from "@/lib/sarf";
import { CompareTable, DIAGNOSTIC_ROWS, WordCard, live } from "../examples";

export function MasteryArticle({ kicker = "Chapter 08" }: { kicker?: string }) {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-1 text-3xl font-semibold">Mastery</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          You already conjugate سالم verbs. Weak verbs are that same analog plus
          a named mutation. This sitting mixes types, tenses, and moods. Name
          the family, then pick the actual surface.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">The whole path on one card</h2>
        <ol className="list-decimal space-y-3 ps-5 leading-7 text-muted-foreground">
          <li>
            Read the three letters in order: doubling, then ف, then ع, then ل,
            then hamza.
          </li>
          <li>
            Build the sound analog in the cell you were asked for — you already
            can.
          </li>
          <li>
            Apply only that family’s rule. If the analog already matches, stop.
          </li>
        </ol>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[32rem] text-start text-sm">
            <thead>
              <tr className="bg-muted/80 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">When it changes</th>
                <th className="p-3 font-medium">When it does not</th>
              </tr>
            </thead>
            <tbody>
              {COURSE_KINDS.map((id) => {
                const meta = COURSE_KIND_META[id];
                const when = {
                  sound: "never — analog is actual",
                  mithal: "Form I present and command (و drops)",
                  ajwaf: "vowelled last → long vowel; still last → shorten",
                  naqis: "هو alif; هي drop; indicative mater; jussive drop",
                  mudaf: "vowelled last → shadda; still last → split",
                  mahmuz: "seating, آخذ, and خذ; otherwise analog",
                }[id];
                const stay = {
                  sound: "every cell",
                  mithal: "past, and most derived forms",
                  ajwaf: "forms whose middle is busy (II, III, V, VI, IX)",
                  naqis: "still endings like دعوت / رميت",
                  mudaf: "مددت and other still endings",
                  mahmuz: "أَخَذَ, يَأْخُذُ, سَأَلَ, يَقْرَأُ",
                }[id];
                return (
                  <tr key={id} className="border-t border-border">
                    <td className="p-3">
                      <span dir="rtl" className="font-arabic">
                        {meta.arabic}
                      </span>
                      <span className="ms-2 text-muted-foreground">
                        {meta.title}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{when}</td>
                    <td className="p-3 text-muted-foreground">{stay}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Diagnostic cells</h2>
        <p className="leading-7 text-muted-foreground">
          If you can produce these six cells from analog for each type, you can
          fill the rest of the table. قال as a reminder:
        </p>
        <CompareTable rootId="qwl" rows={DIAGNOSTIC_ROWS} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">One glance per family</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard label="سالم كتب" result={live("ktb")} />
          <WordCard
            label="مثال يعد"
            result={live("w3d", { tense: "present" })}
          />
          <WordCard label="أجوف قال" result={live("qwl")} />
          <WordCard label="ناقص دعا" result={live("d3w")} />
          <WordCard label="مضاعف مدّ" result={live("mdd")} />
          <WordCard
            label="مهموز خذ"
            result={live("axd", { tense: "imperative", person: "anta" })}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          Mixed roots and cells. Name the type, then choose the actual form.
          After this sitting, the Lab is there if you want to browse every
          mutation side by side.
        </p>
      </section>
    </article>
  );
}
