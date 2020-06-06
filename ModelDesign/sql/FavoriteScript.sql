CREATE TABLE `FavoriteScript` (
`id` varchar(50) not null,
`userId` varchar(50) ,
`scriptId` varchar(50) ,
`addTime` datetime ,
INDEX `IX_FavoriteScript_id` (`id`),
INDEX `IX_FavoriteScript_userId` (`userId`),
INDEX `IX_FavoriteScript_addTime` (`addTime`),
PRIMARY KEY (`id`)
);
