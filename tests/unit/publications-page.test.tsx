import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ search: vi.fn(), taxonomy: vi.fn() }));
vi.mock("@/modules/discovery/publications", () => ({
  searchPublications: mocks.search,
}));
vi.mock("@/modules/taxonomy/repository", () => ({
  listTaxonomy: mocks.taxonomy,
}));

import {
  PublicationsContent,
  PublicationsFallback,
  PublicationsShell,
} from "@/app/(public)/publicacoes/page";

afterEach(cleanup);

const item = {
  id: "10000000-0000-4000-8000-000000000001",
  slug: "publicacao",
  title: "Virtualização sem mistério",
  summary: "Uma leitura sobre sistemas operacionais.",
  markdown: "Conteúdo",
  contentType: "article" as const,
  publishedAt: new Date("2026-09-21T12:00:00.000Z"),
  cover: null,
  areaNames: ["Engenharia de Software"],
  categoryName: "Arquitetura",
  tagNames: ["Virtualização"],
};

const taxonomy = {
  areas: [
    {
      id: "1",
      name: "Engenharia de Software",
      slug: "engenharia-de-software",
      usageCount: 1,
    },
  ],
  categories: [
    { id: "2", name: "Arquitetura", slug: "arquitetura", usageCount: 1 },
  ],
  tags: [
    { id: "3", name: "Virtualização", slug: "virtualizacao", usageCount: 1 },
  ],
};

describe("publications page", () => {
  it("renders results and preserves filters in the view URL", async () => {
    mocks.search.mockResolvedValue({
      items: [item],
      total: 1,
      page: 1,
      pageCount: 1,
    });
    mocks.taxonomy.mockResolvedValue(taxonomy);
    render(
      await PublicationsContent({
        searchParams: Promise.resolve({
          busca: "virtualização",
          area: "engenharia-de-software",
        }),
      } as never),
    );

    expect(
      screen.getByRole("heading", { name: item.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 publicação")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Grade" })).toHaveAttribute(
      "href",
      expect.stringContaining("busca=virtualiza%C3%A7%C3%A3o"),
    );
  });

  it("offers a direct reset when filters have no results", async () => {
    mocks.search.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageCount: 1,
    });
    mocks.taxonomy.mockResolvedValue(taxonomy);
    render(
      await PublicationsContent({
        searchParams: Promise.resolve({ busca: "inexistente" }),
      } as never),
    );

    expect(
      screen.getByRole("heading", { name: "Nenhuma publicação encontrada" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Limpar filtros" }),
    ).toHaveAttribute("href", "/publicacoes");
  });

  it("distinguishes an empty collection from an empty search", async () => {
    mocks.search.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageCount: 1,
    });
    mocks.taxonomy.mockResolvedValue(taxonomy);
    render(
      await PublicationsContent({
        searchParams: Promise.resolve({}),
      } as never),
    );

    expect(
      screen.getByRole("heading", { name: "O acervo está sendo preparado" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Limpar filtros" }),
    ).not.toBeInTheDocument();
  });

  it("renders the page heading independently from search and taxonomy", () => {
    render(<PublicationsShell>Conteúdo posterior</PublicationsShell>);

    expect(
      screen.getByRole("heading", { level: 1, name: "Publicações" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Conteúdo posterior")).toBeInTheDocument();
  });

  it("reserves the result layout while streamed data is pending", () => {
    const { container } = render(<PublicationsFallback />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando publicações",
    );
    expect(container.querySelector(".h-64")).toBeInTheDocument();
  });
});
