import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { SpotterCard } from "./SpotterCard";
import { conjugate, getRoot } from "@/lib/sarf";

const root = getRoot("ktb");
const prompt = {
  root,
  form: 1 as const,
  tense: "past" as const,
  voice: "active" as const,
  person: "huwa" as const,
};
const result = conjugate({
  root: root.letters,
  form: 1,
  formIBab: root.formIBab,
  tense: "past",
  voice: "active",
  person: "huwa",
});

const meta = {
  component: SpotterCard,
  tags: ["ai-generated"],
} satisfies Meta<typeof SpotterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    prompt,
    result,
    feedback: null,
    showColors: false,
    done: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Identify this verb")).toBeVisible();
  },
};

export const Correct: Story = {
  args: {
    prompt,
    result,
    feedback: { ok: true, text: "Correct — Form I" },
    showColors: false,
    done: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Correct — Form I")).toBeVisible();
  },
};

export const Incorrect: Story = {
  args: {
    prompt,
    result,
    feedback: { ok: false, text: "Not Form IV — try again" },
    showColors: false,
    done: false,
  },
};

export const RevealedWithColors: Story = {
  args: {
    prompt,
    result,
    feedback: { ok: false, text: "Not quite — Form I" },
    showColors: true,
    done: true,
    onContinue: () => {},
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Tap the verb to continue")).toBeVisible();
  },
};

export const NoMatches: Story = {
  args: {
    prompt: null,
    result: null,
    feedback: null,
    showColors: false,
    done: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No verbs match these filters")).toBeVisible();
  },
};
