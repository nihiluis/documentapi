import { describe, it, expect, vi, beforeEach } from "vitest"
import { imageDocumentService } from ".."
import { testClient } from "hono/testing"
import createApp, { applyRoutes } from "./createApp"
import type { LanguageModelV1 } from "ai"
import { generateImageUnderstanding } from "@/lib/imageunderstanding"

if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'")
}

const mockGoogleModel = vi.fn() as unknown as LanguageModelV1
vi.mock("./createGoogleModel", () => ({
  default: () => mockGoogleModel,
}))

const app = applyRoutes(createApp(), { model: mockGoogleModel })

const client = testClient(app)

vi.mock("..", () => ({
  imageDocumentService: {
    getImage: vi.fn(),
    getImageText: vi.fn(),
  },
}))

vi.mock("@/lib/imageunderstanding", () => ({
  generateImageUnderstanding: vi.fn(),
}))

describe("GET /api/v1/image/{imageId}", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 400 for invalid image ID", async () => {
    const res = await client.api.v1.image[":imageId"].$get({
      param: { imageId: "invalid-id" },
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: "Invalid image ID" })
  })

  it("should return 404 when image is not found", async () => {
    vi.mocked(imageDocumentService.getImage).mockResolvedValue(null)

    const res = await client.api.v1.image[":imageId"].$get({
      param: { imageId: "123" },
    })
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: "Image id not found" })
  })

  it("should return image data with null text when no text exists", async () => {
    vi.mocked(imageDocumentService.getImage).mockResolvedValue({
      id: 123,
      createdAt: new Date(),
      updatedAt: new Date(),
      documentId: 1,
      imageStoredFileId: null,
    })
    vi.mocked(imageDocumentService.getImageText).mockResolvedValue(null)

    const res = await client.api.v1.image[":imageId"].$get({
      param: { imageId: "123" },
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      imageId: 123,
      documentId: 1,
      imageText: {
        jobId: null,
        representation: null,
        formattedText: null,
        title: null,
        caption: null,
        tags: null,
      },
    })
  })

  it("should return complete image data when text exists", async () => {
    vi.mocked(imageDocumentService.getImage).mockResolvedValue({
      id: 123,
      createdAt: new Date(),
      updatedAt: new Date(),
      documentId: 1,
      imageStoredFileId: null,
    })
    vi.mocked(imageDocumentService.getImageText).mockResolvedValue({
      id: 456,
      createdAt: new Date(),
      updatedAt: new Date(),
      jobId: "job123",
      imageId: 123,
      representation: { some: "data" },
      formattedText: "Sample text",
      tags: [],
      title: "",
      caption: "",
    })

    const res = await client.api.v1.image[":imageId"].$get({
      param: { imageId: "123" },
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      imageId: 123,
      documentId: 1,
      imageText: {
        jobId: "job123",
        representation: { some: "data" },
        formattedText: "Sample text",
        title: "",
        caption: "",
        tags: [],
      },
    })
  })
})

describe("POST /api/v1/document/:documentId/image", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 500 when no image is provided", async () => {
    const formData = new FormData()
    const res = await app.request("/api/v1/document/123/image", {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })

    expect(await res.json()).toEqual({
      message: "Failed to parse body as FormData.",
    })
    expect(res.status).toBe(500)
  })

  it("should return 500 when image processing fails", async () => {
    vi.mocked(generateImageUnderstanding).mockRejectedValue(new Error("Processing failed"))

    const formData = new FormData()
    const imageFile = new File(["dummy image content"], "test.jpg", {
      type: "image/jpeg",
    })
    formData.append("image", imageFile)

    const res = await app.request("/api/v1/document/123/image", {
      method: "POST",
      body: formData,
    })

    const responseBody = await res.json()
    expect(responseBody).toEqual({ message: "Processing failed" })
    expect(res.status).toBe(500)
  })

  it("should successfully process an image and return job details", async () => {
    vi.mocked(generateImageUnderstanding).mockResolvedValue({
      jobId: "job123",
      imageId: 456,
    })

    const formData = new FormData()
    const imageFile = new File(["dummy image content"], "test.jpg", {
      type: "image/jpeg",
    })
    formData.append("image", imageFile)

    const res = await app.request("/api/v1/document/123/image", {
      method: "POST",
      body: formData,
    })

    expect(await res.json()).toEqual({
      jobId: "job123",
      imageId: 456,
    })
    expect(res.status).toBe(200)
  })
})
