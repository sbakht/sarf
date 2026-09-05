"use client";

import { useMemo, useState } from "react";
import { ArabicWord } from "@/components/ArabicWord";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PERSON_BY_ID,
  ROOTS,
  conjugate,
  rootsByWeakness,
  type PersonId,
  type Tense,
  type WeaknessType,
} from "@/lib/sarf";
import { cn } from "@/lib/utils";

type Kind = Extract<
  WeaknessType,
  "ajwaf" | "mithal" | "naqis" | "mudaf" | "mahmuz_f"
>;

const KINDS: { id: Kind; title: string; arabic: string; blurb: string }[] = [
  {
    id: "ajwaf",
    title: "Ajwaf",
    arabic: "الأجوف",
    blurb:
      "The middle radical is و or ي. When both the middle and last letters are vowelled, they collapse into a long vowel (قَالَ / يَقُولُ). When the last letter is still, the long vowel shortens (قُلْتُ / يَقُلْ).",
  },
  {
    id: "mithal",
    title: "Mithal",
    arabic: "المثال",
    blurb:
      "The first radical is و (or ي). In Form I present and command that wāw usually drops: وَعَدَ → يَعِدُ → عِدْ.",
  },
  {
    id: "naqis",
    title: "Naqis",
    arabic: "الناقص",
    blurb:
      "The last radical is و or ي. Past هو becomes alif / alif maqṣūra (دَعَا / رَمَى); before ت it drops (دَعَتْ); the original letter returns before still endings (دَعَوْتُ).",
  },
  {
    id: "mudaf",
    title: "Mudaf",
    arabic: "المضاعف",
    blurb:
      "The second and third radicals are the same letter. They assimilate with shadda when the last letter is vowelled (مَدَّ / يَمُدُّ), and split when it is still (مَدَدْتُ).",
  },
  {
    id: "mahmuz_f",
    title: "Mahmuz",
    arabic: "المهموز",
    blurb:
      "A hamza sits in the root. Most cells follow the sound template; a few commands are irregular (أَخَذَ → خُذْ).",
  },
];

const DRILL_CELLS: {
  tense: Tense;
  person: PersonId;
  mood?: "indicative" | "jussive";
  label: string;
}[] = [
  { tense: "past", person: "huwa", label: "ماضي هو" },
  { tense: "past", person: "ana", label: "ماضي أنا" },
  { tense: "present", person: "huwa", label: "مضارع هو" },
  { tense: "present", person: "hunna", label: "مضارع هن" },
  { tense: "present", person: "huwa", mood: "jussive", label: "مجزوم هو" },
  { tense: "imperative", person: "anta", label: "أمر أنتَ" },
];

