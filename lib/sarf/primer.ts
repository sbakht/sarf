import { conjugate } from "./conjugate";
import { rootArabic, soundRoots } from "./lexicon";
import { PERSON_BY_ID } from "./persons";
import { uniqueOptions } from "./quiz";
import { pick, type SpotterChoice } from "./spotter";
import type { ConjugateResult, PersonId, RootEntry } from "./types";

export const PRIMER_ROUNDS = 6;
export const PRIMER_PERSONS: PersonId[] = ["huwa", "hiya"];

export type RootGenderPrompt = {
  root: RootEntry;
  person: PersonId;
};

export type LessonStep = {
  id: string;
  title: string;
  choices: SpotterChoice[];
};

export function primerRoots(): RootEntry[] {
  return soundRoots().filter((root) => root.forms.includes(1));
}

export function promptSeed(prompt: RootGenderPrompt): string {
  return `${prompt.root.id}:${prompt.person}`;
}

export function makeRootGenderPrompt(
  rng: () => number = Math.random,
): RootGenderPrompt | null {
  const pool = primerRoots();
  if (pool.length < 4) return null;
  const root = pick(pool, rng);
  const person = pick(PRIMER_PERSONS, rng);
  return { root, person };
}

export function conjugateRootGender(
  prompt: RootGenderPrompt,
): ConjugateResult {
  return conjugate({
    root: prompt.root.letters,
    form: 1,
    formIBab: prompt.root.formIBab,
    tense: "past",
    voice: "active",
    person: prompt.person,
    weakness: prompt.root.weakness,
  });
}

export function buildRootGenderSteps(prompt: RootGenderPrompt): LessonStep[] {
  const seed = promptSeed(prompt);
  const rootChoices = uniqueOptions(
    prompt.root,
    primerRoots(),
    4,
    seed,
    (root) => root.id,
  );

  return [
    {
      id: "root",
      title: "Which three letters are the root?",
      choices: rootChoices.map((root) => ({
        id: root.id,
        primary: rootArabic(root),
        arabic: true,
        secondary: root.gloss,
        correct: root.id === prompt.root.id,
        feedback: `root ${rootArabic(prompt.root)} “${prompt.root.gloss}”`,
      })),
    },
    {
      id: "person",
      title: "He or she?",
      choices: uniqueOptions(
        prompt.person,
        PRIMER_PERSONS,
        2,
        seed,
        (person) => person,
      ).map((person) => ({
        id: person,
        primary: PERSON_BY_ID[person].arabic,
        arabic: true,
        secondary: person === "huwa" ? "he" : "she",
        correct: person === prompt.person,
        feedback:
          prompt.person === "huwa"
            ? `he (${PERSON_BY_ID.huwa.arabic})`
            : `she (${PERSON_BY_ID.hiya.arabic})`,
      })),
    },
  ];
}
