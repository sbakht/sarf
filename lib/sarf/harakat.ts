export const FATHA = "\u064E";
export const DAMMA = "\u064F";
export const KASRA = "\u0650";
export const SUKUN = "\u0652";
export const SHADDA = "\u0651";

export const ALEF = "\u0627";
export const ALEF_MADDA = "\u0622";
export const ALEF_HAMZA_ABOVE = "\u0623";
export const ALEF_HAMZA_BELOW = "\u0625";
export const ALEF_MAKSURA = "\u0649";
export const WAW = "\u0648";
export const YEH = "\u064A";
export const WAW_HAMZA = "\u0624";
export const YEH_HAMZA = "\u0626";
export const TEH = "\u062A";
export const NOON = "\u0646";
export const SEEN = "\u0633";
export const HAMZA = "\u0621";

const MARK_RE = /[\u064B-\u065F\u0670]/g;

export function isMark(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return (c >= 0x064b && c <= 0x065f) || c === 0x0670;
}

export function stripHarakat(value: string): string {
  return value.replace(MARK_RE, "");
}

export function normalizeForAnswer(value: string): string {
  return stripHarakat(value)
    .replace(/[\u0622\u0623\u0625]/g, ALEF)
    .replace(/\s+/g, "")
    .replace(/ـ/g, "");
}

export function isWeakLetter(letter: string): boolean {
  return letter === WAW || letter === YEH;
}

export function isHamzaLetter(letter: string): boolean {
  return (
    letter === HAMZA ||
    letter === ALEF_HAMZA_ABOVE ||
    letter === ALEF_HAMZA_BELOW ||
    letter === ALEF_MADDA ||
    letter === WAW_HAMZA ||
    letter === YEH_HAMZA
  );
}

export function withMarks(letter: string, ...marks: string[]): string {
  return letter + marks.join("");
}
