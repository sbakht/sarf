import { PERSON_BY_ID } from "./persons";
import type { PersonId, Tense } from "./types";

/** 2nd dual has one form for both genders, so the quiz treats them as one slot. */
export function quizPersonKey(person: PersonId): PersonId {
  return person === "antuma_f" ? "antuma_m" : person;
}

/**
 * Present-tense verb forms that share a surface (تَفْعَلُ / تَفْعَلَانِ).
 * Past and command keep these persons distinct.
 */
export function quizPersonGroup(person: PersonId, tense?: Tense): string {
  const key = quizPersonKey(person);
  if (tense === "present") {
    if (key === "antuma_m" || person === "huma_f") return "present_t_dual";
    if (person === "anta" || person === "hiya") return "present_t_sg";
  }
  return key;
}

export function linkedPersons(person: PersonId): PersonId[] {
  if (person === "antuma_m" || person === "antuma_f")
    return ["antuma_m", "antuma_f"];
  return [person];
}

export function isCorrectQuizPerson(
  answer: PersonId,
  prompt: PersonId,
  tense?: Tense,
): boolean {
  return quizPersonGroup(answer, tense) === quizPersonGroup(prompt, tense);
}

export function personQuizEnglish(person: PersonId): string {
  const info = PERSON_BY_ID[quizPersonKey(person)];
  if (info.person === 2 && info.number === "du") return "you (m/f)";
  return info.english;
}

/** Pronoun + English for the Person step, naming both readings when the mudari is ambiguous. */
export function personQuizFeedback(person: PersonId, tense?: Tense): string {
  if (tense === "present") {
    const key = quizPersonKey(person);
    if (key === "antuma_m" || person === "huma_f") {
      return `${PERSON_BY_ID.antuma_m.arabic} / ${PERSON_BY_ID.huma_f.arabic} · ${personQuizEnglish("antuma_m")} or they two (f)`;
    }
    if (person === "anta" || person === "hiya") {
      return `${PERSON_BY_ID.anta.arabic} / ${PERSON_BY_ID.hiya.arabic} · ${personQuizEnglish("anta")} or ${personQuizEnglish("hiya")}`;
    }
  }
  return `${PERSON_BY_ID[quizPersonKey(person)].arabic} · ${personQuizEnglish(person)}`;
}

export function uniqueOptions<T>(
  correct: T,
  pool: T[],
  count: number,
  seed: string,
  key: (item: T) => string,
): T[] {
  const seen = new Set<string>([key(correct)]);
  const rest: T[] = [];
  for (const item of pool) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    rest.push(item);
  }
  rest.sort((a, b) => hash(seed + key(a)) - hash(seed + key(b)));
  const picked = [correct, ...rest.slice(0, Math.max(0, count - 1))];
  picked.sort(
    (a, b) => hash(`${seed}:order:${key(a)}`) - hash(`${seed}:order:${key(b)}`),
  );
  return picked;
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
