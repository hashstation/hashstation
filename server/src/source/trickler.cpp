/**
 * @file trickler.cpp
 * @brief Source file for parsing trickle messages from hosts
 * @authors Lukas Zobal (zobal.lukas(at)gmail.com)
 * @date 12. 12. 2018
 * @license MIT, see LICENSE
 */

// trickle message format:
//
// <workunit_name>X</workunit_name> (X = string, from `workunit`.`name` BOINC
// table column) <progress>Y</progress> (Y = float, from 0.0 to 100.0)
//
// mandatory arguments:
//   --variety hashstation

#include "sched_msgs.h"
#include "trickle_handler.h"
#include "util.h"
#include <cinttypes>
#include <cmath>
#include <iostream>
#include <map>

#define UNUSED(expr)                                                           \
  do {                                                                         \
    (void)(expr);                                                              \
  } while (0)

const unsigned int SQL_BUF_SIZE = 1024;

struct Device {
  std::string name;
  std::string type;
  std::string hashrate;
  std::string speed;
  std::string temp;
  std::string util;
};

int handle_trickle_init(int argc, char **argv) {
  /** No extra initialization needed, but the definition must be here */
  UNUSED(argc);
  UNUSED(argv);

  return 0;
}

int handle_trickle(MSG_FROM_HOST &mfh) {
  /** Define local variables */
  bool got_progress = false;
  bool got_wu_name = false;
  bool got_speed = false;
  bool got_remaining_time = false;
  bool got_cracking_time = false;
  bool got_hashrate = false;

  double progress;
  char buf[SQL_BUF_SIZE];
  std::string wu_name;
  std::string speed;
  std::string remaining_time;
  std::string cracking_time;
  std::string hashrate;
  std::map<uint32_t, Device> devices;
  uint64_t hs_workunit_id;

  log_messages.printf(MSG_NORMAL,
                      "Got trickle-up message from hostId #%lu:\n%s\n\n",
                      mfh.hostid, mfh.xml);

  MIOFILE mf;

  mf.init_buf_read(mfh.xml);
  XML_PARSER xp(&mf);

  /** Parse XML message */
  while (!xp.get_tag()) {
    if (xp.parse_string("workunit_name", wu_name)) {
      std::cerr << "Succesfully parsed workunit_name: " << wu_name << std::endl;
      got_wu_name = true;

      // Get workunit_id from hs_workunit
      snprintf(buf, SQL_BUF_SIZE,
               "SELECT id FROM `hs_workunit` WHERE `workunit_id` IN "
               "(SELECT id "
               "FROM workunit WHERE name = '%s') LIMIT 1 ;",
               wu_name.c_str());

      int retval = boinc_db.do_query(buf);
      if (retval) {
        std::cerr << "Problem with DB query: " << buf << "\nShutting down now."
                  << std::endl;
        boinc_db.close();
        exit(1);
      }

      MYSQL_RES *rp;
      rp = mysql_store_result(boinc_db.mysql);
      if (!rp) {
        std::cerr << "Problem with DB query. Shutting down now." << std::endl;
        boinc_db.close();
        exit(1);
      }

      MYSQL_ROW row;
      row = mysql_fetch_row(rp);
      if (row && row[0])
        hs_workunit_id = std::stoull(row[0]);
      
      std::cerr << "hs_workunit_id: " << hs_workunit_id << std::endl;
      mysql_free_result(rp);
      continue;
    }

    if (xp.parse_double("progress", progress)) {
      if (std::isnan(progress)) {
        std::cerr << "ERROR: Progress cannot be nan." << std::endl;
        return 1;
      }

      std::cerr << "Succesfully parsed progress: " << progress << std::endl;
      got_progress = true;
      continue;
    }

    if (xp.parse_string("speed", speed)) {
      std::cerr << "Succesfully parsed speed: " << speed
                << std::endl;
      got_speed = true;
      continue;
    }

    if (xp.parse_string("hashrate", hashrate)) {
      std::cerr << "Succesfully parsed hash rate: " << hashrate
                << std::endl;
      got_hashrate = true;
      continue;
    }

    if (xp.parse_string("remaining_time", remaining_time)) {
      std::cerr << "Succesfully parsed remaining time: " << remaining_time
                << std::endl;
      got_remaining_time = true;
      continue;
    }

    if (xp.parse_string("cracking_time", cracking_time)) {
      std::cerr << "Succesfully parsed cracking time: " << cracking_time
                << std::endl;
      got_cracking_time = true;
      continue;
    }

    char s1[SQL_BUF_SIZE];
    char s2[SQL_BUF_SIZE];
    char s3[SQL_BUF_SIZE];
    if (sscanf(xp.parsed_tag, "%[^_]_%[^_]_%s", s1, s2, s3) == 3) {
      if (strcmp(s1, "device") != 0)
        continue;
      uint32_t device_id = strtoul(s2, NULL, 10);
      std::string tag = std::string(s3);
      if (tag == "name") {
        std::string device_name;
        if (xp.parse_string(xp.parsed_tag, device_name)) {
          devices[device_id].name = device_name;
          continue;
        }
      } else if (tag == "type") {
        std::string device_type;
        if (xp.parse_string(xp.parsed_tag, device_type)) {
          devices[device_id].type = device_type;
          continue;
        }
      } else if (tag == "hashrate") {
        std::string device_hashrate;
        if (xp.parse_string(xp.parsed_tag, device_hashrate)) {
          devices[device_id].hashrate = device_hashrate;
          continue;
        }
      } else if (tag == "speed") {
        std::string device_speed;
        if (xp.parse_string(xp.parsed_tag, device_speed)) {
          devices[device_id].speed = device_speed;
          continue;
        }
      } else if (tag == "temp") {
        std::string device_temp;
        if (xp.parse_string(xp.parsed_tag, device_temp)) {
          devices[device_id].temp = device_temp;
          continue;
        }
      } else if (tag == "util") {
        std::string device_util;
        if (xp.parse_string(xp.parsed_tag, device_util)) {
          devices[device_id].util = device_util;
          continue;
        }
      }
    }

    // std::cerr << "WARNING: Unexpected tag: " << xp.parsed_tag << std::endl;
  }

  /** Check values */
  if (!got_progress || !got_wu_name || !got_speed || !got_remaining_time || !got_cracking_time || !got_hashrate) {
    std::cerr << "ERROR: Could not parse all mandatory data." << std::endl;
    return 1;
  }

  if (progress < 0.0 || progress > 100.0) {
    std::cerr << "ERROR: Invalid progress value: " << progress << std::endl;
    return 1;
  }

  std::cerr << "Updating workunit progress..." << std::endl;

  snprintf(buf, SQL_BUF_SIZE,
           "UPDATE `hs_workunit` SET `progress` = %f WHERE `progress` < %f AND "
           "`id` = %" PRIu64 " LIMIT 1 ;",
           progress, progress, hs_workunit_id);

  int retval = boinc_db.do_query(buf);
  if (retval) {
    std::cerr << "Problem with DB query: " << buf << "\nShutting down now."
              << std::endl;
    boinc_db.close();
    exit(1);
  }

  uint64_t workunit_speed = std::stoull(speed);
  if (workunit_speed > 0) {
    std::cerr << "Updating workunit speed..." << std::endl;

    snprintf(buf, SQL_BUF_SIZE,
             "UPDATE `hs_workunit` SET `speed` = %" PRIu64
             " WHERE `id` = %" PRIu64 " LIMIT 1 ;",
             workunit_speed, hs_workunit_id);

    retval = boinc_db.do_query(buf);
    if (retval) {
      std::cerr << "Problem with DB query: " << buf << "\nShutting down now."
                << std::endl;
      boinc_db.close();
      exit(1);
    }
  }

  uint64_t workunit_hashrate = std::stoull(hashrate);
  if (workunit_hashrate > 0) {
    std::cerr << "Updating workunit hash rate..." << std::endl;

    snprintf(buf, SQL_BUF_SIZE,
             "UPDATE `hs_workunit` SET `hashrate` = %" PRIu64
             " WHERE `id` = %" PRIu64 " LIMIT 1 ;",
             workunit_hashrate, hs_workunit_id);

    retval = boinc_db.do_query(buf);
    if (retval) {
      std::cerr << "Problem with DB query: " << buf << "\nShutting down now."
                << std::endl;
      boinc_db.close();
      exit(1);
    }
  }

  std::cerr << "Updating workunit remaining time..." << std::endl;

  snprintf(buf, SQL_BUF_SIZE,
           "UPDATE `hs_workunit` SET `remaining_time` = %" PRIu64
           " WHERE `id` = %" PRIu64 " LIMIT 1 ;",
           std::stoull(remaining_time), hs_workunit_id);

  retval = boinc_db.do_query(buf);
  if (retval) {
    std::cerr << "Problem with DB query: " << buf << "\nShutting down now."
              << std::endl;
    boinc_db.close();
    exit(1);
  }

  std::cerr << "Updating workunit cracking time..." << std::endl;

  snprintf(buf, SQL_BUF_SIZE,
           "UPDATE `hs_workunit` SET `cracking_time` = %" PRIu64
           " WHERE `id` = %" PRIu64 " LIMIT 1 ;",
           std::stoull(cracking_time), hs_workunit_id);

  retval = boinc_db.do_query(buf);
  if (retval) {
    std::cerr << "Problem with DB query: " << buf << "\nShutting down now."
              << std::endl;
    boinc_db.close();
    exit(1);
  }

  // -----------------------------------

  for (auto &device : devices) {
    // Get device id from hs_device
    std::snprintf(buf, SQL_BUF_SIZE,
                  "SELECT id FROM `hs_device` WHERE `boinc_host_id` = %" PRIu64
                  " AND `hc_id` = %" PRIu64 " LIMIT 1 ;",
                  mfh.hostid, device.first);
    int retval = boinc_db.do_query(buf);
    if (retval) {
      std::cerr << "Problem with DB query: " << buf << "\nShutting down now."
                << std::endl;
      boinc_db.close();
      exit(1);
    }

    MYSQL_RES *rp;
    rp = mysql_store_result(boinc_db.mysql);
    if (!rp) {
      std::cerr << "Problem with DB query. Shutting down now." << std::endl;
      boinc_db.close();
      exit(1);
    }

    uint32_t hs_device_id;
    MYSQL_ROW row;
    row = mysql_fetch_row(rp);
    if (row && row[0]) {
      std::cerr << " hs_device_id " << row[0] << std::endl;
      hs_device_id = std::stoull(row[0]);
    } else {
      // This device does not exist in DB, insert new entry
      std::snprintf(buf, SQL_BUF_SIZE,
                    "INSERT INTO `hs_device` "
                    "(`boinc_host_id`,`hc_id`,`name`,`"
                    "type`) VALUES (%" PRIu64 ", %" PRIu64 ", '%s'"
                    ", '%s');",
                    mfh.hostid, device.first, device.second.name.c_str(),
                    device.second.type.c_str());
      int retval = boinc_db.do_query(buf);
      if (retval) {
        std::cerr << "Problem with DB query: " << buf << "\nShutting down now."
                  << std::endl;
        boinc_db.close();
        exit(1);
      }

      hs_device_id = boinc_db.insert_id();
    }

    mysql_free_result(rp);

    std::cerr << "Inserting data to hs_device_info..." << std::endl;

    std::snprintf(buf, SQL_BUF_SIZE,
                  "INSERT INTO `hs_device_info` "
                  "(`device_id`,`workunit_id`,`hashrate`,`speed`,`temperature`,`"
                  "utilization`) VALUES (%" PRIu64 ", %" PRIu64 ", %" PRId64 ", %" PRId64
                  ", %" PRId64 ", %" PRId64 ");",
                  hs_device_id, hs_workunit_id, std::stoll(device.second.hashrate),
                  std::stoll(device.second.speed),
                  std::stoll(device.second.temp),
                  std::stoll(device.second.util));
    retval = boinc_db.do_query(buf);
    if (retval) {
      std::cerr << "Problem with DB query: " << buf << "\nShutting down now."
                << std::endl;
      boinc_db.close();
      exit(1);
    }
  }

  std::cerr << "Database updated successfully." << std::endl;
  return 0;
}
