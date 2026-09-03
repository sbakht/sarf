import {
  ALEF,
  ALEF_MADDA,
  ALEF_HAMZA_ABOVE,
  ALEF_HAMZA_BELOW,
  ALEF_MAKSURA,
  DAMMA,
  FATHA,
  HAMZA,
  KASRA,
  SHADDA,
  SUKUN,
  TEH,
  WAW,
  WAW_HAMZA,
  YEH,
  YEH_HAMZA,
  isHamzaLetter,
  isWeakLetter,
  stripHarakat,
  withMarks,
} from "./harakat";
import {
  consOf,
  findKind,
  findLastKind,
  marksOf,
  slot,
  surfaceOf,
} from "./slots";
import type {
  ConjugateInput,
  FormIBab,
  FormId,
  MorphemeSlot,
  Mutation,
  PersonId,
  Tense,
  Voice,
  WeaknessType,
} from "./types";

function hasSukun(item: MorphemeSlot): boolean {
  return marksOf(item).includes(SUKUN);
}

function hasShadda(item: MorphemeSlot): boolean {
  return marksOf(item).includes(SHADDA);
}

function vowelOf(item: MorphemeSlot): string | null {
  for (const mark of marksOf(item)) {
    if (mark === FATHA || mark === DAMMA || mark === KASRA) return mark;
  }
  return null;
}

function rewrite(
  item: MorphemeSlot,
  letter: string,
  ...marks: string[]
): MorphemeSlot {
  return slot(withMarks(letter, ...marks), item.kind);
}

export function inferWeakness(root: [string, string, string]): WeaknessType {
  const [f, a, l] = root;
  if (a === l) return "mudaf";
  if (isWeakLetter(f)) return "mithal";
  if (isWeakLetter(a)) return "ajwaf";
  if (isWeakLetter(l)) return "naqis";
  if (isHamzaLetter(f)) return "mahmuz_f";
  if (isHamzaLetter(a)) return "mahmuz_a";
  if (isHamzaLetter(l)) return "mahmuz_l";
  return "sound";
}

function formIPastAjwafShort(middle: string, bab: FormIBab): string {
  if (bab === "fariha" || bab === "hasiba") return KASRA;
  if (bab === "karuma") return DAMMA;
  if (middle === YEH) return KASRA;
  return DAMMA;
}

function applyAjwaf(
  slots: MorphemeSlot[],
  ctx: {
    tense: Tense;
    form: FormId;
    bab: FormIBab;
    root: [string, string, string];
    voice: Voice;
  },
): { slots: MorphemeSlot[]; mutations: Mutation[] } {
  if (
    ctx.form === 2 ||
    ctx.form === 3 ||
    ctx.form === 5 ||
    ctx.form === 6 ||
    ctx.form === 9
  ) {
    return { slots, mutations: [] };
  }

  const aIdx = slots.findIndex(
    (item) =>
      item.kind === "a" && isWeakLetter(consOf(item)) && !hasShadda(item),
  );
  const fIdx = findKind(slots, "f");
  const lIdx = findLastKind(slots, "l");
  if (aIdx < 0 || fIdx < 0 || lIdx < 0) return { slots, mutations: [] };

  const A = slots[aIdx];
  const F = slots[fIdx];
  const L = slots[lIdx];
  // Imperative runs applyAjwaf twice; skip a hollow letter that is already a mater.
  if (vowelOf(A) === null && !hasSukun(A)) {
    return { slots, mutations: [] };
  }
  const from = surfaceOf(slots);
  const next = slots.map((item) => ({ ...item }));

  if (hasSukun(L)) {
    const shortV =
      ctx.tense === "past" && ctx.form === 1
        ? ctx.voice === "passive"
          ? KASRA
          : formIPastAjwafShort(ctx.root[1], ctx.bab)
        : (vowelOf(A) ?? FATHA);
    next.splice(aIdx, 1);
    const newF = next.findIndex((item) => item.kind === "f");
    next[newF] = rewrite(next[newF], consOf(next[newF]), shortV);
    const to = surfaceOf(next);
    return {
      slots: next,
      mutations: [
        {
          rule: "أجوف: the middle radical drops when the third letter is still (sukūn), and the first letter takes a short vowel.",
          from,
          to,
        },
      ],
    };
  }

  if (ctx.tense === "past") {
    if (ctx.voice === "passive") {
      next[fIdx] = rewrite(F, consOf(F), KASRA);
      next[aIdx] = rewrite(A, YEH);
    } else {
      if (hasSukun(F)) {
        next[fIdx] = rewrite(F, consOf(F), FATHA);
      }
      next[aIdx] = rewrite(A, ALEF);
    }
  } else {
    const v = vowelOf(A) ?? FATHA;
    const mater = v === DAMMA ? WAW : v === KASRA ? YEH : ALEF;
    if (hasSukun(F)) {
      next[fIdx] = rewrite(F, consOf(F), v);
    }
    next[aIdx] = rewrite(A, mater);
  }
  const to = surfaceOf(next);
  return {
    slots: next,
    mutations: [
      {
        rule: "أجوف: a vowelled hollow radical and a vowelled third letter collapse into a long vowel.",
        from,
        to,
      },
    ],
  };
}

