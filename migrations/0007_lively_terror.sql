ALTER TABLE "image_text" ALTER COLUMN "title" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "caption" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "caption" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "tags" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "image_text" ALTER COLUMN "tags" SET NOT NULL;