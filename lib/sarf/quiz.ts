import { conjugate } from "./conjugate";
import { FORMS, bilingualQuizChoice, formQuizChoice } from "./forms";
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

export function quizChoiceLabel(choice: QuizChoice): string {
  if (!choice.secondary) return choice.primary;
  return `${choice.primary} · ${choice.secondary}`;
}

export function quizWrongFeedback(answer: string, correct: string): string {
  return `Not quite — you said ${answer}; correct answer is ${correct}`;
}

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

export const DEFAULT_FILTERS: QuizFilters = {
  includeWeak: false,
  enabledForms: ALL_FORMS,
  enabledPersons: ALL_PERSON_IDS,
  enabledVoices: ALL_VOICES,
  enabledTenses: ALL_TENSES,
  enabledQuestions: ALL_QUESTIONS,
};

export const TENSE_LABEL: Record<Tense, string> = {
  past: "ماضي",
  present: "مضارع",
  imperative: "أمر",
};

export const TENSE_EN: Record<Tense, string> = {
  past: "Past",
  present: "Present",
  imperative: "Imperative",
};

export const VOICE_LABEL: Record<Voice, string> = {
  active: "معلوم",
  passive: "مجهول",
};

export const VOICE_EN: Record<Voice, string> = {
  active: "Active",
  passive: "Passive",
};

export function tenseQuizChoice(tense: Tense, mode: LabelMode) {
  return bilingualQuizChoice(TENSE_EN[tense], TENSE_LABEL[tense], mode);
}

export function voiceQuizChoice(voice: Voice, mode: LabelMode) {
  return bilingualQuizChoice(VOICE_EN[voice], VOICE_LABEL[voice], mode);
}

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
  filters: QuizFilters,
  rng: () => number = Math.random,
): Prompt | null {
  const formSet = new Set(filters.enabledForms);
  const quizVoice = filters.enabledQuestions.includes("voice");
  const secondPersons = filters.enabledPersons.filter(isSecondPerson);
  const tenses = eligibleTenses(
    filters.enabledPersons,
    filters.enabledVoices,
    quizVoice,
    filters.enabledTenses,
  );
  const pool = (filters.includeWeak ? ROOTS : soundRoots()).filter((root) =>
    root.forms.some((form) => formSet.has(form)),
  );
  if (
    pool.length === 0 ||
    filters.enabledPersons.length === 0 ||
    filters.enabledVoices.length === 0 ||
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
    if (filters.enabledVoices.length === 1) {
      voice = filters.enabledVoices[0]!;
    } else if (quizVoice) {
      voice = pick(filters.enabledVoices, rng);
    } else if (tense === "imperative" || rng() > 0.85) {
      voice = "active";
    } else {
      voice = pick(filters.enabledVoices, rng);
    }
    const person =
      tense === "imperative"
        ? pick(secondPersons, rng)
        : pick(filters.enabledPersons, rng);
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

function labeledChoices<T>(
  items: T[],
  correct: T,
  idOf: (item: T) => string,
  labelsOf: (item: T) => ReturnType<typeof bilingualQuizChoice>,
): QuizChoice[] {
  const answer = labelsOf(correct);
  return items.map((item) => {
    const labels = labelsOf(item);
    return {
      id: idOf(item),
      primary: labels.primary,
      secondary: labels.secondary,
      arabic: labels.arabic,
      secondaryArabic: labels.secondaryArabic,
      correct: idOf(item) === idOf(correct),
      feedback: answer.feedback,
    };
  });
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
      choices: labeledChoices(formChoices, prompt.form, String, (form) =>
        formQuizChoice(form, labelMode),
      ),
    },
    {
      id: "tense" as const,
      title: "What is the tense / الزمن?",
      choices: labeledChoices(
        tenseChoices,
        prompt.tense,
        (tense) => tense,
        (tense) => tenseQuizChoice(tense, labelMode),
      ),
    },
    {
      id: "voice" as const,
      title: "What is the voice / البناء?",
      choices: labeledChoices(
        filters.enabledVoices,
        prompt.voice,
        (voice) => voice,
        (voice) => voiceQuizChoice(voice, labelMode),
      ),
    },
    {
      id: "person" as const,
      title: "What is the person / الضمير?",
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
