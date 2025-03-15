CREATE TABLE `frames` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`modelID` text,
	`screenHTML` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`renderStartTime` integer,
	`renderEndTime` integer,
	`renderTimeSecs` integer,
	`inputMessageID` text,
	`outputMessageID` text,
	`universalSessionID` text NOT NULL,
	`prevFrameID` text,
	FOREIGN KEY (`inputMessageID`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`outputMessageID`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`universalSessionID`) REFERENCES `universal_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "id__validULID__frames" CHECK(LENGTH("frames"."id") = 26)
);
--> statement-breakpoint
CREATE INDEX `universalSessionID__frames` ON `frames` (`universalSessionID`);--> statement-breakpoint
CREATE INDEX `prevFrameID__frames` ON `frames` (`prevFrameID`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`role` text NOT NULL,
	`content` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`universalSessionID` text NOT NULL,
	FOREIGN KEY (`universalSessionID`) REFERENCES `universal_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "id__validULID__messages" CHECK(LENGTH("messages"."id") = 26),
	CONSTRAINT "type_matches_role__messages" CHECK(
    ("messages"."role" = 'user' AND ("messages"."type" = 'prompt' OR "messages"."type" = 'events')) OR 
    ("messages"."role" = 'system' AND "messages"."type" = 'raw_screen_html')
  )
);
--> statement-breakpoint
CREATE INDEX `universalSessionID__messages` ON `messages` (`universalSessionID`);--> statement-breakpoint
CREATE TABLE `universal_sessions` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`userID` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "id__validULID__universal_sessions" CHECK(LENGTH("universal_sessions"."id") = 26)
);
--> statement-breakpoint
CREATE INDEX `userID__universal_sessions` ON `universal_sessions` (`userID`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`google_auth_id` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_auth_id_unique` ON `users` (`google_auth_id`);--> statement-breakpoint
CREATE INDEX `google_auth_id__users` ON `users` (`google_auth_id`);