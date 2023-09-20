/*
* Author : see AUTHORS
* Licence: MIT, see LICENSE
*/

#include "AttackCrackingBase.hpp"

AttackCrackingBase::AttackCrackingBase(const ConfigTask& config, Directory& directory, bool external_generator) : AttackBase(config), directory_(directory), external_generator_(external_generator) { }

void AttackCrackingBase::addHashcatSpecificArguments() {
    /** For benchmark only allowed attack_mode value is 3 */
    if (external_generator_) {
        addArgument("-a"); // Switch to dictionary attack via pipe
        addArgument("0");
    } else {
        findAndAddRequired("attack_mode", "-a");
    }

    if (!config_.find("attack_submode", attack_submode_))
        AgentUtils::runtimeException("attack_submode is missing in config");

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

    if (config_.find(ConfigTask::WORKUNIT_STATUS_UPDATE, value) && value != "0") {
        addArgument("--status-timer=" + value);
    }

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

void AttackCrackingBase::addSpecificArguments() {
  addHashcatSpecificArguments();
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

void AttackCrackingBase::addRules() {
  std::string rule_application_mode;
  if (config_.find(ConfigTask::RULE_APPLICATION_MODE, rule_application_mode)) {
    if (rule_application_mode == "0") {
      addArgument("-r");
      addRequiredFile("rules");
    } else if (rule_application_mode == "1") {
      std::string rule_counts;
      if (config_.find(ConfigTask::RULE_COUNTS, rule_counts)) {
        File rulesFile;
        if (!directory_.find("rules", rulesFile)) {
            AgentUtils::runtimeException("Failed to find the rules file.");
        }

        std::ifstream rules(rulesFile.getRelativePath());
        if (!rules.is_open()) {
            AgentUtils::runtimeException("Failed to open the rules file.");
        }

        std::vector<std::string> rule_counts_vec = split(rule_counts, ';');
        for (unsigned i = 0; i < rule_counts_vec.size(); i++) {
          std::string temp_rule_name = "rule" + std::to_string(i + 1);
          std::ofstream tmp_rule(temp_rule_name);
          if (!tmp_rule.is_open()) {
              AgentUtils::runtimeException("Failed to open rule file: " + temp_rule_name);
          }

          unsigned rule_count = std::stoull(rule_counts_vec[i]);
          for (unsigned l = 0; l < rule_count; ++l) {
              std::string rule;
              if (!std::getline(rules, rule)) {
                Logging::debugPrint(Logging::Detail::CustomOutput, "Unable to read line " + std::to_string(l + 1) + " from rules file");
                break;
              }
              tmp_rule << rule << std::endl;
          }

          addArgument("-r");
          addArgument(temp_rule_name);

          files_to_delete_.push_back(temp_rule_name);
        }
      } else {
        AgentUtils::runtimeException("No rule counts for attack with rules.");
      }
    }
  } else {
    AgentUtils::runtimeException("No rule application mode for attack with rules.");
  }
}

AttackCrackingBase::~AttackCrackingBase() {
  for (auto& file : files_to_delete_) {
    ::remove(file.c_str());
  }
}