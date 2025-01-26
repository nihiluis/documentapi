import { logger } from "@/lib/pino"
import { generateObject, type LanguageModelV1 } from "ai"
import { protect } from "await-protect"
import { z } from "zod"

export const imageUnderstandingSchema = z.object({
  rawJsonImageRepresentation: z.string(),
})

export type ImageUnderstanding = {
  imageRepresentation: any
}

export async function imageToText(
  image: ArrayBuffer,
  model: LanguageModelV1
): Promise<ImageUnderstanding> {
  const [result, err] = await protect(
    generateObject({
      model,
      schema: imageUnderstandingSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Generate a json representation of what is written in the image",
            },
            { type: "image", image: image },
          ],
        },
      ],
    })
  )

  if (err) {
    throw err
  }

  if (!result) {
    throw new Error("generateImageUnderstanding result is empty")
  }

  logger.info({ result }, "Image understanding result")

  return {
    imageRepresentation: JSON.parse(
      result.object.rawJsonImageRepresentation
    ),
  }
}