function applyMithal(
  slots: MorphemeSlot[],
  ctx: {
    tense: Tense;
    form: FormId;
    root: [string, string, string];
    voice: Voice;
  },
): { slots: MorphemeSlot[]; mutations: Mutation[] } {
  if (ctx.form !== 1) return { slots, mutations: [] };
  if (ctx.tense === "past") return { slots, mutations: [] };
  if (ctx.voice === "passive") return { slots, mutations: [] };
  if (ctx.root[0] !== WAW) return { slots, mutations: [] };

  const fIdx = findKind(slots, "f");
  if (fIdx < 0) return { slots, mutations: [] };
  const F = slots[fIdx];
  if (consOf(F) !== WAW) return { slots, mutations: [] };
  if (!hasSukun(F) && ctx.tense !== "imperative")
    return { slots, mutations: [] };

  const from = surfaceOf(slots);
  const next = slots.filter((_, i) => i !== fIdx);
  return {
    slots: next,
    mutations: [
      {
        rule: "مثال واوي: the initial wāw drops in Form I present and command.",
        from,
        to: surfaceOf(next),
      },
    ],
  };
}

function precedingIdx(slots: MorphemeSlot[], idx: number): number {
  for (let i = idx - 1; i >= 0; i -= 1) {
    if (slots[i].kind !== "suffix") return i;
  }
  return -1;
}

function suffixStartsWith(slots: MorphemeSlot[], letter: string): boolean {
  const suf = slots.find((item) => item.kind === "suffix");
  return !!suf && consOf(suf) === letter;
}

function replaceVowel(item: MorphemeSlot, vowel: string): MorphemeSlot {
  const keep = [...marksOf(item)].filter(
    (mark) => mark !== FATHA && mark !== DAMMA && mark !== KASRA,
  );
  return rewrite(item, consOf(item), ...keep, vowel);
}

