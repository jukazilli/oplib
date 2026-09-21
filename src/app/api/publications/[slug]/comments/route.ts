import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { logEvent } from "@/lib/observability/logger";
import {
  COMMENT_MIN_FILL_MS,
  commentInputSchema,
  normalizeComment,
} from "@/modules/interactions/comments/contract";
import { allowCommentAttempt } from "@/modules/interactions/comments/rate-limit";
import { createPublicComment } from "@/modules/interactions/comments/repository";
import {
  createVisitorId,
  hashVisitorId,
  validVisitorId,
  VISITOR_COOKIE_NAME,
} from "@/modules/interactions/likes/identity";

const noStore = { "cache-control": "no-store" };
const unsafeMessage =
  "Este comentário não pôde ser publicado porque foi identificado como potencialmente inseguro ou abusivo.";

export async function POST(
  request: Request,
  { params }: RouteContext<"/api/publications/[slug]/comments">,
) {
  const correlationId = randomUUID();
  const requestStartedAt = Date.now();
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
      return Response.json(
        { message: "Requisição recusada." },
        { status: 403, headers: noStore },
      );
    if (Number(request.headers.get("content-length") ?? 0) > 10_000)
      return Response.json(
        { message: unsafeMessage },
        { status: 400, headers: noStore },
      );
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).length > 10_000)
      return Response.json(
        { message: unsafeMessage },
        { status: 400, headers: noStore },
      );
    const parsed = commentInputSchema.safeParse(JSON.parse(rawBody));
    if (!parsed.success) {
      const tooLong = parsed.error.issues.some(
        (issue) => issue.path[0] === "body" && issue.code === "too_big",
      );
      return Response.json(
        {
          message: tooLong
            ? "Seu comentário ultrapassou o limite de 1.500 caracteres."
            : "Revise os campos antes de publicar.",
        },
        { status: 400, headers: noStore },
      );
    }
    const normalized = normalizeComment(parsed.data);
    if (!normalized.body)
      return Response.json(
        { message: "Escreva um comentário antes de publicar." },
        { status: 400, headers: noStore },
      );
    if (
      parsed.data.website ||
      Date.now() - parsed.data.startedAt < COMMENT_MIN_FILL_MS
    )
      return Response.json(
        { message: unsafeMessage },
        { status: 400, headers: noStore },
      );
    const cookieValue = request.headers
      .get("cookie")
      ?.match(/(?:^|;\s*)oplib_visitor=([^;]+)/)?.[1];
    const visitorId = validVisitorId(cookieValue)
      ? cookieValue!
      : createVisitorId();
    if (!allowCommentAttempt(hashVisitorId(visitorId)))
      return Response.json(
        {
          message:
            "Foram realizadas muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
        },
        { status: 429, headers: noStore },
      );
    const { slug } = await params;
    const comment = await createPublicComment(slug, normalized);
    if (!comment)
      return Response.json(
        { message: "Esta publicação não está disponível." },
        { status: 404, headers: noStore },
      );
    const response = NextResponse.json(
      { comment },
      { headers: { ...noStore, "x-correlation-id": correlationId } },
    );
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
      event: "interactions.comment",
      correlationId,
      module: "comments",
      result: "published",
      durationMs: Date.now() - requestStartedAt,
    });
    return response;
  } catch {
    logEvent({
      level: "error",
      event: "interactions.comment",
      correlationId,
      module: "comments",
      result: "failed",
      durationMs: Date.now() - requestStartedAt,
      errorCode: "COMMENT_FAILED",
    });
    return Response.json(
      {
        message:
          "Não foi possível publicar agora. Seu texto foi preservado para uma nova tentativa.",
      },
      { status: 503, headers: noStore },
    );
  }
}
