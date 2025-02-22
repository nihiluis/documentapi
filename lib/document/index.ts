import { documentTable, type Document } from "@/db/schema"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

class DocumentService {
  constructor(private db: PostgresJsDatabase) {}

  async createEmptyDocument(): Promise<Document> {
    const [document] = await this.db
      .insert(documentTable)
      .values({})
      .returning()
    return document
  }
}

export function newDocumentService(db: PostgresJsDatabase): DocumentService {
  return new DocumentService(db)
}

export default DocumentService
