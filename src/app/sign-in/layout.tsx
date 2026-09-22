import type { ReactNode } from "react";

import { IdentityProvider } from "@/modules/identity/provider";

export default function SignInLayout({ children }: { children: ReactNode }) {
  return <IdentityProvider>{children}</IdentityProvider>;
}
