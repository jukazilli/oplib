import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const temporaryDirectories: string[] = [];
const scanner = resolve("scripts/check-tracked-secrets.mjs");

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("tracked secret scanner", () => {
  it("accepts empty examples and scans the current tracked repository", () => {
    expect(() =>
      execFileSync(process.execPath, [scanner], { stdio: "pipe" }),
    ).not.toThrow();
  });

  it("rejects a populated sensitive assignment without printing its value", () => {
    const directory = mkdtempSync(join(tmpdir(), "oplib-secret-scan-"));
    temporaryDirectories.push(directory);
    const fixture = join(directory, "leaked.env");
    const value = ["not", "-a-real-", "secret"].join("");
    writeFileSync(fixture, `CLERK_SECRET_KEY=${value}\n`, "utf8");

    const result = spawnSync(process.execPath, [scanner, fixture], {
      encoding: "utf8",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("valor de variável secreta");
    expect(result.stderr).not.toContain(value);
  });
});
