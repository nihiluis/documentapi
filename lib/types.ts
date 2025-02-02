import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi"

type AppBindings = {}

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>
