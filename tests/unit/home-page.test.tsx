import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/(public)/page";
describe("HomePage", () => {
  it("apresenta a identidade e as áreas do acervo", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Conhecimento que atravessa áreas.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Engenharia de Software")).toBeInTheDocument();
    expect(screen.getByText("Educação Física")).toBeInTheDocument();
    expect(screen.getByText("Interdisciplinar")).toBeInTheDocument();
  });
});
