import "server-only";

import type { z } from "zod";

import { parseEnv } from "./schema";

export function parseServerEnv<TSchema extends z.ZodType>(
  name: string,
  schema: TSchema,
  source: Record<string, string | undefined> = process.env,
): z.output<TSchema> {
  return parseEnv(name, schema, source);
}
