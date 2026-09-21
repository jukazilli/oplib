import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  save: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));

vi.mock("@/app/admin/publicacoes/actions", () => ({
  saveDraftAction: mocks.save,
}));

import { DraftComposer } from "@/components/editor/draft-composer";

beforeEach(() => {
  window.localStorage.clear();
  mocks.replace.mockReset();
  mocks.refresh.mockReset();
  mocks.save.mockReset();
});

afterEach(cleanup);

describe("draft composer", () => {
  it("starts with the two approved creation fields", () => {
    render(<DraftComposer initialDraft={null} />);
    expect(
      screen.getByRole("heading", { name: "Nova publicação" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Título" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Conteúdo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Salvar rascunho" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Adicionar capa" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/pipeline|schema|canônico/i),
    ).not.toBeInTheDocument();
  });

  it("keeps taxonomy selected when its popover closes from an outside click", async () => {
    const user = userEvent.setup();
    render(
      <DraftComposer
        initialDraft={null}
        taxonomy={{
          categories: [
            {
              id: "10000000-0000-4000-8000-000000000002",
              name: "Ciência",
              slug: "ciencia",
              usageCount: 0,
            },
          ],
          tags: [
            {
              id: "10000000-0000-4000-8000-000000000003",
              name: "Pesquisa",
              slug: "pesquisa",
              usageCount: 0,
            },
          ],
        }}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Adicionar taxonomia" }),
    );
    expect(
      screen.getByRole("region", { name: "Taxonomia" }),
    ).toBeInTheDocument();
    await user.selectOptions(
      screen.getByLabelText("Categoria"),
      "10000000-0000-4000-8000-000000000002",
    );
    await user.click(screen.getByRole("button", { name: "Pesquisa" }));
    await user.click(screen.getByRole("heading", { name: "Nova publicação" }));
    expect(
      screen.queryByRole("region", { name: "Taxonomia" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "2 classificações" }),
    ).toBeInTheDocument();
  });

  it("saves explicitly and replaces the URL with the persisted draft", async () => {
    const user = userEvent.setup();
    mocks.save.mockResolvedValue({
      status: "success",
      draft: {
        id: "10000000-0000-4000-8000-000000000001",
        title: "Meu rascunho",
        markdown: "Primeira ideia",
        categoryId: "",
        tagIds: [],
        cover: null,
        updatedAt: "2026-09-20T22:30:00.000Z",
      },
    });
    render(<DraftComposer initialDraft={null} />);

    await user.type(
      screen.getByRole("textbox", { name: "Título" }),
      "Meu rascunho",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Conteúdo" }),
      "Primeira ideia",
    );
    await user.click(screen.getByRole("button", { name: "Salvar rascunho" }));

    expect(mocks.save).toHaveBeenCalledOnce();
    expect(mocks.replace).toHaveBeenCalledWith(
      "/admin/publicacoes?draft=10000000-0000-4000-8000-000000000001",
    );
    expect(await screen.findByText(/Salvo às/)).toBeInTheDocument();
  });

  it("uses the product dialog before discarding unsaved changes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const confirmSpy = vi.spyOn(window, "confirm");
    render(<DraftComposer initialDraft={null} onClose={onClose} />);

    await user.type(screen.getByRole("textbox", { name: "Título" }), "Ideia");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(confirmSpy).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "Continuar editando" }),
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    await user.click(
      screen.getByRole("button", { name: "Descartar alterações" }),
    );
    expect(onClose).toHaveBeenCalledOnce();
    confirmSpy.mockRestore();
  });

  it("advances to a safe Markdown preview and returns to composition", async () => {
    const user = userEvent.setup();
    render(<DraftComposer initialDraft={null} />);

    await user.type(
      screen.getByRole("textbox", { name: "Conteúdo" }),
      "# Ideia{enter}{enter}<script>alert(1)</script>",
    );
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Avançar" }));

    expect(screen.getByText("2 de 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ideia" })).toBeInTheDocument();
    expect(
      screen.getByText("HTML não é exibido na prévia."),
    ).toBeInTheDocument();
    expect(document.querySelector("script")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Voltar" }));
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    expect(
      (screen.getByRole("textbox", { name: "Conteúdo" }) as HTMLTextAreaElement)
        .value,
    ).toContain("# Ideia");
  });

  it("recovers a local copy based on the same server version", async () => {
    window.localStorage.setItem(
      "oplib:draft:10000000-0000-4000-8000-000000000001",
      JSON.stringify({
        title: "Título recuperado",
        markdown: "Texto recuperado",
        baseUpdatedAt: "2026-09-20T20:00:00.000Z",
        savedLocallyAt: "2026-09-20T20:05:00.000Z",
      }),
    );
    render(
      <DraftComposer
        initialDraft={{
          id: "10000000-0000-4000-8000-000000000001",
          title: "Título salvo",
          markdown: "Texto salvo",
          categoryId: "",
          tagIds: [],
          cover: null,
          updatedAt: "2026-09-20T20:00:00.000Z",
        }}
      />,
    );

    expect(
      await screen.findByText("Cópia local recuperada."),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Título" })).toHaveValue(
      "Título recuperado",
    );
  });
});
