import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: vi.fn() }));
import { listAdminComments } from "@/modules/admin/comments";

describe("administrative comments repository", () => {
  it("applies the status and cursor filters, ordering and one extra row for next page", async () => {
    const rows = Array.from({ length: 51 }, (_, index) => ({
      id: String(index),
    }));
    const limit = vi.fn().mockResolvedValue(rows);
    const orderBy = vi.fn(() => ({ limit }));
    const where = vi.fn(() => ({ orderBy }));
    const db = {
      select: vi.fn(() => ({
        from: vi.fn(() => ({ innerJoin: vi.fn(() => ({ where })) })),
      })),
    } as never;
    const result = await listAdminComments(
      "hidden",
      {
        createdAt: new Date("2026-09-21T12:00:00.000Z"),
        id: "10000000-0000-4000-8000-000000000001",
      },
      db,
    );
    expect(result.comments).toHaveLength(50);
    expect(result.hasMore).toBe(true);
    expect(where).toHaveBeenCalledOnce();
    expect(orderBy).toHaveBeenCalledOnce();
    expect(limit).toHaveBeenCalledWith(51);
  });
});
