import { jobEngineClient } from "@/openapi/client"
import { JOB_TYPE } from "@/constants"

import type { components } from "@/openapi/jobengine"
import { logger } from "@/lib/pino"

type Job = components["schemas"]["JobOutput"]

interface JobService {
  createJob(payload: Record<string, any>): Promise<string>
  getJob(jobId: string): Promise<Job | null>
  setJobError(jobId: string, error: string): Promise<void>
  setJobResult(jobId: string, result: Record<string, any>): Promise<void>
}

export default function newJobService(): JobService {
  return {
    createJob,
    getJob,
    setJobError,
    setJobResult,
  }
}

async function createJob(payload: Record<string, any>) {
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

  return data.job.id
}

async function getJob(jobId: string): Promise<Job> {
  const { data, error } = await jobEngineClient.GET("/api/v1/jobs/{id}", {
    params: {
      path: { id: jobId },
    },
  })

  if (error) {
    throw new Error("Failed to get job")
  }

  return data.job
}

async function setJobError(jobId: string, errorMessage: string) {
  const { error } = await jobEngineClient.POST("/api/v1/jobs/finish", {
    body: { jobId, result: {}, status: "failed", message: errorMessage },
  })

  if (error) {
    logger.error({ error }, "Failed to set job error")
    throw new Error("Failed to set job error")
  }
}

async function setJobResult(jobId: string, result: Record<string, any>) {
  const { error } = await jobEngineClient.POST("/api/v1/jobs/finish", {
    body: { jobId, result, message: "", status: "completed" },
  })

  if (error) {
    logger.error({ error }, "Failed to set job result")
    throw new Error("Failed to set job result")
  }
}
