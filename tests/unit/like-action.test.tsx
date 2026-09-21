import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LikeAction } from "@/components/editorial/like-action";

beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("LikeAction", () => {
  it("updates the count only after the server confirms the first like", async () => {
    let resolveRequest!: (value: Response) => void;
    vi.mocked(fetch).mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveRequest = resolve;
      }),
    );
    render(
      <LikeAction slug="publicacao" initialCount={4} initiallyLiked={false} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Curtir.*4 curtidas/ }));
    expect(
      screen.getByRole("button", { name: /Registrando….*4 curtidas/ }),
    ).toBeDisabled();
    resolveRequest(Response.json({ count: 5, alreadyLiked: false }));

    expect(
      await screen.findByRole("button", { name: /Curtido.*5 curtidas/ }),
    ).toBeDisabled();
    expect(
      screen.getByText("Curtida registrada. Obrigado!"),
    ).toBeInTheDocument();
  });

  it("synchronizes an already registered like without incrementing locally", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ count: 4, alreadyLiked: true }),
    );
    render(
      <LikeAction slug="publicacao" initialCount={4} initiallyLiked={false} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Curtir.*4 curtidas/ }));
    expect(
      await screen.findByText(
        "Esta publicação já recebeu uma curtida deste navegador.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Curtido.*4 curtidas/ }),
    ).toBeDisabled();
  });

  it("keeps the action retryable and the count unchanged after failure", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));
    render(
      <LikeAction slug="publicacao" initialCount={4} initiallyLiked={false} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Curtir.*4 curtidas/ }));
    expect(
      await screen.findByText(
        "Não foi possível registrar sua curtida agora. Tente novamente.",
      ),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Curtir.*4 curtidas/ }),
      ).toBeEnabled(),
    );
  });

  it("starts disabled when this browser already liked", () => {
    render(<LikeAction slug="publicacao" initialCount={1} initiallyLiked />);
    expect(
      screen.getByRole("button", { name: /Curtido.*1 curtida/ }),
    ).toBeDisabled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
