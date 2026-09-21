import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ del: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@vercel/blob", () => ({ del: mocks.del }));

import type { Database } from "@/lib/db";
import {
  cleanupDetachedCover,
  deleteDetachedCover,
} from "@/modules/media/covers";

function databaseWith(rows: Array<{ id: string; references: number }>) {
  const limit = vi.fn().mockResolvedValue(rows);
  const select = vi.fn(() => ({
    from: () => ({
      leftJoin: () => ({
        where: () => ({ groupBy: () => ({ limit }) }),
      }),
    }),
  }));
  const where = vi.fn().mockResolvedValue(undefined);
  const remove = vi.fn(() => ({ where }));
  return {
    database: { select, delete: remove } as unknown as Database,
    remove,
    where,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("cover lifecycle", () => {
  it("deletes a transient upload that has no database record", async () => {
    const { database, remove } = databaseWith([]);

    await expect(
      cleanupDetachedCover("covers/transient.webp", database),
    ).resolves.toEqual({ deleted: true, hadDatabaseRecord: false });
    expect(mocks.del).toHaveBeenCalledWith("covers/transient.webp");
    expect(remove).not.toHaveBeenCalled();
  });

  it("deletes both blob and detached metadata", async () => {
    const { database, where } = databaseWith([
      { id: "10000000-0000-4000-8000-000000000001", references: 0 },
    ]);

    await cleanupDetachedCover("covers/old.webp", database);
    expect(mocks.del).toHaveBeenCalledWith("covers/old.webp");
    expect(where).toHaveBeenCalledOnce();
  });

  it("keeps a cover while a publication still references it", async () => {
    const { database, remove } = databaseWith([
      { id: "10000000-0000-4000-8000-000000000001", references: 1 },
    ]);

    await expect(
      cleanupDetachedCover("covers/in-use.webp", database),
    ).rejects.toThrow("ainda está vinculada");
    expect(mocks.del).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it("applies the same guard to direct cleanup", async () => {
    await expect(
      deleteDetachedCover("covers/in-use.webp", {
        isStillReferenced: async () => true,
      }),
    ).rejects.toThrow("ainda está vinculada");
  });
});
