import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { VoiceKey } from "./VoiceKey";

const meta = {
  component: VoiceKey,
  tags: ["ai-generated"],
} satisfies Meta<typeof VoiceKey>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormIFull: Story = {
  args: {
    form: 1,
    formIBab: "nasara",
    compact: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("معلوم or مجهول?")).toBeVisible();
  },
};

export const Compact: Story = {
  args: {
    form: 1,
    compact: true,
  },
};

export const FormIXNoPassive: Story = {
  args: {
    form: 9,
    compact: false,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("Form IX has no useful morphological مجهول."),
    ).toBeVisible();
  },
};

export const FormIII: Story = {
  args: {
    form: 3,
    compact: false,
  },
};
