import { createRoute, z } from "@hono/zod-openapi"
import { generateImageUnderstanding } from "@/lib/imageunderstanding"
import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import type { LanguageModelV1 } from "ai"

const ResponseSchema = z.object({
  jobId: z.string(),
  imageId: z.number(),
})

export const processImageRoute = createRoute({
  method: "post",
  path: `${BASE_PATH}/image`,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              image: { type: "string", format: "binary" },
            },
            required: ["image"],
          },
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Retrieve the id for the image processing job",
    },
    400: {
      description: "Bad request",
    },
    500: {
      description: "Server error",
    },
  },
})

export type ProcessImageRoute = typeof processImageRoute

export const processImageHandler = (model: LanguageModelV1): AppRouteHandler<ProcessImageRoute> => {
  return async c => {
    const formData = await c.req.formData()
    const imageFile = formData.get("image")

    // Parsing is already done by Hono/Zod, so I expect this is practically dead code.
    if (!imageFile || !(imageFile instanceof File)) {
      return c.json({ message: "No image file provided" }, 400)
    }

    try {
      const { jobId, imageId } = await generateImageUnderstanding(
        imageFile,
        model
      )
      return c.json({ jobId, imageId })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      return c.json({ message: errorMessage }, 500)
    }
  }
}
