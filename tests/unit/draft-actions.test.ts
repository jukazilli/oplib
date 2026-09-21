import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  create: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
  revalidate: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/modules/identity/admin", () => ({
  requireAdminCommand: mocks.authorize,
}));
vi.mock("@/modules/publishing/draft-repository", () => ({
  createDraft: mocks.create,
  getDraftById: mocks.get,
  updateDraft: mocks.update,
}));

import { saveDraftAction } from "@/app/admin/publicacoes/actions";

function draftForm(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.authorize.mockResolvedValue({ userId: "admin" });
});

describe("draft actions", () => {
  it("authorizes and creates an incomplete draft", async () => {
    mocks.create.mockResolvedValue({
      id: "10000000-0000-4000-8000-000000000001",
      title: "",
      markdown: "Primeira ideia",
      updatedAt: new Date("2026-09-20T22:30:00.000Z"),
    });

    const result = await saveDraftAction(
      draftForm({ id: "", version: "", title: "", markdown: "Primeira ideia" }),
    );

    expect(mocks.authorize).toHaveBeenCalledOnce();
    expect(mocks.create).toHaveBeenCalledWith({
      title: "",
      markdown: "Primeira ideia",
      categoryId: "",
      tagIds: [],
      cover: null,
    });
    expect(result).toMatchObject({ status: "success" });
    expect(mocks.revalidate).toHaveBeenCalledWith("/admin/publicacoes");
  });

  it("returns the current server version after an optimistic conflict", async () => {
    mocks.update.mockResolvedValue(null);
    mocks.get.mockResolvedValue({
      id: "10000000-0000-4000-8000-000000000001",
      title: "Versão do servidor",
      markdown: "Conteúdo atual",
      updatedAt: new Date("2026-09-20T23:00:00.000Z"),
    });

    const result = await saveDraftAction(
      draftForm({
        id: "10000000-0000-4000-8000-000000000001",
        version: "2026-09-20T22:30:00.000Z",
        title: "Minha cópia",
        markdown: "Conteúdo local",
      }),
    );

    expect(result).toEqual({
      status: "conflict",
      message:
        "Este rascunho mudou em outra sessão. Escolha qual versão manter.",
      draft: {
        id: "10000000-0000-4000-8000-000000000001",
        title: "Versão do servidor",
        markdown: "Conteúdo atual",
        updatedAt: "2026-09-20T23:00:00.000Z",
      },
    });
  });
});
