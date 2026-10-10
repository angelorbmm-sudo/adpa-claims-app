CREATE TABLE `company_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`client_id` text,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`revision` text NOT NULL,
	`filename` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`object_key` text NOT NULL,
	`digest` text NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `company_assets_company_created` ON `company_assets` (`company_id`,`created`);--> statement-breakpoint
CREATE TABLE `company_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`state` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `company_clients_company_updated` ON `company_clients` (`company_id`,`updated`);