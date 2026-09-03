import { expect, type Page } from "@playwright/test";

export function spotterStep(page: Page) {
  return page.locator("section").filter({ hasText: /Step \d+ \// });
}

export async function answerSpotterStep(page: Page) {
  const step = spotterStep(page);
  await expect(step).toBeVisible();
  await step.getByRole("button").first().click();
}

export async function finishSpotterRound(page: Page) {
  for (let i = 0; i < 8; i += 1) {
    if (await page.getByRole("button", { name: /Next verb/ }).isVisible()) {
      return;
    }
    await answerSpotterStep(page);
  }
  await expect(page.getByRole("button", { name: /Next verb/ })).toBeVisible();
}
