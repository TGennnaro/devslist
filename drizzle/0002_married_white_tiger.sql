ALTER TABLE "users" RENAME COLUMN "isEmployer" TO "is_employer";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_employer" SET DEFAULT false;