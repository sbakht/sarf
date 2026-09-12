import { describe, expect, it, vi } from "vitest";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
  ALL_QUESTIONS,
  ALL_TENSES,
  ALL_VOICES,
  ALL_WEAK_LETTERS,
  makePrompt,
  seededRng,
  type QuizFilters,
} from "@/lib/sarf";
import { createInitialState, reduceQuiz } from "./useQuiz";

const defaultFilters: QuizFilters = {
  enabledWeaknesses: ["sound"],
  enabledWeakLetters: [...ALL_WEAK_LETTERS],
  enabledForms: ALL_FORMS,
  enabledPersons: ALL_PERSON_IDS,
  enabledVoices: ALL_VOICES,
  enabledTenses: ALL_TENSES,
  enabledQuestions: ALL_QUESTIONS,
};

describe("createInitialState", () => {
  it("does not pick a verb during render", () => {
    expect(createInitialState().prompt).toBeNull();
  });

  it("defaults to sound roots only", () => {
    expect(createInitialState().enabledWeaknesses).toEqual(["sound"]);
  });
});

describe("reduceQuiz", () => {
  it("rolls a random first prompt on start", () => {
    const seeded = makePrompt(defaultFilters, seededRng(1));
    vi.spyOn(Math, "random").mockReturnValue(0.42);
    const state = reduceQuiz(createInitialState(), { type: "nextPrompt" });
    vi.restoreAllMocks();
    expect(state.prompt).not.toBeNull();
    expect(state.prompt).not.toEqual(seeded);
  });

  it("toggles weakness types without dropping the last one", () => {
    const withAjwaf = reduceQuiz(createInitialState(), {
      type: "toggleWeakness",
      weakness: "ajwaf",
    });
    expect(withAjwaf.enabledWeaknesses).toEqual(["sound", "ajwaf"]);

    const soundOnly = reduceQuiz(withAjwaf, {
      type: "toggleWeakness",
      weakness: "ajwaf",
    });
    expect(soundOnly.enabledWeaknesses).toEqual(["sound"]);

    const blocked = reduceQuiz(soundOnly, {
      type: "toggleWeakness",
      weakness: "sound",
    });
    expect(blocked.enabledWeaknesses).toEqual(["sound"]);
  });

  it("toggles weak letters without dropping the last one", () => {
    const wawOnly = reduceQuiz(createInitialState(), {
      type: "toggleWeakLetter",
      letter: "ya",
    });
    expect(wawOnly.enabledWeakLetters).toEqual(["waw"]);

    const blocked = reduceQuiz(wawOnly, {
      type: "toggleWeakLetter",
      letter: "waw",
    });
    expect(blocked.enabledWeakLetters).toEqual(["waw"]);
  });
});
