import { logger } from "hono/logger"
import { OpenAPIHono } from "@hono/zod-openapi"
import { registerRoutes } from "./api/registerRoutes"
import "dotenv/config"
import { createDatabase } from "./db"
import { ImageDocumentService } from "./service/document/image"

const app = new OpenAPIHono()
app.use(logger())

const db = createDatabase()
export const imageDocumentService = new ImageDocumentService(db)

registerRoutes(app)

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
})

export default {
  port: Bun.env.PORT || 3000,
  fetch: app.fetch,
}
