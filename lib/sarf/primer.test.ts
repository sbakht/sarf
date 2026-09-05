import { describe, expect, it } from "vitest";
import {
  PRIMER_PERSONS,
  PRIMER_ROUNDS,
  buildIntroSteps,
  buildRootGenderSteps,
  conjugateIntro,
  conjugateRootGender,
  familyKind,
  makeIntroPrompt,
  makeRootGenderPrompt,
  primerRoots,
} from "./primer";
import { seededRng } from "./spotter";

describe("primerRoots", () => {
  it("keeps only sound Form I roots", () => {
    const roots = primerRoots();
    expect(roots.length).toBeGreaterThanOrEqual(4);
    for (const root of roots) {
      expect(root.weakness).toBe("sound");
      expect(root.forms).toContain(1);
    }
  });
});

describe("makeRootGenderPrompt", () => {
  it("returns Form I past he/she only", () => {
    for (const seed of [1, 2, 3, 99, 12345]) {
      const prompt = makeRootGenderPrompt(seededRng(seed));
      expect(prompt).not.toBeNull();
      if (!prompt) continue;
      expect(PRIMER_PERSONS).toContain(prompt.person);
      expect(prompt.root.weakness).toBe("sound");
      expect(prompt.root.forms).toContain(1);
      const result = conjugateRootGender(prompt);
      expect(result.available).toBe(true);
      expect(result.surface).not.toBe("—");
    }
  });

  it("is deterministic for a seed", () => {
    const a = makeRootGenderPrompt(seededRng(7));
    const b = makeRootGenderPrompt(seededRng(7));
    expect(a).toEqual(b);
  });
});

describe("buildRootGenderSteps", () => {
  it("asks root then he/she", () => {
    const prompt = makeRootGenderPrompt(seededRng(1));
    if (!prompt) throw new Error("expected a prompt");
    const steps = buildRootGenderSteps(prompt);

    expect(steps).toHaveLength(2);
    expect(steps[0]?.id).toBe("root");
    expect(steps[1]?.id).toBe("person");
    expect(steps[0]?.choices).toHaveLength(4);
    expect(steps[1]?.choices).toHaveLength(2);
  });

  it("includes the correct root among four choices", () => {
    const prompt = makeRootGenderPrompt(seededRng(11));
    if (!prompt) throw new Error("expected a prompt");
    const rootStep = buildRootGenderSteps(prompt)[0];
    const ids = rootStep?.choices.map((choice) => choice.id) ?? [];
    expect(ids).toContain(prompt.root.id);
    expect(rootStep?.choices.filter((choice) => choice.correct)).toHaveLength(
      1,
    );
    expect(new Set(ids).size).toBe(4);
  });

  it("offers only huwa and hiya, with one correct", () => {
    const prompt = makeRootGenderPrompt(seededRng(21));
    if (!prompt) throw new Error("expected a prompt");
    const personStep = buildRootGenderSteps(prompt)[1];
    const ids = personStep?.choices.map((choice) => choice.id) ?? [];
    expect(ids.sort()).toEqual(["hiya", "huwa"]);
    const correct = personStep?.choices.find((choice) => choice.correct);
    expect(correct?.id).toBe(prompt.person);
  });
});

describe("makeIntroPrompt", () => {
  it("returns past هو verbs that conjugate", () => {
    for (const seed of [1, 2, 3, 99, 12345]) {
      const prompt = makeIntroPrompt(seededRng(seed));
      expect(prompt).not.toBeNull();
      if (!prompt) continue;
      expect(prompt.root.weakness).toBe("sound");
      expect(prompt.root.forms).toContain(prompt.form);
      const result = conjugateIntro(prompt);
      expect(result.available).toBe(true);
    }
  });

  it("is deterministic for a seed", () => {
    expect(makeIntroPrompt(seededRng(7))).toEqual(
      makeIntroPrompt(seededRng(7)),
    );
  });
});

describe("buildIntroSteps", () => {
  it("asks root then مجرد / مزيد فيه", () => {
    const prompt = makeIntroPrompt(seededRng(1));
    if (!prompt) throw new Error("expected a prompt");
    const steps = buildIntroSteps(prompt);
    expect(steps).toHaveLength(2);
    expect(steps[0]?.id).toBe("root");
    expect(steps[1]?.id).toBe("family");
    expect(steps[0]?.choices).toHaveLength(4);
    expect(steps[1]?.choices).toHaveLength(2);
  });

  it("marks the correct family kind", () => {
    for (const seed of [4, 8, 15, 42]) {
      const prompt = makeIntroPrompt(seededRng(seed));
      if (!prompt) throw new Error("expected a prompt");
      const familyStep = buildIntroSteps(prompt)[1];
      const correct = familyStep?.choices.find((choice) => choice.correct);
      expect(correct?.id).toBe(familyKind(prompt.form));
    }
  });
});

describe("PRIMER_ROUNDS", () => {
  it("is six verbs per sitting", () => {
    expect(PRIMER_ROUNDS).toBe(6);
  });
});
