import { logger } from "@/lib/pino"
import { generateObject, generateText, type LanguageModelV1 } from "ai"
import { z } from "zod"

export const imageUnderstandingSchema = z.object({
  rawJsonImageRepresentation: z.string(),
  tags: z.array(z.string()),
  title: z.string(),
  caption: z.string(),
})

export type ImageUnderstanding = {
  imageRepresentation: any
  tags: string[]
  title: string
  caption: string
  formattedText: string
}

export async function imageToText(
  image: ArrayBuffer,
  model: LanguageModelV1
): Promise<ImageUnderstanding> {
  const { rawJsonImageRepresentation, tags, title, caption } =
    await generateImageRepresentation(image, model)

  const formattedText = await formatText(rawJsonImageRepresentation, model)

  logger.info({ tags, title, caption }, "Image understanding result")

  return {
    imageRepresentation: JSON.parse(rawJsonImageRepresentation),
    tags,
    title,
    caption,
    formattedText,
  }
}

async function generateImageRepresentation(
  image: ArrayBuffer,
  model: LanguageModelV1
): Promise<z.infer<typeof imageUnderstandingSchema>> {
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

  return result.object
}

async function formatText(
  imageRepresentation: any,
  model: LanguageModelV1
): Promise<string> {
  const result = await generateText({
    model: model,
    messages: [
      {
        role: "user",
        content:
          "Format the text in markdown in a way that is easy to read. Summarize if necessary to condense complex data (e.g., tabular). Only return the text nothing else.",
      },
      { role: "user", content: imageRepresentation },
    ],
  })

  return result.text
}
