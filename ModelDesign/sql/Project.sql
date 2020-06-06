CREATE TABLE `Project` (
`id` varchar(50) not null,
`name` varchar(50) ,
`userId` varchar(50) ,
`createTime` datetime ,
`describeContent` varchar(150) ,
`state` int ,
`remark` varchar(150) ,
`domainsJson` MEDIUMTEXT NOT NULL ,
`scriptsJson` MEDIUMTEXT NOT NULL ,
INDEX `IX_Project_id` (`id`),
INDEX `IX_Project_createTime` (`createTime`),
PRIMARY KEY (`id`)
);
