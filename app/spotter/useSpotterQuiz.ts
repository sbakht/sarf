"use client";

import { useEffect, useEffectEvent, useReducer } from "react";
import { useSettings } from "@/components/SettingsProvider";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
  ALL_QUESTIONS,
  ALL_TENSES,
  ALL_VOICES,
  buildSpotterSteps,
  conjugate,
  linkedPersons,
  makePrompt,
  seededRng,
  toggleItem,
  type FormId,
  type PersonId,
  type Prompt,
  type QuestionId,
  type SpotterChoice,
  type SpotterFilters,
  type Tense,
  type Voice,
} from "@/lib/sarf";

type Feedback = {
  ok: boolean;
  text: string;
};

type QuizState = SpotterFilters & {
  prompt: Prompt | null;
  step: number;
  score: { correct: number; total: number };
  feedback: Feedback | null;
  showColors: boolean;
};

type Action =
  | { type: "toggleForm"; form: FormId }
  | { type: "togglePerson"; person: PersonId }
  | { type: "toggleVoice"; voice: Voice }
  | { type: "toggleTense"; tense: Tense }
  | { type: "toggleQuestion"; question: QuestionId }
  | { type: "setIncludeWeak"; value: boolean }
  | { type: "selectAllForms" }
  | { type: "selectAllPersons" }
  | { type: "selectAllVoices" }
  | { type: "selectAllTenses" }
  | { type: "selectAllQuestions" }
  | { type: "togglePersonSet"; persons: PersonId[] }
  | { type: "answer"; ok: boolean; label: string; finishRound: boolean }
  | { type: "nextPrompt" };

const DEFAULT_FILTERS: SpotterFilters = {
  includeWeak: false,
  enabledForms: ALL_FORMS,
  enabledPersons: ALL_PERSON_IDS,
  enabledVoices: ALL_VOICES,
  enabledTenses: ALL_TENSES,
  enabledQuestions: ALL_QUESTIONS,
};

function filtersOf(state: QuizState): SpotterFilters {
  return {
    includeWeak: state.includeWeak,
    enabledForms: state.enabledForms,
    enabledPersons: state.enabledPersons,
    enabledVoices: state.enabledVoices,
    enabledTenses: state.enabledTenses,
    enabledQuestions: state.enabledQuestions,
  };
}

function rollPrompt(
  filters: SpotterFilters,
  rng?: () => number,
): Prompt | null {
  return makePrompt(
    filters.includeWeak,
    filters.enabledForms,
    filters.enabledPersons,
    filters.enabledVoices,
    filters.enabledQuestions.includes("voice"),
    rng,
    filters.enabledTenses,
  );
}

function resetRound(state: QuizState, filters: SpotterFilters): QuizState {
  return {
    ...state,
    ...filters,
    prompt: rollPrompt(filters),
    step: 0,
    feedback: null,
    showColors: false,
  };
}

function applyFilters(
  state: QuizState,
  patch: Partial<SpotterFilters>,
): QuizState {
  return resetRound(state, { ...filtersOf(state), ...patch });
}

function nextPersonSet(
  enabled: PersonId[],
  ids: PersonId[],
): PersonId[] | null {
  const allOn = ids.every((id) => enabled.includes(id));
  if (allOn) {
    const next = enabled.filter((id) => !ids.includes(id));
    return next.length === 0 ? null : next;
  }
  const set = new Set([...enabled, ...ids]);
  return ALL_PERSON_IDS.filter((id) => set.has(id));
}

function nextPersons(enabled: PersonId[], person: PersonId): PersonId[] | null {
  const group = linkedPersons(person);
  const allOn = group.every((id) => enabled.includes(id));
  if (allOn) {
    const next = enabled.filter((id) => !group.includes(id));
    return next.length === 0 ? null : next;
  }
  const set = new Set(enabled);
  for (const id of group) set.add(id);
  return ALL_PERSON_IDS.filter((id) => set.has(id));
}

