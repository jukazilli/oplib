import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  admin: vi.fn(),
  list: vi.fn(),
  notFound: vi.fn(),
  log: vi.fn(),
}));
vi.mock("@/modules/identity/admin", () => ({
  requireAdminCommand: mocks.admin,
}));
vi.mock("@/modules/admin/comments", () => ({ listAdminComments: mocks.list }));
vi.mock("@/app/admin/comentarios/actions", () => ({
  changeCommentVisibilityAction: vi.fn(),
}));
vi.mock("@/lib/observability/logger", () => ({ logEvent: mocks.log }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  notFound: () => {
    mocks.notFound();
    throw new Error("NEXT_NOT_FOUND");
  },
  unstable_rethrow: vi.fn(),
}));
import AdminCommentsPage from "@/app/admin/comentarios/page";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const page = (status = "all", before?: string) =>
  AdminCommentsPage({ searchParams: Promise.resolve({ status, before }) });

describe("administrative comments", () => {
  it("authorizes before fetching and displays literal text, status and source", async () => {
    mocks.list.mockResolvedValue({
      comments: [
        {
          id: "id",
          authorName: '<img src=x onerror="alert(2)">',
          body: "<script>alert(1)</script> **texto**",
          status: "visible",
          createdAt: new Date("2026-09-21T12:00:00.000Z"),
          postTitle: "Publicação",
          postId: "10000000-0000-4000-8000-000000000001",
        },
      ],
      hasMore: false,
    });
    render(await page("visible"));
    expect(mocks.admin).toHaveBeenCalledOnce();
    expect(mocks.list).toHaveBeenCalledWith("visible", undefined);
    expect(
      screen.getByText("<script>alert(1)</script> **texto**"),
    ).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector("img")).toBeNull();
    expect(
      screen.getByText('<img src=x onerror="alert(2)">'),
    ).toBeInTheDocument();
    expect(screen.getByText("Visível")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Publicação" })).toHaveAttribute(
      "href",
      "/admin/publicacoes?draft=10000000-0000-4000-8000-000000000001",
    );
  });
  it("shows filtered empty state and never queries malformed filters", async () => {
    mocks.list.mockResolvedValue({ comments: [], hasMore: false });
    render(await page("hidden"));
    expect(screen.getByText("Nenhum comentário oculto.")).toBeInTheDocument();
    await expect(page("wrong")).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(page("all", "broken")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.list).toHaveBeenCalledTimes(1);
  });
  it("does not read data when authorization fails", async () => {
    mocks.admin.mockRejectedValueOnce(new Error("forbidden"));
    await expect(page()).rejects.toThrow("forbidden");
    expect(mocks.list).not.toHaveBeenCalled();
  });
  it("returns generic recovery on database error", async () => {
    mocks.list.mockRejectedValue(new Error("database secret"));
    render(await page());
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Atualize a página para tentar novamente.",
    );
    expect(screen.queryByText(/secret/)).not.toBeInTheDocument();
  });
});
