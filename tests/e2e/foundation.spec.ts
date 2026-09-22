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

test("public mutations reject cross-origin requests before side effects", async ({
  request,
}) => {
  for (const pathname of [
    "/api/publications/nao-existe/like",
    "/api/publications/nao-existe/comments",
  ]) {
    const response = await request.post(pathname, {
      headers: {
        origin: "https://origem-invalida.example",
        "sec-fetch-site": "cross-site",
      },
      data: {},
    });

    expect(response.status()).toBe(403);
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(response.headers()["set-cookie"]).toBeUndefined();
    await expect(response.json()).resolves.toEqual({
      message: "Requisição recusada.",
    });
  }
});

test("comment endpoint rejects unsafe payloads without visitor state", async ({
  request,
}) => {
  const unsupported = await request.post(
    "/api/publications/nao-existe/comments",
    {
      headers: { "content-type": "text/plain" },
      data: "comentário",
    },
  );
  expect(unsupported.status()).toBe(415);
  expect(unsupported.headers()["cache-control"]).toContain("no-store");
  expect(unsupported.headers()["set-cookie"]).toBeUndefined();

  const malformed = await request.post(
    "/api/publications/nao-existe/comments",
    {
      headers: { "content-type": "application/json" },
      data: '{"body":',
    },
  );
  expect(malformed.status()).toBe(400);
  expect(malformed.headers()["cache-control"]).toContain("no-store");
  expect(malformed.headers()["set-cookie"]).toBeUndefined();
  await expect(malformed.json()).resolves.toEqual({
    message: "Revise os campos antes de publicar.",
  });
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

  const durationInMilliseconds = (value: string) =>
    value.endsWith("ms")
      ? Number.parseFloat(value)
      : Number.parseFloat(value) * 1_000;

  expect(motion.reduced).toBe(true);
  expect(motion.animationIterationCount).toBe("1");
  expect(durationInMilliseconds(motion.animationDuration)).toBeLessThanOrEqual(
    0.01,
  );
  expect(durationInMilliseconds(motion.transitionDuration)).toBeLessThanOrEqual(
    0.01,
  );
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