function applyNaqis(
  slots: MorphemeSlot[],
  ctx: {
    tense: Tense;
    form: FormId;
    person: PersonId;
    mood?: string;
    root: [string, string, string];
    voice: Voice;
  },
): { slots: MorphemeSlot[]; mutations: Mutation[] } {
  const lIdx = findLastKind(slots, "l");
  if (lIdx < 0) return { slots, mutations: [] };
  const L = slots[lIdx];
  const original = ctx.root[2];
  if (consOf(L) === ALEF || consOf(L) === ALEF_MAKSURA)
    return { slots, mutations: [] };
  if (!isWeakLetter(consOf(L))) return { slots, mutations: [] };

  const from = surfaceOf(slots);
  const next = slots.map((item) => ({ ...item }));
  const mutations: Mutation[] = [];
  const note = (rule: string) => {
    mutations.push({ rule, from, to: surfaceOf(next) });
  };

  if (ctx.tense === "past") {
    if (ctx.voice === "passive") {
      if (ctx.person === "hum") {
        const prev = precedingIdx(next, lIdx);
        next.splice(lIdx, 1);
        if (prev >= 0) next[prev] = replaceVowel(next[prev], DAMMA);
        note("ناقص مجهول: masculine plural past is …ُوا (دُعُوا).");
        return { slots: next, mutations };
      }
      if (hasSukun(L)) {
        next[lIdx] = rewrite(L, YEH, SUKUN);
        note(
          "ناقص مجهول: the last radical is ي when the ending is still (دُعِيتُ).",
        );
        return { slots: next, mutations };
      }
      next[lIdx] = rewrite(L, YEH, FATHA);
      note("ناقص مجهول: the last radical is يَ (دُعِيَ / رُمِيَ).");
      return { slots: next, mutations };
    }
    if (ctx.person === "huwa") {
      const mater = ctx.form === 1 && original === WAW ? ALEF : ALEF_MAKSURA;
      next[lIdx] = rewrite(L, mater);
      note(
        "ناقص: in past هو the last radical becomes alif (ا) or alif maqṣūra (ى).",
      );
      return { slots: next, mutations };
    }
    if (ctx.person === "hiya" || ctx.person === "huma_f") {
      next.splice(lIdx, 1);
      note(
        "ناقص: before feminine ت the final weak letter drops (دَعَتْ / رَمَتْ).",
      );
      return { slots: next, mutations };
    }
    if (ctx.person === "hum") {
      next[lIdx] = rewrite(L, WAW, SUKUN);
      const suf = next.findIndex(
        (item) => item.kind === "suffix" && consOf(item) === WAW,
      );
      if (suf >= 0) next.splice(suf, 1);
      note("ناقص: masculine plural past is …َوْا.");
      return { slots: next, mutations };
    }
    if (hasSukun(L)) {
      next[lIdx] = rewrite(L, original, SUKUN);
      note(
        "ناقص: when the last letter is still, the original و / ي returns (دَعَوْتُ / رَمَيْتُ).",
      );
      return { slots: next, mutations };
    }
  }

  if (ctx.tense === "present" || ctx.tense === "imperative") {
    const still = hasSukun(L);
    const mood = ctx.mood ?? "indicative";
    if (
      still &&
      (ctx.person === "huwa" ||
        ctx.person === "hiya" ||
        ctx.person === "anta" ||
        ctx.person === "ana" ||
        ctx.person === "nahnu")
    ) {
      next.splice(lIdx, 1);
      note(
        "ناقص: in the jussive / command the final weak letter drops (يَدْعُ / يَرْمِ).",
      );
      return { slots: next, mutations };
    }
    if (still && (ctx.person === "hunna" || ctx.person === "antunna")) {
      const prev = precedingIdx(next, lIdx);
      const v = prev >= 0 ? vowelOf(next[prev]) : null;
      const letter = v === KASRA ? YEH : WAW;
      next[lIdx] = rewrite(L, letter, SUKUN);
      note(
        "ناقص: before نَ the last radical is the matching glide (يَدْعُوْنَ / يَسْتَدْعِينَ).",
      );
      return { slots: next, mutations };
    }
    if (suffixStartsWith(next, WAW)) {
      const prev = precedingIdx(next, lIdx);
      const prevV = prev >= 0 ? vowelOf(next[prev]) : null;
      next.splice(lIdx, 1);
      if (prev >= 0 && prevV === KASRA)
        next[prev] = replaceVowel(next[prev], DAMMA);
      if (prevV === FATHA) {
        const suf = next.findIndex(
          (item) => item.kind === "suffix" && consOf(item) === WAW,
        );
        if (suf >= 0) next[suf] = rewrite(next[suf], WAW, SUKUN);
      }
      note(
        "ناقص: before a و ending the last radical drops (يَدْعُونَ / يَرْمُونَ).",
      );
      return { slots: next, mutations };
    }
    if (suffixStartsWith(next, YEH)) {
      const prev = precedingIdx(next, lIdx);
      const prevV = prev >= 0 ? vowelOf(next[prev]) : null;
      next.splice(lIdx, 1);
      if (prev >= 0 && prevV === DAMMA)
        next[prev] = replaceVowel(next[prev], KASRA);
      if (prevV === FATHA) {
        const suf = next.findIndex(
          (item) => item.kind === "suffix" && consOf(item) === YEH,
        );
        if (suf >= 0) next[suf] = rewrite(next[suf], YEH, SUKUN);
      }
      note(
        "ناقص: before a ي ending the last radical drops (تَدْعِينَ / تَرْمِينَ).",
      );
      return { slots: next, mutations };
    }
    if (suffixStartsWith(next, ALEF) && !still) {
      const prev = precedingIdx(next, lIdx);
      const v = prev >= 0 ? vowelOf(next[prev]) : null;
      const letter = v === DAMMA ? WAW : YEH;
      next[lIdx] = rewrite(L, letter, FATHA);
      note(
        "ناقص: in the dual the last radical is a vowelled glide (يَدْعُوَانِ / يَسْتَدْعِيَانِ).",
      );
      return { slots: next, mutations };
    }
    const hasSuffix = next.some((item) => item.kind === "suffix");
    if (!still && mood === "indicative" && !hasSuffix) {
      const prev = precedingIdx(next, lIdx);
      const v = (prev >= 0 ? vowelOf(next[prev]) : null) ?? vowelOf(L);
      const mater = v === DAMMA ? WAW : v === KASRA ? YEH : ALEF_MAKSURA;
      next[lIdx] = rewrite(L, mater);
      note(
        "ناقص: in the indicative the last radical is a long vowel letter (يَدْعُو / يَرْمِي / يُدْعَى).",
      );
      return { slots: next, mutations };
    }
  }

  return { slots, mutations: [] };
}

