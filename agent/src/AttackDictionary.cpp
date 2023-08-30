/*
* Author : see AUTHORS
* Licence: MIT, see LICENSE
*/

#include "AttackDictionary.hpp"

AttackDictionary::AttackDictionary(const ConfigTask& config, Directory& directory) : AttackCrackingBase(config, directory) {
  
}

void AttackDictionary::addSpecificArguments() {
  AttackCrackingBase::addSpecificArguments();

  if (attack_submode_ == "0") {

    // Do nothing just at the end add dictionaries

  } else if (attack_submode_ == "1") {

    addRules();

  } else {
    AgentUtils::runtimeException("Unsupported attack_submode = " + attack_submode_ + " attack_mode = " + attack_mode_ + " has no such attack_submode");
  }

  std::string dict1Name;
  std::string prestoredDictsPath = host_config_.getPrestoredDictsPath();

  bool prestored = false;
  File prestoredDict;

  if (config_.find(ConfigTask::DICT1_NAME, dict1Name)) {
    if (!Directory::exists(prestoredDictsPath)) {
      AgentUtils::runtimeException("Unable to find prestored dict " + dict1Name);
    }
    // Try to use prestored dictionary on host. In fitcrack.conf you can set
    // custom dir where Agent should look for dictionaries. If the user enable
    // option to use prestored dictionaries, generator will send dictionary
    // name, so we will now search for this dictionary.
    Directory prestoredDictsDir(prestoredDictsPath);
    prestoredDictsDir.scanForEntities();

    if (prestoredDictsDir.find(dict1Name, prestoredDict)) {
      prestored = true;
      std::string pathToPrestoredDict = prestoredDict.getAbsolutePath();
      Logging::debugPrint(Logging::Detail::GeneralInfo,
                          "Found prestored dict: " + prestoredDict.getAbsolutePath());
    } else {
      // Error!
      AgentUtils::runtimeException("Prestored dict " + dict1Name +
                                    " was not found in " + prestoredDictsPath);
    }
  }

  std::string pathToDictionary;
  if (prestored) {
    pathToDictionary = prestoredDict.getAbsolutePath();
    addArgument(pathToDictionary);
  } else {
    pathToDictionary = addRequiredFile("dict1");
  }

  std::string dict1Keyspace;
  if (config_.find(ConfigTask::DICT1_KEYSPACE, dict1Keyspace)) {
    // Build hashcat.dictstat2 so hashcat does not have to recompute
    // number of passwords in this dictionary - could be a bottleneck for huge
    // dictionaries.
    if (dsBuilder.create()) {
      bool dict1StatAdded = dsBuilder.addStatForDict(pathToDictionary.c_str(),
                                                     stoull(dict1Keyspace));
      if (dict1StatAdded) {
        Logging::debugPrint(Logging::Detail::GeneralInfo,
                            "dictstat2 created for " + pathToDictionary);
      }
      dsBuilder.close();
    }
  }
}
