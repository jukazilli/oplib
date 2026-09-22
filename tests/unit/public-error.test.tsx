import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import PublicError from "@/app/(public)/error";

afterEach(cleanup);

describe("public error boundary", () => {
  it("focuses a safe message and retries the current segment", async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    render(
      <PublicError
        error={new Error("database password and internal connection")}
        retry={retry}
      />,
    );

    const title = screen.getByRole("heading", {
      name: "Não foi possível carregar esta página",
    });
    expect(screen.getByRole("alert")).toContainElement(title);
    expect(title).toHaveFocus();
    expect(screen.queryByText(/database password/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
