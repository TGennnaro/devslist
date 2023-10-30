ALTER TABLE "users" RENAME COLUMN "roles" TO "isEmployer";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "isEmployer" SET DATA TYPE boolean;