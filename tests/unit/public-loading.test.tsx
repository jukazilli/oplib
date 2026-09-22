import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PublicLoading from "@/app/(public)/loading";

describe("public loading", () => {
  it("announces progress once and hides placeholders", () => {
    const { container } = render(<PublicLoading />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando conteúdo");
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
  });
});
