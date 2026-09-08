import { describe, expect, it } from "vitest";
import { FORMS, bilingualQuizChoice, formLabel, formQuizChoice } from "./forms";

describe("form labels", () => {
  it("names Form I المجرد, not الجرّد", () => {
    expect(FORMS[0]?.traditional).toBe("المجرد");
  });

  it("builds bilingual quiz labels from English and Arabic", () => {
    expect(bilingualQuizChoice("Past", "ماضي", "form")).toEqual({
      primary: "Past",
      feedback: "Past",
    });
    expect(bilingualQuizChoice("Past", "ماضي", "wazn")).toEqual({
      primary: "ماضي",
      arabic: true,
      feedback: "ماضي",
    });
    expect(bilingualQuizChoice("Past", "ماضي", "both")).toEqual({
      primary: "Past",
      secondary: "ماضي",
      secondaryArabic: true,
      feedback: "Past · ماضي",
    });
  });

  it("labels Form I by English, wazn, or both", () => {
    expect(formLabel(1, "form")).toBe("Form I");
    expect(formLabel(1, "wazn")).toBe("فَعَلَ");
    expect(formLabel(1, "both")).toBe("Form I · فَعَلَ");
    expect(formQuizChoice(1, "both")).toEqual({
      primary: "Form I",
      secondary: "فَعَلَ",
      secondaryArabic: true,
      feedback: "Form I · فَعَلَ",
    });
  });
});
