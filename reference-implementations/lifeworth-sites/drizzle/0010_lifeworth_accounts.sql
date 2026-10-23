CREATE TABLE `lifeworth_accounts` (
 `owner` text PRIMARY KEY NOT NULL,
 `state` text NOT NULL,
 `version` integer DEFAULT 1 NOT NULL,
 `updated` text NOT NULL
);
