import { describe, expect, it, vi } from "vitest";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
  ALL_QUESTIONS,
  ALL_TENSES,
  ALL_VOICES,
  DEFAULT_FILTERS,
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
    const seeded = makePrompt(DEFAULT_FILTERS, seededRng(1));
    vi.spyOn(Math, "random").mockReturnValue(0.42);
    const state = reduceQuiz(createInitialState(), { type: "nextPrompt" });
    vi.restoreAllMocks();
    expect(state.prompt).not.toBeNull();
    expect(state.prompt).not.toEqual(seeded);
  });

  it("toggles a form off and refuses dropping the last one", () => {
    let state = reduceQuiz(createInitialState(), {
      type: "toggleForm",
      form: 1,
    });
    expect(state.enabledForms).not.toContain(1);
    expect(state.enabledForms).toHaveLength(ALL_FORMS.length - 1);
    expect(state.started).toBe(true);

    state = { ...createInitialState(), enabledForms: [2] };
    expect(
      reduceQuiz(state, { type: "toggleForm", form: 2 }).enabledForms,
    ).toEqual([2]);
  });

  it("selects all forms when some were off", () => {
    const state = reduceQuiz(
      { ...createInitialState(), enabledForms: [1, 2] },
      { type: "selectAllForms" },
    );
    expect(state.enabledForms).toEqual(ALL_FORMS);
  });

  it("toggles linked dual second-person pronouns together", () => {
    const state = reduceQuiz(createInitialState(), {
      type: "togglePerson",
      person: "antuma_m",
    });
    expect(state.enabledPersons).not.toContain("antuma_m");
    expect(state.enabledPersons).not.toContain("antuma_f");
    expect(state.enabledPersons).toHaveLength(ALL_PERSON_IDS.length - 2);
  });

  it("toggles a whole pronoun row and can restore all", () => {
    let state = reduceQuiz(createInitialState(), {
      type: "togglePersonSet",
      persons: ["huwa", "huma_m", "hum"],
    });
    expect(state.enabledPersons).not.toContain("huwa");
    expect(state.enabledPersons).not.toContain("huma_m");
    expect(state.enabledPersons).not.toContain("hum");
    state = reduceQuiz(state, { type: "selectAllPersons" });
    expect(state.enabledPersons).toEqual(ALL_PERSON_IDS);
  });

  it("toggles voice, tense, and question filters the same way", () => {
    let state = reduceQuiz(createInitialState(), {
      type: "toggleVoice",
      voice: "passive",
    });
    expect(state.enabledVoices).toEqual(["active"]);
    state = reduceQuiz(state, { type: "toggleTense", tense: "imperative" });
    expect(state.enabledTenses).toEqual(["past", "present"]);
    state = reduceQuiz(state, { type: "toggleQuestion", question: "root" });
    expect(state.enabledQuestions).not.toContain("root");
    state = reduceQuiz(state, { type: "selectAllVoices" });
    state = reduceQuiz(state, { type: "selectAllTenses" });
    state = reduceQuiz(state, { type: "selectAllQuestions" });
    expect(state.enabledVoices).toEqual(ALL_VOICES);
    expect(state.enabledTenses).toEqual(ALL_TENSES);
    expect(state.enabledQuestions).toEqual(ALL_QUESTIONS);
  });
});
