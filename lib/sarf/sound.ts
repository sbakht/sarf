import { BAB_BY_ID } from "./forms";
import {
  ALEF,
  ALEF_HAMZA_ABOVE,
  DAMMA,
  FATHA,
  KASRA,
  SHADDA,
  SUKUN,
  TEH,
  withMarks,
} from "./harakat";
import {
  PAST_ENDINGS,
  PRESENT_ENDINGS,
  PRESENT_PREFIX,
  isSecondPerson,
} from "./persons";
import { parseAffix, slot, surfaceOf } from "./slots";
import type {
  ConjugateInput,
  FormIBab,
  FormId,
  Mood,
  MorphemeSlot,
  PersonId,
  SlotKind,
  Tense,
  Voice,
} from "./types";

type Piece = {
  kind: SlotKind;
  letter: string;
  marks: string[];
};

function piece(kind: SlotKind, letter: string, ...marks: string[]): Piece {
  return { kind, letter, marks };
}

function toSlots(pieces: Piece[]): MorphemeSlot[] {
  return pieces.map((p) => slot(withMarks(p.letter, ...p.marks), p.kind));
}

function lastLamIndex(pieces: Piece[]): number {
  for (let i = pieces.length - 1; i >= 0; i -= 1) {
    if (pieces[i].kind === "l") return i;
  }
  return -1;
}

function setLastLamVowel(pieces: Piece[], lastVowel: string, shadda = false): Piece[] {
  const copy = pieces.map((p) => ({ ...p, marks: [...p.marks] }));
  const idx = lastLamIndex(copy);
  if (idx < 0) return copy;
  const marks = shadda ? [SHADDA, lastVowel] : [lastVowel];
  copy[idx] = { ...copy[idx], marks };
  return copy;
}

function prefixVowel(form: FormId, voice: Voice): string {
  if (voice === "passive") return DAMMA;
  if (form === 2 || form === 3 || form === 4) return DAMMA;
  return FATHA;
}

function pastThemeA(form: FormId, voice: Voice, bab: FormIBab): string {
  if (voice === "passive") {
    if (form === 1 || form === 7 || form === 8 || form === 10) return KASRA;
    if (form === 2 || form === 5) return KASRA;
    if (form === 3 || form === 6) return KASRA;
    if (form === 4) return KASRA;
    return KASRA;
  }
  if (form === 1) return BAB_BY_ID[bab].pastA;
  return FATHA;
}

function presentThemeA(form: FormId, voice: Voice, bab: FormIBab): string {
  if (voice === "passive") return FATHA;
  if (form === 1) return BAB_BY_ID[bab].presentA;
  if (form === 2 || form === 3 || form === 4 || form === 7 || form === 8 || form === 10) {
    return KASRA;
  }
  return FATHA;
}

function firstVowelPast(form: FormId, voice: Voice): string {
  if (voice === "passive") return DAMMA;
  return FATHA;
}

