import { logger } from "@/lib/pino"
import { generateObject, generateText, type LanguageModelV1 } from "ai"
import { protect } from "await-protect"
import { z } from "zod"

export const imageUnderstandingSchema = z.object({
  rawJsonImageRepresentation: z.string(),
})

export type ImageUnderstanding = {
  imageRepresentation: any
  formattedText: string
}

export async function imageToText(
  image: ArrayBuffer,
  model: LanguageModelV1
): Promise<ImageUnderstanding> {
  const rawJsonStringImageRepresentation = await generateImageRepresentation(
    image,
    model
  )

  const formattedText = await formatText(
    rawJsonStringImageRepresentation,
    model
  )

  logger.info(
    { rawJsonStringImageRepresentation },
    "Image understanding result"
  )

  return {
    imageRepresentation: JSON.parse(rawJsonStringImageRepresentation),
    formattedText,
  }
}

async function generateImageRepresentation(
  image: ArrayBuffer,
  model: LanguageModelV1
): Promise<any> {
  const result = await generateObject({
    model,
    schema: imageUnderstandingSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Generate a json representation of what is written in the image.",
          },
          { type: "image", image: image },
        ],
      },
    ],
  })

  if (!result) {
    throw new Error("generateImageUnderstanding result is empty")
  }

  return result.object.rawJsonImageRepresentation
}

async function formatText(
  imageRepresentation: any,
  model: LanguageModelV1
): Promise<string> {
  const result = await generateText({
    model: model,
    prompt:
      "Format the text in a way that is easy to read. Only return the text nothing else.",
    messages: [{ role: "user", content: imageRepresentation }],
  })

  return result.text
}
