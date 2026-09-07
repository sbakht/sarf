import { describe, expect, it, vi } from "vitest";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
  ALL_VOICES,
  makePrompt,
  seededRng,
} from "@/lib/sarf";
import { createInitialState, reduceQuiz } from "./useQuiz";

describe("createInitialState", () => {
  it("does not pick a verb during render", () => {
    expect(createInitialState().prompt).toBeNull();
  });
});

describe("reduceQuiz", () => {
  it("rolls a random first prompt on start", () => {
    const seeded = makePrompt(
      false,
      ALL_FORMS,
      ALL_PERSON_IDS,
      ALL_VOICES,
      true,
      seededRng(1),
    );
    vi.spyOn(Math, "random").mockReturnValue(0.42);
    const state = reduceQuiz(createInitialState(), { type: "nextPrompt" });
    vi.restoreAllMocks();
    expect(state.prompt).not.toBeNull();
    expect(state.prompt).not.toEqual(seeded);
  });
});
