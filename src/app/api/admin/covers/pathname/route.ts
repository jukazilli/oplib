import { NextResponse } from "next/server";

import { mediaEnvSchema } from "@/lib/env/schema";
import { PayloadTooLargeError, readLimitedJson } from "@/lib/security/request";
import { adminAuthorizationResponse } from "@/modules/identity/authorization";
import { requireAdminCommand } from "@/modules/identity/admin";
import {
  CoverValidationError,
  extensionForCoverType,
} from "@/modules/media/cover-policy";

const noStore = { "cache-control": "no-store" };

export async function POST(request: Request) {
  try {
    await requireAdminCommand();
    const { contentType } = await readLimitedJson<{ contentType?: string }>(
      request,
    );
    const extension = extensionForCoverType(contentType ?? "");
    const env = mediaEnvSchema.parse(process.env);

    return NextResponse.json(
      {
        pathname: `${env.BLOB_COVERS_PREFIX}/${crypto.randomUUID()}.${extension}`,
      },
      { headers: noStore },
    );
  } catch (error) {
    const authorizationResponse = adminAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;

    if (error instanceof CoverValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: noStore },
      );
    }

    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json(
        { error: "A requisição excede o limite permitido." },
        { status: 413, headers: noStore },
      );
    }

    return NextResponse.json(
      { error: "Não foi possível preparar o envio." },
      { status: 400, headers: noStore },
    );
  }
}
