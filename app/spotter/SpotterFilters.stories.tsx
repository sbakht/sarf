import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { SpotterFilters } from "./SpotterFilters";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
  ALL_QUESTIONS,
  ALL_TENSES,
  ALL_VOICES,
  toggleItem,
  type FormId,
  type PersonId,
  type QuestionId,
  type Tense,
  type Voice,
} from "@/lib/sarf";

function FiltersDemo({
  initialQuestions = [...ALL_QUESTIONS],
  initialForms = [...ALL_FORMS],
  initialTenses = [...ALL_TENSES],
  initialVoices = [...ALL_VOICES],
  initialPersons = [...ALL_PERSON_IDS],
}: {
  initialQuestions?: QuestionId[];
  initialForms?: FormId[];
  initialTenses?: Tense[];
  initialVoices?: Voice[];
  initialPersons?: PersonId[];
}) {
  const [enabledQuestions, setQuestions] = useState(initialQuestions);
  const [enabledForms, setForms] = useState(initialForms);
  const [enabledTenses, setTenses] = useState(initialTenses);
  const [enabledVoices, setVoices] = useState(initialVoices);
  const [enabledPersons, setPersons] = useState(initialPersons);

  return (
    <SpotterFilters
      labelMode="form"
      enabledQuestions={enabledQuestions}
      enabledForms={enabledForms}
      enabledTenses={enabledTenses}
      enabledVoices={enabledVoices}
      enabledPersons={enabledPersons}
      onToggleQuestion={(q) => {
        const next = toggleItem(enabledQuestions, q);
        if (next) setQuestions(next);
      }}
      onToggleForm={(f) => {
        const next = toggleItem(enabledForms, f);
        if (next) setForms(next);
      }}
      onToggleTense={(t) => {
        const next = toggleItem(enabledTenses, t);
        if (next) setTenses(next);
      }}
      onToggleVoice={(v) => {
        const next = toggleItem(enabledVoices, v);
        if (next) setVoices(next);
      }}
      onTogglePerson={(p) => {
        const next = toggleItem(enabledPersons, p);
        if (next) setPersons(next);
      }}
      onSelectAllQuestions={() => setQuestions([...ALL_QUESTIONS])}
      onSelectAllForms={() => setForms([...ALL_FORMS])}
      onSelectAllTenses={() => setTenses([...ALL_TENSES])}
      onSelectAllVoices={() => setVoices([...ALL_VOICES])}
      onSelectAllPersons={() => setPersons([...ALL_PERSON_IDS])}
    />
  );
}

const meta = {
  component: SpotterFilters,
  tags: ["ai-generated"],
} satisfies Meta<typeof SpotterFilters>;

export default meta;

export const AllSelected: StoryObj = {
  render: () => <FiltersDemo />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Quiz on")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Root" }),
    ).toHaveAttribute("aria-pressed", "true");
  },
};

export const SparseSelection: StoryObj = {
  render: () => (
    <FiltersDemo
      initialQuestions={["root", "form"]}
      initialForms={[1, 2, 4]}
      initialTenses={["past"]}
      initialVoices={["active"]}
      initialPersons={["huwa", "hiya", "ana"]}
    />
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Root" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      canvas.getByRole("button", { name: "Tense" }),
    ).toHaveAttribute("aria-pressed", "false");
  },
};
