import { conjugate } from "./conjugate";
import { ALEF_MADDA, SUKUN } from "./harakat";
import { ROOTS, rootArabic } from "./lexicon";
import { uniqueOptions } from "./person-quiz";
import type { LessonStep } from "./primer";
import { pick, type QuizChoice } from "./quiz";
import { marksOf } from "./slots";
import type {
  ConjugateResult,
  FormId,
  Mood,
  PersonId,
  RootEntry,
  Tense,
  Voice,
  WeaknessType,
} from "./types";

export type CourseKind =
  "sound" | "mithal" | "ajwaf" | "naqis" | "mudaf" | "mahmuz";

export type ChapterId =
  | "sound-vs-weak"
  | "classify"
  | "mithal"
  | "ajwaf"
  | "naqis"
  | "mudaf"
  | "mahmuz"
  | "mastery";

export type ChapterMeta = {
  id: ChapterId;
  title: string;
  arabic: string;
  summary: string;
};

export type MutationId =
  | "none"
  | "mithal-drop"
  | "ajwaf-long"
  | "ajwaf-short"
  | "naqis-alif"
  | "naqis-drop"
  | "naqis-mater"
  | "mudaf-shadda"
  | "mahmuz-seat"
  | "mahmuz-madda"
  | "mahmuz-command";

export type WeakPrompt = {
  chapter: ChapterId;
  root: RootEntry;
  form: FormId;
  tense: Tense;
  voice: Voice;
  person: PersonId;
  mood?: Mood;
  label: string;
};

type CourseCell = {
  tense: Tense;
  person: PersonId;
  mood?: Mood;
  voice?: Voice;
  label: string;
};

export const COURSE_CHAPTERS: ChapterMeta[] = [
  {
    id: "sound-vs-weak",
    title: "Sound vs weak",
    arabic: "الصحيح والمعتل",
    summary:
      "You already conjugate سالم verbs. Weak letters و and ي (and the sister types مضاعف and مهموز) are what make a cell leave that template.",
  },
  {
    id: "classify",
    title: "Name the type",
    arabic: "أنواع الإعلال",
    summary:
      "Read a three-letter root and name it: سالم، مثال، أجوف، ناقص، مضاعف، or مهموز.",
  },
  {
    id: "mithal",
    title: "Mithal",
    arabic: "المثال",
    summary:
      "First radical و (or ي). Form I past looks sound; present and command drop the wāw.",
  },
  {
    id: "ajwaf",
    title: "Ajwaf",
    arabic: "الأجوف",
    summary:
      "Hollow middle radical. Two vowels collapse into a long vowel; a still last letter shortens it.",
  },
  {
    id: "naqis",
    title: "Naqis",
    arabic: "الناقص",
    summary:
      "Final و or ي. Past هو becomes alif; some endings drop it; some bring the original letter back.",
  },
  {
    id: "mudaf",
    title: "Mudaf",
    arabic: "المضاعف",
    summary:
      "Identical second and third radicals. They assimilate with shadda when the last letter is vowelled.",
  },
  {
    id: "mahmuz",
    title: "Mahmuz",
    arabic: "المهموز",
    summary:
      "A hamza in the root. Most cells follow the sound template; seating, madda, and a few commands are the exceptions.",
  },
  {
    id: "mastery",
    title: "Mastery",
    arabic: "الإتقان",
    summary:
      "Mixed types, tenses, and moods. Name the type, then pick the actual surface from the sound analog.",
  },
];

export const FIRST_CHAPTER_ID = COURSE_CHAPTERS[0]!.id;
export const WEAK_ROUNDS = 6;
export const MASTERY_ROUNDS = 8;

export const COURSE_KINDS: CourseKind[] = [
  "sound",
  "mithal",
  "ajwaf",
  "naqis",
  "mudaf",
  "mahmuz",
];

export const COURSE_KIND_META: Record<
  CourseKind,
  { arabic: string; title: string; hint: string }
