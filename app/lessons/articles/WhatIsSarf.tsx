"use client";

import { ArabicWord, ColorLegend } from "@/components/ArabicWord";
import { Card, CardContent } from "@/components/ui/card";
import {
  conjugate,
  getRoot,
  type ConjugateResult,
  type FormId,
} from "@/lib/sarf";

function pastHuwa(rootId: string, form: FormId): ConjugateResult {
  const root = getRoot(rootId);
  return conjugate({
    root: root.letters,
    form,
    formIBab: root.formIBab,
    tense: "past",
    voice: "active",
    person: "huwa",
    weakness: root.weakness,
  });
}

function WordCard({
  label,
  result,
  note,
}: {
  label: string;
  result: ConjugateResult;
  note?: string;
}) {
  return (
    <div className="rounded-xl bg-muted p-4 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2">
        <ArabicWord slots={result.slots} surface={result.surface} size="lg" />
      </div>
      {note ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p>
      ) : null}
    </div>
  );
}

const FAMILY_MEMBERS: {
  arabic: string;
  english: string;
  example: string;
  gloss: string;
}[] = [
  {
    arabic: "الفعل الماضي",
    english: "past tense",
    example: "عَلَّمَ",
    gloss: "he taught",
  },
  {
    arabic: "الفعل المضارع",
    english: "present tense",
    example: "يُعَلِّمُ",
    gloss: "he teaches",
  },
  {
    arabic: "المصدر",
    english: "the idea / verbal noun",
    example: "تَعْلِيمٌ",
    gloss: "teaching / education",
  },
  {
    arabic: "اسم الفاعل",
    english: "the one doing the action",
    example: "مُعَلِّمٌ",
    gloss: "teacher",
  },
  {
    arabic: "اسم المفعول",
    english: "the one affected by the action",
    example: "مُعَلَّمٌ",
    gloss: "one who is taught",
  },
];

export function WhatIsSarfArticle() {
  const alima = pastHuwa("3lm", 1);
  const allama = pastHuwa("3lm", 2);
  const nasara = pastHuwa("nSr", 1);
  const akhraj = pastHuwa("xrj", 4);
  const kataba = pastHuwa("ktb", 3);
  const taallama = pastHuwa("3lm", 5);

  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header>
        <p className="kicker">Lesson 01</p>
        <h1 className="mt-1 text-3xl font-semibold">What is صرف?</h1>
        <p className="mt-2 text-lg leading-8 text-muted-foreground">
          Sarf is the study of word patterns — how the spelling and vowels
          inside a word carry meaning. Once you see the pattern, you can
          recognize many words and build new ones from a single root.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Contents and container</h2>
        <p className="leading-7 text-muted-foreground">
          Almost every word you will train here is{" "}
          <span className="text-foreground">مشتق</span> — it follows a pattern
          and can be reshaped. A few words are{" "}
          <span className="text-foreground">جامد</span> — fixed shapes you
          cannot “do sarf” on. We focus on مشتق words.
        </p>
        <p className="leading-7 text-muted-foreground">
          Every مشتق word has two parts:
        </p>
        <ul className="list-disc space-y-2 ps-5 leading-7 text-muted-foreground">
          <li>
            <span className="text-foreground">Contents</span> — the root
            letters. Most roots have three letters. The Arabic term is{" "}
            <span dir="rtl" className="font-arabic text-foreground">
              الجذر
            </span>
            .
          </li>
          <li>
            <span className="text-foreground">Container</span> — everything
            else: the vowels and any extra letters that wrap around the root.
            That frame is the pattern.
          </li>
        </ul>
        <p className="leading-7 text-muted-foreground">
          Pour the same contents into different containers and the meanings stay
          related. The root{" "}
          <span dir="rtl" className="font-arabic text-lg text-foreground">
            ع ل م
          </span>{" "}
          is about knowing / teaching:
        </p>
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <WordCard
                label="he knew · Form I"
                result={alima}
                note="contents only + vowels"
              />
              <WordCard
                label="he taught · Form II"
                result={allama}
                note="same root, tighter container"
              />
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Teachers name the three root slots after{" "}
              <span dir="rtl" className="font-arabic text-foreground">
                ف ع ل
              </span>
              : <span className="text-foreground">فاء الكلمة</span>,{" "}
              <span className="text-foreground">عين الكلمة</span>,{" "}
              <span className="text-foreground">لام الكلمة</span>. For{" "}
              <span dir="rtl" className="font-arabic text-foreground">
                ك ت ب
              </span>
              , that is ك · ت · ب.
            </p>
            <ColorLegend />
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Families and family members</h2>
        <p className="leading-7 text-muted-foreground">
          The container belongs to a{" "}
          <span className="text-foreground">family</span> (
          <span dir="rtl" className="font-arabic text-foreground">
            الباب
          </span>
          ). Inside each family you meet the same kinds of{" "}
          <span className="text-foreground">family members</span> (
          <span dir="rtl" className="font-arabic text-foreground">
            الصيغة
          </span>
          ) — past, present, command, the idea of the action, the doer, and so
          on. Members look different from family to family, but within one
          family a given member always keeps the same shape.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[28rem] text-start text-sm">
            <thead>
              <tr className="bg-muted/80 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3 font-medium">Member</th>
                <th className="p-3 font-medium">Role</th>
                <th className="p-3 font-medium">Example</th>
              </tr>
            </thead>
            <tbody>
              {FAMILY_MEMBERS.map((row) => (
                <tr key={row.arabic} className="border-t border-border">
                  <td className="p-3 font-arabic text-base">{row.arabic}</td>
                  <td className="p-3 text-muted-foreground">{row.english}</td>
                  <td className="p-3">
                    <span dir="rtl" className="font-arabic text-lg">
                      {row.example}
                    </span>
                    <span className="ms-2 text-muted-foreground">
                      · {row.gloss}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          What makes families different is a shared trait in the container — an
          extra shadda, an extra alif, an extra ت, and so on. You will meet
          those traits as Forms II–X in this app.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">مجرد and مزيد فيه</h2>
        <p className="leading-7 text-muted-foreground">
          All families fall into two big groups.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-3">
              <h3 className="font-arabic text-xl">المجرد</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                In the past “he” form, the container has{" "}
                <span className="text-foreground">no extra letters</span> — only
                the three root letters plus vowels. Families are told apart by
                those vowels alone.
              </p>
              <WordCard label="نَصَرَ · help" result={nasara} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-3">
              <h3 className="font-arabic text-xl">المزيد فيه</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                The container always adds{" "}
                <span className="text-foreground">extra letters</span> around
                the root. Those extras are what this app paints indigo.
              </p>
              <div className="grid gap-2">
                <WordCard label="أَخْرَجَ · Form IV" result={akhraj} />
                <WordCard label="كَاتَبَ · Form III" result={kataba} />
                <WordCard label="تَعَلَّمَ · Form V" result={taallama} />
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="leading-7 text-muted-foreground">
          A quick test for the past “he” form: if you only see the three root
          letters, it is مجرد. If you see anything else (أ، ت، ا، سـت، …), it is
          مزيد فيه.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Try it</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          A past-tense “he” verb will appear. Name its three root letters
          (الجذر), then say whether the family is مجرد or مزيد فيه. Misses turn
          the colors on so the extras stand out.
        </p>
      </section>
    </article>
  );
}
