import { expect, test } from "@playwright/test";

test("lab compares sound analog and actual for ajwaf", async ({ page }) => {
  await page.goto("/lab");
  await expect(
    page.getByRole("heading", {
      name: /Sound analog vs what you actually say/,
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "الأجوف" })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByText("قَالَ").first()).toBeVisible();
  await expect(page.getByText("(say)")).toBeVisible();
});

test("lab switches weakness type and example root", async ({ page }) => {
  await page.goto("/lab");
  await page.getByRole("button", { name: /Mithal/ }).click();
  await expect(page.getByRole("heading", { name: "المثال" })).toBeVisible();
  await expect(page.getByText("(promise)")).toBeVisible();

  await page.getByRole("button", { name: /Ajwaf/ }).click();
  await page.getByRole("button", { name: "Another root" }).click();
  await expect(page.getByText("(sell)")).toBeVisible();
});

test("lab drill accepts an answer and advances", async ({ page }) => {
  await page.goto("/lab");
  const drill = page
    .locator("section")
    .filter({ hasText: "What is the actual form" });
  await drill.getByRole("button").first().click();
  await expect(drill.getByText(/Correct|The actual form is/)).toBeVisible();
  await drill.getByRole("button", { name: "Next cell" }).click();
  await expect(
    drill.getByRole("heading", { name: /What is the actual form/ }),
  ).toBeVisible();
});
