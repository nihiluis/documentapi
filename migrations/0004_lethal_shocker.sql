ALTER TABLE "image_text" ALTER COLUMN "text" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "text" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "image_text" ADD COLUMN "representation" jsonb;