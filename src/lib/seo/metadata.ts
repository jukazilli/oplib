import type { Metadata } from "next";

const LOCAL_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  try {
    return new URL(configured || LOCAL_SITE_URL);
  } catch {
    return new URL(LOCAL_SITE_URL);
  }
}

export function isPublicIndexingEnabled() {
  return (
    process.env.VERCEL_ENV === "production" &&
    Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim())
  );
}

export function publicRobots(): Metadata["robots"] {
  const indexable = isPublicIndexingEnabled();
  return {
    index: indexable,
    follow: indexable,
    googleBot: { index: indexable, follow: indexable },
  };
}
