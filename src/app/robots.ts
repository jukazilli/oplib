import type { MetadataRoute } from "next";

import { getSiteUrl, isPublicIndexingEnabled } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  if (!isPublicIndexingEnabled()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/sign-in/"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
    host: siteUrl.origin,
  };
}
