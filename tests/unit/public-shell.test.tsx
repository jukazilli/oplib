import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/publicacoes" }));

import PublicLayout from "@/app/(public)/layout";

describe("public shell", () => {
  it("keeps public navigation concise and marks the current destination", () => {
    render(
      <PublicLayout>
        <h1>Conteúdo</h1>
      </PublicLayout>,
    );

    expect(
      screen.getByRole("link", { name: "OPALIB — Início" }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getAllByRole("link", { name: "Publicações" })[0],
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: "Ir para o conteúdo" }),
    ).toHaveAttribute("href", "#conteudo");
    expect(
      screen.queryByRole("link", { name: /admin|entrar|cadastro/i }),
    ).not.toBeInTheDocument();
  });
});
