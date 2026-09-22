import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const listPublicAreas = vi.hoisted(() => vi.fn());
vi.mock("@/modules/discovery/publications", () => ({ listPublicAreas }));

import { AreasList, AreasShell, metadata } from "@/app/(public)/areas/page";

beforeEach(() => listPublicAreas.mockReset());
afterEach(cleanup);

describe("AreasPage", () => {
  it("links only published areas to the existing acervo filter", async () => {
    listPublicAreas.mockResolvedValue([
      {
        id: "1",
        name: "Educação Física",
        slug: "educacao-fisica",
        publicationCount: 1,
      },
      {
        id: "2",
        name: "Engenharia de Software",
        slug: "engenharia-de-software",
        publicationCount: 2,
      },
    ]);
    render(await AreasList());

    expect(metadata.alternates).toEqual({ canonical: "/areas" });
    expect(
      screen.getByRole("link", { name: /Educação Física.*1 publicação/ }),
    ).toHaveAttribute("href", "/publicacoes?area=educacao-fisica");
    expect(
      screen.getByRole("link", {
        name: /Engenharia de Software.*2 publicações/,
      }),
    ).toHaveAttribute("href", "/publicacoes?area=engenharia-de-software");
  });

  it("explains the empty state without inventing areas", async () => {
    listPublicAreas.mockResolvedValue([]);
    render(await AreasList());
    expect(
      screen.getByText("Nenhuma área publicada ainda."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the page heading independently from the area query", () => {
    render(<AreasShell>Conteúdo posterior</AreasShell>);

    expect(screen.getByRole("heading", { name: "Áreas" })).toBeInTheDocument();
    expect(screen.getByText("Conteúdo posterior")).toBeInTheDocument();
  });
});
