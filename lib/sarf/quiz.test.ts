import { describe, expect, it } from "vitest";
import { ROOTS } from "./lexicon";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
  ALL_QUESTIONS,
  ALL_TENSES,
  ALL_VOICES,
  buildQuizSteps,
  eligibleTenses,
  makePrompt,
  quizChoiceLabel,
  quizWrongFeedback,
  seededRng,
  toggleItem,
  type Prompt,
  type QuizFilters,
} from "./quiz";

const defaultFilters: QuizFilters = {
  includeWeak: false,
  enabledForms: ALL_FORMS,
  enabledPersons: ALL_PERSON_IDS,
  enabledVoices: ALL_VOICES,
  enabledTenses: ALL_TENSES,
  enabledQuestions: ALL_QUESTIONS,
};

function samplePrompt(): Prompt {
  const prompt = makePrompt(
    false,
    ALL_FORMS,
    ALL_PERSON_IDS,
    ALL_VOICES,
    true,
    seededRng(1),
  );
  if (!prompt) throw new Error("expected a prompt");
  return prompt;
}

describe("toggleItem", () => {
  it("refuses dropping the last item", () => {
    expect(toggleItem(["root"], "root")).toBeNull();
  });

  it("removes an item when more than one remain", () => {
    expect(toggleItem(["root", "form"], "root")).toEqual(["form"]);
  });

  it("adds a missing item", () => {
    expect(toggleItem(["root"], "form")).toEqual(["root", "form"]);
  });
});

describe("eligibleTenses", () => {
  it("omits imperative when voice is a quiz step", () => {
    expect(eligibleTenses(ALL_PERSON_IDS, ALL_VOICES, true)).toEqual([
      "past",
      "present",
    ]);
  });

  it("omits imperative when no second person is enabled", () => {
    expect(eligibleTenses(["huwa", "hiya"], ALL_VOICES, false)).toEqual([
      "past",
      "present",
    ]);
  });

  it("omits imperative when active voice is off", () => {
    expect(eligibleTenses(ALL_PERSON_IDS, ["passive"], false)).toEqual([
      "past",
      "present",
    ]);
  });

  it("includes imperative when second persons and active voice are on and voice is not quizzed", () => {
    expect(eligibleTenses(ALL_PERSON_IDS, ALL_VOICES, false)).toEqual([
      "past",
      "present",
      "imperative",
    ]);
  });

  it("keeps only enabled tenses", () => {
    expect(eligibleTenses(ALL_PERSON_IDS, ALL_VOICES, false, ["past"])).toEqual(
      ["past"],
    );
    expect(
      eligibleTenses(ALL_PERSON_IDS, ALL_VOICES, false, ["past", "present"]),
    ).toEqual(["past", "present"]);
    expect(
      eligibleTenses(ALL_PERSON_IDS, ALL_VOICES, false, ["imperative"]),
    ).toEqual(["imperative"]);
  });

  it("drops an enabled tense that the other filters cannot produce", () => {
    expect(eligibleTenses(["huwa"], ALL_VOICES, false, ["imperative"])).toEqual(
      [],
    );
    expect(
      eligibleTenses(ALL_PERSON_IDS, ["passive"], false, ["imperative"]),
    ).toEqual([]);
  });

  it("still allows أمر when it is the only enabled tense, even if voice is quizzed", () => {
    expect(
      eligibleTenses(ALL_PERSON_IDS, ALL_VOICES, true, ["imperative"]),
    ).toEqual(["imperative"]);
  });
});

describe("makePrompt", () => {
  it("returns null when the pool is empty", () => {
    expect(
      makePrompt(false, [], ALL_PERSON_IDS, ALL_VOICES, true, seededRng(1)),
    ).toBeNull();
    expect(
      makePrompt(false, ALL_FORMS, [], ALL_VOICES, true, seededRng(1)),
    ).toBeNull();
    expect(
      makePrompt(false, ALL_FORMS, ALL_PERSON_IDS, [], true, seededRng(1)),
    ).toBeNull();
  });

  it("never picks imperative when voice is a quiz question", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const prompt = makePrompt(
        false,
        ALL_FORMS,
        ALL_PERSON_IDS,
        ALL_VOICES,
        true,
        seededRng(seed),
      );
      expect(prompt).not.toBeNull();
      expect(prompt!.tense).not.toBe("imperative");
    }
  });

  it("never picks imperative when no second person is enabled", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const prompt = makePrompt(
        false,
        ALL_FORMS,
        ["huwa", "hiya", "hum"],
        ALL_VOICES,
        false,
        seededRng(seed),
      );
      expect(prompt).not.toBeNull();
      expect(prompt!.tense).not.toBe("imperative");
    }
  });

  it("stays within the enabled filters", () => {
    const forms = [1, 2] as const;
    const persons = ["huwa", "anta"] as const;
    const prompt = makePrompt(
      false,
      [...forms],
      [...persons],
      ["active"],
      true,
      seededRng(3),
    );
    expect(prompt).not.toBeNull();
    expect(forms).toContain(prompt!.form);
    expect(persons).toContain(prompt!.person);
    expect(prompt!.voice).toBe("active");
    expect(prompt!.root.weakness).toBe("sound");
  });

  it("returns null when no enabled tense is eligible", () => {
    expect(
      makePrompt(
        false,
        ALL_FORMS,
        ["huwa", "hiya"],
        ALL_VOICES,
        false,
        seededRng(1),
        ["imperative"],
      ),
    ).toBeNull();
  });

  it("stays within the enabled tenses", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const prompt = makePrompt(
        false,
        ALL_FORMS,
        ALL_PERSON_IDS,
        ALL_VOICES,
        false,
        seededRng(seed),
        ["past"],
      );
      expect(prompt).not.toBeNull();
      expect(prompt!.tense).toBe("past");
    }
  });

  it("can produce imperative when only أمر is enabled", () => {
    const prompt = makePrompt(
      false,
      ALL_FORMS,
      ALL_PERSON_IDS,
      ALL_VOICES,
      false,
      seededRng(1),
      ["imperative"],
    );
    expect(prompt).not.toBeNull();
    expect(prompt!.tense).toBe("imperative");
  });

  it("can produce imperative-only prompts even when voice is a quiz question", () => {
    for (let seed = 1; seed <= 10; seed += 1) {
      const prompt = makePrompt(
        false,
        ALL_FORMS,
        ALL_PERSON_IDS,
        ALL_VOICES,
        true,
        seededRng(seed),
        ["imperative"],
      );
      expect(prompt).not.toBeNull();
      expect(prompt!.tense).toBe("imperative");
    }
  });

  it("can draw weak roots when includeWeak is on", () => {
    const weakIds = new Set(
      ROOTS.filter((root) => root.weakness !== "sound").map((root) => root.id),
    );
    let foundWeak = false;
    for (let seed = 1; seed <= 40; seed += 1) {
      const prompt = makePrompt(
        true,
        ALL_FORMS,
        ALL_PERSON_IDS,
        ALL_VOICES,
        true,
        seededRng(seed),
      );
      expect(prompt).not.toBeNull();
      if (weakIds.has(prompt!.root.id)) {
        foundWeak = true;
        break;
      }
    }
    expect(foundWeak).toBe(true);
  });
});

