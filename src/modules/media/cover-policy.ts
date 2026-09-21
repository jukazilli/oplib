export const MAX_COVER_BYTES = 5 * 1024 * 1024;

const COVER_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export type CoverContentType = keyof typeof COVER_TYPES;
export const ALLOWED_COVER_TYPES = Object.keys(
  COVER_TYPES,
) as CoverContentType[];

export class CoverValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CoverValidationError";
  }
}

export function isManagedCoverPathname(prefix: string, pathname: string) {
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `^${escapedPrefix}/[0-9a-f-]{36}\\.(?:jpg|png|webp|avif)$`,
  ).test(pathname);
}

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((byte, index) => bytes[index] === byte);
}

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.slice(start, end));
}

export function detectCoverType(bytes: Uint8Array): CoverContentType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP") {
    return "image/webp";
  }
  if (
    ascii(bytes, 4, 8) === "ftyp" &&
    ["avif", "avis"].some((brand) => ascii(bytes, 8, 32).includes(brand))
  ) {
    return "image/avif";
  }

  return null;
}

export function extensionForCoverType(type: string) {
  if (!(type in COVER_TYPES)) {
    throw new CoverValidationError("Use uma imagem JPEG, PNG, WebP ou AVIF.");
  }

  return COVER_TYPES[type as CoverContentType];
}

export function assertCoverCanBeDeleted(isStillReferenced: boolean) {
  if (isStillReferenced) {
    throw new Error("A capa ainda está vinculada a uma publicação.");
  }
}

export async function validateCoverFile(file: File) {
  if (file.size === 0) {
    throw new CoverValidationError("Selecione uma imagem válida.");
  }
  if (file.size > MAX_COVER_BYTES) {
    throw new CoverValidationError("A capa deve ter no máximo 5 MB.");
  }

  const extension = extensionForCoverType(file.type);
  const header = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const detectedType = detectCoverType(header);

  if (!detectedType || detectedType !== file.type) {
    throw new CoverValidationError(
      "O conteúdo do arquivo não corresponde ao formato informado.",
    );
  }

  return { contentType: detectedType, extension, size: file.size };
}
