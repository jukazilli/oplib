import { describe, expect, it } from "vitest";

import { optimisticVersionWindow } from "@/modules/publishing/optimistic-version";

describe("publishing optimistic version", () => {
  it("covers PostgreSQL submilliseconds lost by JavaScript Date", () => {
    const version = new Date("2026-09-22T18:42:10.123Z");
    const window = optimisticVersionWindow(version);

    expect(window.start.toISOString()).toBe("2026-09-22T18:42:10.123Z");
    expect(window.end.toISOString()).toBe("2026-09-22T18:42:10.124Z");
  });

  it("does not include the next transported version", () => {
    const version = new Date("2026-09-22T18:42:10.123Z");
    const { start, end } = optimisticVersionWindow(version);
    const current = new Date("2026-09-22T18:42:10.124Z");

    expect(current.getTime()).toBeGreaterThanOrEqual(end.getTime());
    expect(current.getTime()).not.toBe(start.getTime());
  });
});
