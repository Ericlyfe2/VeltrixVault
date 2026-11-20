import { expect, test } from "@playwright/test";

test("homepage presents the public-data product", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Read the game");
  await expect(page.getByRole("link", { name: /open the match lab/i }).first()).toBeVisible();
  await expect(page.getByText(/no tips/i).first()).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("league explorer reaches a table and a team profile", async ({ page }) => {
  await page.goto("/analytics");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Every table");
  const leagueLink = page.locator('a[href="/analytics/premier-league-2025-26"]').first();
  await expect(leagueLink).toBeVisible();
  await leagueLink.click();

  await expect(page).toHaveURL(/\/analytics\/premier-league-2025-26$/);
  await expect(page.getByRole("table", { name: /league table/i })).toBeVisible();

  const teamLink = page.locator('a[href^="/teams/"]').first();
  await teamLink.click();
  await expect(page).toHaveURL(/\/teams\//);
  await expect(page.getByText(/home and away/i).first()).toBeVisible();
});

test("Match Lab runs a fixture without an account", async ({ page }) => {
  await page.goto("/match-lab");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("One fixture");
  await page.locator("#home-team").selectOption({ index: 1 });
  await page.locator("#away-team").selectOption({ index: 2 });
  await page.getByRole("button", { name: /run the model/i }).click();

  await expect(page.getByText("Poisson estimate")).toBeVisible();
  await expect(page.getByText("Most likely scorelines", { exact: true })).toBeVisible();
  await expect(page.getByText(/sign in to save/i)).toBeVisible();
});

test("static information pages render their core copy", async ({ page }) => {
  const cases = [
    { path: "/methodology", text: /independent poisson/i },
    { path: "/pricing", text: /free/i },
    { path: "/about", text: /veltrixvault/i },
    { path: "/privacy", text: /privacy/i },
    { path: "/terms", text: /terms/i },
  ];

  for (const entry of cases) {
    await page.goto(entry.path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("main").getByText(entry.text).first()).toBeVisible();
  }
});

test("unknown routes show the branded not-found page", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");

  await expect(page.getByText("404", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("off the pitch");
  await expect(page.getByRole("link", { name: /homepage/i })).toBeVisible();
});