function buildPastStem(root: [string, string, string], form: FormId, voice: Voice, bab: FormIBab): Piece[] {
  const [f, a, l] = root;
  const aV = pastThemeA(form, voice, bab);
  const fV = firstVowelPast(form, voice);

  switch (form) {
    case 1:
      return [piece("f", f, fV), piece("a", a, aV), piece("l", l)];
    case 2:
      return [piece("f", f, fV), piece("a", a, SHADDA, aV), piece("l", l)];
    case 3:
      if (voice === "passive") {
        return [piece("f", f, DAMMA), piece("extra", "و"), piece("a", a, KASRA), piece("l", l)];
      }
      return [piece("f", f, FATHA), piece("extra", ALEF), piece("a", a, FATHA), piece("l", l)];
    case 4:
      return [
        piece("extra", ALEF_HAMZA_ABOVE, voice === "passive" ? DAMMA : FATHA),
        piece("f", f, SUKUN),
        piece("a", a, aV),
        piece("l", l),
      ];
    case 5:
      return [
        piece("extra", TEH, voice === "passive" ? DAMMA : FATHA),
        piece("f", f, voice === "passive" ? DAMMA : FATHA),
        piece("a", a, SHADDA, aV),
        piece("l", l),
      ];
    case 6:
      if (voice === "passive") {
        return [
          piece("extra", TEH, DAMMA),
          piece("f", f, DAMMA),
          piece("extra", "و"),
          piece("a", a, KASRA),
          piece("l", l),
        ];
      }
      return [
        piece("extra", TEH, FATHA),
        piece("f", f, FATHA),
        piece("extra", ALEF),
        piece("a", a, FATHA),
        piece("l", l),
      ];
    case 7:
      return [
        piece("extra", ALEF, voice === "passive" ? DAMMA : KASRA),
        piece("extra", "ن", SUKUN),
        piece("f", f, voice === "passive" ? DAMMA : FATHA),
        piece("a", a, aV),
        piece("l", l),
      ];
    case 8:
      return [
        piece("extra", ALEF, voice === "passive" ? DAMMA : KASRA),
        piece("f", f, SUKUN),
        piece("extra", TEH, voice === "passive" ? DAMMA : FATHA),
        piece("a", a, aV),
        piece("l", l),
      ];
    case 9:
      return [
        piece("extra", ALEF, KASRA),
        piece("f", f, SUKUN),
        piece("a", a, FATHA),
        piece("l", l),
      ];
    case 10:
      return [
        piece("extra", ALEF, voice === "passive" ? DAMMA : KASRA),
        piece("extra", "س", SUKUN),
        piece("extra", TEH, voice === "passive" ? DAMMA : FATHA),
        piece("f", f, SUKUN),
        piece("a", a, aV),
        piece("l", l),
      ];
  }
}

function buildPresentStem(root: [string, string, string], form: FormId, voice: Voice, bab: FormIBab): Piece[] {
  const [f, a, l] = root;
  const aV = presentThemeA(form, voice, bab);

  switch (form) {
    case 1:
      return [piece("f", f, SUKUN), piece("a", a, aV), piece("l", l)];
    case 2:
      return [piece("f", f, FATHA), piece("a", a, SHADDA, aV), piece("l", l)];
    case 3:
      return [piece("f", f, FATHA), piece("extra", ALEF), piece("a", a, aV), piece("l", l)];
    case 4:
      return [piece("f", f, SUKUN), piece("a", a, aV), piece("l", l)];
    case 5:
      return [
        piece("extra", TEH, FATHA),
        piece("f", f, FATHA),
        piece("a", a, SHADDA, aV),
        piece("l", l),
      ];
    case 6:
      return [
        piece("extra", TEH, FATHA),
        piece("f", f, FATHA),
        piece("extra", ALEF),
        piece("a", a, aV),
        piece("l", l),
      ];
    case 7:
      return [
        piece("extra", "ن", SUKUN),
        piece("f", f, FATHA),
        piece("a", a, aV),
        piece("l", l),
      ];
    case 8:
      return [
        piece("f", f, SUKUN),
        piece("extra", TEH, FATHA),
        piece("a", a, aV),
        piece("l", l),
      ];
    case 9:
      return [piece("f", f, SUKUN), piece("a", a, FATHA), piece("l", l)];
    case 10:
      return [
        piece("extra", "س", SUKUN),
        piece("extra", TEH, FATHA),
        piece("f", f, SUKUN),
        piece("a", a, aV),
        piece("l", l),
      ];
  }
}

function unravelNinth(pieces: Piece[], lastVowel: string): Piece[] {
  const copy = pieces.map((p) => ({ ...p, marks: [...p.marks] }));
  const idx = lastLamIndex(copy);
  const lam = copy[idx];
  copy[idx] = { ...lam, marks: [FATHA] };
  copy.push(piece("l", lam.letter, lastVowel));
  return copy;
}

export function buildSoundPast(
  root: [string, string, string],
  form: FormId,
  voice: Voice,
  person: PersonId,
  bab: FormIBab,
): MorphemeSlot[] {
  const ending = PAST_ENDINGS[person];
  let stem = buildPastStem(root, form, voice, bab);
  if (form === 9 && ending.lastVowel === SUKUN) {
    stem = unravelNinth(stem, ending.lastVowel);
  } else {
    stem = setLastLamVowel(stem, ending.lastVowel, form === 9);
  }
  return [...toSlots(stem), ...parseAffix(ending.suffix, "suffix")];
}

