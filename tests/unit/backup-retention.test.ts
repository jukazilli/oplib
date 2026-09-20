import { describe, expect, it } from "vitest";

import {
  parseBackupPath,
  relatedBackupPaths,
  selectExpiredBackups,
} from "../../scripts/lib/backup-retention.mjs";

const path = (tier: "daily" | "weekly", day: number) =>
  `backups/${tier}/2026-09-${String(day).padStart(2, "0")}T031700Z/oplib.dump.age`;

describe("backup retention", () => {
  it("keeps the seven newest daily and four newest weekly backups", () => {
    const daily = Array.from({ length: 9 }, (_, index) =>
      path("daily", index + 1),
    );
    const weekly = Array.from({ length: 6 }, (_, index) =>
      path("weekly", index + 1),
    );

    expect(selectExpiredBackups([...daily, ...weekly])).toEqual([
      path("daily", 2),
      path("daily", 1),
      path("weekly", 2),
      path("weekly", 1),
    ]);
  });

  it("ignores manifests, manual backups and unrelated objects", () => {
    expect(
      selectExpiredBackups([
        "backups/manual/2026-09-01T031700Z/oplib.dump.age",
        "backups/daily/2026-09-01T031700Z/oplib.manifest.json",
        "covers/image.webp",
      ]),
    ).toEqual([]);
  });

  it("recognizes only canonical encrypted paths and derives the pair", () => {
    const encrypted = path("daily", 20);
    expect(parseBackupPath(encrypted)).toMatchObject({
      tier: "daily",
      backupId: "2026-09-20T031700Z",
    });
    expect(relatedBackupPaths(encrypted)).toEqual([
      encrypted,
      "backups/daily/2026-09-20T031700Z/oplib.manifest.json",
    ]);
  });
});
