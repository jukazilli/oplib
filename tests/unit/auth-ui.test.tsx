import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

describe("administrative authentication UI", () => {
  it("uses the private sign-in route and always continues to the overview", () => {
    render(<SignInPage />);

    const signIn = screen.getByTestId("clerk-sign-in");
    expect(signIn).toHaveAttribute("data-path", "/sign-in");
    expect(signIn).toHaveAttribute("data-redirect", "/admin");
    expect(screen.queryByText(/cadastro|criar conta/i)).not.toBeInTheDocument();
  });

  it("offers explicit sign-out and returns to sign-in", () => {
    render(<SignOutControl />);

    const button = screen.getByRole("button", { name: "Sair" });
    expect(button.parentElement).toHaveAttribute("data-redirect", "/sign-in");
  });
});
