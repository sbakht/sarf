import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { conjugate, getRoot } from "@/lib/sarf";
import { BugReportButton, bugReportSource } from "./BugReportButton";

const prompt = {
  root: getRoot("ktb"),
  form: 1 as const,
  tense: "past" as const,
  voice: "active" as const,
  person: "huwa" as const,
};

const meta = {
  component: BugReportButton,
  tags: ["ai-generated"],
} satisfies Meta<typeof BugReportButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    source: bugReportSource(
      {
        labelMode: "both",
        enabledWeaknesses: ["sound"],
        enabledWeakLetters: ["waw", "ya"],
        enabledForms: [1],
        enabledPersons: ["huwa"],
        enabledVoices: ["active"],
        enabledTenses: ["past"],
        enabledQuestions: ["form"],
        score: { correct: 0, total: 1 },
        step: 0,
        done: false,
        prompt,
        result: conjugate({
          root: prompt.root.letters,
          form: prompt.form,
          formIBab: prompt.root.formIBab,
          tense: prompt.tense,
          voice: prompt.voice,
          person: prompt.person,
          weakness: prompt.root.weakness,
        }),
        current: {
          id: "form",
          title: "Which form?",
          choices: [
            { id: "1", primary: "Form I", correct: true, feedback: "Form I" },
          ],
        },
        steps: [],
        feedback: {
          ok: false,
          text: "Not quite — you said Form II; correct answer is Form I",
        },
        answers: [
          {
            question: "form",
            selected: "Form II",
            ok: false,
            correctLabel: "Form I",
          },
        ],
      },
      "/",
    ),
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Bug report" }),
    ).toBeVisible();
  },
};

export const OpenForm: Story = {
  args: Closed.args,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Bug report" }));
    const page = within(canvasElement.ownerDocument.body);
    await expect(
      page.getByRole("heading", { name: "Report a quiz bug" }),
    ).toBeVisible();
    await expect(page.getByText(/Attached quiz data/)).toBeVisible();
    await expect(page.getByText(/Form II/)).toBeVisible();
  },
};
