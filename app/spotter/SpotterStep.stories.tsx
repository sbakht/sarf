import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import { SpotterStep } from "./SpotterStep";
import type { SpotterStep as SpotterStepData } from "@/lib/sarf";

const meta = {
  component: SpotterStep,
  tags: ["ai-generated"],
  args: {
    onAnswer: fn(),
    step: 0,
    total: 5,
  },
} satisfies Meta<typeof SpotterStep>;

export default meta;
type Story = StoryObj<typeof meta>;

const rootStep: SpotterStepData = {
  id: "root",
  title: "Which root?",
  choices: [
    {
      id: "ktb",
      primary: "ك ت ب",
      arabic: true,
      secondary: "to write",
      correct: true,
      feedback: "Correct",
    },
    {
      id: "qwl",
      primary: "ق و ل",
      arabic: true,
      secondary: "to say",
      correct: false,
      feedback: "Wrong root",
    },
  ],
};

const formStep: SpotterStepData = {
  id: "form",
  title: "Which form?",
  choices: [
    {
      id: "1",
      primary: "Form I",
      secondary: "فَعَلَ",
      correct: true,
      feedback: "Correct",
    },
    {
      id: "4",
      primary: "Form IV",
      secondary: "أَفْعَلَ",
      correct: false,
      feedback: "Wrong form",
    },
  ],
};

const voiceStep: SpotterStepData = {
  id: "voice",
  title: "Which voice?",
  choices: [
    {
      id: "active",
      primary: "معلوم",
      arabic: true,
      secondary: "active",
      correct: true,
      feedback: "Correct",
    },
    {
      id: "passive",
      primary: "مجهول",
      arabic: true,
      secondary: "passive",
      correct: false,
      feedback: "Wrong voice",
    },
  ],
};

export const Root: Story = {
  args: { current: rootStep, step: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Which root?")).toBeVisible();
  },
};

export const Form: Story = {
  args: { current: formStep, step: 1 },
};

export const Voice: Story = {
  args: { current: voiceStep, step: 3 },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByText("Voice key — how to tell معلوم from مجهول"),
    );
    await expect(canvas.getByText("معلوم or مجهول?")).toBeVisible();
  },
};
