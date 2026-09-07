import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { TileChip } from "./TileChip";

const meta = {
  component: TileChip,
  tags: ["ai-generated"],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof TileChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: {
    selected: false,
    children: "I",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "I" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    children: "I",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "I" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

export const StackedBilingual: Story = {
  args: {
    selected: true,
    title: "Form I · فَعَلَ",
    children: (
      <>
        I
        <span dir="rtl" className="font-arabic text-[11px] leading-tight">
          فَعَلَ
        </span>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const chip = canvas.getByRole("button", { name: /فَعَلَ/ });
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await expect(chip).toHaveTextContent("I");
    await expect(chip).toHaveTextContent("فَعَلَ");
  },
};

export const ClickToggles: Story = {
  args: {
    selected: false,
    children: "II",
  },
  play: async ({ canvas, args }) => {
    const chip = canvas.getByRole("button", { name: "II" });
    await expect(chip).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(chip);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