> = {
  sound: {
    arabic: "سالم",
    title: "Sound",
    hint: "three stable consonants — the pattern you already know",
  },
  mithal: {
    arabic: "مثال",
    title: "Mithal",
    hint: "first radical و or ي",
  },
  ajwaf: {
    arabic: "أجوف",
    title: "Ajwaf",
    hint: "middle radical و or ي",
  },
  naqis: {
    arabic: "ناقص",
    title: "Naqis",
    hint: "last radical و or ي",
  },
  mudaf: {
    arabic: "مضاعف",
    title: "Mudaf",
    hint: "second and third radicals are the same letter",
  },
  mahmuz: {
    arabic: "مهموز",
    title: "Mahmuz",
    hint: "a hamza sits in the root",
  },
};

export const MUTATION_META: Record<
  MutationId,
  { primary: string; secondary: string }
> = {
  none: {
    primary: "No change",
    secondary: "this cell matches the sound analog",
  },
  "mithal-drop": {
    primary: "Initial wāw drops",
    secondary: "Form I present and command: وَعَدَ → يَعِدُ → عِدْ",
  },
  "ajwaf-long": {
    primary: "Hollow letter becomes a long vowel",
    secondary: "both the middle and last letters are vowelled: قَالَ / يَقُولُ",
  },
  "ajwaf-short": {
    primary: "Hollow letter drops and the first letter shortens",
    secondary: "the last letter is still: قُلْتُ / يَقُلْ / قُلْ",
  },
  "naqis-alif": {
    primary: "Final weak letter becomes alif",
    secondary: "past هو: دَعَا / رَمَى",
  },
  "naqis-drop": {
    primary: "Final weak letter drops",
    secondary: "before ت, before و/ي endings, and in the jussive/command",
  },
  "naqis-mater": {
    primary: "Final weak letter is a long vowel letter",
    secondary: "indicative: يَدْعُو / يَرْمِي / يُدْعَى",
  },
  "mudaf-shadda": {
    primary: "Identical radicals assimilate with shadda",
    secondary: "last letter is vowelled: مَدَّ / يَمُدُّ",
  },
  "mahmuz-seat": {
    primary: "Hamza changes seat",
    secondary: "ئ after kasra, ء after alif, and so on",
  },
  "mahmuz-madda": {
    primary: "أ + أْ contracts to madda",
    secondary: "Form I present I: آخُذُ",
  },
  "mahmuz-command": {
    primary: "Irregular command",
    secondary: "أَخَذَ → خُذْ",
  },
};

export function getChapter(id: string): ChapterMeta | undefined {
  return COURSE_CHAPTERS.find((chapter) => chapter.id === id);
}

export function nextChapter(id: ChapterId): ChapterMeta | undefined {
  const index = COURSE_CHAPTERS.findIndex((chapter) => chapter.id === id);
  if (index < 0) return undefined;
  return COURSE_CHAPTERS[index + 1];
}

export function chapterRounds(id: ChapterId): number {
  return id === "mastery" ? MASTERY_ROUNDS : WEAK_ROUNDS;
}

export function courseKind(weakness: WeaknessType): CourseKind {
  if (
    weakness === "mahmuz_f" ||
    weakness === "mahmuz_a" ||
    weakness === "mahmuz_l"
  ) {
    return "mahmuz";
  }
  return weakness;
}

function formIRoots(): RootEntry[] {
  return ROOTS.filter((root) => root.forms.includes(1));
}

function rootsFor(chapter: ChapterId): RootEntry[] {
  const all = formIRoots();
  if (
    chapter === "sound-vs-weak" ||
    chapter === "classify" ||
    chapter === "mastery"
  ) {
    return all;
  }
  return all.filter((root) => courseKind(root.weakness) === chapter);
}

const PAST_HUWA: CourseCell = {
  tense: "past",
  person: "huwa",
  label: "ماضي هو",
};

const MITHAL_CELLS: CourseCell[] = [
  PAST_HUWA,
  { tense: "present", person: "huwa", label: "مضارع هو" },
  { tense: "present", person: "ana", label: "مضارع أنا" },
  { tense: "imperative", person: "anta", label: "أمر أنتَ" },
  {
    tense: "present",
    person: "huwa",
    voice: "passive",
    label: "مضارع مجهول هو",
  },
];

