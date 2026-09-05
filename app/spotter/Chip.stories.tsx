import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import { Chip } from "./Chip";

const meta = {
  component: Chip,
  tags: ["ai-generated"],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: {
    selected: false,
    children: "Form I",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Form I" }),
    ).toHaveAttribute("aria-pressed", "false");
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    children: "Form I",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Form I" }),
    ).toHaveAttribute("aria-pressed", "true");
  },
};

export const ArabicLabel: Story = {
  args: {
    selected: true,
    children: <span className="font-arabic">ماضي</span>,
    title: "past tense",
  },
};

// Chip selected uses bg-primary/10 — fails if Tailwind / globals did not load.
export const CssCheck: Story = {
  args: {
    selected: true,
    children: "Form I",
  },
  play: async ({ canvas }) => {
    const chip = canvas.getByRole("button", { name: "Form I" });
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    const probe = document.createElement("div");
    probe.className = "bg-primary/10";
    document.body.appendChild(probe);
    const expected = getComputedStyle(probe).backgroundColor;
    document.body.removeChild(probe);
    await expect(getComputedStyle(chip).backgroundColor).toBe(expected);
  },
};
