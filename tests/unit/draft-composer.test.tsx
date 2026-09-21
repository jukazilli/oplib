import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  save: vi.fn(),
  publish: vi.fn(),
  upload: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));

vi.mock("@/app/admin/publicacoes/actions", () => ({
  saveDraftAction: mocks.save,
  publishPublicationAction: mocks.publish,
}));
vi.mock("@vercel/blob/client", () => ({ upload: mocks.upload }));

import { DraftComposer } from "@/components/editor/draft-composer";

beforeEach(() => {
  window.localStorage.clear();
  mocks.replace.mockReset();
  mocks.refresh.mockReset();
  mocks.save.mockReset();
  mocks.publish.mockReset();
  mocks.upload.mockReset();
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("draft composer", () => {
  it("confirms before updating a published composition", async () => {
    const user = userEvent.setup();
    render(
      <DraftComposer
        initialDraft={{
          id: "10000000-0000-4000-8000-000000000001",
          title: "Artigo",
          slug: "artigo",
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
          updatedAt: "2026-09-21T12:00:00.000Z",
          status: "published",
        }}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Salvar rascunho" }),
    ).not.toBeInTheDocument();
    await user.type(
      screen.getByRole("textbox", { name: "Título" }),
      " revisado",
    );
    await user.click(
      screen.getByRole("button", { name: "Atualizar publicação" }),
    );
    expect(screen.getByRole("alertdialog")).toHaveTextContent(
      "substituirá a que está publicada",
    );
    expect(mocks.publish).not.toHaveBeenCalled();
    await user.click(
      within(screen.getByRole("alertdialog")).getByRole("button", {
        name: "Cancelar",
      }),
    );
    expect(mocks.publish).not.toHaveBeenCalled();
  });
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
    const header = screen
      .getByRole("heading", { name: "Nova publicação" })
      .closest("header");
    expect(header).not.toBeNull();
    expect(
      within(header!).getByRole("button", { name: "Adicionar capa" }),
    ).toBeInTheDocument();
    expect(
      within(header!).getByRole("button", { name: "Classificação" }),
    ).toBeInTheDocument();
    expect(
      within(header!).getByRole("button", {
        name: "Detalhes da publicação",
      }),
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
          areas: [],
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
      screen.getByRole("dialog", { name: "Taxonomia" }),
    ).toBeInTheDocument();
    await user.selectOptions(
      screen.getByLabelText("Categoria"),
      "10000000-0000-4000-8000-000000000002",
    );
    await user.click(screen.getByRole("button", { name: "Pesquisa" }));
    const taxonomyDialog = screen.getByRole("dialog", { name: "Taxonomia" });
    expect(taxonomyDialog).toHaveAttribute("aria-modal", "true");
    await user.click(taxonomyDialog.parentElement!);
    expect(
      screen.queryByRole("dialog", { name: "Taxonomia" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "2 classificações" }),
    ).toBeInTheDocument();
  });

  it("opens details centrally and closes with Escape without discarding the draft", async () => {
    const user = userEvent.setup();
    render(<DraftComposer initialDraft={null} />);
    await user.click(
      screen.getByRole("button", { name: "Detalhes da publicação" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Detalhes da publicação",
    });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.parentElement).toHaveClass("items-center", "justify-center");
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Detalhes da publicação" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Título" })).toBeInTheDocument();
  });

  it("saves explicitly and replaces the URL with the persisted draft", async () => {
    const user = userEvent.setup();
    mocks.save.mockResolvedValue({
      status: "success",
      draft: {
        id: "10000000-0000-4000-8000-000000000001",
        title: "Meu rascunho",
        slug: "meu-rascunho",
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

  it("reveals and submits metadata without densifying the initial composer", async () => {
    const user = userEvent.setup();
    mocks.save.mockResolvedValue({
      status: "success",
      draft: {
        id: "10000000-0000-4000-8000-000000000001",
        title: "Artigo",
        slug: "artigo",
        summary: "Síntese",
        markdown: "Conteúdo",
        contentType: "article",
        areaIds: [],
        categoryId: "",
        tagIds: [],
        course: "Engenharia de Software",
        discipline: "",
        originalDate: "",
        references: [],
        cover: null,
        updatedAt: "2026-09-21T10:00:00.000Z",
      },
    });
    render(<DraftComposer initialDraft={null} />);

    expect(screen.queryByLabelText("Resumo")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Detalhes da publicação" }),
    );
    await user.type(screen.getByLabelText("Resumo"), "Síntese");
    await user.selectOptions(screen.getByLabelText("Tipo"), "article");
    await user.type(screen.getByLabelText("Curso"), "Engenharia de Software");
    await user.type(screen.getByRole("textbox", { name: "Título" }), "Artigo");
    await user.type(
      screen.getByRole("textbox", { name: "Conteúdo" }),
      "Conteúdo",
    );
    await user.click(screen.getByRole("button", { name: "Salvar rascunho" }));

    const submitted = mocks.save.mock.calls[0]?.[0] as FormData;
    expect(submitted.get("summary")).toBe("Síntese");
    expect(submitted.get("contentType")).toBe("article");
    expect(submitted.get("course")).toBe("Engenharia de Software");
  });

  it("preserves the composition when the cover upload fails", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ pathname: "covers/new.png" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    mocks.upload.mockRejectedValue(new Error("storage unavailable"));
    render(<DraftComposer initialDraft={null} />);

    await user.type(screen.getByRole("textbox", { name: "Título" }), "Artigo");
    await user.type(
      screen.getByRole("textbox", { name: "Conteúdo" }),
      "Texto preservado",
    );
    await user.upload(
      screen.getByLabelText("Selecionar imagem de capa"),
      new File(
        [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
        "capa.png",
        { type: "image/png" },
      ),
    );

    expect(
      await screen.findByText(
        "Não foi possível enviar a imagem. A publicação ainda pode ser salva sem capa.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Título" })).toHaveValue(
      "Artigo",
    );
    expect(screen.getByRole("textbox", { name: "Conteúdo" })).toHaveValue(
      "Texto preservado",
    );
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
          slug: "titulo-salvo",
          summary: "",
          markdown: "Texto salvo",
          contentType: "",
          areaIds: [],
          categoryId: "",
          tagIds: [],
          course: "",
          discipline: "",
          originalDate: "",
          references: [],
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

  it.each(["Manter versão salva", "Recuperar minha cópia"])(
    "does not silently replace a newer server draft when choosing %s",
    async (choice) => {
      const user = userEvent.setup();
      const key = "oplib:draft:10000000-0000-4000-8000-000000000001";
      window.localStorage.setItem(
        key,
        JSON.stringify({
          title: "Título local",
          markdown: "Texto local",
          baseUpdatedAt: "2026-09-20T20:00:00.000Z",
          savedLocallyAt: "2026-09-20T20:05:00.000Z",
        }),
      );
      render(
        <DraftComposer
          initialDraft={{
            id: "10000000-0000-4000-8000-000000000001",
            title: "Título novo no servidor",
            slug: "titulo-novo",
            summary: "",
            markdown: "Texto novo no servidor",
            contentType: "",
            areaIds: [],
            categoryId: "",
            tagIds: [],
            course: "",
            discipline: "",
            originalDate: "",
            references: [],
            cover: null,
            updatedAt: "2026-09-20T20:10:00.000Z",
          }}
        />,
      );

      expect(
        await screen.findByText("Escolha a versão para continuar"),
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Título" })).toHaveValue(
        "Título novo no servidor",
      );
      await user.click(screen.getByRole("button", { name: choice }));

      expect(screen.getByRole("textbox", { name: "Título" })).toHaveValue(
        choice === "Recuperar minha cópia"
          ? "Título local"
          : "Título novo no servidor",
      );
      expect(screen.getByRole("textbox", { name: "Conteúdo" })).toHaveValue(
        choice === "Recuperar minha cópia"
          ? "Texto local"
          : "Texto novo no servidor",
      );
      expect(
        screen.queryByText("Escolha a versão para continuar"),
      ).not.toBeInTheDocument();
      if (choice === "Manter versão salva") {
        expect(window.localStorage.getItem(key)).toBeNull();
      }
    },
  );
});
