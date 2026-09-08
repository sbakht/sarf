"use client";

import { ColorLegend } from "@/components/ArabicWord";
import { CompareTable, WordCard, analog, live } from "../examples";

export function SoundVsWeakArticle({
  kicker = "Chapter 01",
}: {
  kicker?: string;
}) {
  const kataba = live("ktb");
  const analogQala = analog("qwl");
  const qala = live("qwl");

  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-1 text-3xl font-semibold">Sound vs weak</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          You already conjugate سالم verbs — three stable consonants in a
          familiar template. Weak verbs start from that same analog, then one
          letter misbehaves.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">The analog you already know</h2>
        <p className="leading-7 text-muted-foreground">
          For any root, you can build the{" "}
          <span className="text-foreground">sound analog</span>: pretend every
          radical is a solid consonant like{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            ك ت ب
          </span>{" "}
          and pour it into Form I. That is the shape you would produce before
          any weak-letter rule.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard
            label="كتب · past هو"
            result={kataba}
            note="سالم — analog and actual are the same"
          />
          <WordCard
            label="قول · sound analog"
            result={analogQala}
            note="if قال were سالم"
          />
        </div>
        <ColorLegend />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Then the letter changes</h2>
        <p className="leading-7 text-muted-foreground">
          The letters{" "}
          <span dir="rtl" className="font-arabic text-lg text-foreground">
            و
          </span>{" "}
          and{" "}
          <span dir="rtl" className="font-arabic text-lg text-foreground">
            ي
          </span>{" "}
          are weak (حروف العلة). They can become a long vowel, drop, or come
          back depending on the cell. Compare the analog of قال with what you
          actually say:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <WordCard label="analog قَوَلَ" result={analogQala} />
          <WordCard
            label="actual قَالَ"
            result={qala}
            note="middle و collapsed into alif"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Two charts, one course</h2>
        <p className="leading-7 text-muted-foreground">
          Classical books split the chart this way:
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[28rem] text-start text-sm">
            <thead>
              <tr className="bg-muted/80 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3 font-medium">Family</th>
                <th className="p-3 font-medium">Arabic</th>
                <th className="p-3 font-medium">What to look at</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["سالم", "sound", "three different, stable consonants"],
                ["مثال", "mithal", "first radical و / ي"],
                ["أجوف", "ajwaf", "middle radical و / ي"],
                ["ناقص", "naqis", "last radical و / ي"],
                ["مضاعف", "mudaf", "second and third letters match"],
                ["مهموز", "mahmuz", "a hamza in the root"],
              ].map(([arabic, english, hint]) => (
                <tr key={english} className="border-t border-border">
                  <td className="p-3 font-arabic text-base">{arabic}</td>
                  <td className="p-3 text-muted-foreground">{english}</td>
                  <td className="p-3 text-muted-foreground">{hint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="leading-7 text-muted-foreground">
          Strictly, مضاعف and مهموز are still called صحيح — they have no و / ي.
          They still leave the analog you already know, so this course treats
          them as sister mutation types. المعتل proper is مثال, أجوف, and ناقص.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">A cell can look sound</h2>
        <p className="leading-7 text-muted-foreground">
          Weakness is a property of the{" "}
          <span className="text-foreground">root</span>, not of every cell. مثال
          past هو is وَعَدَ — identical to the analog. The drop happens in
          present and command. Always ask two questions: what is the root type,
          and did <em>this</em> cell change?
        </p>
        <CompareTable
          rootId="w3d"
          rows={[
            { label: "ماضي هو" },
            { label: "مضارع هو", spec: { tense: "present" } },
          ]}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          You will see a root and its sound analog. Say whether the root is
          سالم, then whether this cell actually left the analog.
        </p>
      </section>
    </article>
  );
}
