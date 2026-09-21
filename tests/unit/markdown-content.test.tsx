import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { MarkdownContent } from "@/components/editor/markdown-content";

afterEach(cleanup);

describe("markdown content", () => {
  it("renders the approved GFM structures", () => {
    render(
      <MarkdownContent
        markdown={[
          "# Título",
          "",
          "- item",
          "",
          "| Área | Estado |",
          "| --- | --- |",
          "| Engenharia | Ativa |",
          "",
          "> Uma citação.",
        ].join("\n")}
      />,
    );

    expect(screen.getByRole("heading", { name: "Título" })).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Uma citação.")).toBeInTheDocument();
  });

  it("drops raw HTML, scripts, event handlers, and dangerous URLs", () => {
    const { container } = render(
      <MarkdownContent
        markdown={
          '<script>alert(1)</script><img src=x onerror="alert(2)">\n\n[ataque](javascript:alert(3))'
        }
      />,
    );

    expect(container.querySelector("script")).not.toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("ataque").closest("a")).not.toHaveAttribute("href");
  });

  it("can render preview links as inert text without changing their appearance", () => {
    render(
      <MarkdownContent
        markdown="[OPALIB](https://example.com)"
        linksEnabled={false}
      />,
    );
    expect(
      screen.queryByRole("link", { name: "OPALIB" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("OPALIB")).toHaveClass("underline");
  });
});
