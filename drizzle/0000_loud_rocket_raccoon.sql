CREATE TABLE IF NOT EXISTS "company" (
	"companyid" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"testid" serial NOT NULL,
	"logo" "bytea" NOT NULL,
	"url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"jobid" serial PRIMARY KEY NOT NULL,
	"userid" serial NOT NULL,
	"company_id" integer NOT NULL,
	"jobTitle" text NOT NULL,
	"salary" integer,
	"skills" json NOT NULL,
	"address" text,
	"jobDescription" text NOT NULL,
	"jobType" text NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" varchar(15),
	"email" text NOT NULL,
	"password" text NOT NULL,
	"profile_photo" "bytea",
	"city" text,
	"state" text,
	"country" text,
	"skills" json DEFAULT '[]'::json NOT NULL,
	"resume" "bytea",
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
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company" ADD CONSTRAINT "company_testid_users_id_fk" FOREIGN KEY ("testid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_company_companyid_fk" FOREIGN KEY ("company_id") REFERENCES "company"("companyid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
