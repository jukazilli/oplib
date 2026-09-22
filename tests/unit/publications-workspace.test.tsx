import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  save: vi.fn(),
  changeStatus: vi.fn(),
  changeFeature: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));

vi.mock("@/app/admin/publicacoes/actions", () => ({
  saveDraftAction: mocks.save,
  changePublicationStatusAction: mocks.changeStatus,
  changePublicationFeatureAction: mocks.changeFeature,
}));

import { PublicationsWorkspace } from "@/components/editor/publications-workspace";

const publication = {
  id: "10000000-0000-4000-8000-000000000001",
  title: "Conhecimento em movimento",
  slug: "conhecimento-em-movimento",
  summary: "Uma síntese do conteúdo.",
  markdown: "Conteúdo completo",
  contentType: "article" as const,
  areaIds: [],
  categoryId: "",
  tagIds: [],
  course: "",
  discipline: "",
  originalDate: "",
  references: [],
  cover: null,
  status: "draft" as const,
  featured: false,
  updatedAt: "2026-09-20T22:30:00.000Z",
};

beforeEach(() => {
  mocks.replace.mockReset();
  mocks.refresh.mockReset();
  mocks.save.mockReset();
  mocks.changeStatus.mockReset();
  mocks.changeFeature.mockReset();
});

afterEach(cleanup);

describe("publications workspace", () => {
  it("separates the private list from the composer trigger", async () => {
    const user = userEvent.setup();
    render(
      <PublicationsWorkspace
        initialDraft={null}
        publications={[publication]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Publicações" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Conhecimento em movimento")).toBeInTheDocument();
    expect(screen.getByText("Seu acervo")).toBeInTheDocument();
    expect(
      screen.queryByText(/para você|seguir|comunidade/i),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Publique algo em seu acervo/i }),
    );
    expect(
      screen.getByRole("dialog", { name: "Nova publicação" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Título" })).toHaveFocus();
  });

  it("opens an existing draft from its three-dot menu", async () => {
    const user = userEvent.setup();
    render(
      <PublicationsWorkspace
        initialDraft={null}
        publications={[publication]}
      />,
    );

    await user.click(
      screen.getByLabelText("Mais ações para Conhecimento em movimento"),
    );
    await user.click(screen.getByRole("button", { name: "Editar" }));

    expect(
      screen.getByRole("dialog", { name: "Editar publicação" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Título" })).toHaveValue(
      "Conhecimento em movimento",
    );
    expect(mocks.replace).toHaveBeenCalledWith(
      "/admin/publicacoes?draft=10000000-0000-4000-8000-000000000001",
    );
  });

  it("opens the draft library from the sheet icon and resumes a composition", async () => {
    const user = userEvent.setup();
    render(
      <PublicationsWorkspace
        initialDraft={null}
        publications={[publication]}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /Publique algo em seu acervo/i }),
    );
    await user.click(screen.getByRole("button", { name: "Rascunhos" }));

    expect(
      screen.getByRole("heading", { name: "Rascunhos" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /Conhecimento em movimento/i }),
    );

    expect(
      screen.getByRole("dialog", { name: "Editar publicação" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Título" })).toHaveValue(
      "Conhecimento em movimento",
    );
  });

  it("confirms withdrawal from the published item menu", async () => {
    const user = userEvent.setup();
    mocks.changeStatus.mockResolvedValue({
      status: "success",
      publication: { ...publication, status: "withdrawn" },
      message: "Publicação retirada do ar.",
    });
    render(
      <PublicationsWorkspace
        initialDraft={null}
        publications={[{ ...publication, status: "published" }]}
      />,
    );

    await user.click(
      screen.getByLabelText("Mais ações para Conhecimento em movimento"),
    );
    await user.click(screen.getByRole("button", { name: "Retirar do ar" }));
    const dialog = screen.getByRole("alertdialog", { name: "Retirar do ar?" });
    expect(dialog).toBeInTheDocument();
    await user.click(
      within(dialog).getByRole("button", { name: "Retirar do ar" }),
    );

    expect(mocks.changeStatus).toHaveBeenCalledWith({
      id: publication.id,
      version: publication.updatedAt,
      intent: "withdraw",
    });
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("offers republication only for withdrawn items", async () => {
    const user = userEvent.setup();
    render(
      <PublicationsWorkspace
        initialDraft={null}
        publications={[{ ...publication, status: "withdrawn" }]}
      />,
    );

    await user.click(
      screen.getByLabelText("Mais ações para Conhecimento em movimento"),
    );
    await user.click(screen.getByRole("button", { name: "Republicar" }));
    expect(
      screen.getByRole("alertdialog", { name: "Republicar?" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Editar" }),
    ).not.toBeInTheDocument();
  });

  it("toggles editorial highlight only for a published item", async () => {
    const user = userEvent.setup();
    mocks.changeFeature.mockResolvedValue({
      status: "success",
      message: "Publicação destacada.",
    });
    render(
      <PublicationsWorkspace
        initialDraft={null}
        publications={[{ ...publication, status: "published" }]}
      />,
    );

    await user.click(
      screen.getByLabelText("Mais ações para Conhecimento em movimento"),
    );
    await user.click(screen.getByRole("button", { name: "Destacar" }));

    expect(mocks.changeFeature).toHaveBeenCalledWith({
      id: publication.id,
      version: publication.updatedAt,
      featured: true,
    });
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("shows the highlight state and offers removal", async () => {
    const user = userEvent.setup();
    render(
      <PublicationsWorkspace
        initialDraft={null}
        publications={[{ ...publication, status: "published", featured: true }]}
      />,
    );

    expect(screen.getByText("Destaque")).toBeInTheDocument();
    await user.click(
      screen.getByLabelText("Mais ações para Conhecimento em movimento"),
    );
    expect(
      screen.getByRole("button", { name: "Remover destaque" }),
    ).toBeInTheDocument();
  });
});