const AJWAF_CELLS: CourseCell[] = [
  PAST_HUWA,
  { tense: "past", person: "ana", label: "ماضي أنا" },
  { tense: "past", person: "hunna", label: "ماضي هن" },
  { tense: "present", person: "huwa", label: "مضارع هو" },
  {
    tense: "present",
    person: "huwa",
    mood: "jussive",
    label: "مجزوم هو",
  },
  { tense: "present", person: "hunna", label: "مضارع هن" },
  { tense: "imperative", person: "anta", label: "أمر أنتَ" },
  { tense: "imperative", person: "anti", label: "أمر أنتِ" },
  { tense: "past", person: "huwa", voice: "passive", label: "ماضي مجهول هو" },
];

const NAQIS_CELLS: CourseCell[] = [
  PAST_HUWA,
  { tense: "past", person: "hiya", label: "ماضي هي" },
  { tense: "past", person: "ana", label: "ماضي أنا" },
  { tense: "past", person: "hum", label: "ماضي هم" },
  { tense: "present", person: "huwa", label: "مضارع هو" },
  {
    tense: "present",
    person: "huwa",
    mood: "jussive",
    label: "مجزوم هو",
  },
  { tense: "present", person: "hum", label: "مضارع هم" },
  { tense: "present", person: "anti", label: "مضارع أنتِ" },
  { tense: "imperative", person: "anta", label: "أمر أنتَ" },
  { tense: "past", person: "huwa", voice: "passive", label: "ماضي مجهول هو" },
];

const MUDAF_CELLS: CourseCell[] = [
  PAST_HUWA,
  { tense: "past", person: "ana", label: "ماضي أنا" },
  { tense: "present", person: "huwa", label: "مضارع هو" },
  { tense: "present", person: "hunna", label: "مضارع هن" },
  { tense: "imperative", person: "anta", label: "أمر أنتَ" },
];

const MAHMUZ_CELLS: CourseCell[] = [
  PAST_HUWA,
  { tense: "present", person: "ana", label: "مضارع أنا" },
  { tense: "imperative", person: "anta", label: "أمر أنتَ" },
  { tense: "present", person: "huwa", label: "مضارع هو" },
  { tense: "past", person: "huwa", voice: "passive", label: "ماضي مجهول هو" },
];

const MIXED_CELLS: CourseCell[] = [
  ...AJWAF_CELLS,
  { tense: "past", person: "hiya", label: "ماضي هي" },
  { tense: "past", person: "hum", label: "ماضي هم" },
  { tense: "present", person: "hum", label: "مضارع هم" },
  { tense: "present", person: "anti", label: "مضارع أنتِ" },
  { tense: "present", person: "ana", label: "مضارع أنا" },
  {
    tense: "present",
    person: "huwa",
    voice: "passive",
    label: "مضارع مجهول هو",
  },
];

function cellsFor(chapter: ChapterId): CourseCell[] {
  switch (chapter) {
    case "classify":
      return [PAST_HUWA];
    case "mithal":
      return MITHAL_CELLS;
    case "ajwaf":
      return AJWAF_CELLS;
    case "naqis":
      return NAQIS_CELLS;
    case "mudaf":
      return MUDAF_CELLS;
    case "mahmuz":
      return MAHMUZ_CELLS;
    default:
      return MIXED_CELLS;
  }
}

function applyCell(
  chapter: ChapterId,
  root: RootEntry,
  cell: CourseCell,
): WeakPrompt {
  const prompt: WeakPrompt = {
    chapter,
    root,
    form: 1,
    tense: cell.tense,
    voice: cell.voice ?? "active",
    person: cell.person,
    label: cell.label,
  };
  if (cell.mood) prompt.mood = cell.mood;
  return prompt;
}

export function conjugateCourse(
  prompt: WeakPrompt,
  analog = false,
): ConjugateResult {
  return conjugate({
    root: prompt.root.letters,
    form: prompt.form,
    formIBab: prompt.root.formIBab,
    tense: prompt.tense,
    voice: prompt.voice,
    person: prompt.person,
    mood: prompt.mood ?? "indicative",
    weakness: analog ? "sound" : prompt.root.weakness,
    asSoundAnalog: analog,
  });
}

function lastRadicalStill(result: ConjugateResult): boolean {
  const last = result.slots.filter((slot) => slot.kind === "l").at(-1);
  return !!last && marksOf(last).includes(SUKUN);
}

