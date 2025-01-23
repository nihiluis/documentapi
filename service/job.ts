import { jobEngineClient } from "@/openapi/client"
import { JOB_TYPE } from "@/constants"

export async function createJob(payload: Record<string, any>) {
  const job = {
    payload,
    jobType: JOB_TYPE,
    process: true,
  }

  const { data, error } = await jobEngineClient.POST("/api/v1/jobs", {
    body: {
      ...job,
    },
  })

  if (error) {
    throw new Error("Failed to create job")
  }

  return data.job.ID
}

