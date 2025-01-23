import { documentTable, imagesTable } from "@/db/schema"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

export class ImageDocumentService {
  constructor(private db: PostgresJsDatabase) {}

  async createImageDocument(): Promise<{
    documentId: number
    imageId: number
  }> {
    const document = await this.db.insert(documentTable).values({}).returning()

    const documentId = document[0].id

    const image = await this.db
      .insert(imagesTable)
      .values({
        documentId,
      })
      .returning()

    const imageId = image[0].id

    return { documentId, imageId }
  }
}
