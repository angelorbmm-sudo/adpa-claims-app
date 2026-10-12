CREATE TABLE `preparation_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`claim_id` text NOT NULL,
	`owner` text NOT NULL,
	`mode` text NOT NULL,
	`status` text NOT NULL,
	`fingerprint` text NOT NULL,
	`snapshot` text NOT NULL,
	`result` text DEFAULT '{}' NOT NULL,
	`reviews` text DEFAULT '[]' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	`error` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `preparation_claim_owner_created` ON `preparation_runs` (`claim_id`,`owner`,`created`);