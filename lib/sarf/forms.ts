import { DAMMA, FATHA, KASRA } from "./harakat";
import type { FormIBab, FormId } from "./types";

export const ROMAN_FORMS: Record<FormId, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
};

export type FormMeta = {
  id: FormId;
  roman: string;
  waznPast: string;
  waznPresent: string;
  meaning: string;
  traditional: string;
};

export const FORMS: FormMeta[] = [
  {
    id: 1,
    roman: "I",
    waznPast: "فَعَلَ",
    waznPresent: "يَفْعُلُ",
    meaning: "Base meaning of the root",
    traditional: "الجرّد",
  },
  {
    id: 2,
    roman: "II",
    waznPast: "فَعَّلَ",
    waznPresent: "يُفَعِّلُ",
    meaning: "Intensive, causative, or estimative",
    traditional: "فَعَّلَ",
  },
  {
    id: 3,
    roman: "III",
    waznPast: "فَاعَلَ",
    waznPresent: "يُفَاعِلُ",
    meaning: "Attempt, directed action, or reciprocal",
    traditional: "فَاعَلَ",
  },
  {
    id: 4,
    roman: "IV",
    waznPast: "أَفْعَلَ",
    waznPresent: "يُفْعِلُ",
    meaning: "Causative / factitive",
    traditional: "أَفْعَلَ",
  },
  {
    id: 5,
    roman: "V",
    waznPast: "تَفَعَّلَ",
    waznPresent: "يَتَفَعَّلُ",
    meaning: "Reflexive or effective of Form II",
    traditional: "تَفَعَّلَ",
  },
  {
    id: 6,
    roman: "VI",
    waznPast: "تَفَاعَلَ",
    waznPresent: "يَتَفَاعَلُ",
    meaning: "Reciprocal of Form III, or pretence",
    traditional: "تَفَاعَلَ",
  },
  {
    id: 7,
    roman: "VII",
    waznPast: "اِنْفَعَلَ",
    waznPresent: "يَنْفَعِلُ",
    meaning: "Passive or reflexive of Form I",
    traditional: "اِنْفَعَلَ",
  },
  {
    id: 8,
    roman: "VIII",
    waznPast: "اِفْتَعَلَ",
    waznPresent: "يَفْتَعِلُ",
    meaning: "Reflexive / middle voice of Form I",
    traditional: "اِفْتَعَلَ",
  },
  {
    id: 9,
    roman: "IX",
    waznPast: "اِفْعَلَّ",
    waznPresent: "يَفْعَلُّ",
    meaning: "Colors and bodily defects",
    traditional: "اِفْعَلَّ",
  },
  {
    id: 10,
    roman: "X",
    waznPast: "اِسْتَفْعَلَ",
    waznPresent: "يَسْتَفْعِلُ",
    meaning: "Request, seek, or consider as",
    traditional: "اِسْتَفْعَلَ",
  },
];

export const FORM_BY_ID: Record<FormId, FormMeta> = Object.fromEntries(
  FORMS.map((form) => [form.id, form]),
) as Record<FormId, FormMeta>;

export type BabMeta = {
  id: FormIBab;
  nameAr: string;
  nameEn: string;
  waznPast: string;
  waznPresent: string;
  pastA: string;
  presentA: string;
};

export const FORM_I_ABWAB: BabMeta[] = [
  {
    id: "nasara",
    nameAr: "بَابُ نَصَرَ",
    nameEn: "nasara (a/u)",
    waznPast: "فَعَلَ",
    waznPresent: "يَفْعُلُ",
    pastA: FATHA,
    presentA: DAMMA,
  },
  {
    id: "daraba",
    nameAr: "بَابُ ضَرَبَ",
    nameEn: "daraba (a/i)",
    waznPast: "فَعَلَ",
    waznPresent: "يَفْعِلُ",
    pastA: FATHA,
    presentA: KASRA,
  },
  {
    id: "fataha",
    nameAr: "بَابُ فَتَحَ",
    nameEn: "fataha (a/a)",
    waznPast: "فَعَلَ",
    waznPresent: "يَفْعَلُ",
    pastA: FATHA,
    presentA: FATHA,
  },
  {
    id: "fariha",
    nameAr: "بَابُ فَرِحَ",
    nameEn: "fariha (i/a)",
    waznPast: "فَعِلَ",
    waznPresent: "يَفْعَلُ",
    pastA: KASRA,
    presentA: FATHA,
  },
  {
    id: "karuma",
    nameAr: "بَابُ كَرُمَ",
    nameEn: "karuma (u/u)",
    waznPast: "فَعُلَ",
    waznPresent: "يَفْعُلُ",
    pastA: DAMMA,
    presentA: DAMMA,
  },
  {
    id: "hasiba",
    nameAr: "بَابُ حَسِبَ",
    nameEn: "hasiba (i/i)",
    waznPast: "فَعِلَ",
    waznPresent: "يَفْعِلُ",
    pastA: KASRA,
    presentA: KASRA,
  },
];

export const BAB_BY_ID: Record<FormIBab, BabMeta> = Object.fromEntries(
  FORM_I_ABWAB.map((bab) => [bab.id, bab]),
) as Record<FormIBab, BabMeta>;

export function formLabel(
  form: FormId,
  mode: "form" | "wazn" | "both",
): string {
  const meta = FORM_BY_ID[form];
  switch (mode) {
    case "form":
      return `Form ${meta.roman}`;
    case "wazn":
      return meta.waznPast;
    case "both":
      return `Form ${meta.roman} · ${meta.waznPast}`;
  }
}

export function formQuizChoice(
  form: FormId,
  mode: "form" | "wazn" | "both",
): {
  primary: string;
  secondary?: string;
  arabic?: boolean;
  secondaryArabic?: boolean;
  feedback: string;
} {
  const meta = FORM_BY_ID[form];
  switch (mode) {
    case "form":
      return {
        primary: `Form ${meta.roman}`,
        feedback: `Form ${meta.roman}`,
      };
    case "wazn":
      return {
        primary: meta.waznPast,
        arabic: true,
        feedback: meta.waznPast,
      };
    case "both":
      return {
        primary: `Form ${meta.roman}`,
        secondary: meta.waznPast,
        secondaryArabic: true,
        feedback: `Form ${meta.roman} · ${meta.waznPast}`,
      };
  }
}
