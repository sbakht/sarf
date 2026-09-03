import { DAMMA, FATHA, KASRA, SUKUN } from "./harakat";
import type { PersonId } from "./types";

export type PersonInfo = {
  id: PersonId;
  arabic: string;
  english: string;
  person: 1 | 2 | 3;
  number: "sg" | "du" | "pl";
  gender: "m" | "f" | "c";
};

export const PERSONS: PersonInfo[] = [
  {
    id: "huwa",
    arabic: "هُوَ",
    english: "he",
    person: 3,
    number: "sg",
    gender: "m",
  },
  {
    id: "huma_m",
    arabic: "هُمَا",
    english: "they two (m)",
    person: 3,
    number: "du",
    gender: "m",
  },
  {
    id: "hum",
    arabic: "هُمْ",
    english: "they (m)",
    person: 3,
    number: "pl",
    gender: "m",
  },
  {
    id: "hiya",
    arabic: "هِيَ",
    english: "she",
    person: 3,
    number: "sg",
    gender: "f",
  },
  {
    id: "huma_f",
    arabic: "هُمَا",
    english: "they two (f)",
    person: 3,
    number: "du",
    gender: "f",
  },
  {
    id: "hunna",
    arabic: "هُنَّ",
    english: "they (f)",
    person: 3,
    number: "pl",
    gender: "f",
  },
  {
    id: "anta",
    arabic: "أَنْتَ",
    english: "you (m)",
    person: 2,
    number: "sg",
    gender: "m",
  },
  {
    id: "antuma_m",
    arabic: "أَنْتُمَا",
    english: "you two",
    person: 2,
    number: "du",
    gender: "c",
  },
  {
    id: "antum",
    arabic: "أَنْتُمْ",
    english: "you (m pl)",
    person: 2,
    number: "pl",
    gender: "m",
  },
  {
    id: "anti",
    arabic: "أَنْتِ",
    english: "you (f)",
    person: 2,
    number: "sg",
    gender: "f",
  },
  {
    id: "antuma_f",
    arabic: "أَنْتُمَا",
    english: "you two",
    person: 2,
    number: "du",
    gender: "c",
  },
  {
    id: "antunna",
    arabic: "أَنْتُنَّ",
    english: "you (f pl)",
    person: 2,
    number: "pl",
    gender: "f",
  },
  {
    id: "ana",
    arabic: "أَنَا",
    english: "I",
    person: 1,
    number: "sg",
    gender: "c",
  },
  {
    id: "nahnu",
    arabic: "نَحْنُ",
    english: "we",
    person: 1,
    number: "pl",
    gender: "c",
  },
];

export const PERSON_BY_ID: Record<PersonId, PersonInfo> = Object.fromEntries(
  PERSONS.map((p) => [p.id, p]),
) as Record<PersonId, PersonInfo>;

export const SECOND_PERSONS: PersonId[] = [
  "anta",
  "antuma_m",
  "antum",
  "anti",
  "antuma_f",
  "antunna",
];

export function isSecondPerson(person: PersonId): boolean {
  return SECOND_PERSONS.includes(person);
}

export type Ending = {
  lastVowel: string;
  suffix: string;
};

export const PAST_ENDINGS: Record<PersonId, Ending> = {
  huwa: { lastVowel: FATHA, suffix: "" },
  huma_m: { lastVowel: FATHA, suffix: "ا" },
  hum: { lastVowel: DAMMA, suffix: "وا" },
  hiya: { lastVowel: FATHA, suffix: "تْ" },
  huma_f: { lastVowel: FATHA, suffix: "تَا" },
  hunna: { lastVowel: SUKUN, suffix: "نَ" },
  anta: { lastVowel: SUKUN, suffix: "تَ" },
  antuma_m: { lastVowel: SUKUN, suffix: "تُمَا" },
  antum: { lastVowel: SUKUN, suffix: "تُمْ" },
  anti: { lastVowel: SUKUN, suffix: "تِ" },
  antuma_f: { lastVowel: SUKUN, suffix: "تُمَا" },
  antunna: { lastVowel: SUKUN, suffix: "تُنَّ" },
  ana: { lastVowel: SUKUN, suffix: "تُ" },
  nahnu: { lastVowel: SUKUN, suffix: "نَا" },
};

