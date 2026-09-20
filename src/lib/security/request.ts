export const MAX_JSON_BODY_BYTES = 64 * 1024;

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
