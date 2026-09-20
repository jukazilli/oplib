import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

vi.mock("@clerk/nextjs", () => ({
  SignIn: ({
    forceRedirectUrl,
    path,
  }: {
    forceRedirectUrl: string;
    path: string;
  }) => (
    <div
      data-testid="clerk-sign-in"
      data-path={path}
      data-redirect={forceRedirectUrl}
    />
  ),
  SignOutButton: ({
    children,
    redirectUrl,
  }: {
    children: React.ReactNode;
    redirectUrl: string;
  }) => <div data-redirect={redirectUrl}>{children}</div>,
}));

import SignInPage from "@/app/sign-in/[[...sign-in]]/page";
import { SignOutControl } from "@/components/admin/sign-out-control";
import {
  authenticationErrorMessage,
  authenticationLocalization,
} from "@/modules/identity/ui";

describe("administrative authentication UI", () => {
  it("uses the private sign-in route and continues to the overview", async () => {
    render(await SignInPage({ searchParams: Promise.resolve({}) }));

    const signIn = screen.getByTestId("clerk-sign-in");
    expect(signIn).toHaveAttribute("data-path", "/sign-in");
    expect(signIn).toHaveAttribute("data-redirect", "/admin");
    expect(screen.queryByText(/cadastro|criar conta/i)).not.toBeInTheDocument();
  });

  it("shows an expired session and returns to a safe admin context", async () => {
    render(
      await SignInPage({
        searchParams: Promise.resolve({
          reason: "session_expired",
          redirect_url: "/admin/publicacoes/rascunho?aba=conteudo",
        }),
      }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Sessão expirada. Entre novamente.",
    );
    expect(screen.getByTestId("clerk-sign-in")).toHaveAttribute(
      "data-redirect",
      "/admin/publicacoes/rascunho?aba=conteudo",
    );
  });

  it("offers explicit sign-out and returns to sign-in", () => {
    render(<SignOutControl />);

    const button = screen.getByRole("button", { name: "Sair" });
    expect(button.parentElement).toHaveAttribute("data-redirect", "/sign-in");
  });

  it("does not distinguish an unknown identity from an incorrect password", () => {
    expect(authenticationLocalization.unstable__errors).toMatchObject({
      form_identifier_not_found: authenticationErrorMessage,
      form_password_incorrect: authenticationErrorMessage,
    });
  });
});
