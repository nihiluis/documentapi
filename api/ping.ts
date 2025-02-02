import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"

const ResponseSchema = z.object({
  message: z.string(),
})

export const pingRoute = createRoute({
  method: "get",
  path: `${BASE_PATH}/ping`,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Ping the server",
    },
  },
})

export type PingRoute = typeof pingRoute

export const pingHandler: AppRouteHandler<PingRoute> = c => {
  return c.json({ message: "OK" })
}

export function registerPingRoute(app: OpenAPIHono) {
  app.openapi(pingRoute, c => {
    return c.json({ message: "OK" })
  })
}