function applyMudaf(
  slots: MorphemeSlot[],
  ctx: { root: [string, string, string]; form: FormId },
): { slots: MorphemeSlot[]; mutations: Mutation[] } {
  if (ctx.root[1] !== ctx.root[2]) return { slots, mutations: [] };
  const aIdx = findKind(slots, "a");
  const fIdx = findKind(slots, "f");
  const lIdx = findLastKind(slots, "l");
  if (aIdx < 0 || lIdx < 0 || aIdx === lIdx) return { slots, mutations: [] };
  const A = slots[aIdx];
  const L = slots[lIdx];
  if (hasShadda(A)) return { slots, mutations: [] };
  if (hasSukun(L)) return { slots, mutations: [] };

  const from = surfaceOf(slots);
  const v = vowelOf(L) ?? FATHA;
  const next = slots.map((item) => ({ ...item }));
  // Form I present يَمُدُّ moves the theme onto ف; Form VIII اِمْتَدَّ keeps فْ.
  if (ctx.form === 1 && fIdx >= 0 && hasSukun(next[fIdx])) {
    const theme = vowelOf(A) ?? v;
    next[fIdx] = rewrite(next[fIdx], consOf(next[fIdx]), theme);
  }
  next[aIdx] = rewrite(A, consOf(A), SHADDA, v);
  next.splice(lIdx, 1);
  return {
    slots: next,
    mutations: [
      {
        rule: "مضاعف: the identical second and third radicals assimilate with shadda when the last letter is vowelled.",
        from,
        to: surfaceOf(next),
      },
    ],
  };
}

const IMPERATIVE_EXCEPTIONS: Record<string, Record<PersonId, string>> = {
  أخذ: {
    anta: "خُذْ",
    anti: "خُذِي",
    antuma_m: "خُذَا",
    antuma_f: "خُذَا",
    antum: "خُذُوا",
    antunna: "خُذْنَ",
    huwa: "",
    huma_m: "",
    hum: "",
    hiya: "",
    huma_f: "",
    hunna: "",
    ana: "",
    nahnu: "",
  },
};

function strongerVowel(a: string | null, b: string | null): string | null {
  if (a === KASRA || b === KASRA) return KASRA;
  if (a === DAMMA || b === DAMMA) return DAMMA;
  if (a === FATHA || b === FATHA) return FATHA;
  return null;
}

function seatOfHamza(
  prev: MorphemeSlot | undefined,
  hamza: MorphemeSlot,
  isLast: boolean,
): string {
  const hv = vowelOf(hamza);
  if (!prev) {
    return hv === KASRA ? ALEF_HAMZA_BELOW : ALEF_HAMZA_ABOVE;
  }
  const prevV = vowelOf(prev);
  if (consOf(prev) === ALEF && prevV === null && !hasSukun(prev)) return HAMZA;
  // Final hamza after fatha stays on alif (يَقْرَأُ), even when the mood vowel is damma.
  if (isLast && prevV === FATHA) return ALEF_HAMZA_ABOVE;
  if (hv === null) {
    if (prevV === KASRA) return YEH_HAMZA;
    if (prevV === DAMMA) return WAW_HAMZA;
    return ALEF_HAMZA_ABOVE;
  }
  const rank = strongerVowel(prevV, hv);
  if (rank === KASRA) return YEH_HAMZA;
  if (rank === DAMMA) return WAW_HAMZA;
  return ALEF_HAMZA_ABOVE;
}

function seatRadicalHamzas(slots: MorphemeSlot[]): MorphemeSlot[] {
  const next = slots.map((item) => ({ ...item }));
  for (let i = 0; i < next.length; i += 1) {
    const item = next[i];
    if (item.kind !== "f" && item.kind !== "a" && item.kind !== "l") continue;
    if (!isHamzaLetter(consOf(item))) continue;
    const prev = i > 0 ? next[i - 1] : undefined;
    const seat = seatOfHamza(prev, item, item.kind === "l");
    if (seat !== consOf(item)) {
      next[i] = rewrite(item, seat, ...marksOf(item));
    }
  }
  return next;
}

