import { expect, test } from "@playwright/test";

test("atlas shows Form I samples for كتب", async ({ page }) => {
  await page.goto("/atlas");
  await expect(page.getByRole("heading", { name: /The map of/ })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Form I abwab" }),
  ).toBeVisible();
  await expect(page.getByText("كَتَبَ").first()).toBeVisible();
  await expect(page.getByText("يَكْتُبُ").first()).toBeVisible();
  await expect(page.getByText("ماضي مجهول · هو")).toBeVisible();
});

test("atlas switches form, bab, and root", async ({ page }) => {
  await page.goto("/atlas");
  await page.getByRole("button", { name: /Form II ·/ }).click();
  await expect(page.getByText("كَتَّبَ").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Form I abwab" })).toHaveCount(
    0,
  );

  await page.getByRole("button", { name: /Form I ·/ }).click();
  await page.getByRole("button", { name: "بَابُ ضَرَبَ" }).click();
  await expect(
    page.getByText("بَابُ ضَرَبَ — فَعَلَ / يَفْعِلُ"),
  ).toBeVisible();

  await page.getByRole("button", { name: "بَابُ نَصَرَ" }).click();
  await page.getByLabel("Root").selectOption("nSr");
  await expect(page.getByText("نَصَرَ").first()).toBeVisible();
});

test("atlas form IX has no مجهول", async ({ page }) => {
  await page.goto("/atlas");
  await page.getByRole("button", { name: /Form IX ·/ }).click();
  await expect(
    page.getByText("Form IX has no useful morphological مجهول.").first(),
  ).toBeVisible();
});
