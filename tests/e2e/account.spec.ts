import { expect, test, type Page } from "@playwright/test";

async function runFixture(page: Page) {
  await page.goto("/match-lab");
  await page.waitForLoadState("networkidle");
  await page.locator("#home-team").selectOption({ index: 1 });
  await page.locator("#away-team").selectOption({ index: 2 });
  await expect(page.getByRole("button", { name: /run the model/i })).toBeEnabled();
  await page.getByRole("button", { name: /run the model/i }).click();
  await expect(page.getByText("Poisson estimate")).toBeVisible();
}

test("a free account can save, revisit, and delete an analysis", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "football2026";

  await page.goto("/signup");
  await page.getByLabel("Name").fill("E2E Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.locator("#acceptTerms").check();
  await page.getByRole("button", { name: /create.*account/i }).click();

  await expect(page.getByText("Your account is ready.")).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Good to see you");

  await page.goto("/dashboard/invite");
  await expect(page.locator("#invite-link")).toHaveValue(/ref=VV[A-Z0-9]{6}/);

  await runFixture(page);

  await page.getByLabel("Title").fill("E2E saved fixture");
  await page.getByLabel("Notes").fill("Checking the saved snapshot.");
  await page.getByRole("button", { name: "Save analysis" }).click();
  await expect(page.getByText("Saved to the Vault")).toBeVisible();

  await page.getByRole("link", { name: /open saved analysis/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/analyses\//);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("E2E saved fixture");
  await expect(page.getByText("A frozen snapshot.")).toBeVisible();
  await expect(page.getByText("Checking the saved snapshot.")).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /delete/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/analyses$/);
  await expect(page.getByText("Nothing saved yet.")).toBeVisible();
});

test("following a team updates the watchlist", async ({ page }) => {
  const email = `e2e-watch-${Date.now()}@example.com`;
  const password = "football2026";

  await page.goto("/signup");
  await page.getByLabel("Name").fill("Watchlist Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.locator("#acceptTerms").check();
  await page.getByRole("button", { name: /create.*account/i }).click();
  await expect(page.getByText("Your account is ready.")).toBeVisible();

  await page.goto("/analytics/premier-league-2025-26");
  await page.locator('a[href^="/teams/"]').first().click();
  await page.getByRole("button", { name: /follow team/i }).click();
  await expect(page.getByRole("button", { name: /following/i })).toBeVisible();

  await page.goto("/dashboard/watchlist");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Teams you follow");
  await expect(page.getByRole("button", { name: /remove/i }).first()).toBeVisible();

  await page.getByRole("button", { name: /remove/i }).first().click();
  await expect(page.getByText("No teams followed yet.")).toBeVisible();
});

test("a signed-out visitor is redirected from the dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
});
