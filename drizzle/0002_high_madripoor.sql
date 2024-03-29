ALTER TABLE `application` MODIFY COLUMN `created` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `application` MODIFY COLUMN `last_modified` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `application` MODIFY COLUMN `status` smallint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `application` MODIFY COLUMN `status` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `experience` MODIFY COLUMN `position` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `experience` MODIFY COLUMN `company` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `experience` MODIFY COLUMN `description` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `experience` MODIFY COLUMN `start_month` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `experience` MODIFY COLUMN `start_year` smallint NOT NULL;