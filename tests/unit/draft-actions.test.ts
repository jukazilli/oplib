import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  create: vi.fn(),
  get: vi.fn(),
  getAdmin: vi.fn(),
  update: vi.fn(),
  publish: vi.fn(),
  transitionStatus: vi.fn(),
  revalidate: vi.fn(),
  logEvent: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/observability/logger", () => ({ logEvent: mocks.logEvent }));
vi.mock("@/modules/identity/admin", () => ({
  requireAdminCommand: mocks.authorize,
}));
vi.mock("@/modules/publishing/draft-repository", () => ({
  createDraft: mocks.create,
  getDraftById: mocks.get,
  getAdminPublicationById: mocks.getAdmin,
  updateDraft: mocks.update,
  publishPublication: mocks.publish,
  transitionPublicationStatus: mocks.transitionStatus,
}));

import {
  changePublicationStatusAction,
  publishPublicationAction,
  saveDraftAction,
} from "@/app/admin/publicacoes/actions";

function draftForm(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getAdmin.mockReset();
  mocks.authorize.mockResolvedValue({ userId: "admin" });
});

describe("draft actions", () => {
  it("withdraws a published item and invalidates its public surfaces after commit", async () => {
    mocks.transitionStatus.mockResolvedValue({
      id: "10000000-0000-4000-8000-000000000001",
      slug: "publicacao",
      status: "withdrawn",
      updatedAt: new Date("2026-09-21T12:01:00.000Z"),
    });

    const result = await changePublicationStatusAction({
      id: "10000000-0000-4000-8000-000000000001",
      version: "2026-09-21T12:00:00.000Z",
      intent: "withdraw",
    });

    expect(mocks.transitionStatus).toHaveBeenCalledWith(
      "10000000-0000-4000-8000-000000000001",
      new Date("2026-09-21T12:00:00.000Z"),
      "withdraw",
      "admin",
    );
    expect(result).toMatchObject({
      status: "success",
      message: "Publicação retirada do ar.",
    });
    expect(mocks.revalidate).toHaveBeenCalledWith("/publicacoes/publicacao");
  });

  it("does not invalidate cache when a status transition conflicts", async () => {
    mocks.transitionStatus.mockResolvedValue(null);

    expect(
      await changePublicationStatusAction({
        id: "10000000-0000-4000-8000-000000000001",
        version: "2026-09-21T12:00:00.000Z",
        intent: "republish",
      }),
    ).toMatchObject({ status: "conflict" });
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it("rejects an invalid status transition before reaching the repository", async () => {
    expect(
      await changePublicationStatusAction({
        id: "invalid",
        intent: "withdraw",
      }),
    ).toEqual({ status: "error", message: "Ação inválida." });
    expect(mocks.transitionStatus).not.toHaveBeenCalled();
  });

  it("publishes a validated draft and revalidates public paths only after commit", async () => {
    const input = draftForm({
      id: "10000000-0000-4000-8000-000000000001",
      version: "2026-09-21T12:00:00.000Z",
      title: "Publicação",
      summary: "Resumo",
      markdown: "# Conteúdo",
      contentType: "article",
    });
    input.append("areaIds", "10000000-0000-4000-8000-000000000002");
    mocks.getAdmin.mockResolvedValue({ slug: "endereco-antigo" });
    mocks.publish.mockResolvedValue({
      id: "10000000-0000-4000-8000-000000000001",
      slug: "publicacao",
      updatedAt: new Date("2026-09-21T12:01:00.000Z"),
    });
    const result = await publishPublicationAction(input, "draft");
    expect(mocks.publish).toHaveBeenCalledWith(
      "10000000-0000-4000-8000-000000000001",
      new Date("2026-09-21T12:00:00.000Z"),
      expect.objectContaining({
        title: "Publicação",
        areaIds: ["10000000-0000-4000-8000-000000000002"],
      }),
      "admin",
      "draft",
    );
    expect(result).toMatchObject({
      status: "success",
      publicUrl: "/publicacoes/publicacao",
    });
    expect(mocks.revalidate).toHaveBeenCalledWith("/publicacoes/publicacao");
    expect(mocks.revalidate).toHaveBeenCalledWith(
      "/publicacoes/endereco-antigo",
    );
  });

  it("does not revalidate when another session changed the publication", async () => {
    const input = draftForm({
      id: "10000000-0000-4000-8000-000000000001",
      version: "2026-09-21T12:00:00.000Z",
      title: "Publicação",
      summary: "Resumo",
      markdown: "# Conteúdo",
      contentType: "article",
    });
    input.append("areaIds", "10000000-0000-4000-8000-000000000002");
    mocks.publish.mockResolvedValue(null);
    expect(await publishPublicationAction(input, "published")).toMatchObject({
      status: "conflict",
    });
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it("recovers as success when the same composition was already published", async () => {
    const input = draftForm({
      id: "10000000-0000-4000-8000-000000000001",
      version: "2026-09-21T12:00:00.000Z",
      title: "Publicação",
      slug: "publicacao",
      summary: "Resumo",
      markdown: "# Conteúdo",
      contentType: "article",
    });
    input.append("areaIds", "10000000-0000-4000-8000-000000000002");
    mocks.publish.mockResolvedValue(null);
    mocks.getAdmin.mockResolvedValue({
      id: "10000000-0000-4000-8000-000000000001",
      title: "Publicação",
      slug: "publicacao",
      summary: "Resumo",
      markdown: "# Conteúdo",
      contentType: "article",
      areaIds: ["10000000-0000-4000-8000-000000000002"],
      categoryId: "",
      tagIds: [],
      course: "",
      discipline: "",
      originalDate: "",
      references: [],
      cover: null,
      status: "published",
      updatedAt: new Date("2026-09-21T12:01:00.000Z"),
    });

    expect(await publishPublicationAction(input, "draft")).toMatchObject({
      status: "success",
      publicUrl: "/publicacoes/publicacao",
    });
    expect(mocks.revalidate).toHaveBeenCalledWith("/publicacoes/publicacao");
  });

  it("does not invalidate public cache when the transaction fails", async () => {
    const input = draftForm({
      id: "10000000-0000-4000-8000-000000000001",
      version: "2026-09-21T12:00:00.000Z",
      title: "Publicação",
      summary: "Resumo",
      markdown: "# Conteúdo",
      contentType: "article",
    });
    input.append("areaIds", "10000000-0000-4000-8000-000000000002");
    mocks.publish.mockRejectedValue(new Error("database unavailable"));
    expect(await publishPublicationAction(input, "draft")).toMatchObject({
      status: "error",
    });
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it("reports a cache warning without treating a committed publication as failed", async () => {
    const input = draftForm({
      id: "10000000-0000-4000-8000-000000000001",
      version: "2026-09-21T12:00:00.000Z",
      title: "Publicação",
      summary: "Resumo",
      markdown: "# Conteúdo",
      contentType: "article",
    });
    input.append("areaIds", "10000000-0000-4000-8000-000000000002");
    mocks.publish.mockResolvedValue({
      id: "10000000-0000-4000-8000-000000000001",
      slug: "publicacao",
      updatedAt: new Date("2026-09-21T12:01:00.000Z"),
    });
    mocks.revalidate.mockImplementationOnce(() => {
      throw new Error("cache");
    });
    const result = await publishPublicationAction(input, "draft");
    expect(result).toMatchObject({
      status: "success",
      warning: expect.stringContaining("Publicação salva"),
    });
  });
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
      slug: "",
      summary: "",
      markdown: "Primeira ideia",
      contentType: "",
      areaIds: [],
      categoryId: "",
      tagIds: [],
      course: "",
      discipline: "",
      originalDate: "",
      references: [],
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
