/*
* Author : see AUTHORS
* Licence: MIT, see LICENSE
*/

#include "AttackCrackingBase.hpp"

AttackCrackingBase::AttackCrackingBase(const ConfigTask& config, Directory& directory, const char* attack_mode) : AttackBase(config), directory_(directory) {

  /** For benchmark only allowed attack_mode value is 3 */
  findAndAddRequired("attack_mode", "-a", attack_mode);

  if (!config_.find("attack_submode", attack_submode_))
  AgentUtils::runtimeException("attack_submode is missing in config");
  
}

void AttackCrackingBase::addSpecificArguments() {

  addRequiredFile("data");

  std::string value;
  if (config_.find(ConfigTask::START_INDEX, value) && value != "0") {
    addArgument("-s");
    addArgument(value);
  }
  if (config_.find(ConfigTask::HC_KEYSPACE, value) && value != "0") {
    addArgument("-l");
    addArgument(value);
  }

  findAndAddOptional(ConfigTask::HWMON_TEMP_ABORT, "--hwmon-temp-abort");

  if (config_.find(ConfigTask::HEX_DICT, value) && value == "1")
    addArgument("--hex-wordlist");

  addArgument("--status-timer="+AgentUtils::toString(HashcatConstant::ProgressPeriod));

  addArgument("-o");
  addArgument(output_file_);

  addArgument("--outfile-format=" + HashcatConstant::OutputFormat);
  addArgument("--quiet");
  addArgument("--status");
  addArgument("--status-json");
  addArgument("--restore-disable");
  addArgument("--potfile-disable");
  addArgument("--logfile-disable");

  if (config_.find(ConfigTask::OPTIMIZED, value) && value == "1")
    addArgument("-O");

  if (config_.find(ConfigTask::SLOW_CANDIDATES, value) && value == "1")
    addArgument("-S");

  if (config_.find(ConfigTask::DEVICE_TYPES, value) && value != "0") {
    if (value == "3")
      value = "1,2";
    addArgument("-D");
    addArgument(value);
  }

  if (config_.find(ConfigTask::WORKLOAD_PROFILE, value) && value != "0") {
    addArgument("-w");
    addArgument(value);
  }

  // Add as last.
  if (config_.find(ConfigTask::EXTRA_HC_ARGS, value)) {
    for (auto &arg : split(value, ' '))
      addArgument(arg);
  }
}

std::string AttackCrackingBase::addRequiredFile(const std::string& file_name) {

  Logging::debugPrint(Logging::Detail::CustomOutput, " : file_name : " + file_name);

  File file;
  if (!directory_.find(file_name, file)) {
    AgentUtils::runtimeException("Missing hashcat required file " + file_name);
  }

  std::string fileRelativePath = file.getRelativePath();
  addArgument(fileRelativePath);

  return fileRelativePath;
}

void AttackCrackingBase::addOptionalFile(const std::string& file_name, const std::string& argument) {

  Logging::debugPrint(Logging::Detail::CustomOutput, " : file_name = " + file_name);

  File file;

  if (directory_.find(file_name, file)) {
    addArgument(argument);
    addArgument(file.getRelativePath());
  }
}