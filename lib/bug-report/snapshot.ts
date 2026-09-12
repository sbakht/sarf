import {
  rootArabic,
  type ConjugateResult,
  type FormId,
  type LabelMode,
  type PersonId,
  type Prompt,
  type QuestionId,
  type QuizChoice,
  type QuizStep,
  type QuizWeakness,
  type Tense,
  type Voice,
  type WeakLetter,
} from "@/lib/sarf";

export type BugReportAnswer = {
  question: string;
  selected: string;
  ok: boolean;
  correctLabel: string;
};

export type BugReportChoice = {
  id: string;
  primary: string;
  secondary?: string;
  correct: boolean;
  feedback: string;
};

export type BugReportStep = {
  id: string;
  title: string;
  choices: BugReportChoice[];
};

export type BugReportFilters = {
  enabledWeaknesses: QuizWeakness[];
  enabledWeakLetters: WeakLetter[];
  enabledForms: FormId[];
  enabledPersons: PersonId[];
  enabledVoices: Voice[];
  enabledTenses: Tense[];
  enabledQuestions: QuestionId[];
  labelMode: LabelMode;
};

export type BugReportQuestion = {
  path: string;
  step: number;
  done: boolean;
  prompt: {
    rootId: string;
    rootArabic: string;
    gloss: string;
    letters: [string, string, string];
    weakness: string;
    formIBab: string;
    form: FormId;
    tense: Tense;
    voice: Voice;
    person: PersonId;
  } | null;
  surface: string | null;
  result: ConjugateResult | null;
  current: BugReportStep | null;
  steps: BugReportStep[];
  feedback: { ok: boolean; text: string } | null;
};

export type BugReportSnapshot = {
  filters: BugReportFilters;
  question: BugReportQuestion;
  answers: BugReportAnswer[];
  score: { correct: number; total: number };
};

export type BugReportQuizState = {
  path: string;
  labelMode: LabelMode;
  enabledWeaknesses: QuizWeakness[];
  enabledWeakLetters: WeakLetter[];
  enabledForms: FormId[];
  enabledPersons: PersonId[];
  enabledVoices: Voice[];
  enabledTenses: Tense[];
  enabledQuestions: QuestionId[];
  score: { correct: number; total: number };
  step: number;
  done: boolean;
  prompt: Prompt | null;
  result: ConjugateResult | null;
  current: QuizStep | BugReportStep | null | undefined;
  steps: Array<QuizStep | BugReportStep>;
  feedback: { ok: boolean; text: string } | null;
  answers: BugReportAnswer[];
};

function compactChoice(choice: QuizChoice | BugReportChoice): BugReportChoice {
  return {
    id: choice.id,
    primary: choice.primary,
    secondary: choice.secondary,
    correct: choice.correct,
    feedback: choice.feedback,
  };
}

function compactStep(step: QuizStep | BugReportStep): BugReportStep {
  return {
    id: step.id,
    title: step.title,
    choices: step.choices.map(compactChoice),
  };
}

export function buildBugReportSnapshot(
  quiz: BugReportQuizState,
): BugReportSnapshot {
  return {
    filters: {
      enabledWeaknesses: quiz.enabledWeaknesses,
      enabledWeakLetters: quiz.enabledWeakLetters,
      enabledForms: quiz.enabledForms,
      enabledPersons: quiz.enabledPersons,
      enabledVoices: quiz.enabledVoices,
      enabledTenses: quiz.enabledTenses,
      enabledQuestions: quiz.enabledQuestions,
      labelMode: quiz.labelMode,
    },
    question: {
      path: quiz.path,
      step: quiz.step,
      done: quiz.done,
      prompt: quiz.prompt
        ? {
            rootId: quiz.prompt.root.id,
            rootArabic: rootArabic(quiz.prompt.root),
            gloss: quiz.prompt.root.gloss,
            letters: quiz.prompt.root.letters,
            weakness: quiz.prompt.root.weakness,
            formIBab: quiz.prompt.root.formIBab,
            form: quiz.prompt.form,
            tense: quiz.prompt.tense,
            voice: quiz.prompt.voice,
            person: quiz.prompt.person,
          }
        : null,
      surface: quiz.result?.surface ?? null,
      result: quiz.result,
      current: quiz.current ? compactStep(quiz.current) : null,
      steps: quiz.steps.map(compactStep),
      feedback: quiz.feedback,
    },
    answers: quiz.answers,
    score: quiz.score,
  };
}
