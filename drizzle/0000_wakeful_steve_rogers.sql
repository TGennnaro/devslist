CREATE TABLE `experience` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`position` varchar(100),
	`company` varchar(100),
	`description` varchar(255),
	`start_month` smallint,
	`start_year` smallint,
	`end_month` smallint,
	`end_year` smallint,
	CONSTRAINT `experience_id` PRIMARY KEY(`id`)
);