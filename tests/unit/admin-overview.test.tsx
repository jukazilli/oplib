import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  SignOutButton: ({ children }: { children: React.ReactNode }) => children,
}));

import {
  AdminOverviewContent,
  AdminOverviewError,
} from "@/components/admin/admin-overview";
import { AdminShell } from "@/components/admin/admin-shell";
import type { AdminOverview } from "@/modules/admin/overview";

afterEach(cleanup);

const emptyOverview: AdminOverview = {
  counts: { published: 0, drafts: 0, withdrawn: 0, hiddenComments: 0 },
  recentComments: [],
};

describe("administrative overview", () => {
  it("presents compact navigation without broken future links", () => {
    render(
      <AdminShell>
        <p>Conteúdo</p>
      </AdminShell>,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Administração",
    });
    expect(within(navigation).getByText("Visão geral")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(navigation).getByText("Publicações")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(
      within(navigation).queryByText("Nova publicação"),
    ).not.toBeInTheDocument();
    expect(within(navigation).queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Sair" })).toHaveLength(2);
  });

  it("shows real counts and the empty comments state without a duplicate creation action", () => {
    render(<AdminOverviewContent overview={emptyOverview} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Acervo" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Nova publicação")).not.toBeInTheDocument();
    expect(screen.getByText("Nenhum comentário ainda")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(4);
    expect(
      screen.queryByRole("heading", { name: "Nova capa" }),
    ).not.toBeInTheDocument();
  });

  it("lists recent comments with their source publication", () => {
    render(
      <AdminOverviewContent
        overview={{
          ...emptyOverview,
          recentComments: [
            {
              id: "comment-1",
              authorName: "Leitora",
              body: "Um comentário recente.",
              postTitle: "Conhecimento em movimento",
              createdAt: new Date("2026-09-20T12:00:00.000Z"),
              status: "visible",
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("Um comentário recente.")).toBeInTheDocument();
    expect(screen.getByText("Conhecimento em movimento")).toBeInTheDocument();
  });

  it("shows a generic degraded state without technical details", () => {
    render(<AdminOverviewError />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível carregar o acervo",
    );
    expect(
      screen.queryByText(/database|stack|postgres|neon/i),
    ).not.toBeInTheDocument();
  });
});
