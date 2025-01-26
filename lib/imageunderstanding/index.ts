import { fileStoreService, imageDocumentService, jobService } from "@/index"
import type { LanguageModelV1 } from "ai"
import { imageToText } from "./imageToText"
import { protect } from "await-protect"
import { logger } from "@/lib/pino"

export async function generateImageUnderstanding(
  imageFile: File,
  model: LanguageModelV1
): Promise<{ jobId: string }> {
  const [imageFileId, err] = await protect(
    fileStoreService.uploadImage(imageFile)
  )

  if (err) {
    logger.error({ error: err }, "Failed to upload image")
    throw new Error("Failed to upload image")
  }

  if (!imageFileId) {
    logger.error("Failed to read uploaded image id")
    throw new Error("Failed to read uploaded image id")
  }

  const [imageDocument, err2] = await protect(
    imageDocumentService.createImageDocument(imageFileId)
  )
  if (!imageDocument) {
    logger.error({ error: err2 }, "Failed to create image document")
    throw new Error("Failed to create image document")
  }

  const [jobId, err3] = await protect(
    jobService.createJob({
      imageId: imageDocument.imageId,
    })
  )
  if (!jobId) {
    logger.error({ error: err3 }, "Failed to create job")
    throw new Error("Failed to create job")
  }

  handleImageToTextJob(jobId, imageFile, model)

  return { jobId }
}

async function handleImageToTextJob(
  jobId: string,
  imageFile: File,
  model: LanguageModelV1
) {
  const image = await imageFile.arrayBuffer()

  const [result, err4] = await protect(imageToText(image, model))
  if (err4) {
    jobService.setJobError(jobId, err4.message)
  }

  if (!result) {
    jobService.setJobError(jobId, "imageToText result is empty")
  }

  jobService.setJobResult(jobId, { imageUnderstanding: result })
}
