import { describe, expect, it } from "vitest";
import { conjugate } from "./conjugate";
import { getRoot, ROOTS, rootsByWeakness, soundRoots } from "./lexicon";

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

describe("mithal lexicon coverage", () => {
  it("includes several waw mithal roots beyond وعد", () => {
    const ids = rootsByWeakness("mithal").map((root) => root.id);
    expect(ids).toEqual(
      expect.arrayContaining(["w3d", "wjd", "wSl", "wq3", "wD3", "wld", "wqf"]),
    );
    expect(ids.length).toBeGreaterThanOrEqual(7);
  });

  it("lists derived forms that conjugate as available for وعد and وصل", () => {
    const w3d = getRoot("w3d");
    const wSl = getRoot("wSl");
    expect(w3d.forms).toEqual(
      expect.arrayContaining([1, 2, 3, 4, 5, 6, 8, 10]),
    );
    expect(wSl.forms).toEqual(
      expect.arrayContaining([1, 2, 3, 4, 5, 6, 8, 10]),
    );

    for (const root of [w3d, wSl]) {
      for (const form of root.forms) {
        const result = conjugate({
          root: root.letters,
          form,
          formIBab: root.formIBab,
          tense: "past",
          voice: "active",
          person: "huwa",
          weakness: root.weakness,
        });
        expect(result.available, `${root.id} form ${form}`).toBe(true);
      }
    }

    expect(
      conjugate({
        root: wSl.letters,
        form: 8,
        formIBab: wSl.formIBab,
        tense: "past",
        voice: "active",
        person: "huwa",
        weakness: wSl.weakness,
      }).surface,
    ).toBe("اِتَّصَلَ");
  });
});

describe("other weak lexicon coverage", () => {
  it("covers multiple roots for ajwaf, naqis, mudaf, and mahmuz", () => {
    expect(rootsByWeakness("ajwaf").map((r) => r.id)).toEqual(
      expect.arrayContaining([
        "qwl",
        "by3",
        "xwf",
        "qwm",
        "syr",
        "zwr",
        "Tyr",
        "nwm",
      ]),
    );
    expect(rootsByWeakness("naqis").map((r) => r.id)).toEqual(
      expect.arrayContaining(["d3w", "rmy", "mshy", "bny"]),
    );
    expect(rootsByWeakness("mudaf").map((r) => r.id)).toEqual(
      expect.arrayContaining(["mdd", "rdd", "Hbb", "shdd", "3dd"]),
    );
    expect(
      ROOTS.filter((r) => r.weakness.startsWith("mahmuz")).map((r) => r.id),
    ).toEqual(
      expect.arrayContaining(["axd", "akl", "amr", "sAl", "qrA", "bdA"]),
    );
  });

  it("lists richer derived forms on core weak roots", () => {
    expect(getRoot("qwl").forms).toEqual(
      expect.arrayContaining([1, 2, 3, 4, 5, 6, 10]),
    );
    expect(getRoot("qwm").forms).toEqual(
      expect.arrayContaining([1, 2, 3, 4, 5, 6, 10]),
    );
    expect(getRoot("d3w").forms).toEqual(
      expect.arrayContaining([1, 3, 4, 5, 6, 8, 10]),
    );
    expect(getRoot("mdd").forms).toEqual(
      expect.arrayContaining([1, 2, 3, 5, 6, 8, 10]),
    );
    expect(getRoot("sAl").forms).toEqual(expect.arrayContaining([1, 3, 6]));
    expect(getRoot("bdA").forms).toEqual(expect.arrayContaining([1, 4, 8, 10]));
  });

  it("keeps every listed non-sound form conjugable", () => {
    for (const root of ROOTS.filter((entry) => entry.weakness !== "sound")) {
      for (const form of root.forms) {
        const result = conjugate({
          root: root.letters,
          form,
          formIBab: root.formIBab,
          tense: "past",
          voice: "active",
          person: "huwa",
          weakness: root.weakness,
        });
        expect(result.available, `${root.id} form ${form}`).toBe(true);
      }
    }
  });
});
