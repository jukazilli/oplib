import { describe, expect, it } from "vitest";

import {
  assertCoverCanBeDeleted,
  CoverValidationError,
  isManagedCoverPathname,
  MAX_COVER_BYTES,
  validateCoverFile,
} from "@/modules/media/cover-policy";

function imageFile(bytes: number[], type: string, name = "cover") {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe("cover policy", () => {
  it.each([
    ["image/jpeg", [0xff, 0xd8, 0xff, 0xe0]],
    ["image/png", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    ["image/webp", [...Buffer.from("RIFF0000WEBP")]],
    ["image/avif", [...Buffer.from("0000ftypavif00000000")]],
  ])("accepts a valid %s signature", async (type, bytes) => {
    await expect(
      validateCoverFile(imageFile(bytes, type)),
    ).resolves.toMatchObject({
      contentType: type,
    });
  });

  it("rejects a MIME type outside the approved list", async () => {
    await expect(
      validateCoverFile(imageFile([0x47], "image/gif")),
    ).rejects.toThrow("JPEG, PNG, WebP ou AVIF");
  });

  it("rejects content that does not match the declared MIME", async () => {
    await expect(
      validateCoverFile(imageFile([0x47, 0x49, 0x46], "image/png")),
    ).rejects.toBeInstanceOf(CoverValidationError);
  });

  it("rejects a cover larger than 5 MB", async () => {
    const file = new File([new Uint8Array(MAX_COVER_BYTES + 1)], "large.jpg", {
      type: "image/jpeg",
    });

    await expect(validateCoverFile(file)).rejects.toThrow("no máximo 5 MB");
  });

  it("prevents deleting a cover that is still referenced", () => {
    expect(() => assertCoverCanBeDeleted(true)).toThrow("ainda está vinculada");
    expect(() => assertCoverCanBeDeleted(false)).not.toThrow();
  });

  it("accepts only immutable managed cover pathnames", () => {
    expect(
      isManagedCoverPathname(
        "covers/preview",
        "covers/preview/10000000-0000-4000-8000-000000000001.webp",
      ),
    ).toBe(true);
    expect(
      isManagedCoverPathname("covers/preview", "covers/preview/../other.webp"),
    ).toBe(false);
    expect(
      isManagedCoverPathname("covers/preview", "covers/production/file.webp"),
    ).toBe(false);
  });
});
