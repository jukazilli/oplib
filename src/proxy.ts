import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { adminSignInUrl } from "@/modules/identity/redirect";

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminCommand = pathname.startsWith("/api/admin/");

  if (!isAdminPage && !isAdminCommand) {
    return;
  }

  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    return;
  }

  if (isAdminCommand) {
    return NextResponse.json(
      { error: "Acesso administrativo não autorizado." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const returnUrl = `${pathname}${request.nextUrl.search}`;
  return NextResponse.redirect(new URL(adminSignInUrl(returnUrl), request.url));
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
