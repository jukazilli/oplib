import type { ReactNode } from "react";
import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/modules/identity/admin";
import { IdentityProvider } from "@/modules/identity/provider";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <IdentityProvider>
      <AdminShell>{children}</AdminShell>
    </IdentityProvider>
  );
}
