import "dotenv/config"
import { createDatabase } from "./db"
import newImageDocumentService from "./lib/document/image"
import newFileStoreService from "./lib/filestore"
import newJobService from "./lib/job"
import createApp, { applyRoutes } from "./api/createApp"
import { createGoogleModel } from "./lib/imageunderstanding/google"

const app = createApp()
applyRoutes(app, { model: createGoogleModel() })

const db = createDatabase()
export const imageDocumentService = newImageDocumentService(db)
export const fileStoreService = newFileStoreService()
export const jobService = newJobService()

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
})

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
}
