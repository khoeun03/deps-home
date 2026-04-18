-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_key" "bytea" NOT NULL,
	"private_key" "bytea" NOT NULL,
	"nickname" varchar(64) NOT NULL,
	"bio" text,
	"avatar_url" text,
	"handle" varchar(18),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "identities_public_key_key" UNIQUE("public_key"),
	CONSTRAINT "identities_handle_key" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "auth_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identity_id" uuid NOT NULL,
	"provider" varchar(32) NOT NULL,
	"credential" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_methods_identity_id_provider_key" UNIQUE("identity_id","provider")
);
--> statement-breakpoint
CREATE TABLE "solve_certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identity_id" uuid NOT NULL,
	"server_domain" varchar(255) NOT NULL,
	"server_key" "bytea" NOT NULL,
	"problem_id" varchar(32) NOT NULL,
	"score" double precision NOT NULL,
	"signed_at" timestamp with time zone NOT NULL,
	"raw_certificate" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "solve_certificates_identity_id_server_domain_problem_id_key" UNIQUE("identity_id","server_domain","problem_id"),
	CONSTRAINT "solve_certificates_score_check" CHECK ((score >= (0)::double precision) AND (score <= (1)::double precision))
);
--> statement-breakpoint
ALTER TABLE "auth_methods" ADD CONSTRAINT "auth_methods_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solve_certificates" ADD CONSTRAINT "solve_certificates_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;
*/