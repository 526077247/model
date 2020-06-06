CREATE TABLE `BuildingScript` (
`id` varchar(50) not null,
`name` varchar(50) ,
`userId` varchar(50) ,
`createTime` datetime ,
`describeContent` varchar(150) ,
`state` int ,
`type` int ,
`remark` varchar(150) ,
INDEX `IX_BuildingScript_id` (`id`),
INDEX `IX_BuildingScript_createTime` (`createTime`),
PRIMARY KEY (`id`)
);
