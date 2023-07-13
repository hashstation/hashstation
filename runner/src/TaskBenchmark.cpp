/*
 * Author : see AUTHORS
 * Licence: MIT, see LICENSE
 */

#include "TaskBenchmark.hpp"
/* Protected */

bool TaskBenchmark::parseHashcatBenchmark(std::string &output_line) {
  using namespace nlohmann;
  status_info_ = json::parse(output_line, nullptr, false);
  if (status_info_.is_discarded()) {
    // JSON parse error
    return false;
  }

  if (salt_count_ <= 1) {
    uint64_t salt_count = status_info_.at("recovered_salts").at(1);
    salt_count_ = std::max<uint64_t>(salt_count, 1);
  }

  return true;
}

/* Public */

TaskBenchmark::TaskBenchmark(Directory &directory, ConfigTask task_config,
                             ConfigHost host_config,
                             const std::string &output_file,
                             const std::string &workunit_name)
    : TaskComputeBase(directory, task_config, host_config, output_file,
                      workunit_name),
      salt_count_(1) {
  mode_ = "b";
  initializeTotalHashes();
}

std::string TaskBenchmark::generateOutputMessage() {

  std::string output_message = "";

  exit_code_ = process_hashcat_->getExitCode();

  output_message += mode_ + "\n";

  if (exit_code_ == HashcatConstant::Succeded ||
      exit_code_ == HashcatConstant::Exhausted ||
      exit_code_ == HashcatConstant::RuntimeAbort) {

    output_message += ProjectConstants::TaskFinalStatus::Succeded + "\n";
    // communicate success to the outside world
    exit_code_ = HashcatConstant::Succeded;

  } else {

    output_message += ProjectConstants::TaskFinalStatus::Error + "\n";
    output_message +=
        RunnerUtils::toString(process_hashcat_->getExitCode()) + "\n";
    output_message += getErrorMessage() + "\n";
  }

  return output_message;
}

void TaskBenchmark::initializeTotalHashes() { total_hashes_ = 1; }

bool TaskBenchmark::parseHashcatOutputLine(std::string &output_line) {
  if (output_line.empty())
    return false;

  Logging::debugPrint(Logging::Detail::CustomOutput,
                      "Hashcat line: " + output_line);

  bool parsed = parseHashcatBenchmark(output_line);
  if (!parsed) {
    return false;
  }
  return true;
}

void TaskBenchmark::progress() {
  std::string line;

  PRINT_POSITION_IN_CODE();

  while (process_hashcat_->isRunning()) {

    PRINT_POSITION_IN_CODE();

    line = process_hashcat_->readOutPipeLine();

    PRINT_POSITION_IN_CODE();

    if (parseHashcatOutputLine(line)) {
      reportProgress();
    }
  }
  PRINT_POSITION_IN_CODE();
}
