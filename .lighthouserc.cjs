const previewUrl = process.env.LHCI_PREVIEW_URL?.replace(/\/$/, "");

if (!previewUrl) {
  throw new Error("LHCI_PREVIEW_URL is required.");
}

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

module.exports = {
  ci: {
    collect: {
      url: [previewUrl, `${previewUrl}/publicacoes`, `${previewUrl}/areas`],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--headless --no-sandbox",
        ...(bypassSecret
          ? {
              extraHeaders: {
                "x-vercel-protection-bypass": bypassSecret,
                "x-vercel-set-bypass-cookie": "true",
              },
            }
          : {}),
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
        "speed-index": ["warn", { maxNumericValue: 3400 }],
        "total-byte-weight": ["warn", { maxNumericValue: 1600000 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
