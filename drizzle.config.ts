import { defineConfig } from "drizzle-kit";

import { migrationEnvSchema, parseEnv } from "./src/lib/env/schema";

const env = parseEnv("migration", migrationEnvSchema, process.env);

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL_UNPOOLED,
  },
  migrations: {
    schema: "public",
    table: "__oplib_migrations",
  },
  strict: true,
  verbose: true,
});
