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

test("public discovery routes fit tablet and desktop viewports", async ({
  page,
}) => {
  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    for (const pathname of ["/", "/publicacoes", "/areas"]) {
      await page.goto(pathname);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
    }
  }
});

test("public shell exposes a working keyboard skip link", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Ir para o conteúdo" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#conteudo")).toBeFocused();
});

test("public UI respects reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const motion = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.animation = "pulse 2s infinite";
    probe.style.transition = "opacity 2s";
    document.body.append(probe);
    const style = getComputedStyle(probe);
    const result = {
      reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
      animationDuration: style.animationDuration,
      animationIterationCount: style.animationIterationCount,
      transitionDuration: style.transitionDuration,
    };
    probe.remove();
    return result;
  });

  expect(motion).toEqual({
    reduced: true,
    animationDuration: "0.01ms",
    animationIterationCount: "1",
    transitionDuration: "0.01ms",
  });
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
