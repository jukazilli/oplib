import "server-only";

import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { databaseEnvSchema } from "@/lib/env/schema";
import { parseServerEnv } from "@/lib/env/server";

import * as schema from "./schema";

const globalForDatabase = globalThis as typeof globalThis & {
  oplibPool?: Pool;
};

function createPool() {
  const env = parseServerEnv("database", databaseEnvSchema);
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 5,
  });

  attachDatabasePool(pool);
  return pool;
}

export function getDatabase() {
  const pool = globalForDatabase.oplibPool ?? createPool();

  if (process.env.NODE_ENV !== "production") {
    globalForDatabase.oplibPool = pool;
  }

  return drizzle(pool, { schema });
}

export type Database = ReturnType<typeof getDatabase>;
