import { conjugate } from "./conjugate";
import { rootArabic, soundRoots } from "./lexicon";
import { PERSON_BY_ID } from "./persons";
import { uniqueOptions } from "./quiz";
import { pick, type SpotterChoice } from "./spotter";
import type {
  ConjugateResult,
  FormId,
  PersonId,
  RootEntry,
} from "./types";

export const PRIMER_ROUNDS = 6;
export const PRIMER_PERSONS: PersonId[] = ["huwa", "hiya"];

/** Forms used to teach مزيد فيه in the intro lesson (past هو only). */
export const INTRO_MAZEED_FORMS: FormId[] = [2, 3, 4, 5, 8, 10];

export type FamilyKind = "mujarrad" | "mazeed";

export type RootGenderPrompt = {
  root: RootEntry;
  person: PersonId;
};

export type IntroPrompt = {
  root: RootEntry;
  form: FormId;
};

export type LessonStep = {
  id: string;
  title: string;
  choices: SpotterChoice[];
};

export function familyKind(form: FormId): FamilyKind {
  return form === 1 ? "mujarrad" : "mazeed";
}

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

function introCandidates(): IntroPrompt[] {
  const out: IntroPrompt[] = [];
  for (const root of soundRoots()) {
    if (root.forms.includes(1)) out.push({ root, form: 1 });
    for (const form of INTRO_MAZEED_FORMS) {
      if (root.forms.includes(form)) out.push({ root, form });
    }
  }
  return out;
}

export function introPromptSeed(prompt: IntroPrompt): string {
  return `${prompt.root.id}:${prompt.form}`;
}

export function makeIntroPrompt(
  rng: () => number = Math.random,
): IntroPrompt | null {
  const all = introCandidates();
  if (all.length < 4) return null;
  const preferMujarrad = rng() < 0.5;
  const preferred = all.filter(
    (item) => (familyKind(item.form) === "mujarrad") === preferMujarrad,
  );
  const pool = preferred.length > 0 ? preferred : all;
  for (let i = 0; i < 30; i += 1) {
    const prompt = pick(pool, rng);
    const result = conjugateIntro(prompt);
    if (result.available) return prompt;
  }
  return null;
}

export function conjugateIntro(prompt: IntroPrompt): ConjugateResult {
  return conjugate({
    root: prompt.root.letters,
    form: prompt.form,
    formIBab: prompt.root.formIBab,
    tense: "past",
    voice: "active",
    person: "huwa",
    weakness: prompt.root.weakness,
  });
}

export function buildIntroSteps(prompt: IntroPrompt): LessonStep[] {
  const seed = introPromptSeed(prompt);
  const kind = familyKind(prompt.form);
  const rootChoices = uniqueOptions(
    prompt.root,
    soundRoots(),
    4,
    seed,
    (root) => root.id,
  );

  return [
    {
      id: "root",
      title: "Which three letters are the contents (الجذر)?",
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
      id: "family",
      title: "مجرد or مزيد فيه?",
      choices: (
        [
          {
            id: "mujarrad" as const,
            primary: "مجرد",
            arabic: true,
            secondary: "no extra letters in past هو",
          },
          {
            id: "mazeed" as const,
            primary: "مزيد فيه",
            arabic: true,
            secondary: "extra letters in the container",
          },
        ] as const
      ).map((choice) => ({
        id: choice.id,
        primary: choice.primary,
        arabic: choice.arabic,
        secondary: choice.secondary,
        correct: choice.id === kind,
        feedback:
          kind === "mujarrad"
            ? "مجرد — only root letters + vowels"
            : "مزيد فيه — extras wrap the root",
      })),
    },
  ];
}
