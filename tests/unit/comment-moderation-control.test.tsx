import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ change: vi.fn(), refresh: vi.fn() }));
vi.mock("@/app/admin/comentarios/actions", () => ({
  changeCommentVisibilityAction: mocks.change,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}));
import { CommentModerationAction } from "@/components/admin/comment-moderation-action";

const id = "10000000-0000-4000-8000-000000000001";
beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);
describe("comment moderation control", () => {
  it("changes status only after server confirmation and offers temporary undo", async () => {
    let resolve!: (result: {
      status: "success";
      visibility: "hidden";
      message: string;
    }) => void;
    mocks.change.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      }),
    );
    render(<CommentModerationAction id={id} initialStatus="visible" />);
    fireEvent.click(screen.getByRole("button", { name: "Ocultar comentário" }));
    expect(screen.getByText("Visível")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvando…" })).toBeDisabled();
    resolve({
      status: "success",
      visibility: "hidden",
      message: "Comentário ocultado.",
    });
    expect(
      await screen.findByRole("button", { name: "Desfazer" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Oculto")).toBeInTheDocument();
    mocks.change.mockResolvedValueOnce({
      status: "success",
      visibility: "visible",
      message: "Comentário restaurado.",
    });
    fireEvent.click(screen.getByRole("button", { name: "Desfazer" }));
    await waitFor(() =>
      expect(screen.getByText("Visível")).toBeInTheDocument(),
    );
    expect(mocks.change).toHaveBeenLastCalledWith({ id, intent: "restore" });
  });
  it("preserves status and retry on failure", async () => {
    mocks.change.mockResolvedValue({
      status: "error",
      message: "Tente novamente.",
    });
    render(<CommentModerationAction id={id} initialStatus="visible" />);
    fireEvent.click(screen.getByRole("button", { name: "Ocultar comentário" }));
    expect(await screen.findByText("Tente novamente.")).toBeInTheDocument();
    expect(screen.getByText("Visível")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ocultar comentário" }),
    ).toBeEnabled();
  });
});
