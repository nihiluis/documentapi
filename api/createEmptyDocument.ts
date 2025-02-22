import { createRoute, z } from "@hono/zod-openapi"
import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import type DocumentService from "@/lib/document"
import { documentService } from ".."

const ResponseSchema = z.object({
  documentId: z.number(),
})

export const createEmptyDocumentRoute = createRoute({
  method: "put",
  path: `${BASE_PATH}/document`,
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Create an empty document",
    },
    500: {
      description: "Server error",
    },
  },
})

export type CreateEmptyDocumentRoute = typeof createEmptyDocumentRoute

export const createEmptyDocumentHandler =
  (): AppRouteHandler<CreateEmptyDocumentRoute> => {
    return async c => {
      try {
        const document = await documentService.createEmptyDocument()
        return c.json({ documentId: document.id })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        return c.json({ message: errorMessage }, 500)
      }
    }
  }
