import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AdminLoading from "@/app/admin/loading";

describe("admin loading", () => {
  it("announces progress once and hides placeholders", () => {
    const { container } = render(<AdminLoading />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando área administrativa",
    );
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
  });
});
