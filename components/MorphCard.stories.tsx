import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { MorphCard } from "./MorphCard";
import { conjugate } from "@/lib/sarf";

const past = conjugate({
  root: ["ك", "ت", "ب"],
  form: 1,
  formIBab: "nasara",
  tense: "past",
  voice: "active",
  person: "huwa",
});

const present = conjugate({
  root: ["ك", "ت", "ب"],
  form: 1,
  formIBab: "nasara",
  tense: "present",
  voice: "active",
  person: "huwa",
});

const command = conjugate({
  root: ["ك", "ت", "ب"],
  form: 1,
  formIBab: "nasara",
  tense: "imperative",
  voice: "active",
  person: "anta",
});

const meta = {
  component: MorphCard,
  tags: ["ai-generated"],
} satisfies Meta<typeof MorphCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Past: Story = {
  args: {
    english: "past",
    title: "ماضي معلوم · هو",
    result: past,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("past")).toBeVisible();
    await expect(canvas.getByText("ماضي معلوم · هو")).toBeVisible();
  },
};

export const Present: Story = {
  args: {
    english: "present",
    title: "مضارع معلوم · هو",
    result: present,
  },
};

export const Imperative: Story = {
  args: {
    english: "imperative",
    title: "أمر · أنتَ",
    result: command,
  },
};