describe("buildQuizSteps", () => {
  const prompt = samplePrompt();

  it("drops questions with fewer than two choices", () => {
    const steps = buildQuizSteps(
      { ...prompt, form: 1, voice: "active", person: "huwa" },
      {
        ...defaultFilters,
        enabledForms: [1],
        enabledVoices: ["active"],
        enabledPersons: ["huwa"],
        enabledQuestions: ["form", "voice", "person", "tense"],
      },
      "form",
    );
    expect(steps.map((step) => step.id)).toEqual(["tense"]);
  });

  it("keeps only enabled questions", () => {
    const steps = buildQuizSteps(
      prompt,
      { ...defaultFilters, enabledQuestions: ["root", "person"] },
      "form",
    );
    expect(steps.map((step) => step.id)).toEqual(["root", "person"]);
  });

  it("offers only enabled tenses on the tense step", () => {
    const steps = buildQuizSteps(
      { ...prompt, tense: "past" },
      {
        ...defaultFilters,
        enabledTenses: ["past", "present"],
        enabledQuestions: ["tense"],
      },
      "form",
    );
    expect(steps).toHaveLength(1);
    expect(steps[0]!.choices.map((choice) => choice.id)).toEqual([
      "past",
      "present",
    ]);
  });

  it("drops the tense step when only one tense is enabled", () => {
    const steps = buildQuizSteps(
      { ...prompt, tense: "past" },
      {
        ...defaultFilters,
        enabledTenses: ["past"],
        enabledQuestions: ["tense"],
      },
      "form",
    );
    expect(steps).toEqual([]);
  });

  it("drops the voice step for an imperative prompt", () => {
    const steps = buildQuizSteps(
      { ...prompt, tense: "imperative", voice: "active", person: "anta" },
      { ...defaultFilters, enabledQuestions: ["tense", "voice"] },
      "form",
    );
    expect(steps.map((step) => step.id)).toEqual(["tense"]);
  });

  it("returns serializable choice data with no extra questions", () => {
    const steps = buildQuizSteps(prompt, defaultFilters, "form");
    expect(steps.length).toBeGreaterThan(0);
    for (const step of steps) {
      expect(step.choices.length).toBeGreaterThanOrEqual(2);
      expect(step.choices.some((choice) => choice.correct)).toBe(true);
      for (const choice of step.choices) {
        expect(choice.primary.length).toBeGreaterThan(0);
        expect(typeof choice.id).toBe("string");
      }
    }
  });

  it("labels form choices by label mode", () => {
    const formStep = buildQuizSteps(
      prompt,
      { ...defaultFilters, enabledQuestions: ["form"] },
      "form",
    )[0]!;
    const waznStep = buildQuizSteps(
      prompt,
      { ...defaultFilters, enabledQuestions: ["form"] },
      "wazn",
    )[0]!;
    const bothStep = buildQuizSteps(
      prompt,
      { ...defaultFilters, enabledQuestions: ["form"] },
      "both",
    )[0]!;

    expect(formStep.choices[0]?.primary).toBe("Form I");
    expect(formStep.choices[0]?.secondary).toBeUndefined();

    expect(waznStep.choices[0]?.primary).toBe("فَعَلَ");
    expect(waznStep.choices[0]?.arabic).toBe(true);

    expect(bothStep.choices[0]?.primary).toBe("Form I");
    expect(bothStep.choices[0]?.secondary).toBe("فَعَلَ");
    expect(bothStep.choices[0]?.secondaryArabic).toBe(true);
  });
});

describe("quiz feedback helpers", () => {
  it("formats choice labels with optional secondary text", () => {
    expect(
      quizChoiceLabel({
        id: "1",
        primary: "Form I",
        correct: false,
        feedback: "Form I",
      }),
    ).toBe("Form I");
    expect(
      quizChoiceLabel({
        id: "1",
        primary: "Form I",
        secondary: "فَعَلَ",
        correct: false,
        feedback: "Form I · فَعَلَ",
      }),
    ).toBe("Form I · فَعَلَ");
  });

  it("includes the selected answer in wrong feedback", () => {
    expect(quizWrongFeedback("Form IV", "Form I")).toBe(
      "Not quite — you said Form IV; correct answer is Form I",
    );
  });
});
