import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { FormBadge } from "./FormBadge";
import { SettingsProvider } from "./SettingsProvider";

const meta = {
  component: FormBadge,
  tags: ["ai-generated"],
} satisfies Meta<typeof FormBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormI: Story = {
  args: { form: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Form I")).toBeVisible();
  },
};

export const FormIV: Story = {
  args: { form: 4 },
};

export const FormX: Story = {
  args: { form: 10 },
};

export const WaznLabels: Story = {
  decorators: [
    (Story) => (
      <SettingsProvider initialLabelMode="wazn">
        <Story />
      </SettingsProvider>
    ),
  ],
  args: { form: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("فَعَلَ")).toBeVisible();
  },
};
