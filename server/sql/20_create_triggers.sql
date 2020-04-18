--
-- Spúšťače 
--
DROP TRIGGER IF EXISTS `job_notification`;
DELIMITER //
CREATE TRIGGER `job_notification` AFTER UPDATE ON `fc_job`
 FOR EACH ROW BEGIN
	DECLARE userID int;
	DECLARE done INT DEFAULT FALSE;
	DECLARE usersCursor CURSOR FOR (SELECT id FROM fc_user);
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

	-- insert progress info to graph table
	IF NEW.indexes_verified <> OLD.indexes_verified THEN
		INSERT INTO fc_job_graph (progress, job_id) VALUES (
	        IF(NEW.hc_keyspace = 0 OR NEW.status = 1 OR NEW.status = 2,
	           100,
	           ROUND((NEW.indexes_verified / IF( NEW.attack_mode = 1, NEW.keyspace, NEW.hc_keyspace )) * 100, 2)
	          ),

	        NEW.id  );
	END IF;

	-- job status changed. We need to send notifications!
	IF NEW.status <> OLD.status THEN

		IF NEW.status = 10 THEN
			INSERT INTO fc_job_graph (progress, job_id) VALUES ( 0, NEW.id);
		END IF;

		IF NEW.status = 1 OR NEW.status = 2 THEN
			INSERT INTO fc_job_graph (progress, job_id) VALUES ( 100, NEW.id);
		END IF;

		-- send notification to admins that can view this job
		OPEN usersCursor;
			user_loop: LOOP
				FETCH usersCursor INTO userID;
			    IF done THEN
			    	LEAVE user_loop;
			    END IF;
				INSERT INTO fc_notification  VALUES (DEFAULT, userID, DEFAULT,NEW.id,OLD.status,NEW.status,DEFAULT, DEFAULT);
			END LOOP;
		CLOSE usersCursor;
	END IF;

END
//
DELIMITER ;


--
-- Failed benchmark has no meaning, set it to finished automatically
--
DROP TRIGGER IF EXISTS `bench_retry_finish`;
DELIMITER //
CREATE TRIGGER `bench_retry_finish` BEFORE UPDATE ON `fc_workunit`
 FOR EACH ROW BEGIN
	IF (NEW.retry = 1 AND OLD.retry = 0 AND NEW.hc_keyspace = 0)
	THEN
		SET NEW.finished = 1;
	END IF;
END
//
DELIMITER ;

--
-- If BOINC error appears, set host status to benchmark and workunit to retry
--
DROP TRIGGER IF EXISTS `client_error_trigger`;
DELIMITER //
CREATE TRIGGER `client_error_trigger` BEFORE UPDATE ON `result`
 FOR EACH ROW BEGIN
	IF (NEW.outcome = 3 AND OLD.outcome != 3)
	THEN
		UPDATE `fc_workunit` SET retry = 1 WHERE `workunit_id` = NEW.workunitid LIMIT 1;
		UPDATE `fc_host` SET `status` = 0, `power` = 0 WHERE id IN (SELECT `host_id` FROM `fc_workunit` WHERE `workunit_id` = NEW.workunitid) LIMIT 1;
	END IF;
	IF (NEW.outcome = 7 AND OLD.outcome != 7)
	THEN
		UPDATE `fc_workunit` SET retry = 1 WHERE `workunit_id` = NEW.workunitid LIMIT 1;
		UPDATE `fc_host` SET `status` = 0, `power` = 0 WHERE id IN (SELECT `host_id` FROM `fc_workunit` WHERE `workunit_id` = NEW.workunitid) LIMIT 1;
	END IF;
END
//
DELIMITER ;


--
-- Actions after new host appears
--
DROP TRIGGER IF EXISTS `new_host_trigger`;
DELIMITER //
CREATE TRIGGER `new_host_trigger` AFTER INSERT ON `host`
FOR EACH ROW BEGIN

	DECLARE benchAll INT;
	DECLARE currentState INT;

	-- Add host to host_status
	INSERT INTO fc_host_status (`id`, `boinc_host_id`, `last_seen`) VALUES (DEFAULT, NEW.id, DEFAULT);

	-- Run bench_all
	SET benchAll = (SELECT `default_bench_all` FROM `fc_settings` LIMIT 1);

	IF (benchAll)
	THEN		
		SET currentState = (SELECT `status` FROM `fc_job` WHERE `id` = 1 LIMIT 1);

		IF (currentState < 10)
        	THEN
			DELETE FROM `fc_host_activity` WHERE `job_id` = 1 ;
			UPDATE `fc_job` SET `time_start` = NOW() WHERE `id` = 1 LIMIT 1;
		END IF;

		INSERT INTO `fc_host_activity` (`boinc_host_id`, `job_id`) VALUES (NEW.id, 1);
		UPDATE `fc_job` SET `status` = 10, `time_end` = NULL WHERE `id` = 1 LIMIT 1;
	END IF;
