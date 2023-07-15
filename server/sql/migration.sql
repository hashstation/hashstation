ALTER TABLE `fc_job`
ADD `dict_deployment_mode` tinyint(3) NOT NULL DEFAULT '0';

ALTER TABLE `fc_workunit`
ADD `remaining_time` bigint(20) unsigned NOT NULL DEFAULT '0';

ALTER TABLE `fc_job`
ADD `device_types` tinyint(3) NOT NULL DEFAULT '0';

ALTER TABLE `fc_job`
ADD `workload_profile` tinyint(3) NOT NULL DEFAULT '0';

ALTER TABLE `fc_job`
ADD `priority` tinyint(3) NOT NULL DEFAULT '1';

ALTER TABLE `fc_workunit`
ADD `hashrate` bigint(20) unsigned NOT NULL DEFAULT '0';

ALTER TABLE `fc_device_info`
ADD `hashrate` bigint(20) unsigned NOT NULL;

ALTER TABLE `fc_job`
ADD `slow_candidates` tinyint(1) NOT NULL DEFAULT '0';
