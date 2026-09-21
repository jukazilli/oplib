import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CommentsSection } from "@/components/editorial/comments-section";

beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("CommentsSection", () => {
  it("shows literal untrusted text, not executable markup or linked content", () => {
    render(
      <CommentsSection
        slug="post"
        initialComments={[
          {
            id: "one",
            authorName: '<img src=x onerror="alert(2)">',
            body: "<script>alert(1)</script> **texto** https://example.com",
            createdAt: "2026-09-21T12:00:00.000Z",
          },
        ]}
      />,
    );
    expect(
      screen.getByText(
        "<script>alert(1)</script> **texto** https://example.com",
      ),
    ).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector("img")).toBeNull();
    expect(
      screen.getByText('<img src=x onerror="alert(2)">'),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
  it("shows a confirmed comment immediately and clears only after success", async () => {
    let resolve!: (response: Response) => void;
    vi.mocked(fetch).mockReturnValue(
      new Promise<Response>((done) => {
        resolve = done;
      }),
    );
    render(<CommentsSection slug="post" initialComments={[]} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Comentário" }), {
      target: { value: "Olá" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Publicar comentário" }),
    );
    expect(screen.getByRole("textbox", { name: "Comentário" })).toHaveValue(
      "Olá",
    );
    expect(screen.getByRole("button", { name: "Publicando…" })).toBeDisabled();
    resolve(
      Response.json({
        comment: {
          id: "new",
          authorName: "Anônimo",
          body: "Olá",
          createdAt: "2026-09-21T12:00:00.000Z",
        },
      }),
    );
    expect(
      await screen.findByText("Comentário publicado."),
    ).toBeInTheDocument();
    expect(screen.getByText("Olá")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Comentário" })).toHaveValue("");
  });
  it("preserves both fields on retryable failure and validates empty text", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));
    render(<CommentsSection slug="post" initialComments={[]} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Publicar comentário" }),
    );
    expect(
      screen.getByText("Escreva um comentário antes de publicar."),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: /Nome/ }), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Comentário" }), {
      target: { value: "Minha mensagem" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Publicar comentário" }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Publicar comentário" }),
      ).toBeEnabled(),
    );
    expect(screen.getByRole("textbox", { name: /Nome/ })).toHaveValue("Ana");
    expect(screen.getByRole("textbox", { name: "Comentário" })).toHaveValue(
      "Minha mensagem",
    );
  });
});