export function buildSoundPresent(
  root: [string, string, string],
  form: FormId,
  voice: Voice,
  person: PersonId,
  mood: Mood,
  bab: FormIBab,
): MorphemeSlot[] {
  const ending = PRESENT_ENDINGS[mood][person];
  const pLetter = PRESENT_PREFIX[person];
  const pVowel = prefixVowel(form, voice);
  const prefix: MorphemeSlot = slot(withMarks(pLetter, pVowel), "prefix");
  let stem = buildPresentStem(root, form, voice, bab);
  if (form === 9 && ending.lastVowel === SUKUN) {
    stem = unravelNinth(stem, ending.lastVowel);
  } else {
    stem = setLastLamVowel(stem, ending.lastVowel, form === 9);
  }
  return [prefix, ...toSlots(stem), ...parseAffix(ending.suffix, "suffix")];
}

export function toImperative(
  presentJussive: MorphemeSlot[],
  form: FormId,
  bab: FormIBab,
): MorphemeSlot[] {
  const withoutPrefix = presentJussive.filter((s) => s.kind !== "prefix");
  const first = withoutPrefix[0];
  if (!first) return withoutPrefix;
  const startsWithSukun = first.text.includes(SUKUN);

  // Form IV keeps أَ even after أجوف collapse (أَقِمْ, not قِمْ).
  if (form === 4) {
    return [slot(withMarks(ALEF_HAMZA_ABOVE, FATHA), "extra"), ...withoutPrefix];
  }

  if (!startsWithSukun) return withoutPrefix;

  const waslVowel =
    form === 1 && BAB_BY_ID[bab].presentA === DAMMA ? DAMMA : KASRA;
  return [slot(withMarks(ALEF, waslVowel), "extra"), ...withoutPrefix];
}

export function buildSoundVerb(input: ConjugateInput): MorphemeSlot[] {
  const bab = input.formIBab ?? "nasara";
  const mood = input.mood ?? "indicative";
  const { root, form, voice, person, tense } = input;

  if (tense === "imperative") {
    if (!isSecondPerson(person) || voice === "passive") return [];
    const present = buildSoundPresent(root, form, "active", person, "jussive", bab);
    return toImperative(present, form, bab);
  }

  if (tense === "past") {
    return buildSoundPast(root, form, voice, person, bab);
  }

  return buildSoundPresent(root, form, voice, person, mood, bab);
}

export function soundSurface(input: ConjugateInput): string {
  return surfaceOf(buildSoundVerb(input));
}

export type CueVowel = "fatha" | "damma" | "kasra";

export type VoiceCues = {
  /** Opening vowel of the word in the past; present uses `prefix` instead. */
  first?: CueVowel;
  /** Person-prefix vowel in the present. */
  prefix?: CueVowel;
  /** Theme vowel on ع. */
  theme: CueVowel;
};

function asCue(mark: string): CueVowel {
  if (mark === DAMMA) return "damma";
  if (mark === KASRA) return "kasra";
  return "fatha";
}

function pastOpeningVowel(form: FormId, voice: Voice): string {
  if (voice === "passive") return DAMMA;
  if (form === 7 || form === 8 || form === 9 || form === 10) return KASRA;
  return FATHA;
}

export function hasMorphologicalPassive(form: FormId, tense: Tense = "past"): boolean {
  if (tense === "imperative") return false;
  if (form === 9) return false;
  return true;
}

export function voiceCues(opts: {
  form: FormId;
  tense: Exclude<Tense, "imperative">;
  voice: Voice;
  formIBab?: FormIBab;
}): VoiceCues {
  const bab = opts.formIBab ?? "nasara";
  if (opts.tense === "present") {
    return {
      prefix: asCue(prefixVowel(opts.form, opts.voice)),
      theme: asCue(presentThemeA(opts.form, opts.voice, bab)),
    };
  }
  return {
    first: asCue(pastOpeningVowel(opts.form, opts.voice)),
    theme: asCue(pastThemeA(opts.form, opts.voice, bab)),
  };
}

export function diagnoseVoiceFromCues(
  tense: Exclude<Tense, "imperative">,
  cues: Pick<VoiceCues, "first" | "prefix" | "theme">,
): Voice {
  if (tense === "present") {
    if (cues.prefix === "fatha") return "active";
    if (cues.theme === "kasra") return "active";
    return "passive";
  }
  if (cues.first === "damma" && cues.theme === "kasra") return "passive";
  return "active";
}
