import { NextResponse } from "next/server";

import { mediaEnvSchema } from "@/lib/env/schema";
import { PayloadTooLargeError, readLimitedJson } from "@/lib/security/request";
import { requireAdmin } from "@/modules/identity/admin";
import {
  CoverValidationError,
  extensionForCoverType,
} from "@/modules/media/cover-policy";

export async function POST(request: Request) {
  await requireAdmin();

  try {
    const { contentType } = await readLimitedJson<{ contentType?: string }>(
      request,
    );
    const extension = extensionForCoverType(contentType ?? "");
    const env = mediaEnvSchema.parse(process.env);

    return NextResponse.json({
      pathname: `${env.BLOB_COVERS_PREFIX}/${crypto.randomUUID()}.${extension}`,
    });
  } catch (error) {
    if (error instanceof CoverValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json(
        { error: "A requisição excede o limite permitido." },
        { status: 413 },
      );
    }

    return NextResponse.json(
      { error: "Não foi possível preparar o envio." },
      { status: 400 },
    );
  }
}
