import type { OpenAPIHono } from "@hono/zod-openapi"
import { registerPingRoute } from "./ping"
import { registerProcessImageRoute } from "./processImage"
import { registerGetImageRoute } from "./getImage"

export function registerRoutes(app: OpenAPIHono) {
  registerGetImageRoute(app)
  registerPingRoute(app)
  registerProcessImageRoute(app)
}