export const PRESENT_PREFIX: Record<PersonId, string> = {
  huwa: "ي",
  huma_m: "ي",
  hum: "ي",
  hiya: "ت",
  huma_f: "ت",
  hunna: "ي",
  anta: "ت",
  antuma_m: "ت",
  antum: "ت",
  anti: "ت",
  antuma_f: "ت",
  antunna: "ت",
  ana: "أ",
  nahnu: "ن",
};

export const PRESENT_ENDINGS = {
  indicative: {
    huwa: { lastVowel: DAMMA, suffix: "" },
    huma_m: { lastVowel: FATHA, suffix: "انِ" },
    hum: { lastVowel: DAMMA, suffix: "ونَ" },
    hiya: { lastVowel: DAMMA, suffix: "" },
    huma_f: { lastVowel: FATHA, suffix: "انِ" },
    hunna: { lastVowel: SUKUN, suffix: "نَ" },
    anta: { lastVowel: DAMMA, suffix: "" },
    antuma_m: { lastVowel: FATHA, suffix: "انِ" },
    antum: { lastVowel: DAMMA, suffix: "ونَ" },
    anti: { lastVowel: KASRA, suffix: "ينَ" },
    antuma_f: { lastVowel: FATHA, suffix: "انِ" },
    antunna: { lastVowel: SUKUN, suffix: "نَ" },
    ana: { lastVowel: DAMMA, suffix: "" },
    nahnu: { lastVowel: DAMMA, suffix: "" },
  } satisfies Record<PersonId, Ending>,
  subjunctive: {
    huwa: { lastVowel: FATHA, suffix: "" },
    huma_m: { lastVowel: FATHA, suffix: "ا" },
    hum: { lastVowel: DAMMA, suffix: "وا" },
    hiya: { lastVowel: FATHA, suffix: "" },
    huma_f: { lastVowel: FATHA, suffix: "ا" },
    hunna: { lastVowel: SUKUN, suffix: "نَ" },
    anta: { lastVowel: FATHA, suffix: "" },
    antuma_m: { lastVowel: FATHA, suffix: "ا" },
    antum: { lastVowel: DAMMA, suffix: "وا" },
    anti: { lastVowel: KASRA, suffix: "ي" },
    antuma_f: { lastVowel: FATHA, suffix: "ا" },
    antunna: { lastVowel: SUKUN, suffix: "نَ" },
    ana: { lastVowel: FATHA, suffix: "" },
    nahnu: { lastVowel: FATHA, suffix: "" },
  } satisfies Record<PersonId, Ending>,
  jussive: {
    huwa: { lastVowel: SUKUN, suffix: "" },
    huma_m: { lastVowel: FATHA, suffix: "ا" },
    hum: { lastVowel: DAMMA, suffix: "وا" },
    hiya: { lastVowel: SUKUN, suffix: "" },
    huma_f: { lastVowel: FATHA, suffix: "ا" },
    hunna: { lastVowel: SUKUN, suffix: "نَ" },
    anta: { lastVowel: SUKUN, suffix: "" },
    antuma_m: { lastVowel: FATHA, suffix: "ا" },
    antum: { lastVowel: DAMMA, suffix: "وا" },
    anti: { lastVowel: KASRA, suffix: "ي" },
    antuma_f: { lastVowel: FATHA, suffix: "ا" },
    antunna: { lastVowel: SUKUN, suffix: "نَ" },
    ana: { lastVowel: SUKUN, suffix: "" },
    nahnu: { lastVowel: SUKUN, suffix: "" },
  } satisfies Record<PersonId, Ending>,
};

export const TABLE_ROWS: { label: string; cells: PersonId[] }[] = [
  { label: "3rd m", cells: ["huwa", "huma_m", "hum"] },
  { label: "3rd f", cells: ["hiya", "huma_f", "hunna"] },
  { label: "2nd m", cells: ["anta", "antuma_m", "antum"] },
  { label: "2nd f", cells: ["anti", "antuma_f", "antunna"] },
  { label: "1st", cells: ["ana", "nahnu"] },
];
