import { BASE_PATH } from "@/constants"
import { imageDocumentService } from ".."
import { createRoute, z } from "@hono/zod-openapi"
import type { AppRouteHandler } from "@/lib/types"

const ResponseSchema = z.object({
  imageId: z.string(),
  documentId: z.string(),
  imageText: z.object({
    jobId: z.string().nullable(),
    representation: z.any().nullable(),
    formattedText: z.string().nullable(),
    caption: z.string().nullable(),
    title: z.string().nullable(),
    tags: z.array(z.string()).nullable(),
  }),
})

export const getImageRoute = createRoute({
  method: "get",
  path: `${BASE_PATH}/image/{imageId}`,
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

export type GetImageRoute = typeof getImageRoute

export const getImageHandler: AppRouteHandler<GetImageRoute> = async c => {
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
    documentId: image.documentId,
    imageText: {
      jobId: imageText?.jobId ?? null,
      caption: imageText?.caption ?? null,
      title: imageText?.title ?? null,
      representation: imageText?.representation ?? null,
      formattedText: imageText?.formattedText ?? null,
      tags: imageText?.tags ?? null,
    },
  })
}
