export type FormId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type FormIBab =
  | "nasara"
  | "daraba"
  | "fataha"
  | "fariha"
  | "karuma"
  | "hasiba";

export type Tense = "past" | "present" | "imperative";
export type Voice = "active" | "passive";
export type Mood = "indicative" | "subjunctive" | "jussive";

export type WeaknessType =
  | "sound"
  | "mithal"
  | "ajwaf"
  | "naqis"
  | "mudaf"
  | "mahmuz_f"
  | "mahmuz_a"
  | "mahmuz_l";

export type PersonId =
  | "huwa"
  | "huma_m"
  | "hum"
  | "hiya"
  | "huma_f"
  | "hunna"
  | "anta"
  | "antuma_m"
  | "antum"
  | "anti"
  | "antuma_f"
  | "antunna"
  | "ana"
  | "nahnu";

export type SlotKind = "f" | "a" | "l" | "extra" | "prefix" | "suffix";

export type MorphemeSlot = {
  text: string;
  kind: SlotKind;
};

export type Mutation = {
  rule: string;
  from: string;
  to: string;
};

export type ConjugateInput = {
  root: [string, string, string];
  form: FormId;
  formIBab?: FormIBab;
  tense: Tense;
  voice: Voice;
  person: PersonId;
  mood?: Mood;
  weakness?: WeaknessType;
  asSoundAnalog?: boolean;
};

export type ConjugateResult = {
  surface: string;
  slots: MorphemeSlot[];
  available: boolean;
  weakness: WeaknessType;
  mutations: Mutation[];
  soundAnalog?: { surface: string; slots: MorphemeSlot[] };
};

export type RootEntry = {
  id: string;
  letters: [string, string, string];
  gloss: string;
  weakness: WeaknessType;
  formIBab: FormIBab;
  forms: FormId[];
};

export type LabelMode = "form" | "wazn";