function createInitialState(): QuizState {
  return {
    ...DEFAULT_FILTERS,
    prompt: rollPrompt(DEFAULT_FILTERS, seededRng(1)),
    step: 0,
    score: { correct: 0, total: 0 },
    feedback: null,
    showColors: false,
  };
}

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "toggleForm": {
      const next = toggleItem(state.enabledForms, action.form);
      return next ? applyFilters(state, { enabledForms: next }) : state;
    }
    case "togglePerson": {
      const next = nextPersons(state.enabledPersons, action.person);
      return next ? applyFilters(state, { enabledPersons: next }) : state;
    }
    case "toggleVoice": {
      const next = toggleItem(state.enabledVoices, action.voice);
      return next ? applyFilters(state, { enabledVoices: next }) : state;
    }
    case "toggleTense": {
      const next = toggleItem(state.enabledTenses, action.tense);
      return next ? applyFilters(state, { enabledTenses: next }) : state;
    }
    case "toggleQuestion": {
      const next = toggleItem(state.enabledQuestions, action.question);
      return next ? applyFilters(state, { enabledQuestions: next }) : state;
    }
    case "setIncludeWeak":
      return state.includeWeak === action.value
        ? state
        : applyFilters(state, { includeWeak: action.value });
    case "selectAllForms":
      return state.enabledForms.length === ALL_FORMS.length
        ? state
        : applyFilters(state, { enabledForms: ALL_FORMS });
    case "selectAllPersons":
      return state.enabledPersons.length === ALL_PERSON_IDS.length
        ? state
        : applyFilters(state, { enabledPersons: ALL_PERSON_IDS });
    case "selectAllVoices":
      return state.enabledVoices.length === ALL_VOICES.length
        ? state
        : applyFilters(state, { enabledVoices: ALL_VOICES });
    case "selectAllTenses":
      return state.enabledTenses.length === ALL_TENSES.length
        ? state
        : applyFilters(state, { enabledTenses: ALL_TENSES });
    case "selectAllQuestions":
      return state.enabledQuestions.length === ALL_QUESTIONS.length
        ? state
        : applyFilters(state, { enabledQuestions: ALL_QUESTIONS });
    case "togglePersonSet": {
      const next = nextPersonSet(state.enabledPersons, action.persons);
      return next ? applyFilters(state, { enabledPersons: next }) : state;
    }
    case "answer": {
      const score = {
        correct: state.score.correct + (action.ok ? 1 : 0),
        total: state.score.total + 1,
      };
      // Correct on the last step: skip the reveal dwell and roll the next verb.
      if (action.finishRound && action.ok) {
        return {
          ...resetRound(state, filtersOf(state)),
          score,
        };
      }
      return {
        ...state,
        score,
        feedback: {
          ok: action.ok,
          text: action.ok
            ? `Correct — ${action.label}`
            : `Not quite — ${action.label}`,
        },
        showColors: action.ok ? state.showColors : true,
        step: state.step + 1,
      };
    }
    case "nextPrompt":
      return resetRound(state, filtersOf(state));
  }
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "SELECT" ||
    tag === "TEXTAREA" ||
    target.isContentEditable
  );
}

export function useSpotterQuiz() {
  const { labelMode } = useSettings();
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const steps = state.prompt
    ? buildSpotterSteps(state.prompt, filtersOf(state), labelMode)
    : [];
  const current = steps[state.step];
  const done = !state.prompt || state.step >= steps.length;
  const result = state.prompt
    ? conjugate({
        root: state.prompt.root.letters,
        form: state.prompt.form,
        formIBab: state.prompt.root.formIBab,
        tense: state.prompt.tense,
        voice: state.prompt.voice,
        person: state.prompt.person,
        weakness: state.prompt.root.weakness,
      })
    : null;

  function submitAnswer(choice: SpotterChoice) {
    const finishRound = state.step >= steps.length - 1;
    dispatch({
      type: "answer",
      ok: choice.correct,
      label: choice.feedback,
      finishRound,
    });
  }

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (isTypingTarget(event.target)) return;
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("[data-spotter-filters]")
    )
      return;
    if (done) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dispatch({ type: "nextPrompt" });
      }
      return;
    }
    const index = Number(event.key) - 1;
    const choice = current?.choices[index];
    if (!choice) return;
    event.preventDefault();
    submitAnswer(choice);
  });

  useEffect(() => {
    function listener(event: KeyboardEvent) {
      onKey(event);
    }
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  function answer(choice: SpotterChoice) {
    submitAnswer(choice);
  }

  return {
    includeWeak: state.includeWeak,
    enabledForms: state.enabledForms,
    enabledPersons: state.enabledPersons,
    enabledVoices: state.enabledVoices,
    enabledTenses: state.enabledTenses,
    enabledQuestions: state.enabledQuestions,
    prompt: state.prompt,
    step: state.step,
    score: state.score,
    feedback: state.feedback,
    showColors: state.showColors,
    steps,
    current,
    done,
    result,
    labelMode,
    setIncludeWeak: (value: boolean) =>
      dispatch({ type: "setIncludeWeak", value }),
    toggleForm: (form: FormId) => dispatch({ type: "toggleForm", form }),
    togglePerson: (person: PersonId) =>
      dispatch({ type: "togglePerson", person }),
    toggleVoice: (voice: Voice) => dispatch({ type: "toggleVoice", voice }),
    toggleTense: (tense: Tense) => dispatch({ type: "toggleTense", tense }),
    toggleQuestion: (question: QuestionId) =>
      dispatch({ type: "toggleQuestion", question }),
    selectAllForms: () => dispatch({ type: "selectAllForms" }),
    selectAllPersons: () => dispatch({ type: "selectAllPersons" }),
    selectAllVoices: () => dispatch({ type: "selectAllVoices" }),
    selectAllTenses: () => dispatch({ type: "selectAllTenses" }),
    selectAllQuestions: () => dispatch({ type: "selectAllQuestions" }),
    togglePersonSet: (persons: PersonId[]) =>
      dispatch({ type: "togglePersonSet", persons }),
    answer,
    nextPrompt: () => dispatch({ type: "nextPrompt" }),
  };
}
