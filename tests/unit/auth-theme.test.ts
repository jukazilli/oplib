import { describe, expect, it } from "vitest";

import { authenticationTheme } from "@/modules/identity/theme";

describe("authentication theme", () => {
  it("preserves the approved shadcn contract without the full UI package", () => {
    expect(authenticationTheme).toMatchObject({
      name: "shadcn",
      cssLayerName: "components",
      __type: "prebuilt_appearance",
      variables: {
        colorBackground: "var(--card)",
        colorForeground: "var(--card-foreground)",
        colorPrimary: "var(--primary)",
        colorDanger: "var(--destructive)",
      },
      elements: {
        input: "bg-transparent dark:bg-input/30",
        cardBox: expect.stringContaining("data-[elevation=flush]"),
      },
    });
  });
});
