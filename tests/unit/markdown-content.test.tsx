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

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
  ])("removes the dangerous link protocol %s", (url) => {
    render(<MarkdownContent markdown={`[ataque](${url})`} />);

    expect(screen.getByText("ataque").closest("a")).not.toHaveAttribute("href");
  });

  it("does not load remote inline images outside the managed cover flow", () => {
    const { container } = render(
      <MarkdownContent markdown="![Diagrama](https://tracker.example/pixel.png)" />,
    );

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("Imagem: Diagrama")).toBeInTheDocument();
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

  it("opens external links without exposing the originating page", () => {
    render(<MarkdownContent markdown="[Fonte](https://example.com/artigo)" />);
    expect(screen.getByRole("link", { name: "Fonte" })).toMatchObject({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });
});
