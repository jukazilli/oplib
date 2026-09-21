import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  admin: vi.fn(),
  change: vi.fn(),
  revalidate: vi.fn(),
  log: vi.fn(),
}));
vi.mock("@/modules/identity/admin", () => ({
  requireAdminCommand: mocks.admin,
}));
vi.mock("@/modules/interactions/moderation/repository", () => ({
  changeCommentVisibility: mocks.change,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/observability/logger", () => ({ logEvent: mocks.log }));
import { changeCommentVisibilityAction } from "@/app/admin/comentarios/actions";

const id = "10000000-0000-4000-8000-000000000001";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.admin.mockResolvedValue({ userId: "admin" });
  mocks.change.mockResolvedValue({ status: "hidden", slug: "post" });
});
describe("comment moderation action", () => {
  it("authorizes, validates and invalidates the public reading path after persistence", async () => {
    expect(await changeCommentVisibilityAction({ id, intent: "hide" })).toEqual(
      {
        status: "success",
        visibility: "hidden",
        message: "Comentário ocultado.",
      },
    );
    expect(mocks.change).toHaveBeenCalledWith(id, "hide", "admin");
    expect(mocks.revalidate).toHaveBeenCalledWith("/publicacoes/post");
  });
  it("does not mutate on invalid input or authorization failure", async () => {
    expect(
      (await changeCommentVisibilityAction({ id: "bad", intent: "hide" }))
        .status,
    ).toBe("error");
    mocks.admin.mockRejectedValueOnce(new Error("forbidden"));
    await expect(
      changeCommentVisibilityAction({ id, intent: "hide" }),
    ).rejects.toThrow("forbidden");
    expect(mocks.change).not.toHaveBeenCalled();
  });
  it("returns conflict and retryable failure without disclosing internals", async () => {
    mocks.change
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error("database secret"));
    expect(
      (await changeCommentVisibilityAction({ id, intent: "hide" })).status,
    ).toBe("conflict");
    const failure = await changeCommentVisibilityAction({ id, intent: "hide" });
    expect(failure.status).toBe("error");
    expect(failure.message).not.toContain("secret");
  });
});
