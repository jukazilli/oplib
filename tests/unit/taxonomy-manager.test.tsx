import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/admin/taxonomia/actions", () => ({
  createTaxonomyAction: vi.fn(),
  renameTaxonomyAction: vi.fn(),
  deleteTaxonomyAction: vi.fn(),
}));

import { TaxonomyManager } from "@/components/admin/taxonomy-manager";

afterEach(cleanup);

describe("taxonomy manager", () => {
  it("exposes search and both creation paths", () => {
    render(<TaxonomyManager categories={[]} tags={[]} search="" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Categorias e tags" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Pesquisar" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nova categoria")).toBeInTheDocument();
    expect(screen.getByLabelText("Nova tag")).toBeInTheDocument();
    expect(screen.getAllByText("Nenhum item encontrado.")).toHaveLength(2);
  });

  it("shows usage and requires an explicit association strategy before deletion", () => {
    render(
      <TaxonomyManager
        search=""
        tags={[]}
        categories={[
          {
            id: "10000000-0000-4000-8000-000000000001",
            name: "Artigos",
            slug: "artigos",
            usageCount: 2,
          },
          {
            id: "10000000-0000-4000-8000-000000000002",
            name: "Estudos",
            slug: "estudos",
            usageCount: 0,
          },
        ]}
      />,
    );

    expect(
      screen.getByText("/artigos · 2 publicação(ões)"),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("radio", { name: /Substituir por/ })[0],
    ).toBeChecked();
    expect(
      screen.getAllByRole("radio", { name: "Remover as associações" })[0],
    ).not.toBeChecked();
    expect(
      screen.getAllByRole("button", { name: "Excluir permanentemente" }),
    ).toHaveLength(2);
  });
});
