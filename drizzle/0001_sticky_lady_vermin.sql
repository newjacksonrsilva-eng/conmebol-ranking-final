CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`espnId` varchar(100),
	`season` int NOT NULL,
	`phase` varchar(100) NOT NULL,
	`group` varchar(10),
	`homeTeamId` int NOT NULL,
	`awayTeamId` int NOT NULL,
	`homeScore` int,
	`awayScore` int,
	`status` varchar(50) NOT NULL,
	`matchDate` timestamp NOT NULL,
	`homeTeamPoints` int DEFAULT 0,
	`awayTeamPoints` int DEFAULT 0,
	`processed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matches_id` PRIMARY KEY(`id`),
	CONSTRAINT `matches_espnId_unique` UNIQUE(`espnId`)
);
--> statement-breakpoint
CREATE TABLE `syncLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` varchar(100) NOT NULL,
	`season` int NOT NULL,
	`lastSyncTime` timestamp NOT NULL,
	`matchesUpdated` int NOT NULL DEFAULT 0,
	`status` varchar(50) NOT NULL,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `syncLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamPoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`season` int NOT NULL,
	`totalPoints` int NOT NULL DEFAULT 0,
	`wins` int NOT NULL DEFAULT 0,
	`draws` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`gamesPlayed` int NOT NULL DEFAULT 0,
	`phaseAdvances` int NOT NULL DEFAULT 0,
	`status` enum('qualified','active','eliminated') NOT NULL DEFAULT 'active',
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `teamPoints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`country` varchar(100) NOT NULL,
	`espnId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`),
	CONSTRAINT `teams_name_unique` UNIQUE(`name`),
	CONSTRAINT `teams_espnId_unique` UNIQUE(`espnId`)
);
