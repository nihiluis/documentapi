import { generateObject, type LanguageModelV1 } from "ai"
import { z } from "zod"

export const imageUnderstandingSchema = z.object({
  rawJsonImageRepresentation: z.string(),
})

export type ImageUnderstanding = {
  imageRepresentation: any
}

export async function generateImageUnderstanding(
  image: ArrayBuffer,
  model: LanguageModelV1
): Promise<ImageUnderstanding> {
  const result = await generateObject({
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

  console.log(result.object)

  return {
    imageRepresentation: JSON.stringify(
      result.object.rawJsonImageRepresentation
    ),
  }
}
