import { BASE_PATH } from "@/constants"
import { imageDocumentService, jobService } from ".."
import { createRoute, z, type OpenAPIHono } from "@hono/zod-openapi"

const ResponseSchema = z.object({
  imageId: z.string(),
  imageText: z.object({
    jobId: z.string().nullable(),
    representation: z.any().nullable(),
    formattedText: z.string().nullable(),
  }),
})

export const getImageRoute = createRoute({
  method: "get",
  path: `${BASE_PATH}/image/:imageId`,
  request: {
    params: z.object({
      imageId: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Retrieve the image representation and text",
    },
    400: {
      description: "Bad request",
    },
    404: {
      description: "Image id not found",
    },
  },
})

export function registerGetImageRoute(app: OpenAPIHono) {
  app.openapi(getImageRoute, async c => {
    const imageId = parseInt(c.req.param("imageId"))
    if (isNaN(imageId)) {
      return c.json({ error: "Invalid image ID" }, 400)
    }

    const image = await imageDocumentService.getImage(imageId)
    if (!image) {
      return c.json({ error: "Image id not found" }, 404)
    }

    const imageText = await imageDocumentService.getImageText(imageId)

    return c.json({
      imageId: image.id,
      imageText: {
        jobId: imageText?.jobId ?? null,
        representation: imageText?.representation ?? null,
        formattedText: imageText?.formattedText ?? null,
      },
    })
  })
}
