import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
test("a página-base comunica o acervo sem violações acessíveis automáticas", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Conhecimento que atravessa áreas.",
    }),
  ).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
