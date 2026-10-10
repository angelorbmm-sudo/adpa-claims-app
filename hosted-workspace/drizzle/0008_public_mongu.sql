CREATE TABLE `shared_job_companies` (
	`id` text PRIMARY KEY NOT NULL,
	`job_id` text NOT NULL,
	`company_id` text NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `shared_jobs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `shared_job_companies_company_job` ON `shared_job_companies` (`company_id`,`job_id`);--> statement-breakpoint
CREATE TABLE `shared_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`creator_company_id` text NOT NULL,
	`origin_client_id` text NOT NULL,
	`homeowner_email` text NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`state` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	FOREIGN KEY (`creator_company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`origin_client_id`) REFERENCES `company_clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `shared_jobs_homeowner_updated` ON `shared_jobs` (`homeowner_email`,`updated`);--> statement-breakpoint
CREATE UNIQUE INDEX `shared_jobs_origin_client` ON `shared_jobs` (`creator_company_id`,`origin_client_id`);