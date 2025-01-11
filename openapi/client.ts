import createClient from "openapi-fetch"
import type { paths } from "./jobengine"
import { JOB_ENGINE_API_URL } from "@/constants"

export const jobEngineClient = createClient<paths>({
  baseUrl: JOB_ENGINE_API_URL,
})
