import { documentTable, imagesTable } from "@/db/schema"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

interface ImageDocument {
  documentId: number
  imageId: number
  imageStoredFileId: string
}

interface ImageDocumentService {
  createImageDocument(imageStoredFileId: string): Promise<ImageDocument>
}

export default function newImageDocumentService(
  db: PostgresJsDatabase
): ImageDocumentService {
  return new ImageDocumentServiceImpl(db)
}

export class ImageDocumentServiceImpl {
  constructor(private db: PostgresJsDatabase) {}

  async createImageDocument(imageStoredFileId: string): Promise<ImageDocument> {
    const document = await this.db.insert(documentTable).values({}).returning()

    const documentId = document[0].id

    const image = await this.db
      .insert(imagesTable)
      .values({
        documentId,
        imageStoredFileId,
      })
      .returning()

    const imageId = image[0].id

    return { documentId, imageId, imageStoredFileId }
  }
}
