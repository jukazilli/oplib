import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getBySlug: vi.fn(),
  getLikeState: vi.fn(),
  listComments: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    mocks.notFound();
    throw new Error("NEXT_NOT_FOUND");
  },
}));
vi.mock("@/modules/publishing/draft-repository", () => ({
  getPublicPublicationBySlug: mocks.getBySlug,
}));
vi.mock("next/headers", () => ({
  cookies: vi
    .fn()
    .mockResolvedValue({ get: vi.fn().mockReturnValue(undefined) }),
}));
vi.mock("@/modules/interactions/likes/identity", () => ({
  VISITOR_COOKIE_NAME: "oplib_visitor",
  validVisitorId: vi.fn().mockReturnValue(null),
  hashVisitorId: vi.fn(),
}));
vi.mock("@/modules/interactions/likes/repository", () => ({
  getLikeState: mocks.getLikeState,
}));
vi.mock("@/modules/interactions/comments/repository", () => ({
  listVisibleComments: mocks.listComments,
}));

import PublicationPage, {
  generateMetadata,
} from "@/app/(public)/publicacoes/[slug]/page";

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
    mocks.getLikeState.mockResolvedValue({ count: 3, liked: false });
    mocks.listComments.mockResolvedValue([]);
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
      screen.getByRole("button", { name: "Compartilhar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Curtir/ })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Publicar comentário" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ainda não há comentários. Você pode iniciar a conversa.",
      ),
    ).toBeInTheDocument();
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

  it("generates canonical and social metadata from a published item", async () => {
    mocks.getBySlug.mockResolvedValue(publication);
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: publication.slug }),
    } as never);

    expect(metadata.title).toBe(publication.title);
    expect(metadata.description).toBe(publication.summary);
    expect(metadata.alternates?.canonical).toBe(
      `/publicacoes/${publication.slug}`,
    );
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      title: publication.title,
      images: [
        expect.objectContaining({
          url: "/opengraph-image",
          width: 1200,
          height: 630,
        }),
      ],
    });
  });

  it("prevents indexing when the slug is not publicly available", async () => {
    mocks.getBySlug.mockResolvedValue(null);
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "rascunho-ou-retirada" }),
    } as never);

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates).toBeUndefined();
  });

  it("uses cover metadata with its real alternative text and dimensions", async () => {
    mocks.getBySlug.mockResolvedValue({
      ...publication,
      cover: {
        pathname: "covers/conhecimento.png",
        url: "https://assets.example/conhecimento.png",
        altText: "Diagrama sobre conhecimento em movimento",
        contentType: "image/png",
        sizeBytes: 2048,
        width: 1600,
        height: 900,
      },
    });
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: publication.slug }),
    } as never);

    expect(metadata.openGraph).toMatchObject({
      images: [
        {
          url: "https://assets.example/conhecimento.png",
          alt: "Diagrama sobre conhecimento em movimento",
          width: 1600,
          height: 900,
        },
      ],
    });
  });
});
