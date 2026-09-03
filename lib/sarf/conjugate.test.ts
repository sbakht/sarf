import { describe, expect, it } from "vitest";
import { conjugate } from "./conjugate";
import { stripHarakat } from "./harakat";
import type { ConjugateInput } from "./types";

function form(overrides: Partial<ConjugateInput> & Pick<ConjugateInput, "root">): string {
  return conjugate({
    form: 1,
    formIBab: "nasara",
    tense: "past",
    voice: "active",
    person: "huwa",
    ...overrides,
  }).surface;
}

describe("sound Form I كتب", () => {
  const root = ["ك", "ت", "ب"] as [string, string, string];

  it("conjugates past", () => {
    expect(form({ root, person: "huwa" })).toBe("كَتَبَ");
    expect(form({ root, person: "huma_m" })).toBe("كَتَبَا");
    expect(form({ root, person: "hum" })).toBe("كَتَبُوا");
    expect(form({ root, person: "hiya" })).toBe("كَتَبَتْ");
    expect(form({ root, person: "huma_f" })).toBe("كَتَبَتَا");
    expect(form({ root, person: "hunna" })).toBe("كَتَبْنَ");
    expect(form({ root, person: "anta" })).toBe("كَتَبْتَ");
    expect(form({ root, person: "ana" })).toBe("كَتَبْتُ");
    expect(form({ root, person: "nahnu" })).toBe("كَتَبْنَا");
    expect(form({ root, person: "antum" })).toBe("كَتَبْتُمْ");
    expect(form({ root, person: "anti" })).toBe("كَتَبْتِ");
    expect(form({ root, person: "antunna" })).toBe("كَتَبْتُنَّ");
  });

  it("conjugates present indicative", () => {
    expect(form({ root, tense: "present", person: "huwa" })).toBe("يَكْتُبُ");
    expect(form({ root, tense: "present", person: "huma_m" })).toBe("يَكْتُبَانِ");
    expect(form({ root, tense: "present", person: "hum" })).toBe("يَكْتُبُونَ");
    expect(form({ root, tense: "present", person: "hiya" })).toBe("تَكْتُبُ");
    expect(form({ root, tense: "present", person: "hunna" })).toBe("يَكْتُبْنَ");
    expect(form({ root, tense: "present", person: "anta" })).toBe("تَكْتُبُ");
    expect(form({ root, tense: "present", person: "anti" })).toBe("تَكْتُبِينَ");
    expect(form({ root, tense: "present", person: "ana" })).toBe("أَكْتُبُ");
    expect(form({ root, tense: "present", person: "nahnu" })).toBe("نَكْتُبُ");
  });

  it("conjugates jussive and subjunctive", () => {
    expect(form({ root, tense: "present", mood: "jussive", person: "huwa" })).toBe("يَكْتُبْ");
    expect(form({ root, tense: "present", mood: "subjunctive", person: "huwa" })).toBe("يَكْتُبَ");
    expect(form({ root, tense: "present", mood: "jussive", person: "hum" })).toBe("يَكْتُبُوا");
  });

  it("conjugates imperative", () => {
    expect(form({ root, tense: "imperative", person: "anta" })).toBe("اُكْتُبْ");
    expect(form({ root, tense: "imperative", person: "anti" })).toBe("اُكْتُبِي");
    expect(form({ root, tense: "imperative", person: "antum" })).toBe("اُكْتُبُوا");
    expect(form({ root, tense: "imperative", person: "huwa" })).toBe("—");
  });

  it("conjugates passive", () => {
    expect(form({ root, voice: "passive", person: "huwa" })).toBe("كُتِبَ");
    expect(form({ root, tense: "present", voice: "passive", person: "huwa" })).toBe("يُكْتَبُ");
  });

  it("tags ف ع ل slots", () => {
    const result = conjugate({
      root,
      form: 1,
      formIBab: "nasara",
      tense: "present",
      voice: "active",
      person: "hum",
    });
    expect(result.slots.map((s) => s.kind)).toContain("f");
    expect(result.slots.map((s) => s.kind)).toContain("a");
    expect(result.slots.map((s) => s.kind)).toContain("l");
    expect(result.slots[0].kind).toBe("prefix");
  });
});