export function LabView() {
  const [kind, setKind] = useState<Kind>("ajwaf");
  const [rootIndex, setRootIndex] = useState(0);
  const [drill, setDrill] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const roots =
    kind === "mahmuz_f"
      ? ROOTS.filter((item) => item.weakness.startsWith("mahmuz"))
      : rootsByWeakness(kind);
  const root = roots[rootIndex % Math.max(roots.length, 1)] ?? roots[0];
  const meta = KINDS.find((item) => item.id === kind)!;

  const rows = useMemo(() => {
    if (!root) return [];
    return DRILL_CELLS.map((cell) => {
      const actual = conjugate({
        root: root.letters,
        form: 1,
        formIBab: root.formIBab,
        tense: cell.tense,
        voice: "active",
        person: cell.person,
        mood: cell.mood ?? "indicative",
        weakness: root.weakness,
      });
      const analog = conjugate({
        root: root.letters,
        form: 1,
        formIBab: root.formIBab,
        tense: cell.tense,
        voice: "active",
        person: cell.person,
        mood: cell.mood ?? "indicative",
        asSoundAnalog: true,
        weakness: "sound",
      });
      return { ...cell, actual, analog };
    });
  }, [root]);

  const current = rows[drill % Math.max(rows.length, 1)];
  const uniqueOptions = useMemo(() => {
    if (!current) return [];
    const set = new Set<string>([
      current.actual.surface,
      current.analog.surface,
      ...neighborSurfaces(rows, drill),
    ]);
    return [...set].filter((s) => s !== "—").slice(0, 4);
  }, [current, rows, drill]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="kicker">Weak Verb Lab</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Sound analog vs what you actually say
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Start from the regular template, then apply the mutation. أجوف is the
          most common; the other types use the same compare-and-drill layout.
        </p>
      </header>

      <Tabs
        value={kind}
        onValueChange={(value) => {
          setKind(value as Kind);
          setRootIndex(0);
          setDrill(0);
          setPicked(null);
        }}
        className="gap-0"
      >
        <TabsList className="flex h-auto flex-wrap">
          {KINDS.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="rounded-full px-3"
            >
              <span className="font-arabic">{item.arabic}</span> · {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {root ? (
        <>
          <Card>
            <CardContent>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-arabic text-3xl">{meta.arabic}</h2>
                  <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
                    {meta.blurb}
                  </p>
                </div>
                <div className="rounded-xl bg-muted px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Example root
                  </p>
                  <p className="font-arabic text-2xl">
                    {root.letters.join(" ")}{" "}
                    <span className="text-base text-muted-foreground">
                      ({root.gloss})
                    </span>
                  </p>
                  {roots.length > 1 ? (
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-1 h-auto px-0 text-energy"
                      onClick={() => {
                        setRootIndex((n) => n + 1);
                        setPicked(null);
                      }}
                    >
                      Another root
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-x-auto py-0">
            <table className="w-full min-w-[40rem] text-center">
              <thead>
                <tr className="bg-muted/80 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-3 text-left">Cell</th>
                  <th className="p-3">Sound analog</th>
                  <th className="p-3">Actual</th>
                  <th className="p-3 text-left">Rule</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-border align-top"
                  >
                    <th className="p-3 text-left text-sm font-medium">
                      {row.label}
                      <div className="font-arabic text-xs font-normal text-muted-foreground">
                        {PERSON_BY_ID[row.person].arabic}
                      </div>
                    </th>
                    <td className="p-3">
                      <ArabicWord
                        slots={row.analog.slots}
                        surface={row.analog.surface}
                      />
                    </td>
                    <td className="p-3">
                      <ArabicWord
                        slots={row.actual.slots}
                        surface={row.actual.surface}
                      />
                    </td>
                    <td className="p-3 text-left text-sm text-muted-foreground">
                      {row.actual.mutations[0]?.rule ??
                        (row.actual.surface === row.analog.surface
                          ? "No change in this cell."
                          : "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {current ? (
            <Card>
              <CardContent>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Drill
                </p>
                <h3 className="mt-1 text-xl font-semibold">
                  What is the actual form for {current.label}?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sound analog:{" "}
                  <ArabicWord
                    slots={current.analog.slots}
                    surface={current.analog.surface}
                    size="sm"
                  />
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {uniqueOptions.map((option) => {
                    const right = option === current.actual.surface;
                    const state =
                      picked == null
                        ? ""
                        : right
                          ? "border-ok bg-ok/10"
                          : option === picked
                            ? "border-no bg-no/10"
                            : "";
                    return (
                      <Button
                        key={option}
                        variant="outline"
                        disabled={picked != null}
                        onClick={() => setPicked(option)}
                        className={cn(
                          "h-auto rounded-xl bg-muted px-4 py-3 font-arabic text-2xl",
                          state,
                        )}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
                {picked ? (
                  <div className="mt-4 flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      {picked === current.actual.surface
                        ? "Correct."
                        : `The actual form is ${current.actual.surface}.`}
                    </p>
                    <Button
                      variant="energy"
                      size="sm"
                      className="rounded-full"
                      onClick={() => {
                        setDrill((n) => n + 1);
                        setPicked(null);
                      }}
                    >
                      Next cell
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : (
        <p>No roots seeded for this type yet.</p>
      )}
    </div>
  );
}

function neighborSurfaces(
  rows: { actual: { surface: string } }[],
  index: number,
): string[] {
  return rows
    .filter((_, i) => i !== index)
    .map((row) => row.actual.surface)
    .filter((s) => s !== "—");
}
