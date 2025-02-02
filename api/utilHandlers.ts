import type { Context, ErrorHandler } from "hono"
import type { ContentfulStatusCode } from "hono/utils/http-status"

export function notFoundHandler(c: Context) {
  return c.json({ error: "Not Found" }, 404)
}

export const errorHandler: ErrorHandler = async (err, c) => {
  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status
  let statusCode =
    currentStatus !== 200 ? (currentStatus as ContentfulStatusCode) : 500

  // eslint-disable-next-line node/prefer-global/process
  const env = c.env?.NODE_ENV || process.env?.NODE_ENV
  return c.json(
    {
      message: err.message,
      stack: env === "production" || env === "test" ? undefined : err.stack,
    },
    statusCode
  )
}
