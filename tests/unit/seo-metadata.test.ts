import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getSiteUrl,
  isPublicIndexingEnabled,
  publicRobots,
} from "@/lib/seo/metadata";

afterEach(() => vi.unstubAllEnvs());

describe("SEO metadata environment policy", () => {
  it("indexes only production with an explicit canonical URL", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://oplib.example");

    expect(getSiteUrl().href).toBe("https://oplib.example/");
    expect(isPublicIndexingEnabled()).toBe(true);
    expect(publicRobots()).toMatchObject({ index: true, follow: true });
  });

  it("blocks Preview and environments without a canonical URL", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example");
    expect(isPublicIndexingEnabled()).toBe(false);

    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl().href).toBe("http://localhost:3000/");
    expect(publicRobots()).toMatchObject({ index: false, follow: false });
  });
});
