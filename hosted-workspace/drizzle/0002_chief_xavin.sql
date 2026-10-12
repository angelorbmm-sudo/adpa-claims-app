CREATE TABLE `agreement_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`revision` text NOT NULL,
	`kind` text NOT NULL,
	`filename` text NOT NULL,
	`size` integer NOT NULL,
	`object_key` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `agreement_templates_owner_created` ON `agreement_templates` (`owner`,`created`);