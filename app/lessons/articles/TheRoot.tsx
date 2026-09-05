"use client";

import { ArabicWord, ColorLegend } from "@/components/ArabicWord";
import { Card, CardContent } from "@/components/ui/card";
import {
  conjugate,
  getRoot,
  type ConjugateResult,
  type PersonId,
} from "@/lib/sarf";

const TEMPLATE: [string, string, string] = ["ف", "ع", "ل"];

function templatePast(): ConjugateResult {
  return conjugate({
    root: TEMPLATE,
    form: 1,
    formIBab: "nasara",
    tense: "past",
    voice: "active",
    person: "huwa",
    asSoundAnalog: true,
    weakness: "sound",
  });
}

function livePast(rootId: string, person: PersonId): ConjugateResult {
  const root = getRoot(rootId);
  return conjugate({
    root: root.letters,
    form: 1,
    formIBab: root.formIBab,
    tense: "past",
    voice: "active",
    person,
    weakness: root.weakness,
  });
}

function Example({
  label,
  result,
  highlightSuffix = false,
}: {
  label: string;
  result: ConjugateResult;
  highlightSuffix?: boolean;
}) {
  return (
    <div className="rounded-xl bg-muted p-4 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2">
        <ArabicWord
          slots={result.slots}
          surface={result.surface}
          size="lg"
          highlight={highlightSuffix ? ["suffix"] : undefined}
        />
      </div>
    </div>
  );
}

function HeShePair({ rootId, gloss }: { rootId: string; gloss: string }) {
  const root = getRoot(rootId);
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">
        <span dir="rtl" className="font-arabic text-base text-foreground">
          {root.letters.join(" ")}
        </span>{" "}
        · {gloss}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Example label="he · هُوَ" result={livePast(rootId, "huwa")} />
        <Example
          label="she · هِيَ"
          result={livePast(rootId, "hiya")}
          highlightSuffix
        />
      </div>
    </div>
  );
}

export function TheRootArticle() {
  const template = templatePast();
  const kataba = livePast("ktb", "huwa");
  const katabat = livePast("ktb", "hiya");

  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">Lesson 02</p>
        <h1 className="mt-1 text-3xl font-semibold">The three-letter root</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          Sarf is the system that changes an Arabic verb’s shape. You do not
          need any of it yet except one fact: almost every verb is built from
          three letters, called the root.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Three letters, one meaning</h2>
        <p className="leading-7 text-muted-foreground">
          The root is like a skeleton. The letters{" "}
          <span dir="rtl" className="font-arabic text-lg text-foreground">
            ك ت ب
          </span>{" "}
          carry the idea “write”. Different vowels and extra letters will later
          make “he wrote”, “she wrote”, “they write”, and so on — but those
          three letters stay the meaning.
        </p>
        <p className="leading-7 text-muted-foreground">
          Teachers mark the three slots as{" "}
          <span dir="rtl" className="font-arabic text-lg text-foreground">
            ف ع ل
          </span>
          . This app colors them the same way everywhere: first, second, and
          third root letter.
        </p>
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Example label="the template" result={template} />
              <Example label="write · ك ت ب" result={kataba} />
            </div>
            <ColorLegend />
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">He wrote, she wrote</h2>
        <p className="leading-7 text-muted-foreground">
          The simplest pattern is called{" "}
          <span className="text-foreground">Form I</span>. Its past-tense shape
          is{" "}
          <span dir="rtl" className="font-arabic text-lg text-foreground">
            فَعَلَ
          </span>
          . For “he”, nothing is added after the root. For “she”, a small ending{" "}
          <span dir="rtl" className="font-arabic text-lg text-foreground">
            تْ
          </span>{" "}
          is attached. That ending is not a fourth root letter — it only says
          who did the action.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Example label="he wrote · هُوَ" result={kataba} />
          <Example
            label="she wrote · هِيَ"
            result={katabat}
            highlightSuffix
          />
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          The stone-colored{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            تْ
          </span>{" "}
          is a person ending. The three colored letters are still{" "}
          <span dir="rtl" className="font-arabic text-foreground">
            ك ت ب
          </span>
          .
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Same rule, other roots</h2>
        <p className="leading-7 text-muted-foreground">
          Swap the three root letters. The he / she ending does not change.
        </p>
        <HeShePair rootId="drs" gloss="study" />
        <HeShePair rootId="ftH" gloss="open" />
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          A past-tense verb will appear. Name its three root letters, then say
          whether it is he or she. Misses turn the colors on so you can see the
          ending.
        </p>
      </section>
    </article>
  );
}
