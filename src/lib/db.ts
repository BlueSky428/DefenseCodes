import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;

/** Neon serverless SQL client; `null` when `DATABASE_URL` is unset (local dev without DB). */
export function getSql(): ReturnType<typeof neon> | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!sql) sql = neon(url);
  return sql;
}