describe("Form I abwab", () => {
  it("uses the six theme-vowel patterns", () => {
    expect(form({ root: ["ض", "ر", "ب"], formIBab: "daraba", tense: "present" })).toBe("يَضْرِبُ");
    expect(form({ root: ["ف", "ت", "ح"], formIBab: "fataha", tense: "present" })).toBe("يَفْتَحُ");
    expect(form({ root: ["ف", "ر", "ح"], formIBab: "fariha" })).toBe("فَرِحَ");
    expect(form({ root: ["ف", "ر", "ح"], formIBab: "fariha", tense: "present" })).toBe("يَفْرَحُ");
    expect(form({ root: ["ك", "ر", "م"], formIBab: "karuma" })).toBe("كَرُمَ");
    expect(form({ root: ["ح", "س", "ب"], formIBab: "hasiba", tense: "present" })).toBe("يَحْسِبُ");
  });
});

describe("derived forms", () => {
  const ktb = ["ك", "ت", "ب"] as [string, string, string];
  const xrj = ["خ", "ر", "ج"] as [string, string, string];
  const krm = ["ك", "ر", "م"] as [string, string, string];
  const ftH = ["ف", "ت", "ح"] as [string, string, string];
  const jm3 = ["ج", "م", "ع"] as [string, string, string];
  const ilm = ["ع", "ل", "م"] as [string, string, string];

  it("Forms II–X past and present for huwa", () => {
    expect(form({ root: ilm, form: 2 })).toBe("عَلَّمَ");
    expect(form({ root: ilm, form: 2, tense: "present" })).toBe("يُعَلِّمُ");
    expect(form({ root: ktb, form: 3 })).toBe("كَاتَبَ");
    expect(form({ root: ktb, form: 3, tense: "present" })).toBe("يُكَاتِبُ");
    expect(form({ root: krm, form: 4 })).toBe("أَكْرَمَ");
    expect(form({ root: krm, form: 4, tense: "present" })).toBe("يُكْرِمُ");
    expect(form({ root: ilm, form: 5 })).toBe("تَعَلَّمَ");
    expect(form({ root: ilm, form: 5, tense: "present" })).toBe("يَتَعَلَّمُ");
    expect(form({ root: ktb, form: 6 })).toBe("تَكَاتَبَ");
    expect(form({ root: ktb, form: 6, tense: "present" })).toBe("يَتَكَاتَبُ");
    expect(form({ root: ftH, form: 7 })).toBe("اِنْفَتَحَ");
    expect(form({ root: ftH, form: 7, tense: "present" })).toBe("يَنْفَتِحُ");
    expect(form({ root: jm3, form: 8 })).toBe("اِجْتَمَعَ");
    expect(form({ root: jm3, form: 8, tense: "present" })).toBe("يَجْتَمِعُ");
    expect(form({ root: jm3, form: 8, tense: "present", voice: "passive" })).toBe("يُجْتَمَعُ");
    expect(form({ root: ["ح", "م", "ر"], form: 9 })).toBe("اِحْمَرَّ");
    expect(form({ root: ["ح", "م", "ر"], form: 9, tense: "present" })).toBe("يَحْمَرُّ");
    expect(form({ root: ["ح", "م", "ر"], form: 9, voice: "passive" })).toBe("—");
    expect(form({ root: xrj, form: 10 })).toBe("اِسْتَخْرَجَ");
    expect(form({ root: xrj, form: 10, tense: "present" })).toBe("يَسْتَخْرِجُ");
  });

  it("Form IV and X imperatives", () => {
    expect(form({ root: krm, form: 4, tense: "imperative", person: "anta" })).toBe("أَكْرِمْ");
    expect(form({ root: xrj, form: 10, tense: "imperative", person: "anta" })).toBe("اِسْتَخْرِجْ");
    expect(form({ root: ilm, form: 2, tense: "imperative", person: "anta" })).toBe("عَلِّمْ");
  });

  it("Form I daraba imperative uses kasra wasl", () => {
    expect(form({ root: ["ض", "ر", "ب"], formIBab: "daraba", tense: "imperative", person: "anta" })).toBe(
      "اِضْرِبْ",
    );
  });

  it("Form VIII طلب assimilates ت into ط", () => {
    const tlb = ["ط", "ل", "ب"] as [string, string, string];
    expect(form({ root: tlb, form: 8 })).toBe("اِطَّلَبَ");
    expect(form({ root: tlb, form: 8, voice: "passive" })).toBe("اُطُّلِبَ");
    expect(form({ root: tlb, form: 8, tense: "present" })).toBe("يَطَّلِبُ");
    expect(form({ root: tlb, form: 8, tense: "present", voice: "passive" })).toBe("يُطَّلَبُ");
    expect(form({ root: tlb, form: 8, tense: "present", voice: "passive", person: "antunna" })).toBe(
      "تُطَّلَبْنَ",
    );
    expect(form({ root: tlb, form: 8, tense: "imperative", person: "anta" })).toBe("اِطَّلِبْ");
    expect(
      conjugate({
        root: tlb,
        form: 8,
        tense: "present",
        voice: "passive",
        person: "antunna",
        asSoundAnalog: true,
      }).surface,
    ).toBe("تُطْتَلَبْنَ");
  });
});

