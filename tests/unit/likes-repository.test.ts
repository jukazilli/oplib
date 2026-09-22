import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: vi.fn() }));

import { registerLike } from "@/modules/interactions/likes/repository";

function database({ inserted = true, published = true } = {}) {
  const returning = vi
    .fn()
    .mockResolvedValue(inserted ? [{ id: "like-id" }] : []);
  const onConflictDoNothing = vi.fn(() => ({ returning }));
  const values = vi.fn(() => ({ onConflictDoNothing }));
  const insert = vi.fn(() => ({ values }));
  let selectCall = 0;
  const select = vi.fn(() => {
    selectCall += 1;
    if (selectCall === 1) {
      const limit = vi
        .fn()
        .mockResolvedValue(published ? [{ id: "post-id" }] : []);
      return { from: vi.fn(() => ({ where: vi.fn(() => ({ limit })) })) };
    }
    return {
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{ value: inserted ? 5 : 4 }]),
      })),
    };
  });
  const tx = { select, insert };
  const transaction = vi.fn(async (callback: (value: typeof tx) => unknown) =>
    callback(tx),
  );
  return { db: { transaction } as never, insert, onConflictDoNothing };
}

describe("likes repository", () => {
  it("inserts with conflict protection and returns the confirmed count", async () => {
    const fake = database();
    await expect(registerLike("publicacao", "hash", fake.db)).resolves.toEqual({
      count: 5,
      alreadyLiked: false,
    });
    expect(fake.onConflictDoNothing).toHaveBeenCalledOnce();
  });

  it("treats a uniqueness conflict as the same existing like", async () => {
    const fake = database({ inserted: false });
    await expect(registerLike("publicacao", "hash", fake.db)).resolves.toEqual({
      count: 4,
      alreadyLiked: true,
    });
  });

  it("refuses likes for a non-public publication", async () => {
    const fake = database({ published: false });
    await expect(registerLike("retirada", "hash", fake.db)).resolves.toBeNull();
    expect(fake.insert).not.toHaveBeenCalled();
  });
});
