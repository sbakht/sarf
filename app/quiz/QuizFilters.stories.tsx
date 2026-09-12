import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { QuizFilters } from "./QuizFilters";
import {
  ALL_FORMS,
  ALL_PERSON_IDS,
  ALL_QUESTIONS,
  ALL_TENSES,
  ALL_VOICES,
  ALL_WEAK_LETTERS,
  toggleItem,
  type FormId,
  type LabelMode,
  type PersonId,
  type QuestionId,
  type QuizWeakness,
  type Tense,
  type Voice,
  type WeakLetter,
} from "@/lib/sarf";

function FiltersDemo({
  initialLabelMode = "both",
  initialQuestions = [...ALL_QUESTIONS],
  initialForms = [...ALL_FORMS],
  initialTenses = [...ALL_TENSES],
  initialVoices = [...ALL_VOICES],
  initialPersons = [...ALL_PERSON_IDS],
  initialWeaknesses = ["sound"] as QuizWeakness[],
  initialWeakLetters = [...ALL_WEAK_LETTERS] as WeakLetter[],
  collapsible = false,
  summary,
}: {
  initialLabelMode?: LabelMode;
  initialQuestions?: QuestionId[];
  initialForms?: FormId[];
  initialTenses?: Tense[];
  initialVoices?: Voice[];
  initialPersons?: PersonId[];
  initialWeaknesses?: QuizWeakness[];
  initialWeakLetters?: WeakLetter[];
  collapsible?: boolean;
  summary?: string;
}) {
  const [labelMode, setLabelMode] = useState(initialLabelMode);
  const [enabledQuestions, setQuestions] = useState(initialQuestions);
  const [enabledForms, setForms] = useState(initialForms);
  const [enabledTenses, setTenses] = useState(initialTenses);
  const [enabledVoices, setVoices] = useState(initialVoices);
  const [enabledPersons, setPersons] = useState(initialPersons);
  const [enabledWeaknesses, setWeaknesses] = useState(initialWeaknesses);
  const [enabledWeakLetters, setWeakLetters] = useState(initialWeakLetters);

  return (
    <QuizFilters
      labelMode={labelMode}
      enabledQuestions={enabledQuestions}
      enabledForms={enabledForms}
      enabledTenses={enabledTenses}
      enabledVoices={enabledVoices}
      enabledPersons={enabledPersons}
      enabledWeaknesses={enabledWeaknesses}
      enabledWeakLetters={enabledWeakLetters}
      onLabelModeChange={setLabelMode}
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
      onTogglePersonSet={(ids) => {
        const allOn = ids.every((id) => enabledPersons.includes(id));
        if (allOn) {
          const next = enabledPersons.filter((id) => !ids.includes(id));
          if (next.length) setPersons(next);
        } else {
          setPersons([...new Set([...enabledPersons, ...ids])]);
        }
      }}
      onSelectAllPersons={() => setPersons([...ALL_PERSON_IDS])}
      onToggleWeakness={(w) => {
        const next = toggleItem(enabledWeaknesses, w);
        if (next) setWeaknesses(next);
      }}
      onToggleWeakLetter={(letter) => {
        const next = toggleItem(enabledWeakLetters, letter);
        if (next) setWeakLetters(next);
      }}
      collapsible={collapsible}
      summary={summary}
    />
  );
}

const meta = {
  component: QuizFilters,
  tags: ["ai-generated"],
} satisfies Meta<typeof QuizFilters>;

export default meta;

export const AllSelected: StoryObj = {
  render: () => <FiltersDemo />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Filters")).toBeVisible();
    await expect(canvas.getByText("Roots")).toBeVisible();
    await expect(canvas.getByText("Questions")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Sound/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByRole("button", { name: /Root/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

export const ArabicLabels: StoryObj = {
  render: () => <FiltersDemo initialLabelMode="wazn" />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Arabic" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByText("فَعَلَ")).toBeVisible();
  },
};

export const BothLabels: StoryObj = {
  render: () => <FiltersDemo initialLabelMode="both" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Both" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByText("I")).toBeVisible();
    await expect(canvas.getByText("فَعَلَ")).toBeVisible();
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
      initialWeaknesses={["ajwaf", "naqis"]}
      initialWeakLetters={["waw"]}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /Root/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByRole("button", { name: /Tense/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await expect(canvas.getByRole("button", { name: /Ajwaf/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByRole("button", { name: /Waw/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

/** Closed mobile Filters header inside the quiz page grid — must keep px-4 inset. */
export const CollapsedMobile: StoryObj = {
  render: () => (
    <div
      data-testid="mobile-quiz-frame"
      className="mx-auto flex min-w-0 flex-col gap-6 px-4 py-8"
      style={{ width: "375px", maxWidth: "375px" }}
    >
      <div className="grid min-w-0 gap-6">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0">
            <FiltersDemo
              collapsible
              summary="5 questions · 10 forms · 3 tenses · 2 voices · 14 pronouns"
            />
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const frame = canvas.getByTestId("mobile-quiz-frame");
    const toggle = canvas.getByRole("button", { name: /Filters/i });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    const filters = toggle.closest("[data-quiz-filters]");
    await expect(filters).toBeTruthy();

    const frameBox = frame.getBoundingClientRect();
    const filtersBox = filters!.getBoundingClientRect();
    await expect(filtersBox.left - frameBox.left).toBeGreaterThanOrEqual(16);
    await expect(frameBox.right - filtersBox.right).toBeGreaterThanOrEqual(16);
  },
};