describe("أجوف قال / باع / خاف", () => {
  const qwl = ["ق", "و", "ل"] as [string, string, string];
  const by3 = ["ب", "ي", "ع"] as [string, string, string];
  const xwf = ["خ", "و", "ف"] as [string, string, string];

  it("قال past shortens before still endings", () => {
    expect(form({ root: qwl, person: "huwa" })).toBe("قَالَ");
    expect(form({ root: qwl, person: "hiya" })).toBe("قَالَتْ");
    expect(form({ root: qwl, person: "ana" })).toBe("قُلْتُ");
    expect(form({ root: qwl, person: "hunna" })).toBe("قُلْنَ");
  });

  it("قال present lengthens and shortens in jussive", () => {
    expect(form({ root: qwl, tense: "present", person: "huwa" })).toBe("يَقُولُ");
    expect(form({ root: qwl, tense: "present", person: "hunna" })).toBe("يَقُلْنَ");
    expect(form({ root: qwl, tense: "present", mood: "jussive", person: "huwa" })).toBe("يَقُلْ");
    expect(form({ root: qwl, tense: "imperative", person: "anta" })).toBe("قُلْ");
    expect(form({ root: qwl, tense: "imperative", person: "anti" })).toBe("قُولِي");
    expect(form({ root: qwl, tense: "imperative", person: "antum" })).toBe("قُولُوا");
  });

  it("قال past مجهول shortens with kasra on still endings", () => {
    expect(form({ root: qwl, voice: "passive", person: "hunna" })).toBe("قِلْنَ");
    expect(form({ root: qwl, voice: "passive", person: "ana" })).toBe("قِلْتُ");
  });

  it("باع and خاف follow yeh / fariha quality", () => {
    expect(form({ root: by3, formIBab: "daraba", person: "huwa" })).toBe("بَاعَ");
    expect(form({ root: by3, formIBab: "daraba", person: "ana" })).toBe("بِعْتُ");
    expect(form({ root: by3, formIBab: "daraba", tense: "present" })).toBe("يَبِيعُ");
    expect(form({ root: by3, formIBab: "daraba", tense: "imperative", person: "anti" })).toBe("بِيعِي");
    expect(form({ root: xwf, formIBab: "fariha", person: "huwa" })).toBe("خَافَ");
    expect(form({ root: xwf, formIBab: "fariha", voice: "passive" })).toBe("خِيفَ");
    expect(form({ root: xwf, formIBab: "fariha", person: "ana" })).toBe("خِفْتُ");
    expect(form({ root: xwf, formIBab: "fariha", tense: "present" })).toBe("يَخَافُ");
  });

  it("Form IV أجوف أراد", () => {
    const rwd = ["ر", "و", "د"] as [string, string, string];
    expect(form({ root: rwd, form: 4, person: "huwa" })).toBe("أَرَادَ");
    expect(form({ root: rwd, form: 4, person: "ana" })).toBe("أَرَدْتُ");
    expect(form({ root: rwd, form: 4, tense: "present" })).toBe("يُرِيدُ");
    expect(form({ root: rwd, form: 4, voice: "passive" })).toBe("أُرِيدَ");
    expect(form({ root: rwd, form: 4, tense: "imperative", person: "anta" })).toBe("أَرِدْ");
    expect(form({ root: rwd, form: 4, tense: "imperative", person: "anti" })).toBe("أَرِيدِي");
  });

  it("Form IV / X أجوف command keeps the form prefix", () => {
    const qwm = ["ق", "و", "م"] as [string, string, string];
    const xwf = ["خ", "و", "ف"] as [string, string, string];
    expect(form({ root: qwm, form: 4, tense: "imperative", person: "anta" })).toBe("أَقِمْ");
    expect(form({ root: qwm, form: 4, tense: "imperative", person: "anti" })).toBe("أَقِيمِي");
    expect(form({ root: xwf, form: 4, formIBab: "fariha", tense: "imperative", person: "anta" })).toBe("أَخِفْ");
    expect(form({ root: qwm, form: 10, tense: "imperative", person: "anti" })).toBe("اِسْتَقِيمِي");
  });
});

