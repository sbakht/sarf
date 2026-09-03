import { PERSONS } from "./persons";
import {
  buildSoundPresent,
  buildSoundVerb,
  hasMorphologicalPassive,
  toImperative,
} from "./sound";
import { surfaceOf } from "./slots";
import { applyFormVIIIIdgham, applyWeakness, inferWeakness } from "./weak";
import type { ConjugateInput, ConjugateResult, PersonId } from "./types";

function unavailable(weakness: ConjugateResult["weakness"]): ConjugateResult {
  return {
    surface: "—",
    slots: [],
    available: false,
    weakness,
    mutations: [],
  };
}

function withFormVIII(
  slots: ConjugateResult["slots"],
  mutations: ConjugateResult["mutations"],
  analog: { surface: string; slots: ConjugateResult["slots"] },
  input: ConjugateInput,
  weakness: ConjugateResult["weakness"],
): ConjugateResult {
  const idgham =
    input.asSoundAnalog || input.form !== 8
      ? { slots, mutations: [] }
      : applyFormVIIIIdgham(slots);
  const surface = surfaceOf(idgham.slots);
  return {
    surface,
    slots: idgham.slots,
    available: true,
    weakness,
    mutations: [...mutations, ...idgham.mutations],
    soundAnalog: analog.surface !== surface ? analog : undefined,
  };
}

export function conjugate(input: ConjugateInput): ConjugateResult {
  const weakness = input.weakness ?? inferWeakness(input.root);
  const bab = input.formIBab ?? "nasara";

  if (
    input.voice === "passive" &&
    !hasMorphologicalPassive(input.form, input.tense)
  ) {
    return unavailable(weakness);
  }

  if (input.tense === "imperative") {
    if (input.voice === "passive") return unavailable(weakness);
    const second: PersonId[] = [
      "anta",
      "anti",
      "antuma_m",
      "antuma_f",
      "antum",
      "antunna",
    ];
    if (!second.includes(input.person)) return unavailable(weakness);

    const presentInput: ConjugateInput = {
      ...input,
      tense: "present",
      voice: "active",
      mood: "jussive",
    };
    const presentSound = buildSoundPresent(
      input.root,
      input.form,
      "active",
      input.person,
      "jussive",
      bab,
    );
    const presentWeak = input.asSoundAnalog
      ? { slots: presentSound, mutations: [] }
      : applyWeakness(presentSound, presentInput, weakness);
    const analogPresent = applyWeakness(presentSound, presentInput, "sound");
    const imperativeSlots = toImperative(presentWeak.slots, input.form, bab);
    const analogImperative = toImperative(analogPresent.slots, input.form, bab);
    const afterException = input.asSoundAnalog
      ? { slots: imperativeSlots, mutations: presentWeak.mutations }
      : applyWeakness(imperativeSlots, input, weakness);

    return withFormVIII(
      afterException.slots,
      [...presentWeak.mutations, ...afterException.mutations],
      { surface: surfaceOf(analogImperative), slots: analogImperative },
      input,
      weakness,
    );
  }

  const soundSlots = buildSoundVerb({ ...input, asSoundAnalog: true });
  if (soundSlots.length === 0) return unavailable(weakness);

  const analog = { surface: surfaceOf(soundSlots), slots: soundSlots };
  if (input.asSoundAnalog) {
    return {
      surface: analog.surface,
      slots: soundSlots,
      available: true,
      weakness,
      mutations: [],
    };
  }

  const weak = applyWeakness(soundSlots, input, weakness);
  return withFormVIII(weak.slots, weak.mutations, analog, input, weakness);
}

export function paradigm(
  input: Omit<ConjugateInput, "person">,
): Record<PersonId, ConjugateResult> {
  const out = {} as Record<PersonId, ConjugateResult>;
  for (const person of PERSONS) {
    out[person.id] = conjugate({ ...input, person: person.id });
  }
  return out;
}
