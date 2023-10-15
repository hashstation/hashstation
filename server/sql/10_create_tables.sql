SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


-- --------------------------------------------------------

--
-- Table definition for `hs_benchmark`
--

CREATE TABLE IF NOT EXISTS `hs_benchmark` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `boinc_host_id` bigint(20) unsigned NOT NULL,
  `hash_type` int(11) unsigned DEFAULT NULL,
  `attack_mode` tinyint(3) unsigned DEFAULT NULL,
  `power` bigint(20) unsigned NOT NULL DEFAULT '0',
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_charset`
--

CREATE TABLE IF NOT EXISTS `hs_charset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `path` varchar(400) NOT NULL,
  `keyspace` bigint(20) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_dictionary`
--

CREATE TABLE IF NOT EXISTS `hs_dictionary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(400) NOT NULL,
  `password_distribution` text COLLATE utf8_bin NOT NULL,
  `keyspace` bigint(20) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hex_dict` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_hash`
--

CREATE TABLE IF NOT EXISTS`hs_hash` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned DEFAULT NULL,
  `hash_type` int(11) unsigned NOT NULL,
  `hash` longblob NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `result` longtext DEFAULT NULL,
  `added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `time_cracked` timestamp NULL DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_hcstats`
--

CREATE TABLE IF NOT EXISTS `hs_hcstats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(400) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_host`
--

CREATE TABLE IF NOT EXISTS `hs_host` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `boinc_host_id` bigint(20) unsigned NOT NULL,
  `power` bigint(20) unsigned NOT NULL DEFAULT '0',
  `job_id` bigint(20) unsigned NOT NULL,
  `status` smallint(1) unsigned NOT NULL DEFAULT '0',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_device`
--

CREATE TABLE IF NOT EXISTS `hs_device` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `boinc_host_id` bigint(20) unsigned NOT NULL,
  `hc_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_device_info`
--

CREATE TABLE IF NOT EXISTS `hs_device_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `device_id` bigint(20) unsigned NOT NULL,   -- hs_device
  `workunit_id` bigint(20) unsigned NOT NULL, -- hs_workunit
  `hashrate` bigint(20) unsigned NOT NULL,
  `speed` bigint(20) unsigned NOT NULL,
  `temperature` int(11) NOT NULL,
  `utilization` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_host_activity`
--

CREATE TABLE IF NOT EXISTS `hs_host_activity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `boinc_host_id` bigint(20) unsigned NOT NULL,
  `job_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_workunit`
--

CREATE TABLE IF NOT EXISTS `hs_workunit` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) NOT NULL,
  `workunit_id` bigint(20) unsigned NOT NULL,
  `host_id` bigint(20) unsigned NOT NULL,
  `boinc_host_id` bigint(20) unsigned NOT NULL,
  `start_index` bigint(20) unsigned NOT NULL,
  `start_index_2` bigint(20) unsigned NOT NULL,
  `hc_keyspace` bigint(20) unsigned NOT NULL,
  `progress` double NOT NULL DEFAULT '0',
  `speed` bigint(20) unsigned NOT NULL DEFAULT '0',
  `hashrate` bigint(20) unsigned NOT NULL DEFAULT '0',
  `remaining_time` bigint(20) unsigned NOT NULL DEFAULT '0',
  `mask_id` bigint(20) unsigned NOT NULL,
  `dictionary_id` bigint(20) unsigned NOT NULL,
  `duplicated` tinyint(1) NOT NULL DEFAULT '0',
  `duplicate` bigint(20) unsigned NOT NULL DEFAULT '0',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cracking_time` double unsigned NOT NULL DEFAULT '0',
  `retry` int(1) NOT NULL DEFAULT '0',
  `finished` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_mask`
--

CREATE TABLE IF NOT EXISTS `hs_mask` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned NOT NULL,
  `mask` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `current_index` bigint(20) unsigned NOT NULL,
  `keyspace` bigint(20) unsigned NOT NULL,
  `hc_keyspace` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_masks_set`
--

CREATE TABLE IF NOT EXISTS `hs_masks_set` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(400) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_notification`
--

CREATE TABLE IF NOT EXISTS `hs_notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `source_type` int(11) DEFAULT '0',
  `source_id` bigint(20) unsigned DEFAULT NULL,
  `old_value` smallint(6) DEFAULT NULL,
  `new_value` smallint(6) DEFAULT NULL,
  `seen` tinyint(1) DEFAULT '0',
  `discord_sent` tinyint(1) DEFAULT '0',
  `telegram_sent` tinyint(1) DEFAULT '0',
  `email_sent` tinyint(1) DEFAULT '0',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `source_id` (`source_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_protected_file`
--

CREATE TABLE IF NOT EXISTS `hs_protected_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `path` varchar(400) NOT NULL,
  `hash` longblob NOT NULL,
  `hash_type` varchar(50) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


-- --------------------------------------------------------

--
-- Table definition for `hs_bin`
--