describe("other weakness types", () => {
  it("مثال وعد drops waw in present", () => {
    const root = ["و", "ع", "د"] as [string, string, string];
    expect(form({ root, formIBab: "daraba" })).toBe("وَعَدَ");
    expect(form({ root, formIBab: "daraba", tense: "present" })).toBe("يَعِدُ");
    expect(form({ root, formIBab: "daraba", tense: "imperative", person: "anta" })).toBe("عِدْ");
    expect(form({ root, formIBab: "daraba", tense: "present", voice: "passive" })).toBe("يُوْعَدُ");
  });

  it("ناقص دعا / رمى", () => {
    const d3w = ["د", "ع", "و"] as [string, string, string];
    const rmy = ["ر", "م", "ي"] as [string, string, string];
    expect(form({ root: d3w, person: "huwa" })).toBe("دَعَا");
    expect(form({ root: d3w, person: "hiya" })).toBe("دَعَتْ");
    expect(form({ root: d3w, person: "ana" })).toBe("دَعَوْتُ");
    expect(form({ root: rmy, formIBab: "daraba", person: "huwa" })).toBe("رَمَى");
    expect(form({ root: rmy, formIBab: "daraba", tense: "present" })).toBe("يَرْمِي");
    expect(form({ root: d3w, tense: "present" })).toBe("يَدْعُو");
    expect(form({ root: d3w, tense: "present", mood: "jussive" })).toBe("يَدْعُ");
    expect(form({ root: d3w, tense: "present", person: "hum" })).toBe("يَدْعُونَ");
    expect(form({ root: d3w, tense: "present", person: "anti" })).toBe("تَدْعِينَ");
    expect(form({ root: d3w, voice: "passive" })).toBe("دُعِيَ");
    expect(form({ root: d3w, tense: "present", voice: "passive" })).toBe("يُدْعَى");
    expect(form({ root: rmy, formIBab: "daraba", tense: "present", person: "hum" })).toBe("يَرْمُونَ");
    expect(form({ root: rmy, formIBab: "daraba", tense: "present", person: "anti" })).toBe("تَرْمِينَ");
    expect(form({ root: rmy, formIBab: "daraba", voice: "passive" })).toBe("رُمِيَ");
    expect(form({ root: d3w, form: 10 })).toBe("اِسْتَدْعَى");
    expect(form({ root: d3w, form: 10, tense: "present" })).toBe("يَسْتَدْعِي");
    expect(form({ root: rmy, form: 4 })).toBe("أَرْمَى");
    expect(form({ root: rmy, form: 4, tense: "present" })).toBe("يُرْمِي");
    expect(form({ root: d3w, tense: "imperative", person: "anta" })).toBe("اُدْعُ");
    expect(form({ root: d3w, tense: "imperative", person: "anti" })).toBe("اُدْعِي");
    expect(form({ root: d3w, voice: "passive", person: "hiya" })).toBe("دُعِيَتْ");
    expect(form({ root: d3w, tense: "present", voice: "passive", person: "hum" })).toBe("يُدْعَوْنَ");
    expect(form({ root: d3w, tense: "present", voice: "passive", person: "anti" })).toBe("تُدْعَيْنَ");
    expect(form({ root: d3w, form: 10, tense: "present", person: "hunna" })).toBe("يَسْتَدْعِيْنَ");
    expect(form({ root: d3w, form: 10, tense: "present", person: "huma_m" })).toBe("يَسْتَدْعِيَانِ");
    expect(form({ root: d3w, tense: "present", person: "huma_m" })).toBe("يَدْعُوَانِ");
  });

  it("مضاعف مدّ assimilates when vowelled", () => {
    const root = ["م", "د", "د"] as [string, string, string];
    expect(form({ root, person: "huwa" })).toBe("مَدَّ");
    expect(form({ root, person: "ana" })).toBe("مَدَدْتُ");
    expect(form({ root, tense: "present" })).toBe("يَمُدُّ");
  });

  it("مضاعف Form VIII keeps sukun on ف", () => {
    const root = ["م", "د", "د"] as [string, string, string];
    expect(form({ root, form: 8 })).toBe("اِمْتَدَّ");
    expect(form({ root, form: 8, tense: "present" })).toBe("يَمْتَدُّ");
  });

  it("مهموز أخذ command is irregular", () => {
    const root = ["أ", "خ", "ذ"] as [string, string, string];
    expect(form({ root, person: "huwa" })).toBe("أَخَذَ");
    expect(form({ root, tense: "imperative", person: "anta" })).toBe("خُذْ");
    expect(form({ root, tense: "present", person: "ana" })).toBe("آخُذُ");
  });

  it("مهموز أخذ Form VIII assimilates to اتَّخذ", () => {
    const root = ["أ", "خ", "ذ"] as [string, string, string];
    expect(form({ root, form: 8 })).toBe("اِتَّخَذَ");
    expect(form({ root, form: 8, tense: "present" })).toBe("يَتَّخِذُ");
    expect(form({ root, form: 8, tense: "imperative", person: "anta" })).toBe("اِتَّخِذْ");
  });

  it("seats hamza on yeh after kasra and on the line after alif", () => {
    const qrA = ["ق", "ر", "أ"] as [string, string, string];
    const sAl = ["س", "أ", "ل"] as [string, string, string];
    expect(form({ root: qrA, formIBab: "fataha", voice: "passive" })).toBe("قُرِئَ");
    expect(form({ root: qrA, form: 4, tense: "present" })).toBe("يُقْرِئُ");
    expect(form({ root: sAl, formIBab: "fataha", form: 6 })).toBe("تَسَاءَلَ");
    expect(form({ root: sAl, formIBab: "fataha", voice: "passive" })).toBe("سُئِلَ");
    expect(form({ root: ["أ", "خ", "ذ"], voice: "passive" })).toBe("أُخِذَ");
  });
});

describe("quiz normalization", () => {
  it("ignores harakat when comparing answers", () => {
    expect(stripHarakat("كَتَبَ")).toBe("كتب");
  });
});
