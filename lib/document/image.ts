import {
  documentTable,
  imagesTable,
  imageTextTable,
  type Image,
  type ImageText,
} from "@/db/schema"
import { eq } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

interface ImageDocument {
  documentId: number
  imageId: number
  imageStoredFileId: string
}

export type EditableImageText = Partial<
  Pick<
    ImageText,
    "jobId" | "representation" | "formattedText" | "title" | "caption" | "tags"
  >
>

interface ImageDocumentService {
  createImage(imageStoredFileId: string): Promise<ImageDocument>
  createImageText(imageId: number, jobId: string): Promise<ImageText>
  updateImageText(imageId: number, data: EditableImageText): Promise<ImageText>
  getImage(imageId: number): Promise<Image | null>
  getImageText(imageId: number): Promise<ImageText | null>
}

export default function newImageDocumentService(
  db: PostgresJsDatabase
): ImageDocumentService {
  return new ImageDocumentServiceImpl(db)
}

export class ImageDocumentServiceImpl {
  constructor(private db: PostgresJsDatabase) {}

  async createImage(imageStoredFileId: string): Promise<ImageDocument> {
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

  async createImageText(imageId: number, jobId: string): Promise<ImageText> {
    const imageText = await this.db
      .insert(imageTextTable)
      .values({ imageId, jobId })
      .returning()
    return imageText[0]
  }

  async updateImageText(
    imageId: number,
    data: EditableImageText
  ): Promise<ImageText> {
    const imageTexts = await this.db
      .update(imageTextTable)
      .set(data)
      .where(eq(imageTextTable.imageId, imageId))
      .returning()

    return imageTexts[0]
  }

  async getImage(imageId: number): Promise<Image | null> {
    const images = await this.db
      .select()
      .from(imagesTable)
      .where(eq(imagesTable.id, imageId))

    if (images.length === 0) {
      return null
    }

    return images[0]
  }

  async getImageText(imageId: number): Promise<ImageText | null> {
    const imageTexts = await this.db
      .select()
      .from(imageTextTable)
      .where(eq(imageTextTable.imageId, imageId))

    if (imageTexts.length === 0) {
      return null
    }

    return imageTexts[0]
  }
}
