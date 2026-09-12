import { describe, expect, it } from "vitest";
import { getRoot } from "./lexicon";
import { seededRng } from "./quiz";
import {
  COURSE_CHAPTERS,
  COURSE_KINDS,
  FIRST_CHAPTER_ID,
  buildWeakSteps,
  chapterRounds,
  conjugateCourse,
  courseKind,
  getChapter,
  makeWeakPrompt,
  mutationId,
  nextChapter,
  type ChapterId,
  type WeakPrompt,
} from "./weak-course";

function mustPrompt(chapter: ChapterId, seed: number): WeakPrompt {
  const prompt = makeWeakPrompt(chapter, seededRng(seed));
  if (!prompt) throw new Error(`expected a ${chapter} prompt`);
  return prompt;
}

function cell(
  chapter: ChapterId,
  rootId: string,
  patch: Partial<WeakPrompt>,
): WeakPrompt {
  return {
    chapter,
    root: getRoot(rootId),
    form: 1,
    tense: "past",
    voice: "active",
    person: "huwa",
    label: "ماضي هو",
    ...patch,
  };
}

describe("courseKind", () => {
  it("maps engine weakness types onto the six teaching kinds", () => {
    expect(courseKind("sound")).toBe("sound");
    expect(courseKind("mithal")).toBe("mithal");
    expect(courseKind("ajwaf")).toBe("ajwaf");
    expect(courseKind("naqis")).toBe("naqis");
    expect(courseKind("mudaf")).toBe("mudaf");
    expect(courseKind("mahmuz_f")).toBe("mahmuz");
    expect(courseKind("mahmuz_a")).toBe("mahmuz");
    expect(courseKind("mahmuz_l")).toBe("mahmuz");
  });
});

describe("COURSE_CHAPTERS", () => {
  it("teaches weak verbs from first principles through mastery", () => {
    expect(COURSE_CHAPTERS.map((chapter) => chapter.id)).toEqual([
      "sound-vs-weak",
      "classify",
      "mithal",
      "ajwaf",
      "naqis",
      "mudaf",
      "mahmuz",
      "mastery",
    ]);
    expect(FIRST_CHAPTER_ID).toBe("sound-vs-weak");
    expect(getChapter("naqis")?.arabic).toBe("الناقص");
    expect(nextChapter("mahmuz")?.id).toBe("mastery");
    expect(nextChapter("mastery")).toBeUndefined();
    expect(chapterRounds("mithal")).toBe(6);
    expect(chapterRounds("mastery")).toBe(8);
  });
});

describe("makeWeakPrompt classify", () => {
  it("returns a conjugable Form I cell for a typed root", () => {
    for (const seed of [1, 2, 3, 99, 12345]) {
      const prompt = makeWeakPrompt("classify", seededRng(seed));
      expect(prompt).not.toBeNull();
      if (!prompt) continue;
      expect(prompt.chapter).toBe("classify");
      expect(prompt.root.forms).toContain(prompt.form);
      expect(prompt.form).toBe(1);
      const result = conjugateCourse(prompt);
      expect(result.available).toBe(true);
      expect(result.surface).not.toBe("—");
    }
  });

  it("is deterministic for a seed", () => {
    expect(makeWeakPrompt("classify", seededRng(7))).toEqual(
      makeWeakPrompt("classify", seededRng(7)),
    );
  });
});

describe("buildWeakSteps classify", () => {
  it("asks the student to name the type among six kinds", () => {
    const prompt = mustPrompt("classify", 11);
    const steps = buildWeakSteps(prompt);
    expect(steps).toHaveLength(1);
    expect(steps[0]?.id).toBe("kind");
    expect(steps[0]?.choices).toHaveLength(COURSE_KINDS.length);
    const correct = steps[0]?.choices.filter((choice) => choice.correct) ?? [];
    expect(correct).toHaveLength(1);
    expect(correct[0]?.id).toBe(courseKind(prompt.root.weakness));
  });
});

