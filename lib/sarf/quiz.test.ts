import { describe, expect, it } from "vitest";
import { ROOTS } from "./lexicon";
import {
  ALL_PERSON_IDS,
  ALL_QUESTIONS,
  ALL_VOICES,
  DEFAULT_FILTERS,
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

const defaultFilters: QuizFilters = DEFAULT_FILTERS;
const noVoiceQuestions = ALL_QUESTIONS.filter(
  (question) => question !== "voice",
);

function promptFrom(
  patch: Partial<QuizFilters> = {},
  rng = seededRng(1),
): Prompt | null {
  return makePrompt({ ...DEFAULT_FILTERS, ...patch }, rng);
}

function samplePrompt(): Prompt {
  const prompt = promptFrom({}, seededRng(1));
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
    expect(promptFrom({ enabledForms: [] })).toBeNull();
    expect(promptFrom({ enabledPersons: [] })).toBeNull();
    expect(promptFrom({ enabledVoices: [] })).toBeNull();
  });

  it("never picks imperative when voice is a quiz question", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const prompt = promptFrom({}, seededRng(seed));
      expect(prompt).not.toBeNull();
      expect(prompt!.tense).not.toBe("imperative");
    }
  });

  it("never picks imperative when no second person is enabled", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const prompt = promptFrom(
        {
          enabledPersons: ["huwa", "hiya", "hum"],
          enabledQuestions: noVoiceQuestions,
        },
        seededRng(seed),
      );
      expect(prompt).not.toBeNull();
      expect(prompt!.tense).not.toBe("imperative");
    }
  });

  it("stays within the enabled filters", () => {
    const forms = [1, 2] as const;
    const persons = ["huwa", "anta"] as const;
    const prompt = promptFrom(
      {
        enabledForms: [...forms],
        enabledPersons: [...persons],
        enabledVoices: ["active"],
      },
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
      promptFrom({
        enabledPersons: ["huwa", "hiya"],
        enabledQuestions: noVoiceQuestions,
        enabledTenses: ["imperative"],
      }),
    ).toBeNull();
  });

  it("stays within the enabled tenses", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const prompt = promptFrom(
        { enabledQuestions: noVoiceQuestions, enabledTenses: ["past"] },
        seededRng(seed),
      );
      expect(prompt).not.toBeNull();
      expect(prompt!.tense).toBe("past");
    }
  });

  it("can produce imperative when only أمر is enabled", () => {
    const prompt = promptFrom({
      enabledQuestions: noVoiceQuestions,
      enabledTenses: ["imperative"],
    });
    expect(prompt).not.toBeNull();
    expect(prompt!.tense).toBe("imperative");
  });

  it("can produce imperative-only prompts even when voice is a quiz question", () => {
    for (let seed = 1; seed <= 10; seed += 1) {
      const prompt = promptFrom(
        { enabledTenses: ["imperative"] },
        seededRng(seed),
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
      const prompt = promptFrom({ includeWeak: true }, seededRng(seed));
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

  it("titles tense, voice, and person like other questions", () => {
    const tenseStep = buildQuizSteps(
      prompt,
      { ...defaultFilters, enabledQuestions: ["tense"] },
      "form",
    )[0]!;
    const voiceStep = buildQuizSteps(
      prompt,
      { ...defaultFilters, enabledQuestions: ["voice"] },
      "form",
    )[0]!;
    const personStep = buildQuizSteps(
      prompt,
      { ...defaultFilters, enabledQuestions: ["person"] },
      "form",
    )[0]!;

    expect(tenseStep.title).toBe("What is the tense / الزمن?");
    expect(voiceStep.title).toBe("What is the voice / البناء?");
    expect(personStep.title).toBe("What is the person / الضمير?");
  });

  it("labels tense choices by label mode", () => {
    const pastPrompt = { ...prompt, tense: "past" as const };
    const englishStep = buildQuizSteps(
      pastPrompt,
      { ...defaultFilters, enabledQuestions: ["tense"] },
      "form",
    )[0]!;
    const arabicStep = buildQuizSteps(
      pastPrompt,
      { ...defaultFilters, enabledQuestions: ["tense"] },
      "wazn",
    )[0]!;
    const bothStep = buildQuizSteps(
      pastPrompt,
      { ...defaultFilters, enabledQuestions: ["tense"] },
      "both",
    )[0]!;

    const englishPast = englishStep.choices.find((c) => c.id === "past")!;
    expect(englishPast.primary).toBe("Past");
    expect(englishPast.arabic).toBeUndefined();
    expect(englishPast.secondary).toBeUndefined();
    expect(englishPast.feedback).toBe("Past");

    const arabicPast = arabicStep.choices.find((c) => c.id === "past")!;
    expect(arabicPast.primary).toBe("ماضي");
    expect(arabicPast.arabic).toBe(true);
    expect(arabicPast.feedback).toBe("ماضي");

    const bothPast = bothStep.choices.find((c) => c.id === "past")!;
    expect(bothPast.primary).toBe("Past");
    expect(bothPast.secondary).toBe("ماضي");
    expect(bothPast.secondaryArabic).toBe(true);
    expect(bothPast.feedback).toBe("Past · ماضي");
  });

  it("labels voice choices by label mode", () => {
    const activePrompt = { ...prompt, voice: "active" as const };
    const englishStep = buildQuizSteps(
      activePrompt,
      { ...defaultFilters, enabledQuestions: ["voice"] },
      "form",
    )[0]!;
    const arabicStep = buildQuizSteps(
      activePrompt,
      { ...defaultFilters, enabledQuestions: ["voice"] },
      "wazn",
    )[0]!;
    const bothStep = buildQuizSteps(
      activePrompt,
      { ...defaultFilters, enabledQuestions: ["voice"] },
      "both",
    )[0]!;

    const englishActive = englishStep.choices.find((c) => c.id === "active")!;
    expect(englishActive.primary).toBe("Active");
    expect(englishActive.arabic).toBeUndefined();
    expect(englishActive.secondary).toBeUndefined();
    expect(englishActive.feedback).toBe("Active");

    const arabicActive = arabicStep.choices.find((c) => c.id === "active")!;
    expect(arabicActive.primary).toBe("معلوم");
    expect(arabicActive.arabic).toBe(true);
    expect(arabicActive.feedback).toBe("معلوم");

    const bothActive = bothStep.choices.find((c) => c.id === "active")!;
    expect(bothActive.primary).toBe("Active");
    expect(bothActive.secondary).toBe("معلوم");
    expect(bothActive.secondaryArabic).toBe(true);
    expect(bothActive.feedback).toBe("Active · معلوم");
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
