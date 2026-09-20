import { del } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { mediaEnvSchema } from "@/lib/env/schema";
import { PayloadTooLargeError, readLimitedJson } from "@/lib/security/request";
import { requireAdmin } from "@/modules/identity/admin";
import {
  ALLOWED_COVER_TYPES,
  detectCoverType,
  MAX_COVER_BYTES,
} from "@/modules/media/cover-policy";

export async function POST(request: Request) {
  try {
    const body = await readLimitedJson<HandleUploadBody>(request);
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        await requireAdmin();
        const env = mediaEnvSchema.parse(process.env);
        const escapedPrefix = env.BLOB_COVERS_PREFIX.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        const immutablePath = new RegExp(
          `^${escapedPrefix}/[0-9a-f-]{36}\\.(?:jpg|png|webp|avif)$`,
        );

        if (!immutablePath.test(pathname)) {
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

    return NextResponse.json(json);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json(
        { error: "A requisição excede o limite permitido." },
        { status: 413 },
      );
    }

    return NextResponse.json(
      { error: "Não foi possível enviar a capa." },
      { status: 400 },
    );
  }
}
