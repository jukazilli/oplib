import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

import { authenticationTheme } from "@/modules/identity/theme";
import { authenticationLocalization } from "@/modules/identity/ui";

export function IdentityProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{ theme: authenticationTheme }}
      localization={authenticationLocalization}
      signInUrl="/sign-in"
      signUpUrl={undefined}
    >
      {children}
    </ClerkProvider>
  );
}
