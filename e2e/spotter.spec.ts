import { expect, test } from "@playwright/test";
import { answerSpotterStep, finishSpotterRound, spotterStep } from "./helpers";

test("spotter round accepts an answer and updates the score", async ({
  page,
}) => {
  await page.goto("/spotter");
  await expect(
    page.getByRole("heading", { name: "Name what you see" }),
  ).toBeVisible();
  await expect(page.getByText("Identify this verb")).toBeVisible();
  await expect(page.getByText("Score 0/0")).toBeVisible();

  await answerSpotterStep(page);

  await expect(page.getByText(/Score \d+\/1/)).toBeVisible();
  await expect(page.getByText(/^(Correct|Not quite)/)).toBeVisible();
});

test("spotter can finish a round and start the next", async ({ page }) => {
  await page.goto("/spotter");
  await finishSpotterRound(page);
  await expect(page.getByText(/Score \d+\/[1-9]/)).toBeVisible();

  const score = await page.getByText(/Score \d+\/\d+/).textContent();
  await page.getByRole("button", { name: /Next verb/ }).click();
  await expect(spotterStep(page)).toBeVisible();
  await expect(page.getByText(score ?? "")).toBeVisible();
  await expect(page.getByRole("button", { name: /Next verb/ })).toHaveCount(0);
});

test("spotter number key answers the current step", async ({ page }) => {
  await page.goto("/spotter");
  await expect(spotterStep(page)).toBeVisible();
  await page.getByRole("heading", { name: "Name what you see" }).click();
  await page.keyboard.press("1");
  await expect(page.getByText(/Score \d+\/1/)).toBeVisible();
});

test("spotter filters still leave a playable round", async ({ page }) => {
  await page.goto("/spotter");
  await page.getByLabel("Include weak verbs").check();
  await expect(page.getByText("Identify this verb")).toBeVisible();
  await expect(spotterStep(page)).toBeVisible();

  await page
    .locator("[data-spotter-filters]")
    .getByRole("button", { name: "Voice", exact: true })
    .click();
  await expect(page.getByText("Identify this verb")).toBeVisible();
  await expect(spotterStep(page)).toBeVisible();
  await expect(spotterStep(page).getByText("Voice?")).toHaveCount(0);
});
