import { describe, expect, it } from "vitest";
import { conjugate } from "./conjugate";
import { diagnoseVoiceFromCues, hasMorphologicalPassive, voiceCues } from "./sound";

const ktb = ["ك", "ت", "ب"] as [string, string, string];
const ilm = ["ع", "ل", "م"] as [string, string, string];
const qwl = ["ق", "و", "ل"] as [string, string, string];

describe("voice cues", () => {
  it("reads Form I present يَكْتُبُ as معلوم from a fatha prefix", () => {
    const cues = voiceCues({ form: 1, tense: "present", voice: "active" });
    expect(cues.prefix).toBe("fatha");
    expect(diagnoseVoiceFromCues("present", cues)).toBe("active");
    expect(conjugate({ root: ktb, form: 1, tense: "present", voice: "active", person: "huwa" }).surface).toBe(
      "يَكْتُبُ",
    );
  });

  it("reads Form I present يُكْتَبُ as مجهول from damma + fatha", () => {
    const cues = voiceCues({ form: 1, tense: "present", voice: "passive" });
    expect(cues.prefix).toBe("damma");
    expect(cues.theme).toBe("fatha");
    expect(diagnoseVoiceFromCues("present", cues)).toBe("passive");
    expect(conjugate({ root: ktb, form: 1, tense: "present", voice: "passive", person: "huwa" }).surface).toBe(
      "يُكْتَبُ",
    );
  });

  it("reads Form II present يُعَلِّمُ as معلوم from damma + kasra", () => {
    const cues = voiceCues({ form: 2, tense: "present", voice: "active" });
    expect(cues.prefix).toBe("damma");
    expect(cues.theme).toBe("kasra");
    expect(diagnoseVoiceFromCues("present", cues)).toBe("active");
    expect(conjugate({ root: ilm, form: 2, tense: "present", voice: "active", person: "huwa" }).surface).toBe(
      "يُعَلِّمُ",
    );
  });

  it("reads كَتَبَ as معلوم and كُتِبَ as مجهول", () => {
    const active = voiceCues({ form: 1, tense: "past", voice: "active" });
    const passive = voiceCues({ form: 1, tense: "past", voice: "passive" });
    expect(active.first).toBe("fatha");
    expect(diagnoseVoiceFromCues("past", active)).toBe("active");
    expect(passive.first).toBe("damma");
    expect(passive.theme).toBe("kasra");
    expect(diagnoseVoiceFromCues("past", passive)).toBe("passive");
    expect(conjugate({ root: ktb, form: 1, tense: "past", voice: "active", person: "huwa" }).surface).toBe("كَتَبَ");
    expect(conjugate({ root: ktb, form: 1, tense: "past", voice: "passive", person: "huwa" }).surface).toBe("كُتِبَ");
  });

  it("does not call باب فرح فَعِلَ مجهول", () => {
    const cues = voiceCues({ form: 1, tense: "past", voice: "active", formIBab: "fariha" });
    expect(cues.first).toBe("fatha");
    expect(cues.theme).toBe("kasra");
    expect(diagnoseVoiceFromCues("past", cues)).toBe("active");
  });

  it("treats Form IX and أمر as having no morphological مجهول", () => {
    expect(hasMorphologicalPassive(9)).toBe(false);
    expect(hasMorphologicalPassive(1, "imperative")).toBe(false);
    expect(hasMorphologicalPassive(1, "past")).toBe(true);
    expect(conjugate({ root: ktb, form: 1, tense: "imperative", voice: "passive", person: "anta" }).available).toBe(
      false,
    );
  });
});

describe("أجوف past مجهول", () => {
  it("keeps the sound analog on the damma-kasra tree, then surfaces as قِيلَ", () => {
    const analog = conjugate({
      root: qwl,
      form: 1,
      formIBab: "nasara",
      tense: "past",
      voice: "passive",
      person: "huwa",
      asSoundAnalog: true,
    });
    expect(analog.surface).toBe("قُوِلَ");
    expect(diagnoseVoiceFromCues("past", voiceCues({ form: 1, tense: "past", voice: "passive" }))).toBe("passive");

    const actual = conjugate({
      root: qwl,
      form: 1,
      formIBab: "nasara",
      tense: "past",
      voice: "passive",
      person: "huwa",
    });
    expect(actual.surface).toBe("قِيلَ");
    expect(actual.soundAnalog?.surface).toBe("قُوِلَ");
  });
});
