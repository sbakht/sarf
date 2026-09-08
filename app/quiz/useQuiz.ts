"use client";

import { useEffect, useEffectEvent, useReducer } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { isTypingTarget } from "./keyboard";
import {
  ALL_PERSON_IDS,
  DEFAULT_FILTERS,
  buildQuizSteps,
  conjugate,
  linkedPersons,
  makePrompt,
  quizChoiceLabel,
  quizWrongFeedback,
  toggleItem,
  type FormId,
  type PersonId,
  type Prompt,
  type QuestionId,
  type QuizChoice,
  type QuizFilters,
  type Tense,
  type Voice,
} from "@/lib/sarf";

type Feedback = {
  ok: boolean;
  text: string;
};

type QuizState = QuizFilters & {
  prompt: Prompt | null;
  started: boolean;
  step: number;
  score: { correct: number; total: number };
  feedback: Feedback | null;
  showColors: boolean;
};

type ListFilter =
  | "enabledForms"
  | "enabledPersons"
  | "enabledVoices"
  | "enabledTenses"
  | "enabledQuestions";

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
  | {
      type: "answer";
      ok: boolean;
      label: string;
      answer: string;
      finishRound: boolean;
    }
  | { type: "nextPrompt" };

function filtersOf(state: QuizState): QuizFilters {
  return {
    includeWeak: state.includeWeak,
    enabledForms: state.enabledForms,
    enabledPersons: state.enabledPersons,
    enabledVoices: state.enabledVoices,
    enabledTenses: state.enabledTenses,
    enabledQuestions: state.enabledQuestions,
  };
}

function resetRound(state: QuizState, filters: QuizFilters): QuizState {
  return {
    ...state,
    ...filters,
    started: true,
    prompt: makePrompt(filters),
    step: 0,
    feedback: null,
    showColors: false,
  };
}

function applyFilters(
  state: QuizState,
  patch: Partial<QuizFilters>,
): QuizState {
  return resetRound(state, { ...filtersOf(state), ...patch });
}

function toggleFilter<T>(
  state: QuizState,
  key: Exclude<ListFilter, "enabledPersons">,
  list: T[],
  item: T,
): QuizState {
  const next = toggleItem(list, item);
  return next ? applyFilters(state, { [key]: next }) : state;
}

function selectAll(state: QuizState, key: ListFilter): QuizState {
  const all = DEFAULT_FILTERS[key];
  return state[key].length === all.length
    ? state
    : applyFilters(state, { [key]: all });
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

export function createInitialState(): QuizState {
  return {
    ...DEFAULT_FILTERS,
    prompt: null,
    started: false,
    step: 0,
    score: { correct: 0, total: 0 },
    feedback: null,
    showColors: false,
  };
}

export function reduceQuiz(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "toggleForm":
      return toggleFilter(
        state,
        "enabledForms",
        state.enabledForms,
        action.form,
      );
    case "togglePerson": {
      const next = nextPersonSet(
        state.enabledPersons,
        linkedPersons(action.person),
      );
      return next ? applyFilters(state, { enabledPersons: next }) : state;
    }
    case "toggleVoice":
      return toggleFilter(
        state,
        "enabledVoices",
        state.enabledVoices,
        action.voice,
      );
    case "toggleTense":
      return toggleFilter(
        state,
        "enabledTenses",
        state.enabledTenses,
        action.tense,
      );
    case "toggleQuestion":
      return toggleFilter(
        state,
        "enabledQuestions",
        state.enabledQuestions,
        action.question,
      );
    case "setIncludeWeak":
      return state.includeWeak === action.value
        ? state
        : applyFilters(state, { includeWeak: action.value });
    case "selectAllForms":
      return selectAll(state, "enabledForms");
    case "selectAllPersons":
      return selectAll(state, "enabledPersons");
    case "selectAllVoices":
      return selectAll(state, "enabledVoices");
    case "selectAllTenses":
      return selectAll(state, "enabledTenses");
    case "selectAllQuestions":
      return selectAll(state, "enabledQuestions");
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
            : quizWrongFeedback(action.answer, action.label),
        },
        showColors: action.ok ? state.showColors : true,
        step: state.step + 1,
      };
    }
    case "nextPrompt":
      return resetRound(state, filtersOf(state));
  }
}

export function useQuiz() {
  const { labelMode } = useSettings();
  const [state, dispatch] = useReducer(
    reduceQuiz,
    undefined,
    createInitialState,
  );

  const steps = state.prompt
    ? buildQuizSteps(state.prompt, filtersOf(state), labelMode)
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

  function answer(choice: QuizChoice) {
    dispatch({
      type: "answer",
      ok: choice.correct,
      label: choice.feedback,
      answer: quizChoiceLabel(choice),
      finishRound: state.step >= steps.length - 1,
    });
  }

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (isTypingTarget(event.target)) return;
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("[data-quiz-filters]")
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
    answer(choice);
  });

  useEffect(() => {
    if (!state.started) dispatch({ type: "nextPrompt" });
  }, [state.started]);

  useEffect(() => {
    function listener(event: KeyboardEvent) {
      onKey(event);
    }
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return {
    ...filtersOf(state),
    prompt: state.prompt,
    started: state.started,
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
