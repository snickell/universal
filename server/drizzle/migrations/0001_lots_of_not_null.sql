PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_frames` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`modelID` text NOT NULL,
	`screenHTML` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`renderStartTime` integer NOT NULL,
	`renderEndTime` integer NOT NULL,
	`renderTimeSecs` integer NOT NULL,
	`inputMessageID` text NOT NULL,
	`outputMessageID` text NOT NULL,
	`universalSessionID` text NOT NULL,
	`prevFrameID` text,
	FOREIGN KEY (`inputMessageID`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`outputMessageID`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`universalSessionID`) REFERENCES `universal_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "id__validULID__frames" CHECK(LENGTH("__new_frames"."id") = 26)
);
--> statement-breakpoint
INSERT INTO `__new_frames`("id", "modelID", "screenHTML", "createdAt", "renderStartTime", "renderEndTime", "renderTimeSecs", "inputMessageID", "outputMessageID", "universalSessionID", "prevFrameID") SELECT "id", "modelID", "screenHTML", "createdAt", "renderStartTime", "renderEndTime", "renderTimeSecs", "inputMessageID", "outputMessageID", "universalSessionID", "prevFrameID" FROM `frames`;--> statement-breakpoint
DROP TABLE `frames`;--> statement-breakpoint
ALTER TABLE `__new_frames` RENAME TO `frames`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `universalSessionID__frames` ON `frames` (`universalSessionID`);--> statement-breakpoint
CREATE INDEX `prevFrameID__frames` ON `frames` (`prevFrameID`);--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`universalSessionID` text NOT NULL,
	FOREIGN KEY (`universalSessionID`) REFERENCES `universal_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "id__validULID__messages" CHECK(LENGTH("__new_messages"."id") = 26),
	CONSTRAINT "type_matches_role__messages" CHECK(
    ("__new_messages"."role" = 'user' AND ("__new_messages"."type" = 'prompt' OR "__new_messages"."type" = 'events')) OR 
    ("__new_messages"."role" = 'system' AND "__new_messages"."type" = 'raw_screen_html')
  )
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "type", "role", "content", "createdAt", "universalSessionID") SELECT "id", "type", "role", "content", "createdAt", "universalSessionID" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
CREATE INDEX `universalSessionID__messages` ON `messages` (`universalSessionID`);