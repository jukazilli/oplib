import { z } from "zod";

export const COMMENT_BODY_MAX = 1500;
export const COMMENT_MIN_FILL_MS = 1500;

export const commentInputSchema = z.object({
  authorName: z.string().max(80).optional().default(""),
  body: z.string().max(COMMENT_BODY_MAX),
  website: z.string().max(200),
  startedAt: z.number().int().positive(),
});

export type CommentInput = z.infer<typeof commentInputSchema>;
export type PublicComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export function normalizeComment(input: CommentInput) {
  return {
    authorName: input.authorName.trim() || "Anônimo",
    body: input.body.trim(),
  };
}