export function mutationId(prompt: WeakPrompt): MutationId {
  const actual = conjugateCourse(prompt);
  const analog = conjugateCourse(prompt, true);
  if (!actual.available || actual.surface === analog.surface) return "none";

  const kind = courseKind(prompt.root.weakness);
  if (kind === "mithal") return "mithal-drop";
  if (kind === "ajwaf") {
    return lastRadicalStill(analog) ? "ajwaf-short" : "ajwaf-long";
  }
  if (kind === "naqis") {
    if (prompt.tense === "past" && prompt.person === "huwa")
      return "naqis-alif";
    if (
      prompt.tense === "present" &&
      (prompt.mood ?? "indicative") === "indicative" &&
      (prompt.person === "huwa" ||
        prompt.person === "hiya" ||
        prompt.person === "ana" ||
        prompt.person === "nahnu")
    ) {
      return "naqis-mater";
    }
    return "naqis-drop";
  }
  if (kind === "mudaf") return "mudaf-shadda";
  if (prompt.tense === "imperative" && prompt.root.id === "axd") {
    return "mahmuz-command";
  }
  if (actual.surface.includes(ALEF_MADDA)) return "mahmuz-madda";
  return "mahmuz-seat";
}

function promptSeed(prompt: WeakPrompt): string {
  return [
    prompt.chapter,
    prompt.root.id,
    prompt.form,
    prompt.tense,
    prompt.voice,
    prompt.person,
    prompt.mood ?? "",
  ].join(":");
}

