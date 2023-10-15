/**
 * @file Config.cpp
 * @brief Source file for Config
 * @authors Lukas Zobal (zobal.lukas(at)gmail.com)
 * @date 12. 12. 2018
 * @license MIT, see LICENSE
 */

#include <Config.h>

#include <ctime>
#include <iostream>
#include <cstdarg>
#include <iomanip>
#include <sstream>
#include <cstdio>


/** Initialization of static private map */
std::map<std::pair<uint64_t, uint64_t>, std::ifstream* > Tools::m_fd_map;


namespace Config {
    /** Table names, for easy configuration */
    std::string tableNameBenchmark =       "hs_benchmark";
    std::string tableNameWorkunit =        "hs_workunit";
    std::string tableNameJob =             "hs_job";
    std::string tableNameHost =            "hs_host";
    std::string tableNameHostActivity =    "hs_host_activity";
    std::string tableNameHostStatus =      "hs_host_status";
    std::string tableNameMask =            "hs_mask";
    std::string tableNameSettings =        "hs_settings";
    std::string tableNameDictionary =      "hs_dictionary";
    std::string tableNameRule =            "hs_rule";
    std::string tableNameJobDictionary =   "hs_job_dictionary";
    std::string tableNameJobRule =         "hs_job_rule";
    std::string tableNameHash =            "hs_hash";
    std::string tableNamePcfgGrammar =     "hs_pcfg_grammar";
    std::string tableNameUserPermissions = "hs_user_permissions";

    /** Path to dictionaries */
    std::string dictDir = "/usr/share/assets/dictionaries/";
    std::string markovDir = "/usr/share/assets/markov/";
    std::string rulesDir = "/usr/share/assets/rules/";
    std::string pcfgDir = "/usr/share/assets/pcfg/";
    std::string charsetDir = "/usr/share/assets/charsets/";

    /** Template names*/
    std::string inTemplateFileBench =          "bench_in";
    std::string inTemplateFileMask =           "mask_in";
    std::string inTemplateFileMarkov =         "markov_in";
    std::string inTemplateFileDict =           "dict_in";
    std::string inTemplateFileDictAlt =        "dict_alt_in";
    std::string inTemplateFileCombinator =     "combinator_in";
    std::string inTemplateFileHybridDictMask = "hybrid_dict_mask_in";
    std::string inTemplateFileHybridMaskDict = "hybrid_mask_dict_in";
    std::string inTemplateFilePrince =         "prince_in";
    std::string inTemplateFilePcfg =           "pcfg_in";
    std::string outTemplateFile =              "app_out";

    /** Some default values */
    char * inTemplatePathBench = nullptr;
    char * inTemplatePathMask = nullptr;
    char * inTemplatePathMarkov = nullptr;
    char * inTemplatePathDict = nullptr;
    char * inTemplatePathDictAlt = nullptr;
    char * inTemplatePathPrince = nullptr;
    char * inTemplatePathPcfg = nullptr;
    char * inTemplatePathCombinator = nullptr;
    char * inTemplatePathHybridDictMask = nullptr;
    char * inTemplatePathHybridMaskDict = nullptr;
    DB_APP * app = nullptr;
    int startTime = 0;
    int seqNo = 0;
    char * appName = nullptr;
    std::string projectDir = "";
}

void Tools::printDebug(const char* format, ...)
{
    va_list argPtr;
    va_start(argPtr, format);
    vfprintf(stderr, format, argPtr);
    va_end(argPtr);
}


void Tools::printDebugTimestamp(const char *format, ...)
{
    std::time_t timeNow = std::time(nullptr);
    std::cerr << std::put_time(std::localtime(&timeNow), "%d.%m.%Y %H:%M:%S ");

    va_list argPtr;
    va_start(argPtr, format);
    vfprintf(stderr, format, argPtr);
    va_end(argPtr);
}


