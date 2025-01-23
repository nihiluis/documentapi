import { drizzle } from "drizzle-orm/node-postgres"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

export function createDatabase(): PostgresJsDatabase {
  const db = drizzle(Bun.env.DATABASE_URL || "")
  return db
}
