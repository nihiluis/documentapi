import { BASE_PATH } from "@/constants"
import { jobService } from ".."
import type { OpenAPIHono } from "@hono/zod-openapi"

export function registerGetImageRoute(app: OpenAPIHono) {
    app.get(`${BASE_PATH}/image/:imageId`, async c => {
        const imageId = c.req.param("imageId")
        const image = await imageDocumentService.getImage(imageId)
        if (!image) {
            return c.json({ error: "Job not found" }, 404)
        }
      return c.json({ jobId })
    })
  }