CREATE TABLE IF NOT EXISTS `hs_bin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `position` int(11),
  primary key (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


-- --------------------------------------------------------

--
-- Table definition for `hs_batch`
--

CREATE TABLE IF NOT EXISTS `hs_batch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `creator_id` int(11),
  primary key (`id`),
  key `creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table definition for `hs_job`
--

CREATE TABLE IF NOT EXISTS `hs_job` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `attack` varchar(40) COLLATE utf8_bin NOT NULL,
  `attack_mode` tinyint(3) unsigned NOT NULL,
  `attack_submode` tinyint(3) NOT NULL DEFAULT '0',
  `distribution_mode` tinyint(3) NOT NULL DEFAULT '0',
  `hash_type` int(10) unsigned NOT NULL,
  `status` smallint(1) unsigned NOT NULL DEFAULT '0',
  `keyspace` bigint(20) unsigned NOT NULL,
  `hc_keyspace` bigint(20) unsigned NOT NULL,
  `indexes_verified` bigint(20) unsigned NOT NULL,
  `current_index` bigint(20) unsigned NOT NULL DEFAULT '0',
  `current_index_2` bigint(20) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` text COLLATE utf8_bin NOT NULL,
  `comment` text COLLATE utf8_bin NOT NULL,
  `time_start` timestamp NULL DEFAULT NULL,
  `time_end` timestamp NULL DEFAULT NULL,
  `seconds_per_workunit` bigint(20) unsigned NOT NULL DEFAULT '600',
  `charset1` varchar(4096) COLLATE utf8_bin DEFAULT NULL,
  `charset2` varchar(4096) COLLATE utf8_bin DEFAULT NULL,
  `charset3` varchar(4096) COLLATE utf8_bin DEFAULT NULL,
  `charset4` varchar(4096) COLLATE utf8_bin DEFAULT NULL,
  `rules` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `rule_left` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `rule_right` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `markov_hcstat` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `markov_threshold` int(20) NOT NULL DEFAULT '0',
  `grammar_id` bigint(20) unsigned DEFAULT NULL,
  `case_permute` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `check_duplicates` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `min_password_len` int(10) unsigned NOT NULL DEFAULT '1',
  `max_password_len` int(10) unsigned NOT NULL DEFAULT '8',
  `min_elem_in_chain` int(10) unsigned NOT NULL DEFAULT '1',
  `max_elem_in_chain` int(10) unsigned NOT NULL DEFAULT '8',
  `dict_deployment_mode` tinyint(3) NOT NULL DEFAULT '0',
  `optimized` tinyint(1) NOT NULL DEFAULT '1',
  `device_types` tinyint(3) NOT NULL DEFAULT '0',
  `workload_profile` tinyint(3) NOT NULL DEFAULT '0',
  `priority` tinyint(3) NOT NULL DEFAULT '1',
  `slow_candidates` tinyint(1) NOT NULL DEFAULT '0',
  `extra_hc_args` varchar(4096) COLLATE utf8_bin DEFAULT NULL,
  `fixed_workunit_size` bigint(20) unsigned NOT NULL DEFAULT '0',
  `rule_application_mode` tinyint(3) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `kill` int(11) NOT NULL DEFAULT '0',
  `batch_id` int(11),
  `queue_position` int(11),
  PRIMARY KEY (`id`),
  KEY `batch_id` (`batch_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

--
-- Table definition for `hs_bin_job` (M2M junction)
--

CREATE TABLE IF NOT EXISTS `hs_bin_job` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned NOT NULL,
  `bin_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `bin_id` (`bin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;



-- --------------------------------------------------------

--
-- Table definition for `hs_job_dictionary`
--

CREATE TABLE IF NOT EXISTS `hs_job_dictionary` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned NOT NULL,
  `dictionary_id` bigint(20) unsigned NOT NULL,
  `current_index` bigint(20) unsigned NOT NULL DEFAULT '0',
  `current_pos` bigint(20) unsigned NOT NULL DEFAULT '0',
  `is_left` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_job_rule`
--

CREATE TABLE IF NOT EXISTS `hs_job_rule` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned NOT NULL,
  `rule_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_job_graph`
--

CREATE TABLE IF NOT EXISTS `hs_job_graph` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `progress` decimal(5,2) NOT NULL,
  `job_id` bigint(20) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_template`
--

CREATE TABLE IF NOT EXISTS `hs_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `template` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_role`
--

CREATE TABLE IF NOT EXISTS `hs_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `MANAGE_USERS` tinyint(1) NOT NULL DEFAULT '0',
  `ADD_NEW_JOB` tinyint(1) NOT NULL DEFAULT '0',
  `UPLOAD_DICTIONARIES` tinyint(1) NOT NULL DEFAULT '0',
  `VIEW_ALL_JOBS` tinyint(1) NOT NULL DEFAULT '0',
  `EDIT_ALL_JOBS` tinyint(1) NOT NULL DEFAULT '0',
  `OPERATE_ALL_JOBS` tinyint(1) NOT NULL DEFAULT '0',
  `ADD_USER_PERMISSIONS_TO_JOB` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_rule`
--

CREATE TABLE IF NOT EXISTS `hs_rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `path` varchar(400) NOT NULL,
  `count` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_pcfg_preterminals`
--

CREATE TABLE `hs_pcfg_preterminals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned NOT NULL,
  `workunit_id` bigint(20) unsigned NOT NULL,
  `preterminals` blob DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_pcfg_grammar`
--

CREATE TABLE `hs_pcfg_grammar` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(400) NOT NULL,
  `keyspace` bigint(20) unsigned NOT NULL,
  `time_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;


-- --------------------------------------------------------

--
-- Table definition for `hs_settings`
--

CREATE TABLE IF NOT EXISTS `hs_settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `default_seconds_per_workunit` int(10) unsigned NOT NULL DEFAULT '600',
  `workunit_timeout_factor` int(10) unsigned NOT NULL DEFAULT '48',
  `hwmon_temp_abort` int(10) unsigned NOT NULL DEFAULT '90',
  `bench_all` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `verify_hash_format` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `auto_add_hosts_to_running_jobs` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `bench_runtime_limit` int(10) unsigned NOT NULL DEFAULT '30',
  `workunit_status_update` int(10) unsigned NOT NULL DEFAULT '5',

  `discord_notifications` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `discord_webhook_id` varchar(200) DEFAULT NULL,
  `discord_webhook_token` varchar(200) DEFAULT NULL,
  `telegram_notifications` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `telegram_bot_token` varchar(200) DEFAULT NULL,
  `telegram_chat_id` varchar(200) DEFAULT NULL,
  `email_notifications` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `email_address` varchar(200) DEFAULT NULL,
  `email_password` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table definition for `hs_user`
--

CREATE TABLE IF NOT EXISTS `hs_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `password` varchar(128) NOT NULL,
  `mail` varchar(200) NOT NULL,
  `role_id` int(11) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_user_permissions`
--

CREATE TABLE IF NOT EXISTS `hs_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned NOT NULL,
  `user_id` int(11) NOT NULL,
  `view` tinyint(1) NOT NULL DEFAULT '0',
  `modify` tinyint(1) NOT NULL DEFAULT '0',
  `operate` tinyint(1) NOT NULL DEFAULT '0',
  `owner` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_host_status`
--

CREATE TABLE IF NOT EXISTS `hs_host_status` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `boinc_host_id` bigint(20) unsigned NOT NULL,
  `last_seen` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `device_types` tinyint(3) NOT NULL DEFAULT '2',
  `workload_profile` tinyint(3) NOT NULL DEFAULT '2',
  `extra_hc_args` varchar(4096) COLLATE utf8_bin DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------


--
-- Table definition for `hs_job_status`
--

CREATE TABLE IF NOT EXISTS `hs_job_status` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned NOT NULL,
  `status` smallint(1) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table definition for `hs_server_usage`
--

CREATE TABLE IF NOT EXISTS `hs_server_usage` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cpu` decimal(10,0) NOT NULL,
  `ram` decimal(10,0) NOT NULL,
  `net_recv` int(11) NOT NULL,
  `net_sent` int(11) NOT NULL,
  `hdd_read` int(11) NOT NULL,
  `hdd_write` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Constraints for `hs_job`
--
ALTER TABLE `hs_job`
  ADD CONSTRAINT `batch_link` FOREIGN KEY (`batch_id`) REFERENCES `hs_batch` (`id`) ON DELETE SET NULL;

--
-- Constraints for `hs_batch`
--
ALTER TABLE `hs_batch`
  ADD CONSTRAINT `user_link` FOREIGN KEY (`creator_id`) REFERENCES `hs_user` (`id`) ON DELETE SET NULL;

--
-- Constraints for `hs_job_status`
--
ALTER TABLE `hs_job_status`
  ADD CONSTRAINT `hs_job_status_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `hs_job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Constraints for `hs_notification`
--
ALTER TABLE `hs_notification`
  ADD CONSTRAINT `hs_notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `hs_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hs_notification_ibfk_2` FOREIGN KEY (`source_id`) REFERENCES `hs_job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Constraints for `hs_bin_job`
--
ALTER TABLE `hs_bin_job`
  ADD CONSTRAINT `hs_bin_job_jobfk` FOREIGN KEY (`job_id`) REFERENCES `hs_job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hs_bin_job_binfk` FOREIGN KEY (`bin_id`) REFERENCES `hs_bin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Constraints for `hs_job_graph`
--
ALTER TABLE `hs_job_graph`
  ADD CONSTRAINT `hs_job_graph_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `hs_job` (`id`);

--
-- Constraints for `hs_user`
--
ALTER TABLE `hs_user`
  ADD CONSTRAINT `hs_user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `hs_role` (`id`);

--
-- Constraints for `hs_user_permissions`
--
ALTER TABLE `hs_user_permissions`
  ADD CONSTRAINT `hs_user_permissions_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `hs_job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hs_user_permissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `hs_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
