/*
 Navicat Premium Data Transfer

 Source Server         : 阿里云
 Source Server Type    : MySQL

 Date: 30/05/2021 23:02:01
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `action` enum('add','delete','update','query','import','export') NOT NULL,
  `type` enum('user','role','race','record','permission') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `label` (`label`),
  UNIQUE KEY `label_2` (`label`),
  UNIQUE KEY `label_3` (`label`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of permissions
-- ----------------------------
BEGIN;
INSERT INTO `permissions` VALUES (1, '添加用户', 'add', 'user');
INSERT INTO `permissions` VALUES (2, '删除用户', 'delete', 'user');
INSERT INTO `permissions` VALUES (3, '修改用户', 'update', 'user');
INSERT INTO `permissions` VALUES (4, '查询用户', 'query', 'user');
INSERT INTO `permissions` VALUES (7, '添加比赛', 'add', 'race');
INSERT INTO `permissions` VALUES (8, '删除比赛', 'delete', 'race');
INSERT INTO `permissions` VALUES (9, '更新比赛', 'update', 'race');
INSERT INTO `permissions` VALUES (10, '导入用户', 'import', 'user');
INSERT INTO `permissions` VALUES (11, '查询比赛', 'query', 'race');
INSERT INTO `permissions` VALUES (12, '添加参赛记录', 'add', 'record');
INSERT INTO `permissions` VALUES (13, '更新参赛记录', 'update', 'record');
INSERT INTO `permissions` VALUES (14, '查询参赛记录', 'query', 'record');
INSERT INTO `permissions` VALUES (15, '删除参赛记录', 'delete', 'record');
INSERT INTO `permissions` VALUES (17, '添加角色', 'add', 'role');
INSERT INTO `permissions` VALUES (18, '删除角色', 'delete', 'role');
INSERT INTO `permissions` VALUES (19, '更新角色', 'update', 'role');
INSERT INTO `permissions` VALUES (20, '查询角色', 'query', 'role');
INSERT INTO `permissions` VALUES (21, '添加权限', 'add', 'permission');
INSERT INTO `permissions` VALUES (22, '删除权限', 'delete', 'permission');
INSERT INTO `permissions` VALUES (23, '查询权限', 'query', 'permission');
INSERT INTO `permissions` VALUES (24, '修改权限', 'update', 'permission');
INSERT INTO `permissions` VALUES (25, '导出用户', 'export', 'user');
INSERT INTO `permissions` VALUES (26, '导出参赛记录', 'export', 'record');
INSERT INTO `permissions` VALUES (28, '导出比赛', 'export', 'race');
COMMIT;

-- ----------------------------
-- Table structure for races
-- ----------------------------
DROP TABLE IF EXISTS `races`;
CREATE TABLE `races` (
  `race_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `sponsor` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`race_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of races
-- ----------------------------
BEGIN;
INSERT INTO `races` VALUES (2, '互联网+创新创业大赛', '软件学院', 'A', 3, '软件楼', '2021-04-30 05:30:22', '', '2021-04-25 05:30:29', '2021-04-30 13:11:49');
INSERT INTO `races` VALUES (3, '校园歌手大赛', '南昌大学', 'A', 1, '前湖校区艺术楼', '2021-05-04 13:12:15', '', '2021-04-30 13:12:31', '2021-04-30 13:12:31');
INSERT INTO `races` VALUES (4, '计算机程序设计大赛', '江西省', 'B', 2, '软件楼', '2021-05-28 13:13:18', '', '2021-04-30 13:13:32', '2021-04-30 13:13:32');
INSERT INTO `races` VALUES (5, '奥林匹克数学竞赛', '南昌大学附属中学', 'A', 2, '校内', '2022-04-08 13:15:02', '', '2021-04-30 13:15:14', '2021-04-30 13:15:40');
INSERT INTO `races` VALUES (6, '致青春主题演讲比赛', '南昌大学附属中学', 'A', 1, '校内', '2021-06-01 13:17:50', '', '2021-04-30 13:17:56', '2021-04-30 13:17:56');
INSERT INTO `races` VALUES (7, '校园歌手大赛', '软件学院', 'A', 1, '软件楼', '2021-05-31 01:30:41', '哈哈哈', '2021-05-30 01:30:48', '2021-05-30 01:30:48');
COMMIT;

-- ----------------------------
-- Table structure for records
-- ----------------------------
DROP TABLE IF EXISTS `records`;
CREATE TABLE `records` (
  `record_id` int(11) NOT NULL AUTO_INCREMENT,
  `status` int(11) DEFAULT '0',
  `score` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT '',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  `sid` varchar(255) DEFAULT NULL,
  `tid` varchar(255) DEFAULT NULL,
  `race_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`record_id`),
  KEY `sid` (`sid`),
  KEY `tid` (`tid`),
  KEY `race_id` (`race_id`),
  CONSTRAINT `records_ibfk_7` FOREIGN KEY (`sid`) REFERENCES `students` (`sid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `records_ibfk_8` FOREIGN KEY (`tid`) REFERENCES `teachers` (`tid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `records_ibfk_9` FOREIGN KEY (`race_id`) REFERENCES `races` (`race_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of records
-- ----------------------------
BEGIN;
INSERT INTO `records` VALUES (6, 0, '一等奖', '', '2021-05-30 15:01:40', '2021-05-30 15:01:40', 'admin', NULL, 2);
COMMIT;

-- ----------------------------
-- Table structure for role_permission
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `permission_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `role_permission_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role_permission
-- ----------------------------
BEGIN;
INSERT INTO `role_permission` VALUES (1, 1);
INSERT INTO `role_permission` VALUES (2, 1);
INSERT INTO `role_permission` VALUES (3, 1);
INSERT INTO `role_permission` VALUES (4, 1);
INSERT INTO `role_permission` VALUES (7, 1);
INSERT INTO `role_permission` VALUES (8, 1);
INSERT INTO `role_permission` VALUES (9, 1);
INSERT INTO `role_permission` VALUES (10, 1);
INSERT INTO `role_permission` VALUES (11, 1);
INSERT INTO `role_permission` VALUES (12, 1);
INSERT INTO `role_permission` VALUES (13, 1);
INSERT INTO `role_permission` VALUES (14, 1);
INSERT INTO `role_permission` VALUES (15, 1);
INSERT INTO `role_permission` VALUES (17, 1);
INSERT INTO `role_permission` VALUES (18, 1);
INSERT INTO `role_permission` VALUES (19, 1);
INSERT INTO `role_permission` VALUES (20, 1);
INSERT INTO `role_permission` VALUES (21, 1);
INSERT INTO `role_permission` VALUES (22, 1);
INSERT INTO `role_permission` VALUES (23, 1);
INSERT INTO `role_permission` VALUES (24, 1);
INSERT INTO `role_permission` VALUES (25, 1);
INSERT INTO `role_permission` VALUES (26, 1);
INSERT INTO `role_permission` VALUES (28, 1);
INSERT INTO `role_permission` VALUES (1, 2);
INSERT INTO `role_permission` VALUES (3, 2);
INSERT INTO `role_permission` VALUES (4, 2);
INSERT INTO `role_permission` VALUES (7, 2);
INSERT INTO `role_permission` VALUES (9, 2);
INSERT INTO `role_permission` VALUES (10, 2);
INSERT INTO `role_permission` VALUES (11, 2);
INSERT INTO `role_permission` VALUES (12, 2);
INSERT INTO `role_permission` VALUES (13, 2);
INSERT INTO `role_permission` VALUES (14, 2);
INSERT INTO `role_permission` VALUES (4, 3);
INSERT INTO `role_permission` VALUES (11, 3);
INSERT INTO `role_permission` VALUES (12, 3);
INSERT INTO `role_permission` VALUES (14, 3);
INSERT INTO `role_permission` VALUES (4, 4);
INSERT INTO `role_permission` VALUES (11, 4);
INSERT INTO `role_permission` VALUES (13, 4);
INSERT INTO `role_permission` VALUES (14, 4);
COMMIT;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `label` (`label`),
  UNIQUE KEY `label_2` (`label`),
  UNIQUE KEY `label_3` (`label`),
  UNIQUE KEY `label_4` (`label`),
  UNIQUE KEY `label_5` (`label`),
  UNIQUE KEY `label_6` (`label`),
  UNIQUE KEY `label_7` (`label`),
  UNIQUE KEY `label_8` (`label`),
  UNIQUE KEY `label_9` (`label`),
  UNIQUE KEY `label_10` (`label`),
  UNIQUE KEY `label_11` (`label`),
  UNIQUE KEY `label_12` (`label`),
  UNIQUE KEY `label_13` (`label`),
  UNIQUE KEY `label_14` (`label`),
  UNIQUE KEY `label_15` (`label`),
  UNIQUE KEY `label_16` (`label`),
  UNIQUE KEY `label_17` (`label`),
  UNIQUE KEY `label_18` (`label`),
  UNIQUE KEY `label_19` (`label`),
  UNIQUE KEY `label_20` (`label`),
  UNIQUE KEY `label_21` (`label`),
  UNIQUE KEY `label_22` (`label`),
  UNIQUE KEY `label_23` (`label`),
  UNIQUE KEY `label_24` (`label`),
  UNIQUE KEY `label_25` (`label`),
  UNIQUE KEY `label_26` (`label`),
  UNIQUE KEY `label_27` (`label`),
  UNIQUE KEY `label_28` (`label`),
  UNIQUE KEY `label_29` (`label`),
  UNIQUE KEY `label_30` (`label`),
  UNIQUE KEY `label_31` (`label`),
  UNIQUE KEY `label_32` (`label`),
  UNIQUE KEY `label_33` (`label`),
  UNIQUE KEY `label_34` (`label`),
  UNIQUE KEY `label_35` (`label`),
  UNIQUE KEY `label_36` (`label`),
  UNIQUE KEY `label_37` (`label`),
  UNIQUE KEY `label_38` (`label`),
  UNIQUE KEY `label_39` (`label`),
  UNIQUE KEY `label_40` (`label`),
  UNIQUE KEY `label_41` (`label`),
  UNIQUE KEY `label_42` (`label`),
  UNIQUE KEY `label_43` (`label`),
  UNIQUE KEY `label_44` (`label`),
  UNIQUE KEY `label_45` (`label`),
  UNIQUE KEY `label_46` (`label`),
  UNIQUE KEY `label_47` (`label`),
  UNIQUE KEY `label_48` (`label`),
  UNIQUE KEY `label_49` (`label`),
  UNIQUE KEY `label_50` (`label`),
  UNIQUE KEY `label_51` (`label`),
  UNIQUE KEY `label_52` (`label`),
  UNIQUE KEY `label_53` (`label`),
  UNIQUE KEY `label_54` (`label`),
  UNIQUE KEY `label_55` (`label`),
  UNIQUE KEY `label_56` (`label`),
  UNIQUE KEY `label_57` (`label`),
  UNIQUE KEY `label_58` (`label`),
  UNIQUE KEY `label_59` (`label`),
  UNIQUE KEY `label_60` (`label`),
  UNIQUE KEY `label_61` (`label`),
  UNIQUE KEY `label_62` (`label`),
  UNIQUE KEY `label_63` (`label`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of roles
-- ----------------------------
BEGIN;
INSERT INTO `roles` VALUES (1, '超级管理员', '系统管理员，可进行任何操作');
INSERT INTO `roles` VALUES (2, '普通管理员', '不能删除，不能操作角色和权限');
INSERT INTO `roles` VALUES (3, '学生', '');
INSERT INTO `roles` VALUES (4, '教师', '');
COMMIT;

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `sid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT '123456',
  `sex` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `class` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`sid`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of students
-- ----------------------------
BEGIN;
INSERT INTO `students` VALUES ('admin', '张三', '$2a$10$NrxfdEr1iiv47sazb2cRFOigpgOU6A5c2qOaaxYkvTOuWIhvROzJq', 1, 1, '1709', '2021-05-30 14:58:09', '2021-05-30 14:58:09', 1);
COMMIT;

-- ----------------------------
-- Table structure for teachers
-- ----------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `tid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT '123456',
  `rank` int(11) NOT NULL DEFAULT '0',
  `description` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`tid`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of teachers
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
