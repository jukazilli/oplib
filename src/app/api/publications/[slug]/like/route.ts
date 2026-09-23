import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { logEvent } from "@/lib/observability/logger";
import { isSameOriginMutation } from "@/lib/security/request";
import {
  createVisitorId,
  hashVisitorId,
  validVisitorId,
  VISITOR_COOKIE_NAME,
} from "@/modules/interactions/likes/identity";
import { registerLike } from "@/modules/interactions/likes/repository";

const noStore = { "cache-control": "no-store" };

export async function POST(
  request: Request,
  { params }: RouteContext<"/api/publications/[slug]/like">,
) {
  const correlationId = randomUUID();
  const startedAt = Date.now();
  try {
    if (!isSameOriginMutation(request))
      return Response.json(
        { message: "Requisição recusada." },
        { status: 403, headers: noStore },
      );
    const { slug } = await params;
    const cookieValue = request.headers
      .get("cookie")
      ?.match(/(?:^|;\s*)oplib_visitor=([^;]+)/)?.[1];
    const visitorId = validVisitorId(cookieValue)
      ? cookieValue!
      : createVisitorId();
    const result = await registerLike(slug, hashVisitorId(visitorId));
    if (!result)
      return Response.json(
        { message: "Esta publicação não está disponível." },
        { status: 404, headers: noStore },
      );

    const response = NextResponse.json(result, {
      headers: {
        ...noStore,
        "x-correlation-id": correlationId,
      },
    });
    if (!validVisitorId(cookieValue))
      response.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    logEvent({
      level: "info",
      event: "interactions.like",
      correlationId,
      module: "likes",
      result: result.alreadyLiked ? "already_registered" : "registered",
      durationMs: Date.now() - startedAt,
    });
    return response;
  } catch {
    logEvent({
      level: "error",
      event: "interactions.like",
      correlationId,
      module: "likes",
      result: "failed",
      durationMs: Date.now() - startedAt,
      errorCode: "LIKE_FAILED",
    });
    return Response.json(
      {
        message:
          "Não foi possível registrar sua curtida agora. Tente novamente.",
      },
      { status: 503, headers: noStore },
    );
  }
}
