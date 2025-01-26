import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import { generateImageUnderstanding } from "@/lib/imageunderstanding"
import { createGoogleModel } from "@/lib/imageunderstanding/google"
import { BASE_PATH } from "@/constants"

const model = createGoogleModel()

const ResponseSchema = z.object({
  jobId: z.string(),
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
  },
})

export function registerProcessImageRoute(app: OpenAPIHono) {
  app.post(`${BASE_PATH}/image`, async c => {
    const formData = await c.req.formData()
    const imageFile = formData.get("image")

    if (!imageFile || !(imageFile instanceof File)) {
      return c.json({ error: "No image file provided" }, 400)
    }

    try {
      const { jobId } = await generateImageUnderstanding(imageFile, model)
      return c.json({ jobId })
    } catch (error) {
      return c.json({ error: (error as Error).message }, 500)
    }
  })
}