function neighborSurfaces(prompt: WeakPrompt): string[] {
  const out: string[] = [];
  for (const cell of cellsFor(prompt.chapter)) {
    const other = applyCell(prompt.chapter, prompt.root, cell);
    if (
      other.tense === prompt.tense &&
      other.person === prompt.person &&
      other.voice === prompt.voice &&
      (other.mood ?? "indicative") === (prompt.mood ?? "indicative")
    ) {
      continue;
    }
    const result = conjugateCourse(other);
    if (result.available && result.surface !== "—") out.push(result.surface);
  }
  return out;
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function surfaceChoices(prompt: WeakPrompt): QuizChoice[] {
  const actual = conjugateCourse(prompt).surface;
  const analog = conjugateCourse(prompt, true).surface;
  const picked: string[] = [actual];
  const seen = new Set<string>([actual]);
  if (analog && analog !== "—" && analog !== actual) {
    picked.push(analog);
    seen.add(analog);
  }
  for (const surface of neighborSurfaces(prompt)) {
    if (picked.length >= 4) break;
    if (!surface || surface === "—" || seen.has(surface)) continue;
    picked.push(surface);
    seen.add(surface);
  }
  const seed = promptSeed(prompt);
  picked.sort((a, b) => hash(seed + a) - hash(seed + b));
  return picked.map((surface) => ({
    id: surface,
    primary: surface,
    arabic: true,
    correct: surface === actual,
    feedback: actual,
  }));
}

function classifyKindChoices(kind: CourseKind): QuizChoice[] {
  return COURSE_KINDS.map((id) => {
    const meta = COURSE_KIND_META[id];
    return {
      id,
      primary: meta.arabic,
      arabic: true,
      secondary: `${meta.title} — ${meta.hint}`,
      correct: id === kind,
      feedback: `${meta.arabic} · ${meta.title}`,
    };
  });
}

function chapterRules(chapter: ChapterId): MutationId[] {
  switch (chapter) {
    case "mithal":
      return ["none", "mithal-drop"];
    case "ajwaf":
      return ["none", "ajwaf-long", "ajwaf-short"];
    case "naqis":
      return ["none", "naqis-alif", "naqis-drop", "naqis-mater"];
    case "mudaf":
      return ["none", "mudaf-shadda"];
    case "mahmuz":
      return ["none", "mahmuz-seat", "mahmuz-madda", "mahmuz-command"];
    default:
      return Object.keys(MUTATION_META) as MutationId[];
  }
}

function ruleChoices(prompt: WeakPrompt): QuizChoice[] {
  const correct = mutationId(prompt);
  const pool = [...new Set([correct, ...chapterRules(prompt.chapter)])];
  const picked = uniqueOptions(
    correct,
    pool,
    Math.min(4, pool.length),
    promptSeed(prompt),
    (id) => id,
  );
  return picked.map((id) => {
    const meta = MUTATION_META[id];
    return {
      id,
      primary: meta.primary,
      secondary: meta.secondary,
      correct: id === correct,
      feedback: meta.primary,
    };
  });
}

function needsSurfaceDistractors(chapter: ChapterId): boolean {
  return (
    chapter === "mithal" ||
    chapter === "ajwaf" ||
    chapter === "naqis" ||
    chapter === "mudaf" ||
    chapter === "mahmuz" ||
    chapter === "mastery"
  );
}

export function makeWeakPrompt(
  chapter: ChapterId,
  rng: () => number = Math.random,
): WeakPrompt | null {
  const roots = rootsFor(chapter);
  const cells = cellsFor(chapter);
  if (roots.length === 0 || cells.length === 0) return null;

  for (let i = 0; i < 40; i += 1) {
    const prompt = applyCell(chapter, pick(roots, rng), pick(cells, rng));
    const actual = conjugateCourse(prompt);
    const analog = conjugateCourse(prompt, true);
    if (!actual.available || actual.surface === "—") continue;
    if (!analog.available || analog.surface === "—") continue;
    if (needsSurfaceDistractors(chapter) && surfaceChoices(prompt).length < 2) {
      continue;
    }
    return prompt;
  }
  return null;
}

export function buildWeakSteps(prompt: WeakPrompt): LessonStep[] {
  const kind = courseKind(prompt.root.weakness);
  const actual = conjugateCourse(prompt);
  const analog = conjugateCourse(prompt, true);
  const changed = actual.surface !== analog.surface;

  if (prompt.chapter === "sound-vs-weak") {
    return [
      {
        id: "family",
        title: `Is ${rootArabic(prompt.root)} the سالم pattern you already know?`,
        choices: [
          {
            id: "sound",
            primary: "سالم",
            arabic: true,
            secondary: "three stable consonants",
            correct: kind === "sound",
            feedback:
              kind === "sound"
                ? "سالم — conjugate it like كتب"
                : `${COURSE_KIND_META[kind].arabic} — not the sound pattern`,
          },
          {
            id: "mutation",
            primary: "Needs a mutation family",
            secondary: "مثال / أجوف / ناقص / مضاعف / مهموز",
            correct: kind !== "sound",
            feedback:
              kind === "sound"
                ? "سالم — conjugate it like كتب"
                : `${COURSE_KIND_META[kind].arabic} — not the sound pattern`,
          },
        ],
      },
      {
        id: "changed",
        title: `Did ${prompt.label} leave the sound analog?`,
        choices: [
          {
            id: "same",
            primary: "Same as analog",
            secondary: analog.surface,
            secondaryArabic: true,
            correct: !changed,
            feedback: changed
              ? `Changed — actual ${actual.surface}`
              : `Same as analog ${analog.surface}`,
          },
          {
            id: "changed",
            primary: "A mutation applied",
            secondary: "the surface is not the sound template",
            correct: changed,
            feedback: changed
              ? `Changed — actual ${actual.surface}`
              : `Same as analog ${analog.surface}`,
          },
        ],
      },
    ];
  }

  if (prompt.chapter === "classify") {
    return [
      {
        id: "kind",
        title: `Name the type for ${rootArabic(prompt.root)}`,
        choices: classifyKindChoices(kind),
      },
    ];
  }

  if (prompt.chapter === "mastery") {
    return [
      {
        id: "kind",
        title: `Name the type for ${rootArabic(prompt.root)}`,
        choices: classifyKindChoices(kind),
      },
      {
        id: "actual",
        title: `What actually surfaces for ${prompt.label}?`,
        choices: surfaceChoices(prompt),
      },
    ];
  }

  return [
    {
      id: "actual",
      title: `What actually surfaces for ${prompt.label}?`,
      choices: surfaceChoices(prompt),
    },
    {
      id: "rule",
      title: "Which rule applied?",
      choices: ruleChoices(prompt),
    },
  ];
}
