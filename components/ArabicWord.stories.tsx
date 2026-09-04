import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { ArabicWord, ColorLegend } from "./ArabicWord";
import { SettingsProvider } from "./SettingsProvider";
import { conjugate } from "@/lib/sarf";

const pastActive = conjugate({
  root: ["ك", "ت", "ب"],
  form: 1,
  formIBab: "nasara",
  tense: "past",
  voice: "active",
  person: "huwa",
});

const presentPassive = conjugate({
  root: ["ك", "ت", "ب"],
  form: 1,
  formIBab: "nasara",
  tense: "present",
  voice: "passive",
  person: "huwa",
});

const meta = {
  component: ArabicWord,
  tags: ["ai-generated"],
} satisfies Meta<typeof ArabicWord>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SurfaceOnly: Story = {
  args: { surface: "كَتَبَ", size: "lg" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("كَتَبَ")).toBeVisible();
  },
};

export const SlottedFormI: Story = {
  args: {
    slots: pastActive.slots,
    surface: pastActive.surface,
    size: "lg",
  },
};

export const HighlightRadicals: Story = {
  args: {
    slots: pastActive.slots,
    surface: pastActive.surface,
    size: "lg",
    highlight: ["f", "a", "l"],
  },
};

export const HighlightAffixes: Story = {
  args: {
    slots: presentPassive.slots,
    surface: presentPassive.surface,
    size: "lg",
    highlight: ["prefix", "suffix"],
  },
};

export const HarakatOff: Story = {
  decorators: [
    (Story) => (
      <SettingsProvider initialShowHarakat={false}>
        <Story />
      </SettingsProvider>
    ),
  ],
  args: {
    surface: "كَتَبَ",
    size: "lg",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("كتب")).toBeVisible();
  },
};

export const LegendDefault: StoryObj<typeof ColorLegend> = {
  render: () => <ColorLegend />,
};

export const LegendCompact: StoryObj<typeof ColorLegend> = {
  render: () => <ColorLegend compact />,
};
