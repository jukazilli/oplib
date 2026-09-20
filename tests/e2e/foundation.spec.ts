import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("public home is available", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  expect(response?.headers()["content-security-policy-report-only"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Conhecimento que atravessa áreas.",
    }),
  ).toBeVisible();
});

test("anonymous visitor cannot access the collection", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/sign-in(?:\/|\?|$)/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Acesso administrativo" }),
  ).toBeVisible();
  await expect(page.getByText(/cadastro|criar conta/i)).toHaveCount(0);
});

test("public sign-up route is absent", async ({ request }) => {
  const response = await request.get("/sign-up");

  expect(response.status()).toBe(404);
});

test("invalid sign-in does not enumerate identities", async ({ page }) => {
  await page.goto("/sign-in");
  await page
    .locator('input[name="identifier"]')
    .fill("conta-inexistente+clerk_test@example.com");
  await page.locator('button[type="submit"]').click();

  await expect(
    page.getByText(
      "Não foi possível entrar. Verifique os dados e tente novamente.",
    ),
  ).toBeVisible();
});

test("public home has no critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page }).analyze();
  const criticalViolations = results.violations.filter(
    (violation) => violation.impact === "critical",
  );

  expect(criticalViolations).toEqual([]);
});

test("health endpoint reports a safe status", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["x-correlation-id"]).toMatch(/^[0-9a-f-]{36}$/);
  await expect(response.json()).resolves.toMatchObject({
    status: "healthy",
    database: true,
  });
});
