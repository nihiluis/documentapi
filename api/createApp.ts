import { OpenAPIHono } from "@hono/zod-openapi"
import { logger } from "hono/logger"
import { pingHandler, pingRoute } from "./ping"
import { getImageRoute } from "./getImage"
import { getImageHandler } from "./getImage"
import { processImageHandler, processImageRoute } from "./processImage"
import { errorHandler, notFoundHandler } from "./utilHandlers"
import type { LanguageModelV1 } from "ai"

export default function createApp() {
  const app = new OpenAPIHono()
  app.use(logger())
  app.notFound(notFoundHandler)
  app.onError(errorHandler)
  return app
}

export type RouteConfig = {
  model: LanguageModelV1
}

export function applyRoutes(app: OpenAPIHono, { model}: RouteConfig) {
  return app
    .openapi(pingRoute, pingHandler)
    .openapi(processImageRoute, processImageHandler(model))
    .openapi(getImageRoute, getImageHandler)
}

export type AppRoutes = typeof applyRoutes
