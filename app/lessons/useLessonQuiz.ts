"use client";

import { useEffect, useEffectEvent, useReducer } from "react";
import {
  PRIMER_ROUNDS,
  seededRng,
  type ConjugateResult,
  type LessonStep,
  type QuizChoice,
} from "@/lib/sarf";

type Feedback = {
  ok: boolean;
  text: string;
};

type QuizState<P> = {
  prompt: P | null;
  step: number;
  round: number;
  score: { correct: number; total: number };
  feedback: Feedback | null;
  showColors: boolean;
  complete: boolean;
};

type Action =
  | { type: "answer"; ok: boolean; label: string; finishRound: boolean }
  | { type: "nextRound" }
  | { type: "restart" };

export type LessonQuizConfig<P> = {
  makePrompt: (rng?: () => number) => P | null;
  buildSteps: (prompt: P) => LessonStep[];
  toResult: (prompt: P) => ConjugateResult;
  rounds?: number;
};

function rollPrompt<P>(
  makePrompt: (rng?: () => number) => P | null,
  rng?: () => number,
): P | null {
  return makePrompt(rng);
}

function freshRound<P>(
  state: QuizState<P>,
  makePrompt: (rng?: () => number) => P | null,
  patch: Partial<QuizState<P>> = {},
): QuizState<P> {
  return {
    ...state,
    prompt: rollPrompt(makePrompt),
    step: 0,
    feedback: null,
    showColors: false,
    ...patch,
  };
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

export function useLessonQuiz<P>(config: LessonQuizConfig<P>) {
  const rounds = config.rounds ?? PRIMER_ROUNDS;
  const { makePrompt, buildSteps, toResult } = config;

  const [state, dispatch] = useReducer(
    (current: QuizState<P>, action: Action): QuizState<P> => {
      switch (action.type) {
        case "answer": {
          const score = {
            correct: current.score.correct + (action.ok ? 1 : 0),
            total: current.score.total + 1,
          };
          if (action.finishRound && action.ok) {
            const nextRound = current.round + 1;
            if (nextRound >= rounds) {
              return {
                ...current,
                score,
                feedback: { ok: true, text: `Correct — ${action.label}` },
                showColors: true,
                step: current.step + 1,
                complete: true,
              };
            }
            return freshRound(current, makePrompt, {
              score,
              round: nextRound,
            });
          }
          return {
            ...current,
            score,
            feedback: {
              ok: action.ok,
              text: action.ok
                ? `Correct — ${action.label}`
                : `Not quite — ${action.label}`,
            },
            showColors: action.ok ? current.showColors : true,
            step: current.step + 1,
            complete:
              action.finishRound && current.round + 1 >= rounds
                ? true
                : current.complete,
          };
        }
        case "nextRound": {
          const nextRound = current.round + 1;
          if (nextRound >= rounds) {
            return { ...current, complete: true, showColors: true };
          }
          return freshRound(current, makePrompt, { round: nextRound });
        }
        case "restart":
          return {
            prompt: rollPrompt(makePrompt),
            step: 0,
            round: 0,
            score: { correct: 0, total: 0 },
            feedback: null,
            showColors: false,
            complete: false,
          };
      }
    },
    undefined,
    (): QuizState<P> => ({
      prompt: rollPrompt(makePrompt, seededRng(1)),
      step: 0,
      round: 0,
      score: { correct: 0, total: 0 },
      feedback: null,
      showColors: false,
      complete: false,
    }),
  );

  const steps = state.prompt ? buildSteps(state.prompt) : [];
  const current = steps[state.step];
  const awaitingContinue =
    !state.complete && !!state.prompt && state.step >= steps.length;
  const result = state.prompt ? toResult(state.prompt) : null;

  function submitAnswer(choice: QuizChoice) {
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
    if (state.complete) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dispatch({ type: "restart" });
      }
      return;
    }
    if (awaitingContinue) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dispatch({ type: "nextRound" });
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

  return {
    prompt: state.prompt,
    step: state.step,
    round: state.round,
    rounds,
    score: state.score,
    feedback: state.feedback,
    showColors: state.showColors,
    complete: state.complete,
    awaitingContinue,
    steps,
    current,
    result,
    answer: submitAnswer,
    nextRound: () => dispatch({ type: "nextRound" }),
    restart: () => dispatch({ type: "restart" }),
  };
}
