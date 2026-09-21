import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: vi.fn() }));
const audit = vi.hoisted(() => vi.fn());
vi.mock("@/modules/identity/audit/repository", () => ({
  recordAdminAuditEvent: audit,
}));
import { changeCommentVisibility } from "@/modules/interactions/moderation/repository";

const id = "10000000-0000-4000-8000-000000000001";
function database(changed = true) {
  const returning = vi
    .fn()
    .mockResolvedValue(changed ? [{ postId: "post-id" }] : []);
  const where = vi.fn(() => ({ returning }));
  const set = vi.fn((values: Record<string, unknown>) => {
    void values;
    return { where };
  });
  const update = vi.fn(() => ({ set }));
  const limit = vi.fn().mockResolvedValue([{ slug: "post" }]);
  const tx = {
    update,
    select: vi.fn(() => ({
      from: vi.fn(() => ({ where: vi.fn(() => ({ limit })) })),
    })),
  };
  const transaction = vi.fn((callback: (value: typeof tx) => unknown) =>
    callback(tx),
  );
  return { db: { transaction } as never, tx, set, where };
}

describe("comment visibility repository", () => {
  it("hides with moderated timestamp and audit in the same transaction", async () => {
    const fake = database();
    expect(await changeCommentVisibility(id, "hide", "admin", fake.db)).toEqual(
      { status: "hidden", slug: "post" },
    );
    expect(fake.set).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "hidden",
        moderatedAt: expect.any(Date),
      }),
    );
    expect(audit).toHaveBeenCalledWith(
      "admin",
      { action: "comment.hide", result: "success", entityId: id },
      fake.tx,
    );
  });
  it("restores without changing original author, body or creation date", async () => {
    const fake = database();
    expect(
      await changeCommentVisibility(id, "restore", "admin", fake.db),
    ).toEqual({ status: "visible", slug: "post" });
    expect(fake.set).toHaveBeenCalledWith(
      expect.objectContaining({ status: "visible", moderatedAt: null }),
    );
    expect(vi.mocked(fake.set).mock.lastCall?.[0]).not.toHaveProperty("body");
    expect(vi.mocked(fake.set).mock.lastCall?.[0]).not.toHaveProperty(
      "createdAt",
    );
  });
  it("rejects conflicting concurrent status without audit", async () => {
    audit.mockClear();
    const fake = database(false);
    expect(
      await changeCommentVisibility(id, "hide", "admin", fake.db),
    ).toBeNull();
    expect(audit).not.toHaveBeenCalled();
  });
});
