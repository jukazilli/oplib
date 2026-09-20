import { z } from "zod";

const nonEmptySecret = z.string().trim().min(1, "variável obrigatória ausente");

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().trim().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
});

export const databaseEnvSchema = z.object({
  DATABASE_URL: z.url().startsWith("postgres", "deve usar PostgreSQL"),
  DATABASE_URL_UNPOOLED: z.url().startsWith("postgres", "deve usar PostgreSQL"),
});

export const migrationEnvSchema = databaseEnvSchema.pick({
  DATABASE_URL_UNPOOLED: true,
});

export const identityEnvSchema = z.object({
  ADMIN_CLERK_USER_ID: nonEmptySecret,
  CLERK_SECRET_KEY: nonEmptySecret,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: nonEmptySecret,
});

export const mediaEnvSchema = z.object({
  BLOB_COVERS_PREFIX: z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9/-]*[a-z0-9]$/, "prefixo de capas inválido"),
  BLOB_READ_WRITE_TOKEN: nonEmptySecret.optional(),
});

export const interactionsEnvSchema = z.object({
  VISITOR_ID_PEPPER: z
    .string()
    .min(32, "deve possuir pelo menos 32 caracteres"),
});

export const backupEnvSchema = z.object({
  BACKUP_BLOB_READ_WRITE_TOKEN: nonEmptySecret,
  BACKUP_ENCRYPTION_PUBLIC_KEY: nonEmptySecret,
});

export function formatEnvError(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
}

export function parseEnv<TSchema extends z.ZodType>(
  name: string,
  schema: TSchema,
  source: Record<string, string | undefined>,
): z.output<TSchema> {
  const result = schema.safeParse(source);

  if (!result.success) {
    throw new Error(
      `Configuração inválida para ${name}: ${formatEnvError(result.error)}`,
    );
  }

  return result.data;
}
