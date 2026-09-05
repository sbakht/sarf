import { describe, expect, it } from "vitest";
import { conjugate } from "./conjugate";
import { PERSONS } from "./persons";
import {
  isCorrectQuizPerson,
  personQuizEnglish,
  personQuizFeedback,
  quizPersonGroup,
  quizPersonKey,
  uniqueOptions,
} from "./quiz";
import type { PersonId } from "./types";

const ALL_PERSON_IDS = PERSONS.map((person) => person.id);

describe("2nd dual quiz identity", () => {
  it("collapses masculine and feminine 2nd dual into one slot", () => {
    expect(quizPersonKey("antuma_m")).toBe(quizPersonKey("antuma_f"));
    expect(isCorrectQuizPerson("antuma_m", "antuma_f")).toBe(true);
    expect(isCorrectQuizPerson("antuma_f", "antuma_m")).toBe(true);
  });

  it("does not collapse 3rd dual, whose conjugations differ by gender", () => {
    expect(quizPersonKey("huma_m")).not.toBe(quizPersonKey("huma_f"));
    expect(isCorrectQuizPerson("huma_m", "huma_f")).toBe(false);
  });

  it("labels 2nd dual without gender", () => {
    expect(personQuizEnglish("antuma_m")).toBe("you dual (m/f)");
    expect(personQuizEnglish("antuma_f")).toBe("you dual (m/f)");
  });

  it("never offers both 2nd dual genders as distinct choices", () => {
    const ids = ["antuma_f", ...ALL_PERSON_IDS] as PersonId[];
    const choices = uniqueOptions("antuma_f", ids, 14, "seed", quizPersonKey);
    const duals = choices.filter(
      (id) => id === "antuma_m" || id === "antuma_f",
    );
    expect(duals).toHaveLength(1);
    expect(
      choices.map(personQuizEnglish).filter((label) => label === "you dual (m/f)"),
    ).toHaveLength(1);
  });
});

describe("2nd dual conjugations", () => {
  const root = ["ك", "ت", "ب"] as [string, string, string];

  it("match across gender in past, present, and imperative", () => {
    for (const tense of ["past", "present", "imperative"] as const) {
      const masculine = conjugate({
        root,
        form: 1,
        formIBab: "nasara",
        tense,
        voice: "active",
        person: "antuma_m",
      });
      const feminine = conjugate({
        root,
        form: 1,
        formIBab: "nasara",
        tense,
        voice: "active",
        person: "antuma_f",
      });
      expect(masculine.surface).toBe(feminine.surface);
      expect(masculine.available).toBe(true);
    }
  });
});

