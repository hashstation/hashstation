/*
 * Author : see AUTHORS
 * Licence: MIT, see LICENSE
 */

#include "TaskBenchmarkAll.hpp"
#include <algorithm>

/* Public */
TaskBenchmarkAll::TaskBenchmarkAll(Directory &directory,
                                   ConfigTask task_config,
                                   ConfigHost host_config,
                                   const std::string &output_file,
                                   const std::string &workunit_name)
    : TaskBase(directory, task_config, host_config, output_file, workunit_name),
      hashcat_mutex_(AgentConstants::HashcatMutexName) {
  mode_ = "a";
}

TaskBenchmarkAll::~TaskBenchmarkAll() {
  delete process_cracking_engine_;
}

std::string TaskBenchmarkAll::generateOutputMessage() {

  std::ostringstream msg;
  msg << mode_ << '\n';

  if (exit_code_ == HashcatConstant::Succeded) {

    msg << ProjectConstants::TaskFinalStatus::Succeded << '\n';
    msg << getRunTime() << '\n';

    for (const auto &result : results_) {
      msg << result.first << ':' << result.second << '\n';
    }

  } else {

    msg << ProjectConstants::TaskFinalStatus::Error << '\n';
    msg << exit_code_ << '\n';
  }

  return msg.str();
}

void TaskBenchmarkAll::initializeTotalHashes() {}

void TaskBenchmarkAll::initialize() {
  using namespace nlohmann;
  std::ifstream json_file("hash_info.json");
  json hash_info_json = json::parse(json_file, nullptr, false);
  if (hash_info_json.is_discarded()) {
    // JSON parse error
    return;
  }

  total_hashes_ = hash_info_json.size();
}

void TaskBenchmarkAll::startComputation() {}

int TaskBenchmarkAll::finish() { return exit_code_; }

void TaskBenchmarkAll::progress() {
  std::string line;
  std::set<unsigned> benchmarked_modes;
  std::vector<std::string> args;
  args.push_back("-b");
  args.push_back("--benchmark-all");
  args.push_back("--quiet");
  args.push_back("--machine-readable");

  process_cracking_engine_ = Process::create(args, directory_);

  hashcat_mutex_.lock();
  process_cracking_engine_->run();

  while (process_cracking_engine_->isRunning()) {

    line = process_cracking_engine_->readOutPipeLine();
    int device_id, corespeed_dev, memoryspeed_dev;
    float exec_msec_dev;
    unsigned hash_mode;
    uint64_t speed; // hashes per second

    int filled_vars =
        sscanf(line.c_str(), "%d:%u:%d:%d:%f:%" PRIu64, &device_id, &hash_mode,
               &corespeed_dev, &memoryspeed_dev, &exec_msec_dev, &speed);
    if (filled_vars != 6)
      continue;

    results_[hash_mode] += speed;
    if (benchmarked_modes.insert(hash_mode).second) { // first time
      actualizeComputedHashes(1);
      reportProgress();
    }
  }

  exit_code_ = process_cracking_engine_->finish();
  hashcat_mutex_.unlock();
}

double TaskBenchmarkAll::getRunTime() const {
  return process_cracking_engine_->getExecutionTime();
}