import { conjugate } from "./conjugate";
import { FORMS, formQuizChoice } from "./forms";
import { ROOTS, rootArabic, soundRoots } from "./lexicon";
import { PERSON_BY_ID, PERSONS, isSecondPerson } from "./persons";
import {
  isCorrectQuizPerson,
  personQuizEnglish,
  personQuizFeedback,
  quizPersonGroup,
  quizPersonKey,
  uniqueOptions,
} from "./person-quiz";
import type {
  FormId,
  LabelMode,
  PersonId,
  RootEntry,
  Tense,
  Voice,
} from "./types";

export type QuestionId = "root" | "form" | "tense" | "voice" | "person";

export type Prompt = {
  root: RootEntry;
  form: FormId;
  tense: Tense;
  voice: Voice;
  person: PersonId;
};

export type QuizFilters = {
  includeWeak: boolean;
  enabledForms: FormId[];
  enabledPersons: PersonId[];
  enabledVoices: Voice[];
  enabledTenses: Tense[];
  enabledQuestions: QuestionId[];
};

export type QuizChoice = {
  id: string;
  primary: string;
  arabic?: boolean;
  secondary?: string;
  secondaryArabic?: boolean;
  correct: boolean;
  feedback: string;
};

export type QuizStep = {
  id: QuestionId;
  title: string;
  choices: QuizChoice[];
};

export const ALL_FORMS: FormId[] = FORMS.map((form) => form.id);
export const ALL_PERSON_IDS: PersonId[] = PERSONS.map((person) => person.id);
export const ALL_VOICES: Voice[] = ["active", "passive"];
export const ALL_TENSES: Tense[] = ["past", "present", "imperative"];
export const ALL_QUESTIONS: QuestionId[] = [
  "root",
  "form",
  "tense",
  "voice",
  "person",
];

export const TENSE_LABEL: Record<Tense, string> = {
  past: "ماضي",
  present: "مضارع",
  imperative: "أمر",
};

const VOICE_LABEL: Record<Voice, string> = {
  active: "معلوم",
  passive: "مجهول",
};

export function seededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(items: T[], rng: () => number = Math.random): T {
  return items[Math.floor(rng() * items.length)]!;
}

export function toggleItem<T>(list: T[], item: T): T[] | null {
  if (list.includes(item)) {
    if (list.length === 1) return null;
    return list.filter((entry) => entry !== item);
  }
  return [...list, item];
}

export function eligibleTenses(
  enabledPersons: PersonId[],
  enabledVoices: Voice[],
  quizVoice: boolean,
  enabledTenses: Tense[] = ALL_TENSES,
): Tense[] {
  const secondPersons = enabledPersons.filter(isSecondPerson);
  const canImperative =
    secondPersons.length > 0 &&
    enabledVoices.includes("active") &&
    enabledTenses.includes("imperative");
  const pastPresent = (["past", "present"] as const).filter((tense) =>
    enabledTenses.includes(tense),
  );
  if (quizVoice && pastPresent.length > 0) return [...pastPresent];
  return canImperative ? [...pastPresent, "imperative"] : [...pastPresent];
}