void Tools::printDebugJob(Config::DebugType type, uint64_t jobId, const char *format, ...)
{
    std::stringstream tmpStream;
    switch (type)
    {
        case Config::DebugType::Log:
            tmpStream << "LOG: ";
            break;
        case Config::DebugType::Warn:
            tmpStream << "WARN: ";
            break;
        case Config::DebugType::Error:
            tmpStream << "ERROR: ";
        default:
            break;
    }

    std::time_t timeNow = std::time(nullptr);
    tmpStream << std::put_time(std::localtime(&timeNow), "%d.%m.%Y %H:%M:%S ");
    tmpStream << "[Job #" << jobId << "] ";

    std::cerr << tmpStream.str();

    va_list argPtr;
    va_start(argPtr, format);
    vfprintf(stderr, format, argPtr);

    if (type == Config::DebugType::Warn)
    {
        FILE * warnFile;
        warnFile = std::fopen((Config::projectDir + "work_generator_warn.log").c_str(), "a");
        if (warnFile != nullptr)
        {
            std::fputs(tmpStream.str().c_str(), warnFile);
            va_start(argPtr, format);
            vfprintf(warnFile, format, argPtr);
            std::fclose(warnFile);
        }
        else
        {
            std::cerr << "Note: Failed to open additional log." << std::endl;
        }
    }
    else if (type == Config::DebugType::Error)
    {
        FILE * errorFile;
        errorFile = std::fopen((Config::projectDir + "work_generator_error.log").c_str(), "a");
        if (errorFile != nullptr)
        {
            std::fputs(tmpStream.str().c_str(), errorFile);
            va_start(argPtr, format);
            vfprintf(errorFile, format, argPtr);
            std::fclose(errorFile);
        }
        else
        {
            std::cerr << "Note: Failed to open additional log." << std::endl;
        }
    }

    va_end(argPtr);
}



void Tools::printDebugHost(Config::DebugType type, uint64_t jobId, uint64_t hostId, const char *format, ...)
{
    std::stringstream tmpStream;
    switch (type)
    {
        case Config::DebugType::Log:
            tmpStream << "LOG: ";
            break;
        case Config::DebugType::Warn:
            tmpStream << "WARN: ";
            break;
        case Config::DebugType::Error:
            tmpStream << "ERROR: ";
        default:
            break;
    }

    std::time_t timeNow = std::time(nullptr);
    tmpStream << std::put_time(std::localtime(&timeNow), "%d.%m.%Y %H:%M:%S ");
    tmpStream << "[Job #" << jobId << "][Host #" << hostId << "] ";

    std::cerr << tmpStream.str();

    va_list argPtr;
    va_start(argPtr, format);
    vfprintf(stderr, format, argPtr);

    if (type == Config::DebugType::Warn)
    {
        FILE * warnFile;
        warnFile = std::fopen((Config::projectDir + "work_generator_warn.log").c_str(), "a");
        if (warnFile != nullptr)
        {
            std::fputs(tmpStream.str().c_str(), warnFile);
            va_start(argPtr, format);
            vfprintf(warnFile, format, argPtr);
            std::fclose(warnFile);
        }
        else
        {
            std::cerr << "Note: Failed to open additional log." << std::endl;
        }
    }
    else if (type == Config::DebugType::Error)
    {
        FILE * errorFile;
        errorFile = std::fopen((Config::projectDir + "work_generator_error.log").c_str(), "a");
        if (errorFile != nullptr)
        {
            std::fputs(tmpStream.str().c_str(), errorFile);
            va_start(argPtr, format);
            vfprintf(errorFile, format, argPtr);
            std::fclose(errorFile);
        }
        else
        {
            std::cerr << "Note: Failed to open additional log." << std::endl;
        }
    }

    va_end(argPtr);
}



void Tools::printDbMap(DbMap & map)
{
    Tools::printDebug("Map contents:\n");
    for (auto & item : map)
        Tools::printDebug("%s : %s\n", item.first.c_str(), item.second.c_str());
}


std::ifstream * Tools::getStream(uint64_t jobId, uint64_t dictId, std::string dictFileName)
{
    /** Search for opened file descriptor */
    for(auto & entry : m_fd_map)
    {
        if(entry.first.first == jobId && entry.first.second == dictId)
            return entry.second;
    }

    /** Open a new one */
    auto newStream = new std::ifstream(Config::dictDir + dictFileName);
    m_fd_map.insert(std::make_pair(std::pair<uint64_t, uint64_t >(jobId, dictId), newStream));
    return newStream;
}


void Tools::releaseFdMemory()
{
    for(auto & fd : m_fd_map)
    {
        if(fd.second)
        {
            fd.second->close();
            delete fd.second;
        }
    }
}


std::string Tools::toHex(char *binaryData, int len)
{
    std::string s(len * 2, ' ');
    for (int i = 0; i < len; ++i) {
        s[2 * i]     = Config::hexmap[(binaryData[i] & 0xF0) >> 4];
        s[2 * i + 1] = Config::hexmap[binaryData[i] & 0x0F];
    }
    return s;
}
