import type { OpenAPIHono } from "@hono/zod-openapi"
import { registerPingRoute } from "./ping"
import { registerProcessImageRoute } from "./processImage"

export function registerRoutes(app: OpenAPIHono) {
  registerPingRoute(app)
  registerProcessImageRoute(app)
}
