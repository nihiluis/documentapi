import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { type LanguageModelV1 } from "ai"

export function createGoogleModel(): LanguageModelV1 {
  const apiKey = Bun.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set")
  }

  const google = createGoogleGenerativeAI({
    apiKey,
  })

  const model = google(Bun.env.GOOGLE_MODEL_ID || "gemini-2.0-flash-exp")

  return model
}
