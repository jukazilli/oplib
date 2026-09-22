import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PublicationsLoading from "@/app/(public)/publicacoes/loading";

describe("PublicationsLoading", () => {
  it("announces loading while keeping decorative placeholders hidden", () => {
    const { container } = render(<PublicationsLoading />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando publicações",
    );
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
  });
});
