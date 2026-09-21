import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ShareAction } from "@/components/editorial/share-action";

const props = {
  title: "Conhecimento em movimento",
  text: "Uma síntese clara.",
  url: "https://oplib.example/publicacoes/conhecimento-em-movimento",
};

beforeEach(() => {
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: undefined,
  });
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn() },
  });
});

afterEach(cleanup);

describe("ShareAction", () => {
  it("uses native sharing when supported", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });
    render(<ShareAction {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
    await waitFor(() => expect(share).toHaveBeenCalledWith(props));
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it("copies the canonical URL as fallback and confirms success", async () => {
    vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);
    render(<ShareAction {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
    expect(
      await screen.findByRole("button", { name: "Link copiado" }),
    ).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(props.url);
  });

  it("keeps a manual recovery path when sharing fails", async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(
      new Error("denied"),
    );
    render(<ShareAction {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
    expect(
      await screen.findByText(
        "Não foi possível copiar o link. Você ainda pode copiá-lo pela barra do navegador.",
      ),
    ).toBeInTheDocument();
  });

  it("treats native cancellation as a neutral outcome", async () => {
    const share = vi
      .fn()
      .mockRejectedValue(new DOMException("cancelled", "AbortError"));
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });
    render(<ShareAction {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    expect(screen.queryByText(/não foi possível/i)).not.toBeInTheDocument();
  });
});
