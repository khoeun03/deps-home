-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_key" text NOT NULL,
	"handle" varchar(18) NOT NULL,
	"signedidentity" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "identities_public_key_key" UNIQUE("public_key"),
	CONSTRAINT "identities_handle_key" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identity_id" uuid NOT NULL,
	"provider" varchar(32) NOT NULL,
	"credential" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "credentials_identity_id_provider_key" UNIQUE("identity_id","provider")
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"identity_id" uuid NOT NULL,
	"problem_id" text NOT NULL,
	"format" text NOT NULL,
	"verdict" text,
	"time_ms" integer,
	"memory_kb" integer,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"certificate" jsonb
);
--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE no action ON UPDATE no action;
*/