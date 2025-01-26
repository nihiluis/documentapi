import { BASE_PATH } from "@/constants"
import { jobService } from ".."
import type { OpenAPIHono } from "@hono/zod-openapi"

export function registerProcessImageRoute(app: OpenAPIHono) {
    app.get(`${BASE_PATH}/image/:jobId`, async c => {
        const jobId = c.req.param("jobId")
        const job = await jobService.getJob(jobId)
        if (!job) {
            return c.json({ error: "Job not found" }, 404)
        }
      return c.json({ jobId })
    })
  }