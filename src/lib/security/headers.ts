const clerkSources = [
  "https://*.clerk.accounts.dev",
  "https://*.clerk.com",
  "https://clerk-telemetry.com",
];

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} ${clerkSources.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src 'self' data: blob: https://img.clerk.com https://*.public.blob.vercel-storage.com`,
  `connect-src 'self' ${clerkSources.join(" ")} https://*.vercel-storage.com`,
  `frame-src 'self' ${clerkSources.join(" ")}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  `form-action 'self' ${clerkSources.join(" ")}`,
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const securityHeaders = [
  {
    key: "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicy,
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  },
] as const;