export function makePrompt(
  includeWeak: boolean,
  enabledForms: FormId[],
  enabledPersons: PersonId[],
  enabledVoices: Voice[],
  quizVoice: boolean,
  rng: () => number = Math.random,
  enabledTenses: Tense[] = ALL_TENSES,
): Prompt | null {
  const formSet = new Set(enabledForms);
  const secondPersons = enabledPersons.filter(isSecondPerson);
  const tenses = eligibleTenses(
    enabledPersons,
    enabledVoices,
    quizVoice,
    enabledTenses,
  );
  const pool = (includeWeak ? ROOTS : soundRoots()).filter((root) =>
    root.forms.some((form) => formSet.has(form)),
  );
  if (
    pool.length === 0 ||
    enabledPersons.length === 0 ||
    enabledVoices.length === 0 ||
    tenses.length === 0
  ) {
    return null;
  }

  for (let i = 0; i < 30; i += 1) {
    const root = pick(pool, rng);
    const forms = root.forms.filter((form) => formSet.has(form));
    if (forms.length === 0) continue;
    const form = pick(forms, rng);
    const tense = pick(tenses, rng);
    let voice: Voice;
    if (enabledVoices.length === 1) {
      voice = enabledVoices[0]!;
    } else if (quizVoice) {
      voice = pick(enabledVoices, rng);
    } else if (tense === "imperative" || rng() > 0.85) {
      voice = "active";
    } else {
      voice = pick(enabledVoices, rng);
    }
    const person =
      tense === "imperative"
        ? pick(secondPersons, rng)
        : pick(enabledPersons, rng);
    const result = conjugate({
      root: root.letters,
      form,
      formIBab: root.formIBab,
      tense,
      voice,
      person,
      weakness: root.weakness,
    });
    if (result.available) return { root, form, tense, voice, person };
  }
  return null;
}

export function promptSeed(prompt: Prompt): string {
  return `${prompt.root.id}:${prompt.form}:${prompt.tense}:${prompt.voice}:${prompt.person}`;
}

export function buildQuizSteps(
  prompt: Prompt,
  filters: QuizFilters,
  labelMode: LabelMode,
): QuizStep[] {
  const seed = promptSeed(prompt);
  const secondPersons = filters.enabledPersons.filter(isSecondPerson);
  const rootPool = filters.includeWeak ? ROOTS : soundRoots();
  const rootChoices = uniqueOptions(
    prompt.root,
    rootPool,
    4,
    seed,
    (root) => root.id,
  );
  const formChoices = uniqueOptions(
    prompt.form,
    filters.enabledForms,
    Math.min(4, filters.enabledForms.length),
    seed,
    String,
  );
  const tenseChoices = filters.enabledTenses.filter(
    (tense) => tense !== "imperative" || secondPersons.length > 0,
  );
  const personChoices = uniqueOptions(
    prompt.person,
    filters.enabledPersons,
    Math.min(4, filters.enabledPersons.length),
    seed,
    (person) => quizPersonGroup(person, prompt.tense),
  );

  return [
    {
      id: "root" as const,
      title: "What is the root?",
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
      id: "form" as const,
      title: "What is the form / وزن?",
      choices: formChoices.map((form) => {
        const labels = formQuizChoice(form, labelMode);
        const answer = formQuizChoice(prompt.form, labelMode);
        return {
          id: String(form),
          primary: labels.primary,
          secondary: labels.secondary,
          arabic: labels.arabic,
          secondaryArabic: labels.secondaryArabic,
          correct: form === prompt.form,
          feedback: answer.feedback,
        };
      }),
    },
    {
      id: "tense" as const,
      title: "Tense?",
      choices: tenseChoices.map((tense) => ({
        id: tense,
        primary: TENSE_LABEL[tense],
        arabic: true,
        correct: tense === prompt.tense,
        feedback: prompt.tense,
      })),
    },
    {
      id: "voice" as const,
      title: "Voice?",
      choices: filters.enabledVoices.map((voice) => ({
        id: voice,
        primary: VOICE_LABEL[voice],
        arabic: true,
        correct: voice === prompt.voice,
        feedback: prompt.voice,
      })),
    },
    {
      id: "person" as const,
      title: "Person?",
      choices: personChoices.map((person) => ({
        id: quizPersonGroup(person, prompt.tense),
        primary: PERSON_BY_ID[quizPersonKey(person)].arabic,
        arabic: true,
        secondary: personQuizEnglish(person),
        correct: isCorrectQuizPerson(person, prompt.person, prompt.tense),
        feedback: personQuizFeedback(prompt.person, prompt.tense),
      })),
    },
  ]
    .filter((item) => filters.enabledQuestions.includes(item.id))
    .filter((item) => item.id !== "voice" || prompt.tense !== "imperative")
    .filter((item) => item.choices.length >= 2);
}
