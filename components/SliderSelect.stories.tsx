import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { SliderSelect, type SliderSelectOption } from "./SliderSelect";

const FONT_SIZE_OPTIONS: SliderSelectOption[] = [
  { value: "12", label: "12px" },
  { value: "14", label: "14px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
  { value: "20", label: "20px" },
  { value: "24", label: "24px" },
];

function FontSizeDemo({ initialValue = "16" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="flex max-w-sm flex-col gap-6">
      <SliderSelect
        label="Font size"
        options={FONT_SIZE_OPTIONS}
        value={value}
        onValueChange={setValue}
      />
      <p
        data-testid="font-preview"
        className="flex h-20 items-center justify-center rounded-lg border border-border bg-card px-4 text-center font-arabic leading-none"
        style={{ fontSize: `${value}px` }}
      >
        فَعَلَ
      </p>
    </div>
  );
}

const meta = {
  component: SliderSelect,
  tags: ["ai-generated"],
  args: {
    options: FONT_SIZE_OPTIONS,
    value: "16",
    onValueChange: () => {},
    label: "Font size",
  },
  render: () => <FontSizeDemo />,
} satisfies Meta<typeof SliderSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontSize: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const preview = canvas.getByTestId("font-preview");
    await expect(preview).toHaveStyle({ fontSize: "16px" });

    await userEvent.click(canvas.getByRole("combobox"));
    const listbox = within(document.body);
    await userEvent.click(await listbox.findByRole("option", { name: "20px" }));
    await expect(preview).toHaveStyle({ fontSize: "20px" });
    await expect(canvas.getByRole("combobox")).toHaveTextContent("20px");
  },
};

export const SliderUpdatesSelect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider");
    slider.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect(canvas.getByRole("combobox")).toHaveTextContent("20px");
    await expect(canvas.getByTestId("font-preview")).toHaveStyle({
      fontSize: "20px",
    });
  },
};
