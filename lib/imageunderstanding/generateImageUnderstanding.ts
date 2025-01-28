import { fileStoreService, imageDocumentService, jobService } from "@/index"
import type { LanguageModelV1 } from "ai"
import { imageToText } from "./imageToText"
import { protect } from "await-protect"
import { logger } from "@/lib/pino"

export type ImageUnderstandingResult = {
  jobId: string
  imageId: number
}

export default async function generateImageUnderstanding(
  imageFile: File,
  model: LanguageModelV1
): Promise<ImageUnderstandingResult> {
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
    imageDocumentService.createImage(imageFileId)
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

  handleImageToTextJob(imageDocument.imageId, jobId, imageFile, model)
  logger.info(
    {
      jobId,
      imageId: imageDocument.imageId,
    },
    "Image understanding job created"
  )
  return { jobId, imageId: imageDocument.imageId }
}

async function handleImageToTextJob(
  imageId: number,
  jobId: string,
  imageFile: File,
  model: LanguageModelV1
) {
  const image = await imageFile.arrayBuffer()

  const [_, err3] = await protect(
    imageDocumentService.createImageText(imageId, jobId)
  )
  if (err3) {
    logger.error({ error: err3 }, "Failed to create image text")
    jobService.setJobError(jobId, err3.message)
    return
  }

  const [imageUnderstanding, err4] = await protect(imageToText(image, model))
  if (err4 || !imageUnderstanding) {
    logger.error({ error: err4 }, "Failed to generate image text")
    jobService.setJobError(
      jobId,
      err4?.message || "imageToText result is empty"
    )
    return
  }

  const { imageRepresentation, formattedText, tags, title, caption } =
    imageUnderstanding

  const [__, err5] = await protect(
    imageDocumentService.updateImageText(imageId, {
      representation: imageRepresentation,
      formattedText,
      tags,
      title,
      caption,
    })
  )

  if (err5) {
    logger.error({ error: err5 }, "Failed to update image text")
    jobService.setJobError(jobId, err5.message)
    return
  }

  jobService.setJobResult(jobId, { imageUnderstanding })
}