describe("sound-vs-weak", () => {
  it("asks سالم vs mutation family, then analog vs changed", () => {
    const prompt = mustPrompt("sound-vs-weak", 4);
    const kind = courseKind(prompt.root.weakness);
    const changed =
      conjugateCourse(prompt).surface !== conjugateCourse(prompt, true).surface;
    const steps = buildWeakSteps(prompt);
    expect(steps.map((step) => step.id)).toEqual(["family", "changed"]);
    expect(steps[0]?.choices.find((choice) => choice.correct)?.id).toBe(
      kind === "sound" ? "sound" : "mutation",
    );
    expect(steps[1]?.choices.find((choice) => choice.correct)?.id).toBe(
      changed ? "changed" : "same",
    );
  });
});

describe("type chapters stay on that weakness", () => {
  it.each(["mithal", "ajwaf", "naqis", "mudaf", "mahmuz"] as const)(
    "%s prompts only that kind",
    (chapter) => {
      for (const seed of [1, 2, 3, 8, 21, 99]) {
        const prompt = makeWeakPrompt(chapter, seededRng(seed));
        expect(prompt).not.toBeNull();
        if (!prompt) continue;
        expect(courseKind(prompt.root.weakness)).toBe(chapter);
        expect(conjugateCourse(prompt).available).toBe(true);
      }
    },
  );
});

describe("mutation drills ask for the actual surface", () => {
  it("includes the conjugated form among arabic choices", () => {
    const prompt = mustPrompt("ajwaf", 5);
    const actual = conjugateCourse(prompt);
    const analog = conjugateCourse(prompt, true);
    const steps = buildWeakSteps(prompt);
    expect(steps[0]?.id).toBe("actual");
    const ids = steps[0]?.choices.map((choice) => choice.id) ?? [];
    expect(ids).toContain(actual.surface);
    expect(steps[0]?.choices.filter((choice) => choice.correct)).toHaveLength(
      1,
    );
    if (actual.surface !== analog.surface) {
      expect(ids).toContain(analog.surface);
    }
    expect(steps[1]?.id).toBe("rule");
    expect(steps[1]?.choices.find((choice) => choice.correct)?.id).toBe(
      mutationId(prompt),
    );
  });
});

describe("mutationId", () => {
  it("names the rule a sound-verb student must apply", () => {
    expect(mutationId(cell("mithal", "w3d", { tense: "present" }))).toBe(
      "mithal-drop",
    );
    expect(mutationId(cell("mithal", "w3d", {}))).toBe("none");
    expect(mutationId(cell("ajwaf", "qwl", {}))).toBe("ajwaf-long");
    expect(
      mutationId(cell("ajwaf", "qwl", { person: "ana", label: "ماضي أنا" })),
    ).toBe("ajwaf-short");
    expect(mutationId(cell("naqis", "d3w", {}))).toBe("naqis-alif");
    expect(
      mutationId(cell("naqis", "d3w", { person: "hiya", label: "ماضي هي" })),
    ).toBe("naqis-drop");
    expect(
      mutationId(cell("naqis", "d3w", { person: "ana", label: "ماضي أنا" })),
    ).toBe("none");
    expect(mutationId(cell("naqis", "d3w", { tense: "present" }))).toBe(
      "naqis-mater",
    );
    expect(
      mutationId(
        cell("naqis", "d3w", {
          tense: "present",
          mood: "jussive",
          label: "مجزوم هو",
        }),
      ),
    ).toBe("naqis-drop");
    expect(mutationId(cell("mudaf", "mdd", {}))).toBe("mudaf-shadda");
    expect(
      mutationId(cell("mudaf", "mdd", { person: "ana", label: "ماضي أنا" })),
    ).toBe("none");
    expect(
      mutationId(
        cell("mahmuz", "axd", {
          tense: "imperative",
          person: "anta",
          label: "أمر أنتَ",
        }),
      ),
    ).toBe("mahmuz-command");
    expect(
      mutationId(
        cell("mahmuz", "axd", {
          tense: "present",
          person: "ana",
          label: "مضارع أنا",
        }),
      ),
    ).toBe("mahmuz-madda");
  });
});

describe("mastery", () => {
  it("asks type then the actual surface", () => {
    const prompt = mustPrompt("mastery", 9);
    const steps = buildWeakSteps(prompt);
    expect(steps.map((step) => step.id)).toEqual(["kind", "actual"]);
    expect(steps[0]?.choices.find((choice) => choice.correct)?.id).toBe(
      courseKind(prompt.root.weakness),
    );
    expect(steps[1]?.choices.find((choice) => choice.correct)?.id).toBe(
      conjugateCourse(prompt).surface,
    );
  });
});
