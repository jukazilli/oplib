import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: vi.fn() }));
import {
  createPublicComment,
  listVisibleComments,
} from "@/modules/interactions/comments/repository";

const row = {
  id: "comment-id",
  authorName: "Anônimo",
  body: "Olá",
  createdAt: new Date("2026-09-21T12:00:00.000Z"),
};

describe("comments repository", () => {
  it("selects visible comments and serializes timestamps", async () => {
    const orderBy = vi.fn().mockResolvedValue([row]);
    const where = vi.fn(() => ({ orderBy }));
    const db = {
      select: vi.fn(() => ({ from: vi.fn(() => ({ where })) })),
    } as never;
    expect(await listVisibleComments("post-id", db)).toEqual([
      { ...row, createdAt: row.createdAt.toISOString() },
    ]);
    expect(where).toHaveBeenCalledOnce();
  });
  it("inserts only for a published slug and returns persisted data", async () => {
    const values = vi.fn(() => ({
      returning: vi.fn().mockResolvedValue([row]),
    }));
    const tx = {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue([{ id: "post-id" }]),
          })),
        })),
      })),
      insert: vi.fn(() => ({ values })),
    };
    const db = { transaction: vi.fn((callback) => callback(tx)) } as never;
    expect(
      await createPublicComment(
        "post",
        { authorName: "Anônimo", body: "Olá" },
        db,
      ),
    ).toEqual({ ...row, createdAt: row.createdAt.toISOString() });
    expect(values).toHaveBeenCalledWith({
      postId: "post-id",
      authorName: "Anônimo",
      body: "Olá",
    });
  });
  it("never inserts for a draft, withdrawn or unknown slug", async () => {
    const tx = {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([]) })),
        })),
      })),
      insert: vi.fn(),
    };
    const db = { transaction: vi.fn((callback) => callback(tx)) } as never;
    expect(
      await createPublicComment(
        "retirada",
        { authorName: "Anônimo", body: "Olá" },
        db,
      ),
    ).toBeNull();
    expect(tx.insert).not.toHaveBeenCalled();
  });
});
