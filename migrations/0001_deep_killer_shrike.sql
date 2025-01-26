CREATE TABLE "image_text" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "image_text_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"imageId" integer,
	"text" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "image_text" ADD CONSTRAINT "image_text_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;