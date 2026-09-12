"use client";

import { Card, CardContent } from "@/components/ui/card";
import { WordCard, live } from "../examples";
import { COURSE_KIND_META, COURSE_KINDS, getRoot } from "@/lib/sarf";

const WORKED = [
  { id: "ktb", kind: "sound" },
  { id: "w3d", kind: "mithal" },
  { id: "qwl", kind: "ajwaf" },
  { id: "rmy", kind: "naqis" },
  { id: "mdd", kind: "mudaf" },
  { id: "axd", kind: "mahmuz" },
] as const;

export function ClassifyArticle({
  kicker = "Chapter 02",
}: {
  kicker?: string;
}) {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-1 text-3xl font-semibold">Name the type</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          Before you conjugate, read the three root letters in a fixed order.
          The first matching test is the name of the verb.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">The decision order</h2>
        <p className="leading-7 text-muted-foreground">
          Teachers check doubling first, then the weak slots from front to back,
          then hamza. That matches how this trainer labels a root:
        </p>
        <ol className="list-decimal space-y-3 ps-5 leading-7 text-muted-foreground">
          <li>
            If the second and third letters are the{" "}
            <span className="text-foreground">same</span>, it is مضاعف — even if
            that letter is و or ي.
          </li>
          <li>
            Else if the <span className="text-foreground">first</span> letter is
            و or ي, it is مثال.
          </li>
          <li>
            Else if the <span className="text-foreground">middle</span> letter
            is و or ي, it is أجوف.
          </li>
          <li>
            Else if the <span className="text-foreground">last</span> letter is
            و or ي, it is ناقص.
          </li>
          <li>
            Else if any letter is a{" "}
            <span className="text-foreground">hamza</span> (أ ؤ ئ ء إ آ), it is
            مهموز. Name the slot: فاء, عين, or لام.
          </li>
          <li>
            Otherwise it is سالم — conjugate it exactly as you already do.
          </li>
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Worked roots</h2>
        <p className="leading-7 text-muted-foreground">
          Cover the type column and name each root from the three letters.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {WORKED.map((item) => {
            const root = getRoot(item.id);
            const meta = COURSE_KIND_META[item.kind];
            return (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-2">
                  <p dir="rtl" className="font-arabic text-2xl">
                    {root.letters.join(" ")}
                  </p>
                  <p className="text-sm text-muted-foreground">{root.gloss}</p>
                  <p className="text-sm">
                    <span dir="rtl" className="font-arabic">
                      {meta.arabic}
                    </span>{" "}
                    · {meta.title}
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {meta.hint}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">
          Past هو is a hint, not the test
        </h2>
        <p className="leading-7 text-muted-foreground">
          قال and دعا no longer show the original و. Always recover the root
          first. The past هو form is useful later, once you know which mutation
          family you are in.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {COURSE_KINDS.filter((id) => id !== "sound")
            .slice(0, 3)
            .map((id) => {
              const sample =
                id === "mithal"
                  ? live("w3d")
                  : id === "ajwaf"
                    ? live("qwl")
                    : live("d3w");
              return (
                <WordCard
                  key={id}
                  label={`${COURSE_KIND_META[id].arabic} · past هو`}
                  result={sample}
                />
              );
            })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          A root will appear. Pick سالم، مثال، أجوف، ناقص، مضاعف، or مهموز.
        </p>
      </section>
    </article>
  );
}
