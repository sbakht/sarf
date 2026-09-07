import { describe, expect, it, vi } from "vitest";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
  ALL_VOICES,
  makePrompt,
  seededRng,
} from "@/lib/sarf";
import { createInitialState } from "./useQuiz";

describe("createInitialState", () => {
  it("rolls the first prompt randomly", () => {
    const seeded = makePrompt(
      false,
      ALL_FORMS,
      ALL_PERSON_IDS,
      ALL_VOICES,
      true,
      seededRng(1),
    );
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const state = createInitialState();
    vi.restoreAllMocks();
    expect(state.prompt).not.toEqual(seeded);
  });
});
