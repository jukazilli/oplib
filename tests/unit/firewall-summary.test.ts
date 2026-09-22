import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const temporaryDirectories: string[] = [];
const summarizer = resolve("scripts/summarize-firewall.mjs");

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("firewall audit summary", () => {
  it("keeps operational rule details while removing sensitive values", () => {
    const directory = mkdtempSync(join(tmpdir(), "oplib-firewall-"));
    temporaryDirectories.push(directory);
    const active = join(directory, "active.json");
    const draft = join(directory, "draft.json");
    const output = join(directory, "summary.md");
    const secret = "never-print-this-header-value";
    const ip = "203.0.113.42";

    writeFileSync(
      active,
      JSON.stringify({
        firewallEnabled: true,
        botIdEnabled: false,
        changes: [],
        ips: [{ ip, action: "deny" }],
        rules: [
          {
            name: "Observe Preview admin authentication",
            active: true,
            valid: true,
            action: { mitigate: { action: "log" } },
            conditionGroup: [
              {
                conditions: [
                  { type: "path", op: "pre", value: "/sign-in" },
                  {
                    type: "header",
                    op: "eq",
                    key: "authorization",
                    value: secret,
                  },
                ],
              },
            ],
          },
        ],
        managedRules: {
          owasp: { active: true, action: "log", username: secret },
        },
        ownerId: "owner-secret",
        projectKey: "project-secret",
      }),
      "utf8",
    );
    writeFileSync(
      draft,
      JSON.stringify({
        firewallEnabled: true,
        rules: [
          {
            name: "Comments limit",
            active: true,
            valid: true,
            action: {
              mitigate: {
                rateLimit: {
                  action: "log",
                  algo: "fixed_window",
                  limit: 30,
                  window: 60,
                  keys: ["ip"],
                },
              },
            },
            conditionGroup: [
              {
                conditions: [
                  { type: "path", op: "pre", value: "/api/publications/" },
                  { type: "method", op: "eq", value: "POST" },
                ],
              },
            ],
          },
        ],
      }),
      "utf8",
    );

    execFileSync(process.execPath, [summarizer, active, output, draft], {
      stdio: "pipe",
    });
    const summary = readFileSync(output, "utf8");

    expect(summary).toContain("Observe Preview admin authentication");
    expect(summary).toContain("path pre /sign-in");
    expect(summary).toContain("Comments limit");
    expect(summary).toContain("rate_limit:log (30/60s; 1 chave(s))");
    expect(summary).toContain("Regras por IP: 1 (valores omitidos)");
    expect(summary).not.toContain(secret);
    expect(summary).not.toContain(ip);
    expect(summary).not.toContain("owner-secret");
    expect(summary).not.toContain("project-secret");
  });

  it("records the absence of a draft without inventing one", () => {
    const directory = mkdtempSync(join(tmpdir(), "oplib-firewall-"));
    temporaryDirectories.push(directory);
    const active = join(directory, "active.json");
    const output = join(directory, "summary.md");
    writeFileSync(active, JSON.stringify({ firewallEnabled: true }), "utf8");

    execFileSync(process.execPath, [summarizer, active, output], {
      stdio: "pipe",
    });

    expect(readFileSync(output, "utf8")).toContain(
      "Nenhum draft retornado pela API.",
    );
  });
});
