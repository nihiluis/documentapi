ALTER TABLE "documents" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "imageId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "text" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "text" TYPE jsonb USING text::jsonb;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "text" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "documentId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "updatedAt" SET NOT NULL;