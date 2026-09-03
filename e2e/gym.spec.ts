import { expect, test } from "@playwright/test";

test("gym shows the default كتب paradigm", async ({ page }) => {
  await page.goto("/gym");
  await expect(
    page.getByRole("heading", { name: "Produce the table" }),
  ).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByText("كَتَبَ").first()).toBeVisible();
});

test("gym tense and voice update the table", async ({ page }) => {
  await page.goto("/gym");
  await page.getByLabel("Tense").selectOption("present");
  await expect(page.getByText("يَكْتُبُ").first()).toBeVisible();
  await expect(page.getByLabel("Mood")).toBeVisible();

  await page.getByLabel("Tense").selectOption("past");
  await page.getByLabel("Voice").selectOption("passive");
  await expect(page.getByText("كُتِبَ").first()).toBeVisible();
});

test("gym form II intensifies كتب", async ({ page }) => {
  await page.goto("/gym");
  await page.getByLabel("Form").selectOption("2");
  await expect(page.getByText("كَتَّبَ").first()).toBeVisible();
});

test("gym quiz covers cells until revealed", async ({ page }) => {
  await page.goto("/gym");
  await page.getByRole("button", { name: "Quiz" }).click();
  await expect(page.getByText("Tap a cell to reveal it.")).toBeVisible();
  await expect(page.getByText("tap to reveal").first()).toBeVisible();

  await page.getByRole("button", { name: "Reveal he" }).click();
  await expect(page.getByRole("button", { name: /he: كَتَبَ/ })).toBeVisible();
});

test("gym imperative has no voice and no 1st person command", async ({
  page,
}) => {
  await page.goto("/gym");
  await page.getByLabel("Tense").selectOption("imperative");
  await expect(page.getByLabel("Voice")).toHaveCount(0);
  await page.getByRole("button", { name: /^I:/ }).click();
  await expect(
    page.getByText("No command form for this person."),
  ).toBeVisible();
});
