import { Hono } from "hono"
import { logger } from "hono/logger"
import { generateImageUnderstanding } from "./imageunderstanding"
import { createGoogleModel } from "./imageunderstanding/google"

const BASE_PATH = "/api/v1"

const googleGenAiWrapper = createGoogleModel()

const app = new Hono()
app.use(logger())

app.get("/", c => {
  return c.text("OK")
})

app.post(`${BASE_PATH}/image`, async c => {
  const formData = await c.req.formData()
  const imageFile = formData.get("image")

  if (!imageFile || !(imageFile instanceof File)) {
    return c.json({ error: "No image file provided" }, 400)
  }

  const image = await imageFile.arrayBuffer()
  const result = await generateImageUnderstanding(image, googleGenAiWrapper)
  return c.json({ result })
})

export default {
  port: Bun.env.PORT || 3000,
  fetch: app.fetch,
}
