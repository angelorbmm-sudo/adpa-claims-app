CREATE TABLE `claim_packages` (
	`id` text PRIMARY KEY NOT NULL,
	`claim_id` text NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`created` text NOT NULL,
	`actor` text NOT NULL,
	`fingerprint` text NOT NULL,
	`snapshot` text NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `packages_claim_owner_created` ON `claim_packages` (`claim_id`,`owner`,`created`);