describe("mudari person homographs", () => {
  it("treats 2nd dual and 3rd dual feminine as the same present answer", () => {
    expect(quizPersonGroup("antuma_m", "present")).toBe(
      quizPersonGroup("huma_f", "present"),
    );
    expect(quizPersonGroup("antuma_f", "present")).toBe(
      quizPersonGroup("huma_f", "present"),
    );
    expect(isCorrectQuizPerson("antuma_m", "huma_f", "present")).toBe(true);
    expect(isCorrectQuizPerson("huma_f", "antuma_f", "present")).toBe(true);
  });

  it("keeps 2nd dual and 3rd dual feminine distinct in the past", () => {
    expect(quizPersonGroup("antuma_m", "past")).not.toBe(
      quizPersonGroup("huma_f", "past"),
    );
    expect(isCorrectQuizPerson("antuma_m", "huma_f", "past")).toBe(false);
    expect(isCorrectQuizPerson("antuma_m", "huma_f")).toBe(false);
  });

  it("treats you (m) and she as the same present answer", () => {
    expect(quizPersonGroup("anta", "present")).toBe(
      quizPersonGroup("hiya", "present"),
    );
    expect(isCorrectQuizPerson("anta", "hiya", "present")).toBe(true);
    expect(isCorrectQuizPerson("hiya", "anta", "present")).toBe(true);
  });

  it("keeps you (m) and she distinct in the past", () => {
    expect(quizPersonGroup("anta", "past")).not.toBe(
      quizPersonGroup("hiya", "past"),
    );
    expect(isCorrectQuizPerson("anta", "hiya", "past")).toBe(false);
  });

  it("does not collapse 3rd dual masculine with 3rd dual feminine in the present", () => {
    expect(quizPersonGroup("huma_m", "present")).not.toBe(
      quizPersonGroup("huma_f", "present"),
    );
    expect(isCorrectQuizPerson("huma_m", "huma_f", "present")).toBe(false);
  });

  it("never offers present dual homographs as distinct choices", () => {
    const choices = uniqueOptions(
      "antuma_m",
      ALL_PERSON_IDS,
      14,
      "seed",
      (id) => quizPersonGroup(id, "present"),
    );
    const duals = choices.filter(
      (id) => id === "antuma_m" || id === "antuma_f" || id === "huma_f",
    );
    expect(duals).toHaveLength(1);
  });

  it("never offers present anta/hiya as distinct choices", () => {
    const choices = uniqueOptions("hiya", ALL_PERSON_IDS, 14, "seed", (id) =>
      quizPersonGroup(id, "present"),
    );
    const pair = choices.filter((id) => id === "anta" || id === "hiya");
    expect(pair).toHaveLength(1);
  });

  it("still offers 2nd dual and 3rd dual feminine as distinct past choices", () => {
    const choices = uniqueOptions(
      "antuma_m",
      ALL_PERSON_IDS,
      14,
      "seed",
      (id) => quizPersonGroup(id, "past"),
    );
    expect(choices).toContain("antuma_m");
    expect(choices).toContain("huma_f");
  });

  it("names both readings in present-tense feedback", () => {
    expect(personQuizFeedback("antuma_m", "present")).toBe(
      "أَنْتُمَا / هُمَا · you dual (m/f) or they dual (f)",
    );
    expect(personQuizFeedback("huma_f", "present")).toBe(
      "أَنْتُمَا / هُمَا · you dual (m/f) or they dual (f)",
    );
    expect(personQuizFeedback("anta", "present")).toBe(
      "أَنْتَ / هِيَ · you (m) or she",
    );
    expect(personQuizFeedback("antuma_m", "past")).toBe(
      "أَنْتُمَا · you dual (m/f)",
    );
  });
});

describe("mudari homograph conjugations", () => {
  const root = ["ك", "ت", "ب"] as [string, string, string];

  it("2nd dual and 3rd dual feminine share a present surface", () => {
    const secondDual = conjugate({
      root,
      form: 1,
      formIBab: "nasara",
      tense: "present",
      voice: "active",
      person: "antuma_m",
    });
    const thirdDualFem = conjugate({
      root,
      form: 1,
      formIBab: "nasara",
      tense: "present",
      voice: "active",
      person: "huma_f",
    });
    expect(secondDual.surface).toBe(thirdDualFem.surface);
    expect(secondDual.available).toBe(true);
  });

  it("you (m) and she share a present surface", () => {
    const youM = conjugate({
      root,
      form: 1,
      formIBab: "nasara",
      tense: "present",
      voice: "active",
      person: "anta",
    });
    const she = conjugate({
      root,
      form: 1,
      formIBab: "nasara",
      tense: "present",
      voice: "active",
      person: "hiya",
    });
    expect(youM.surface).toBe(she.surface);
    expect(youM.available).toBe(true);
  });

  it("those pairs differ in the past", () => {
    const secondDual = conjugate({
      root,
      form: 1,
      formIBab: "nasara",
      tense: "past",
      voice: "active",
      person: "antuma_m",
    });
    const thirdDualFem = conjugate({
      root,
      form: 1,
      formIBab: "nasara",
      tense: "past",
      voice: "active",
      person: "huma_f",
    });
    const youM = conjugate({
      root,
      form: 1,
      formIBab: "nasara",
      tense: "past",
      voice: "active",
      person: "anta",
    });
    const she = conjugate({
      root,
      form: 1,
      formIBab: "nasara",
      tense: "past",
      voice: "active",
      person: "hiya",
    });
    expect(secondDual.surface).not.toBe(thirdDualFem.surface);
    expect(youM.surface).not.toBe(she.surface);
  });
});
