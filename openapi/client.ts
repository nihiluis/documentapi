import createClient from "openapi-fetch"
import type { paths as jobEnginePaths } from "./jobengine"
import type { paths as filestorePaths } from "./filestore"
import { FILESTORE_API_URL, JOB_ENGINE_API_URL } from "@/constants"

export const jobEngineClient = createClient<jobEnginePaths>({
  baseUrl: JOB_ENGINE_API_URL,
})

export const filestoreClient = createClient<filestorePaths>({
  baseUrl: FILESTORE_API_URL,
})

