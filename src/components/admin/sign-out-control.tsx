"use client";

import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function SignOutControl() {
  return (
    <SignOutButton redirectUrl="/sign-in">
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 font-interface text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOut aria-hidden="true" className="size-4" />
        Sair
      </button>
    </SignOutButton>
  );
}
