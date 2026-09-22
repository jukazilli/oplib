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
      name: "Conhecimento para construir, preservar e compartilhar.",
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

test("anonymous administrative commands are rejected safely", async ({
  request,
}) => {
  for (const pathname of ["/api/admin/covers/pathname", "/api/admin/covers"]) {
    const response = await request.post(pathname, { data: {} });

    expect(response.status()).toBe(401);
    expect(response.headers()["cache-control"]).toContain("no-store");
    await expect(response.json()).resolves.toEqual({
      error: "Acesso administrativo não autorizado.",
    });
  }
});

test("public discovery routes remain accessible and fit a 320px viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });

  for (const pathname of ["/", "/publicacoes", "/areas"]) {
    const response = await page.goto(pathname);
    expect(response?.ok(), `${pathname} should respond successfully`).toBe(
      true,
    );
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      `${pathname} should have no WCAG A/AA violations`,
    ).toEqual([]);
  }
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
