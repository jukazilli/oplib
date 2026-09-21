import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getBySlug: vi.fn(), notFound: vi.fn() }));

vi.mock("next/navigation", () => ({
  notFound: () => {
    mocks.notFound();
    throw new Error("NEXT_NOT_FOUND");
  },
}));
vi.mock("@/modules/publishing/draft-repository", () => ({
  getPublicPublicationBySlug: mocks.getBySlug,
}));

import PublicationPage from "@/app/(public)/publicacoes/[slug]/page";

const publication = {
  id: "10000000-0000-4000-8000-000000000001",
  title: "Conhecimento em movimento",
  slug: "conhecimento-em-movimento",
  summary: "Uma síntese clara.",
  markdown: "## Primeiro tópico\n\nConteúdo publicado.",
  contentType: "article" as const,
  areaIds: [],
  areaNames: ["Engenharia de Software"],
  categoryId: "",
  categoryName: "Arquitetura",
  tagIds: [],
  tagNames: ["Virtualização"],
  course: "",
  discipline: "",
  originalDate: "2022-01-20",
  references: [
    {
      id: "20000000-0000-4000-8000-000000000001",
      kind: "related_link" as const,
      title: "Fonte externa",
      citation: "",
      url: "https://example.com",
    },
  ],
  cover: null,
  publishedAt: new Date("2026-09-21T12:00:00.000Z"),
  updatedAt: new Date("2026-09-21T12:00:00.000Z"),
};

describe("public publication page", () => {
  it("renders the published reading hierarchy without inactive interactions", async () => {
    mocks.getBySlug.mockResolvedValue(publication);
    render(
      await PublicationPage({
        params: Promise.resolve({ slug: publication.slug }),
      } as never),
    );

    expect(
      screen.getByRole("heading", { level: 1, name: publication.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Engenharia de Software · Artigo"),
    ).toBeInTheDocument();
    expect(screen.getByText("Juliano Zilli")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Referências" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Virtualização")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /curtir|comentar|compartilhar/i }),
    ).not.toBeInTheDocument();
  });

  it("uses the same unavailable state when the public query finds nothing", async () => {
    mocks.getBySlug.mockResolvedValue(null);
    await expect(
      PublicationPage({
        params: Promise.resolve({ slug: "retirada" }),
      } as never),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.notFound).toHaveBeenCalledOnce();
  });
});
