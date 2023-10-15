/*
* Author : see AUTHORS
* Licence: MIT, see LICENSE
*/

#include <main.hpp>

#include <memory>

int main(int argc, char **argv) {

  BOINC_OPTIONS options;
  AgentUtils::initializeBoinc(options);

  int error_value = 0;

  std::string exception_message;

  try {
    Logging::debugPrint(Logging::Detail::Important, "Hashstation Agent " AGENT_VERSION);

    Directory directory(".");
    File file;

    directory.scanForEntities();

    if (!directory.findVersionedFile("hashcat_files", "zip", file)) {
      AgentUtils::runtimeException("Couldn't find hashcat_files archive.");
      return -1;
    }

    unsigned long long extraction_start = AgentUtils::timeInMs();
    FileZip hashcatkernels(file);
    hashcatkernels.extract();
    unsigned long long extraction_end = AgentUtils::timeInMs();

    Logging::debugPrint(Logging::Detail::DevelDebug, " whole EXTRACTION took: " + AgentUtils::toString(extraction_end - extraction_start) + "ms");

    directory.scanForEntities();

    const char *config = argc > 1 ? argv[1] : "config";
    directory.find(config, file);

    std::unique_ptr<TaskBase> task(Task::create(file, directory));

    task->initialize();
    task->startComputation();
    task->progress();
    error_value = task->saveAndFinish();
    error_value = (error_value == 1 ? 0 : error_value);
  }
  catch (const std::exception& e) {
    exception_message = e.what();
    Logging::debugPrint(Logging::Detail::Important, "Agent failed with std::runtime_error: \n what() : " + exception_message);
  }
  catch(...)
  {
    Logging::debugPrint(Logging::Detail::Important, "Agent failed with an unknown exception");
  }

  if (AgentUtils::isStandalone()) {
    Logging::debugPrint(Logging::Detail::Important, "Results and run outputs are stored in 'out' and 'stderr.txt' files.");
  }

  if (!exception_message.empty()) {
    boinc_finish_message(error_value, exception_message.c_str(), false); //exit(0);
  } else {
    boinc_finish(error_value); // exit(0);
  }

  return 0;
}
