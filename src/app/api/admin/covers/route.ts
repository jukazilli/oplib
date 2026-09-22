import { del } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { mediaEnvSchema } from "@/lib/env/schema";
import { PayloadTooLargeError, readLimitedJson } from "@/lib/security/request";
import { requireAdminCommand } from "@/modules/identity/admin";
import { adminAuthorizationResponse } from "@/modules/identity/authorization";
import {
  ALLOWED_COVER_TYPES,
  detectCoverType,
  isManagedCoverPathname,
  MAX_COVER_BYTES,
} from "@/modules/media/cover-policy";
import { cleanupDetachedCover } from "@/modules/media/covers";

const noStore = { "cache-control": "no-store" };

export async function POST(request: Request) {
  try {
    const body = await readLimitedJson<HandleUploadBody>(request);
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        await requireAdminCommand();
        const env = mediaEnvSchema.parse(process.env);
        if (!isManagedCoverPathname(env.BLOB_COVERS_PREFIX, pathname)) {
          throw new Error("Caminho de capa inválido.");
        }

        return {
          allowedContentTypes: ALLOWED_COVER_TYPES,
          maximumSizeInBytes: MAX_COVER_BYTES,
          allowOverwrite: false,
          cacheControlMaxAge: 31_536_000,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        const response = await fetch(blob.url, {
          headers: { Range: "bytes=0-31" },
          cache: "no-store",
        });
        const detectedType = detectCoverType(
          new Uint8Array(await response.arrayBuffer()),
        );

        if (!response.ok || detectedType !== blob.contentType) {
          await del(blob.url);
          throw new Error("Assinatura de arquivo inválida.");
        }
      },
    });

    return NextResponse.json(json, { headers: noStore });
  } catch (error) {
    const authorizationResponse = adminAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;

    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json(
        { error: "A requisição excede o limite permitido." },
        { status: 413, headers: noStore },
      );
    }

    return NextResponse.json(
      { error: "Não foi possível enviar a capa." },
      { status: 400, headers: noStore },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminCommand();
    const { pathname } = await readLimitedJson<{ pathname?: string }>(request);
    const env = mediaEnvSchema.parse(process.env);
    if (
      !pathname ||
      !isManagedCoverPathname(env.BLOB_COVERS_PREFIX, pathname)
    ) {
      return NextResponse.json(
        { error: "Capa inválida." },
        { status: 400, headers: noStore },
      );
    }
    await cleanupDetachedCover(pathname);
    return NextResponse.json({ deleted: true }, { headers: noStore });
  } catch (error) {
    const authorizationResponse = adminAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json(
        { error: "A requisição excede o limite permitido." },
        { status: 413, headers: noStore },
      );
    }
    if (
      error instanceof Error &&
      error.message.includes("ainda está vinculada")
    ) {
      return NextResponse.json(
        { error: "A capa ainda está em uso." },
        { status: 409, headers: noStore },
      );
    }
    return NextResponse.json(
      { error: "Não foi possível remover a capa." },
      { status: 400, headers: noStore },
    );
  }
}
