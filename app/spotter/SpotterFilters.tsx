import type { ReactNode } from "react";
import { Chip } from "./Chip";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
  ALL_QUESTIONS,
  ALL_TENSES,
  ALL_VOICES,
  FORM_BY_ID,
  FORMS,
  PERSON_BY_ID,
  PERSONS,
  TENSE_LABEL,
  formLabel,
  linkedPersons,
  personQuizEnglish,
  quizPersonKey,
  type FormId,
  type LabelMode,
  type PersonId,
  type QuestionId,
  type Tense,
  type Voice,
} from "@/lib/sarf";

const QUESTION_CHIPS: { id: QuestionId; label: string }[] = [
  { id: "root", label: "Root" },
  { id: "form", label: "Form" },
  { id: "tense", label: "Tense" },
  { id: "voice", label: "Voice" },
  { id: "person", label: "Person" },
];

const VOICE_CHIPS: { id: Voice; label: string }[] = [
  { id: "active", label: "معلوم" },
  { id: "passive", label: "مجهول" },
];

const TENSE_CHIPS: { id: Tense; label: string }[] = ALL_TENSES.map((id) => ({
  id,
  label: TENSE_LABEL[id],
}));

const PERSON_GROUPS: { label: string; ids: PersonId[] }[] = [
  { label: "3rd", ids: PERSONS.filter((p) => p.person === 3).map((p) => p.id) },
  { label: "2nd", ids: PERSONS.filter((p) => p.person === 2).map((p) => p.id) },
  { label: "1st", ids: PERSONS.filter((p) => p.person === 1).map((p) => p.id) },
];

function FilterGroup({
  label,
  allSelected,
  onSelectAll,
  children,
}: {
  label: string;
  allSelected: boolean;
  onSelectAll: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium">{label}</p>
        <Chip selected={allSelected} onClick={onSelectAll}>
          All
        </Chip>
      </div>
      {children}
    </div>
  );
}

export function SpotterFilters({
  labelMode,
  enabledQuestions,
  enabledForms,
  enabledTenses,
  enabledVoices,
  enabledPersons,
  onLabelModeChange,
  onToggleQuestion,
  onToggleForm,
  onToggleTense,
  onToggleVoice,
  onTogglePerson,
  onSelectAllQuestions,
  onSelectAllForms,
  onSelectAllTenses,
  onSelectAllVoices,
  onSelectAllPersons,
}: {
  labelMode: LabelMode;
  enabledQuestions: QuestionId[];
  enabledForms: FormId[];
  enabledTenses: Tense[];
  enabledVoices: Voice[];
  enabledPersons: PersonId[];
  onLabelModeChange: (mode: LabelMode) => void;
  onToggleQuestion: (question: QuestionId) => void;
  onToggleForm: (form: FormId) => void;
  onToggleTense: (tense: Tense) => void;
  onToggleVoice: (voice: Voice) => void;
  onTogglePerson: (person: PersonId) => void;
  onSelectAllQuestions: () => void;
  onSelectAllForms: () => void;
  onSelectAllTenses: () => void;
  onSelectAllVoices: () => void;
  onSelectAllPersons: () => void;
}) {
  return (
    <section
      data-spotter-filters
      className="flex flex-col gap-4 rounded-2xl border border-rule bg-card p-4"
    >
      <p className="text-xs uppercase tracking-wider text-ink-soft">Quiz on</p>
      <FilterGroup
        label="Questions"
        allSelected={enabledQuestions.length === ALL_QUESTIONS.length}
        onSelectAll={onSelectAllQuestions}
      >
        <div className="flex flex-wrap gap-2">
          {QUESTION_CHIPS.map((question) => (
            <Chip
              key={question.id}
              selected={enabledQuestions.includes(question.id)}
              onClick={() => onToggleQuestion(question.id)}
            >
              {question.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">Forms</p>
          <Chip
            selected={enabledForms.length === ALL_FORMS.length}
            onClick={onSelectAllForms}
          >
            All
          </Chip>
          <span className="mx-1 h-4 w-px bg-rule" aria-hidden />
          <Chip
            selected={labelMode === "form"}
            onClick={() => onLabelModeChange("form")}
          >
            Form #
          </Chip>
          <Chip
            selected={labelMode === "wazn"}
            onClick={() => onLabelModeChange("wazn")}
            title="Show ف ع ل patterns"
          >
            <span dir="rtl" className="font-arabic">
              وزن
            </span>
          </Chip>
          <Chip
            selected={labelMode === "both"}
            onClick={() => onLabelModeChange("both")}
            title="Show Form number and ف ع ل pattern"
          >
            Both
          </Chip>
        </div>
        <div className="flex flex-wrap gap-2">
          {FORMS.map((form) => {
            const meta = FORM_BY_ID[form.id];
            return (
              <Chip
                key={form.id}
                selected={enabledForms.includes(form.id)}
                title={formLabel(form.id, labelMode)}
                onClick={() => onToggleForm(form.id)}
              >
                {labelMode === "form" ? (
                  `Form ${meta.roman}`
                ) : labelMode === "wazn" ? (
                  <span dir="rtl" className="font-arabic text-base">
                    {meta.waznPast}
                  </span>
                ) : (
                  <span className="inline-flex items-baseline gap-1.5">
                    <span>Form {meta.roman}</span>
                    <span dir="rtl" className="font-arabic text-base">
                      {meta.waznPast}
                    </span>
                  </span>
                )}
              </Chip>
            );
          })}
        </div>
      </div>
      <FilterGroup
        label="Tense"
        allSelected={enabledTenses.length === ALL_TENSES.length}
        onSelectAll={onSelectAllTenses}
      >
        <div className="flex flex-wrap gap-2">
          {TENSE_CHIPS.map((tense) => (
            <Chip
              key={tense.id}
              selected={enabledTenses.includes(tense.id)}
              onClick={() => onToggleTense(tense.id)}
            >
              <span className="font-arabic">{tense.label}</span>
            </Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup
        label="Voice"
        allSelected={enabledVoices.length === ALL_VOICES.length}
        onSelectAll={onSelectAllVoices}
      >
        <div className="flex flex-wrap gap-2">
          {VOICE_CHIPS.map((voice) => (
            <Chip
              key={voice.id}
              selected={enabledVoices.includes(voice.id)}
              onClick={() => onToggleVoice(voice.id)}
            >
              <span className="font-arabic">{voice.label}</span>
            </Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup
        label="Persons"
        allSelected={enabledPersons.length === ALL_PERSON_IDS.length}
        onSelectAll={onSelectAllPersons}
      >
        <div className="flex flex-col gap-2">
          {PERSON_GROUPS.map((group) => (
            <div
              key={group.label}
              className="flex flex-wrap items-center gap-2"
            >
              <p className="w-8 text-xs text-ink-soft">{group.label}</p>
              {group.ids
                .filter((id) => quizPersonKey(id) === id)
                .map((id) => (
                  <Chip
                    key={id}
                    selected={linkedPersons(id).every((person) =>
                      enabledPersons.includes(person),
                    )}
                    title={personQuizEnglish(id)}
                    onClick={() => onTogglePerson(id)}
                  >
                    <span className="font-arabic">
                      {PERSON_BY_ID[id].arabic}
                    </span>
                  </Chip>
                ))}
            </div>
          ))}
        </div>
      </FilterGroup>
    </section>
  );
}
