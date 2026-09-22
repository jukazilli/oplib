import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ sitemapEntries: vi.fn() }));
vi.mock("@/modules/discovery/publications", () => ({
  listPublishedSitemapEntries: mocks.sitemapEntries,
}));

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

beforeEach(() => {
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://oplib.example");
  mocks.sitemapEntries.mockReset().mockResolvedValue([
    {
      slug: "publicada",
      updatedAt: new Date("2026-09-21T12:00:00.000Z"),
      coverUrl: "https://assets.example/cover.png",
    },
  ]);
});

afterEach(() => vi.unstubAllEnvs());

describe("technical discovery files", () => {
  it("lists stable public routes and published entries in Production", async () => {
    expect(await sitemap()).toEqual([
      expect.objectContaining({ url: "https://oplib.example/", priority: 1 }),
      expect.objectContaining({
        url: "https://oplib.example/publicacoes",
        priority: 0.9,
      }),
      expect.objectContaining({
        url: "https://oplib.example/publicacoes/publicada",
        lastModified: new Date("2026-09-21T12:00:00.000Z"),
        images: ["https://assets.example/cover.png"],
      }),
    ]);
  });

  it("blocks crawling and exposes no sitemap entries outside Production", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");

    expect(await sitemap()).toEqual([]);
    expect(mocks.sitemapEntries).not.toHaveBeenCalled();
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("allows public crawling while excluding private and technical routes", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/sign-in/"],
      },
      sitemap: "https://oplib.example/sitemap.xml",
      host: "https://oplib.example",
    });
  });
});
