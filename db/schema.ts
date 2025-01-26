import { integer, pgTable, timestamp, text, jsonb } from "drizzle-orm/pg-core"

export const documentTable = pgTable("documents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export const imagesTable = pgTable("images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  documentId: integer()
    .notNull()
    .references(() => documentTable.id),
  imageStoredFileId: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export const imageTextTable = pgTable("image_text", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  imageId: integer()
    .notNull()
    .references(() => imagesTable.id),
  jobId: text(),
  text: jsonb(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export type ImageText = typeof imageTextTable.$inferSelect
export type Image = typeof imagesTable.$inferSelect
export type Document = typeof documentTable.$inferSelect