END
//
DELIMITER ;

--
-- When timeout is reached, set workunit to retry and host to benchmark
--
DROP TRIGGER IF EXISTS `timeout_v1`;
DELIMITER //
CREATE TRIGGER `timeout_v1` AFTER UPDATE ON `result`
 FOR EACH ROW BEGIN
	IF (NEW.server_state = 5 AND OLD.server_state != 5 AND UNIX_TIMESTAMP() >= NEW.report_deadline)
	THEN
		UPDATE `fc_workunit` SET `retry` = 1 WHERE `workunit_id` = NEW.workunitid LIMIT 1 ;
        UPDATE `fc_host` SET `status` = 0, `power` = 0 WHERE id IN (SELECT `host_id` FROM `fc_workunit` WHERE `workunit_id` = NEW.workunitid) LIMIT 1;
	END IF;
END
//
DELIMITER ;

--
-- Trigger na ukladani zmen stavu pri vytvoreni
--
DROP TRIGGER IF EXISTS `job_status_changes_new`;
DELIMITER //
CREATE TRIGGER `job_status_changes_new` AFTER INSERT ON `fc_job`
 FOR EACH ROW BEGIN
 INSERT INTO `fc_job_status` (`job_id`, `status`, `time`) VALUES (NEW.id, NEW.status, NOW());
END
//
DELIMITER ;


--
-- Trigger na ukladani zmen stavu pri aktualizaci fc_job
--
DROP TRIGGER IF EXISTS `job_status_changes_edit`;
DELIMITER //
CREATE TRIGGER `job_status_changes_edit` BEFORE UPDATE ON `fc_job` FOR EACH ROW
BEGIN
    IF NEW.status <> OLD.status THEN
    	INSERT INTO fc_job_status (`job_id`, `status`, `time`)
    	VALUES (NEW.id, NEW.status, NOW());
    END IF;
END
//
DELIMITER ;

--
-- Trigger assigning implicit queue position when job joins a batch
--
drop trigger if exists queue_in_batch;
delimiter //
create trigger queue_in_batch
before update on fc_job for each row
begin
declare pos int;
if (OLD.batch_id is null or OLD.batch_id <> NEW.batch_id) and NEW.batch_id is not null then
-- actually assign a position
set pos = (select max(queue_position) from fc_job where batch_id = NEW.batch_id);
if pos is null then
	set NEW.queue_position = 0;
else
	set NEW.queue_position = pos + 1;
end if;
-- or delet
elseif NEW.batch_id is null then
	set NEW.queue_position = null;
end if;
end //
delimiter ;

--
-- Procedure for finishing job and continuing batch if applicable
--
drop procedure if exists finish_job;
delimiter //
--
create procedure finish_job(
	IN job_id bigint(20),
	IN end_status smallint(1)
)
sql security invoker
begin
declare b_id int(11);
declare q_p int(11);
declare succ_id bigint(20);
--
declare exit handler for sqlexception
begin
rollback;
end;
--
set end_status = ifnull(end_status, 1); -- 1 = finished, default value 
start transaction;
-- set job to finished state
update fc_job set status = end_status, result = 'check the hashlist', time_end = now() where id = job_id;
-- get job batch details
select batch_id, queue_position into b_id, q_p
from fc_job where id = job_id;
-- find successor id
select id into succ_id 
from fc_job where batch_id = b_id
and queue_position > q_p
and status = 0 -- ready
order by queue_position asc
limit 1;
-- start succeessor if one exists
if succ_id is not null then
  update fc_job set status = 10 where id = succ_id;
end if;
--
commit;
end //
delimiter ;

--
-- Triggers and procedures for bin organization
--

-- triggers

drop trigger if exists assign_bin_position;

delimiter //
create trigger assign_bin_position
before insert on fc_bin for each row
begin
declare pos int;
set pos = (select max(position) from fc_bin);
if pos is null then
  set NEW.position = 0;
else
  set NEW.position = pos + 1;
end if;
end //
delimiter ;

-- procedures

drop procedure if exists move_bin;
drop procedure if exists delete_bin;

delimiter //

create procedure move_bin(
  IN bin_id INT(11),
  IN target int
)
sql security invoker
begin
declare pos int;
declare exit handler for sqlexception
begin
rollback;
end;
set pos = (select position from fc_bin where id=bin_id);
start transaction;
if target > pos then
update fc_bin set position = position - 1 where position between pos and target;
else
update fc_bin set position = position + 1 where position between target and pos;
end if;
update fc_bin set position = target where id = bin_id;
commit;
end //


create procedure delete_bin(
  IN bin_id INT(11)
)
sql security invoker
begin
declare pos int;
declare exit handler for sqlexception
begin
rollback;
end;
set pos = (select position from fc_bin where id=bin_id);
start transaction;
delete from fc_bin where id=bin_id;
update fc_bin set position = position - 1 where position > pos;
commit;
end //
 
delimiter ;