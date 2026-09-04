import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { ModeCard } from "./ModeCard";

const meta = {
  component: ModeCard,
  tags: ["ai-generated"],
} satisfies Meta<typeof ModeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "/atlas",
    kicker: "01 · Map",
    title: "Form Atlas",
    arabic: "الأوزان",
    body: "See Forms I–X as color-coded ف ع ل templates, with both Form numbers and traditional awzan.",
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: /Form Atlas/i });
    await expect(link).toHaveAttribute("href", "/atlas");
  },
};

export const Gym: Story = {
  args: {
    href: "/gym",
    kicker: "02 · Produce",
    title: "Conjugation Gym",
    arabic: "التصريف",
    body: "Fill the 14-person table from a root and a form. Study the overlay, then quiz empty cells.",
  },
};

export const Spotter: Story = {
  args: {
    href: "/spotter",
    kicker: "03 · Recognize",
    title: "Pattern Spotter",
    arabic: "التمييز",
    body: "A vocalized verb appears. Name the root, form, tense, voice, and person.",
  },
};
