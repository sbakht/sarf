import { expect, test } from "@playwright/test";

test("home lists the four training modes", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "تدريب الصرف" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Form Atlas/ })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Conjugation Gym/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Pattern Spotter/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Weak Verb Lab/ })).toBeVisible();
});

test("home card opens gym", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Conjugation Gym/ }).click();
  await expect(page).toHaveURL(/\/gym$/);
  await expect(
    page.getByRole("heading", { name: "Produce the table" }),
  ).toBeVisible();
});

test("nav reaches every mode", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation");

  await nav.getByRole("link", { name: "Atlas" }).click();
  await expect(page).toHaveURL(/\/atlas$/);
  await expect(page.getByRole("heading", { name: /The map of/ })).toBeVisible();

  await nav.getByRole("link", { name: "Gym" }).click();
  await expect(page).toHaveURL(/\/gym$/);
  await expect(
    page.getByRole("heading", { name: "Produce the table" }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "Spotter" }).click();
  await expect(page).toHaveURL(/\/spotter$/);
  await expect(
    page.getByRole("heading", { name: "Name what you see" }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "Lab" }).click();
  await expect(page).toHaveURL(/\/lab$/);
  await expect(
    page.getByRole("heading", {
      name: /Sound analog vs what you actually say/,
    }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "Home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "تدريب الصرف" }),
  ).toBeVisible();
});

test("header toggles harakat and label mode", async ({ page }) => {
  await page.goto("/gym");
  await expect(page.getByText("كَتَبَ").first()).toBeVisible();

  await page.getByRole("button", { name: "Harakat on" }).click();
  await expect(page.getByRole("button", { name: "Harakat off" })).toBeVisible();
  await expect(page.getByRole("table").getByText("كتب").first()).toBeVisible();
  await expect(page.getByRole("table").getByText("كَتَبَ")).toHaveCount(0);

  await page.getByRole("button", { name: "Labels: Form I–X" }).click();
  await expect(page.getByRole("button", { name: "Labels: وزن" })).toBeVisible();
});