function applyMahmuz(
  slots: MorphemeSlot[],
  ctx: {
    tense: Tense;
    person: PersonId;
    root: [string, string, string];
    form: FormId;
    voice: Voice;
  },
): { slots: MorphemeSlot[]; mutations: Mutation[] } {
  const key = ctx.root.join("");
  if (
    ctx.form === 1 &&
    ctx.tense === "imperative" &&
    IMPERATIVE_EXCEPTIONS[key]?.[ctx.person]
  ) {
    const to = IMPERATIVE_EXCEPTIONS[key][ctx.person];
    if (!to) return { slots, mutations: [] };
    return {
      slots: [slot(to, "extra")],
      mutations: [
        {
          rule: "مهموز: أَخَذَ has an irregular command (خُذْ).",
          from: surfaceOf(slots),
          to,
        },
      ],
    };
  }

  const mutations: Mutation[] = [];
  let next = slots.map((item) => ({ ...item }));
  const from = surfaceOf(slots);

  if (
    ctx.form === 1 &&
    ctx.tense === "present" &&
    ctx.person === "ana" &&
    ctx.voice === "active"
  ) {
    const pIdx = findKind(next, "prefix");
    const fIdx = findKind(next, "f");
    if (
      pIdx >= 0 &&
      fIdx >= 0 &&
      isHamzaLetter(consOf(next[pIdx])) &&
      isHamzaLetter(consOf(next[fIdx])) &&
      hasSukun(next[fIdx])
    ) {
      next[pIdx] = slot(ALEF_MADDA, "prefix");
      next.splice(fIdx, 1);
      mutations.push({
        rule: "مهموز: أَ + أْ contracts to madda (آخُذُ).",
        from,
        to: surfaceOf(next),
      });
    }
  }

  const seated = seatRadicalHamzas(next);
  if (surfaceOf(seated) !== surfaceOf(next)) {
    mutations.push({
      rule: "همزة: the seat of hamza follows the neighbouring vowel (ئ after kasra, ء after alif).",
      from: surfaceOf(next),
      to: surfaceOf(seated),
    });
    next = seated;
  }

  return { slots: next, mutations };
}

const FORM_VIII_IDGHAM = new Set(["ت", "ث", "د", "ذ", "ز", "ص", "ض", "ط", "ظ"]);

export function applyFormVIIIIdgham(slots: MorphemeSlot[]): {
  slots: MorphemeSlot[];
  mutations: Mutation[];
} {
  const fIdx = findKind(slots, "f");
  if (fIdx < 0) return { slots, mutations: [] };
  const extraIdx = slots.findIndex(
    (item, i) => i > fIdx && item.kind === "extra" && consOf(item) === TEH,
  );
  if (extraIdx < 0) return { slots, mutations: [] };
  const F = slots[fIdx];
  const fCons = consOf(F);
  if (!FORM_VIII_IDGHAM.has(fCons) && !isHamzaLetter(fCons))
    return { slots, mutations: [] };

  const from = surfaceOf(slots);
  const vowel = vowelOf(slots[extraIdx]) ?? FATHA;
  const next = slots.map((item) => ({ ...item }));
  const letter = isHamzaLetter(fCons) ? TEH : fCons;
  next[fIdx] = rewrite(F, letter, SHADDA, vowel);
  next.splice(extraIdx, 1);
  return {
    slots: next,
    mutations: [
      {
        rule: "Form VIII: the infixed ت assimilates to the first radical (اطَّلَبَ, اتَّخَذَ).",
        from,
        to: surfaceOf(next),
      },
    ],
  };
}

export function applyWeakness(
  slots: MorphemeSlot[],
  input: ConjugateInput,
  weakness: WeaknessType,
): { slots: MorphemeSlot[]; mutations: Mutation[] } {
  const bab = input.formIBab ?? "nasara";
  const ctx = {
    tense: input.tense,
    form: input.form,
    bab,
    person: input.person,
    mood: input.mood,
    root: input.root,
    voice: input.voice,
  };

  if (weakness === "sound") return { slots, mutations: [] };

  if (weakness === "ajwaf") return applyAjwaf(slots, ctx);
  if (weakness === "mithal") return applyMithal(slots, ctx);
  if (weakness === "naqis") return applyNaqis(slots, ctx);
  if (weakness === "mudaf") return applyMudaf(slots, ctx);
  if (weakness.startsWith("mahmuz")) return applyMahmuz(slots, ctx);
  return { slots, mutations: [] };
}

export function changedFromAnalog(actual: string, analog: string): boolean {
  return stripHarakat(actual) !== stripHarakat(analog);
}
