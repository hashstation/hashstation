/**
 * @file AbstractGenerator.cpp
 * @brief Source file for abstract generator
 * @authors Lukas Zobal (zobal.lukas(at)gmail.com)
 * @date 12. 12. 2018
 * @license MIT, see LICENSE
 */

#include <sched_util_basic.h>
#include <sched_util.h>
#include "AbstractGenerator.h"
#include "SqlLoader.h"

#include <cmath>


uint64_t CAbstractGenerator::getSecondsPerWorkunit(PtrJob &job, CSqlLoader &loader)
{
    uint64_t secondsPerWorkunit = job->getSecondsPerWorkunit();
    Tools::printDebugJob(Config::DebugType::Log, job->getId(),
                         "Desired seconds per workunit: %" PRIu64 "\n",
                         secondsPerWorkunit);
    return secondsPerWorkunit;
}


void CAbstractGenerator::activateJobs()
{
    int retval;
    /** Wait for the transitioner to create instances
     * of the workunits we just created.
     * Otherwise we'll create too many workunits.
     */
    double now = dtime();
    while (1)
    {
        daemon_sleep(1);
        double x;

        retval = min_transition_time(x);
        if (retval)
        {
            log_messages.printf(MSG_DEBUG, "min_transition_time failed: %s\n", boincerror(retval));
            break;
        }

        if (x > now)
            break;
    }
}

std::vector<std::string> CAbstractGenerator::getStickyFiles(PtrJob &job) {
    std::vector<std::string> stickyFiles;
    stickyFiles.push_back(std::string(Config::appName) + "_hashes_" + std::to_string(job->getId()));

    /** Get sticky file names according to attack */
    switch (job->getAttackMode())
    {
        case Config::AttackMode::AttackCombinator:
            stickyFiles.push_back(std::string(Config::appName) + "_combinator_" + std::to_string(job->getId()));
            break;

        case Config::AttackMode::AttackMask:
            if (job->getAttackSubmode() == 0)
                break;

            stickyFiles.push_back(std::string(Config::appName) + "_markov_" + std::to_string(job->getId()));
            break;

        case Config::AttackMode::AttackDict:
          if (job->getAttackSubmode() == 1)
            stickyFiles.push_back(std::string(Config::appName) + "_rules_" +
                                  std::to_string(job->getId()));

          if (job->getDistributionMode() == 1)
            stickyFiles.push_back(std::string(Config::appName) + "_dict_" +
                                  std::to_string(job->getId()));

          break;
        case Config::AttackMode::AttackPrince:
          stickyFiles.push_back(std::string(Config::appName) + "_dict_" +
                                std::to_string(job->getId()));
          if (job->getAttackSubmode() == 1)
            stickyFiles.push_back(std::string(Config::appName) + "_rules_" +
                                  std::to_string(job->getId()));
          break;
        case Config::AttackMode::AttackPcfg:
          stickyFiles.push_back(std::string(Config::appName) + "_grammar_" +
                                std::to_string(job->getId()));
          if (job->getAttackSubmode() == 1)
            stickyFiles.push_back(std::string(Config::appName) + "_rules_" +
                                  std::to_string(job->getId()));
          break;
        
        case Config::AttackMode::AttackHybridDictMask:
          stickyFiles.push_back(std::string(Config::appName) + "_hybrid_" +
                                std::to_string(job->getId())+".dict");
          break;

        default:
          break;
    }

    return stickyFiles;
}

void CAbstractGenerator::deleteStickyFiles(PtrJob &job, std::vector<PtrHost> &jobHosts)
{
    std::vector<std::string> stickyFiles = getStickyFiles(job);
    if (stickyFiles.empty())
        return;

    /** Send message to all hosts in hs_host working on job */
    for (PtrHost &host : jobHosts)
      for (const std::string &stickyFile : stickyFiles)
        create_delete_file_msg((int)host->getBoincHostId(), stickyFile.c_str());
}
