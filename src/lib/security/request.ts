export const MAX_JSON_BODY_BYTES = 64 * 1024;

export function isSameOriginMutation(request: Request): boolean {
  const targetOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin && origin !== targetOrigin) return false;

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;

  if (!origin && !fetchSite) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        if (new URL(referer).origin !== targetOrigin) return false;
      } catch {
        return false;
      }
    }
  }

  return true;
}

export class PayloadTooLargeError extends Error {
  constructor() {
    super("O corpo da requisição excede o limite permitido.");
    this.name = "PayloadTooLargeError";
  }
}

export async function readLimitedJson<T>(
  request: Request,
  maxBytes = MAX_JSON_BODY_BYTES,
): Promise<T> {
  const declaredLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new PayloadTooLargeError();
  }

  if (!request.body) {
    return JSON.parse("") as T;
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let json = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    bytesRead += value.byteLength;
    if (bytesRead > maxBytes) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }

    json += decoder.decode(value, { stream: true });
  }

  json += decoder.decode();
  return JSON.parse(json) as T;
}
