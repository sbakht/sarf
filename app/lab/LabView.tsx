"use client";

import { useMemo, useState } from "react";
import { ArabicWord } from "@/components/ArabicWord";
import {
  PERSON_BY_ID,
  ROOTS,
  conjugate,
  rootsByWeakness,
  type PersonId,
  type Tense,
  type WeaknessType,
} from "@/lib/sarf";

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
        <p className="text-sm uppercase tracking-[0.2em] text-accent">
          Weak Verb Lab
        </p>
        <h1 className="mt-1 text-3xl font-semibold">
          Sound analog vs what you actually say
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Start from the regular template, then apply the mutation. أجوف is the
          most common; the other types use the same compare-and-drill layout.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 scroll-mt-28">
        {KINDS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setKind(item.id);
              setRootIndex(0);
              setDrill(0);
              setPicked(null);
            }}
            className={`rounded-full px-4 py-2 text-sm ${
              kind === item.id
                ? "bg-accent text-paper"
                : "border border-rule bg-card"
            }`}
          >
            <span className="font-arabic">{item.arabic}</span> · {item.title}
          </button>
        ))}
      </div>

      {root ? (
        <>
          <section className="rounded-3xl border border-rule bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-arabic text-3xl">{meta.arabic}</h2>
                <p className="mt-2 max-w-2xl leading-7 text-ink-soft">
                  {meta.blurb}
                </p>
              </div>
              <div className="rounded-2xl bg-paper px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-ink-soft">
                  Example root
                </p>
                <p className="font-arabic text-2xl">
                  {root.letters.join(" ")}{" "}
                  <span className="text-base text-ink-soft">
                    ({root.gloss})
                  </span>
                </p>
                {roots.length > 1 ? (
                  <button
                    type="button"
                    className="mt-2 text-xs text-accent"
                    onClick={() => {
                      setRootIndex((n) => n + 1);
                      setPicked(null);
                    }}
                  >
                    Another root
                  </button>
                ) : null}
              </div>
            </div>
          </section>

          <section className="overflow-x-auto rounded-2xl border border-rule bg-card">
            <table className="w-full min-w-[40rem] text-center">
              <thead>
                <tr className="bg-paper-deep/60 text-xs uppercase tracking-wider text-ink-soft">
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
                    className="border-t border-rule align-top"
                  >
                    <th className="p-3 text-left text-sm font-medium">
                      {row.label}
                      <div className="font-arabic text-xs font-normal text-ink-soft">
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
                    <td className="p-3 text-left text-sm text-ink-soft">
                      {row.actual.mutations[0]?.rule ??
                        (row.actual.surface === row.analog.surface
                          ? "No change in this cell."
                          : "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {current ? (
            <section className="rounded-2xl border border-rule bg-card p-6">
              <p className="text-xs uppercase tracking-wider text-ink-soft">
                Drill
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                What is the actual form for {current.label}?
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
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
                        ? "border-fa bg-fa/10"
                        : option === picked
                          ? "border-lam bg-lam/10"
                          : "";
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={picked != null}
                      onClick={() => setPicked(option)}
                      className={`rounded-2xl border border-rule bg-paper px-4 py-3 font-arabic text-2xl ${state}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {picked ? (
                <div className="mt-4 flex items-center gap-3">
                  <p className="text-sm text-ink-soft">
                    {picked === current.actual.surface
                      ? "Correct."
                      : `The actual form is ${current.actual.surface}.`}
                  </p>
                  <button
                    type="button"
                    className="rounded-full bg-accent px-4 py-1.5 text-sm text-paper"
                    onClick={() => {
                      setDrill((n) => n + 1);
                      setPicked(null);
                    }}
                  >
                    Next cell
                  </button>
                </div>
              ) : null}
            </section>
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
