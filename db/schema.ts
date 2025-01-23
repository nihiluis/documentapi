import { integer, pgTable, timestamp, text } from "drizzle-orm/pg-core"

export const documentTable = pgTable("documents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export const imagesTable = pgTable("images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  documentId: integer().references(() => documentTable.id),
  url: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})
