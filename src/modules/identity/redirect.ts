const ADMIN_ROOT = "/admin";

export function safeAdminReturnUrl(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (
    !candidate ||
    (candidate !== ADMIN_ROOT && !candidate.startsWith(`${ADMIN_ROOT}/`))
  ) {
    return ADMIN_ROOT;
  }

  try {
    const parsed = new URL(candidate, "https://oplib.invalid");

    if (parsed.origin !== "https://oplib.invalid") {
      return ADMIN_ROOT;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return ADMIN_ROOT;
  }
}

export function adminSignInUrl(returnUrl: string, sessionExpired = false) {
  const params = new URLSearchParams({
    redirect_url: safeAdminReturnUrl(returnUrl),
  });

  if (sessionExpired) {
    params.set("reason", "session_expired");
  }

  return `/sign-in?${params.toString()}`;
}
