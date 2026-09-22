import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  featured: vi.fn(),
  recent: vi.fn(),
  areas: vi.fn(),
}));

vi.mock("@/modules/discovery/publications", () => ({
  listFeaturedPublications: mocks.featured,
  listRecentPublications: mocks.recent,
  listPublicAreas: mocks.areas,
}));

import HomePage, { HomeDiscovery, MainFeature } from "@/app/(public)/page";

const main = {
  id: "10000000-0000-4000-8000-000000000001",
  slug: "principal",
  title: "Conhecimento em movimento",
  summary: "Uma síntese interdisciplinar.",
  markdown: "Conteúdo",
  contentType: "article" as const,
  publishedAt: new Date("2026-09-21T12:00:00.000Z"),
  cover: null,
  areaNames: ["Engenharia de Software"],
  categoryName: "Arquitetura",
  tagNames: [],
};
const secondary = {
  ...main,
  id: "2",
  slug: "secundaria",
  title: "Outro olhar",
};
const recent = { ...main, id: "3", slug: "recente", title: "Pesquisa recente" };
const areas = [
  {
    id: "4",
    name: "Engenharia de Software",
    slug: "engenharia-de-software",
    publicationCount: 2,
  },
];

beforeEach(() => {
  mocks.featured.mockReset().mockResolvedValue([main, secondary]);
  mocks.recent.mockReset().mockResolvedValue([recent]);
  mocks.areas.mockReset().mockResolvedValue(areas);
});

afterEach(cleanup);

describe("HomePage", () => {
  it("uses the approved hero and routes discovery actions", async () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Conhecimento para construir, preservar e compartilhar.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Explorar publicações" }),
    ).toHaveAttribute("href", "/publicacoes");
    expect(screen.getByRole("search")).toHaveAttribute(
      "action",
      "/publicacoes",
    );
    cleanup();
    render(await MainFeature());
    expect(
      screen.getByRole("heading", { name: main.title }),
    ).toBeInTheDocument();
  });

  it("renders featured, recent and published-area discovery", async () => {
    render(await HomeDiscovery());

    expect(
      screen.getByRole("heading", { name: secondary.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: recent.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Engenharia de Software/ }),
    ).toHaveAttribute("href", "/publicacoes?area=engenharia-de-software");
  });

  it("keeps healthy sections available when one query fails", async () => {
    mocks.featured.mockRejectedValue(new Error("featured unavailable"));
    render(await MainFeature());

    expect(
      screen.getByText("O destaque não pôde ser carregado."),
    ).toBeInTheDocument();
    cleanup();
    render(await HomeDiscovery());
    expect(
      screen.getByText("Os destaques não puderam ser carregados."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: recent.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Engenharia de Software/ }),
    ).toBeInTheDocument();
  });

  it("shows the collection state when no recent publication exists", async () => {
    mocks.featured.mockResolvedValue([]);
    mocks.recent.mockResolvedValue([]);
    mocks.areas.mockResolvedValue([]);
    render(await HomeDiscovery());

    expect(
      screen.getByText("O acervo está sendo preparado."),
    ).toBeInTheDocument();
    expect(screen.getByText("Nenhuma área publicada.")).toBeInTheDocument();
  });
});
