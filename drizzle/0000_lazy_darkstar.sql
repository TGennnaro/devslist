CREATE TABLE IF NOT EXISTS "users" (
	"userid" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" varchar(15),
	"email" text NOT NULL,
	"password" text NOT NULL,
	"city" text,
	"state" text,
	"country" text,
	"skills" json DEFAULT '[]'::json NOT NULL,
	"about" text,
	"dob" date,
	"roles" text,
	"github_id" text,
	"gender" boolean,
	"veteran_status" boolean,
	"ethnicity" text,
	"disability" boolean,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "users" ("email");