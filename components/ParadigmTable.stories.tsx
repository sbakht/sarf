import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import { ParadigmTable } from "./ParadigmTable";

const pastActive = {
  root: ["ك", "ت", "ب"] as [string, string, string],
  form: 1 as const,
  formIBab: "nasara" as const,
  tense: "past" as const,
  voice: "active" as const,
};

const presentPassive = {
  root: ["ك", "ت", "ب"] as [string, string, string],
  form: 1 as const,
  formIBab: "nasara" as const,
  tense: "present" as const,
  voice: "passive" as const,
};

const meta = {
  component: ParadigmTable,
  tags: ["ai-generated"],
} satisfies Meta<typeof ParadigmTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Study: Story = {
  args: { input: pastActive },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "he: كَتَبَ" }),
    ).toBeVisible();
  },
};

export const QuizCovered: Story = {
  args: {
    input: pastActive,
    quiz: true,
    revealedPersons: {},
    onToggleReveal: fn(),
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: /Reveal he/i }),
    ).toBeVisible();
  },
};

export const QuizPartialReveal: Story = {
  args: {
    input: pastActive,
    quiz: true,
    revealedPersons: { huwa: true, hiya: true, ana: true },
    onToggleReveal: fn(),
  },
};

export const PresentPassive: Story = {
  args: { input: presentPassive },
};
