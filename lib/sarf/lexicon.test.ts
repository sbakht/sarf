import { describe, expect, it } from "vitest";
import { conjugate } from "./conjugate";
import { getRoot, soundRoots } from "./lexicon";

describe("Form VIII initial-ta root", () => {
  it("is in the sound pool so quiz and atlas can practice gathering the two tes", () => {
    const root = getRoot("tb3");
    expect(root.letters).toEqual(["ت", "ب", "ع"]);
    expect(root.gloss).toBe("follow");
    expect(root.forms).toContain(8);
    expect(soundRoots().some((item) => item.id === "tb3")).toBe(true);
    expect(
      conjugate({
        root: root.letters,
        form: 8,
        formIBab: root.formIBab,
        tense: "past",
        voice: "active",
        person: "huwa",
        weakness: root.weakness,
      }).surface,
    ).toBe("اِتَّبَعَ");
  });
});
