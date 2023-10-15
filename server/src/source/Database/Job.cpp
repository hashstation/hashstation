/**
 * @file job.cpp
 * @brief Source file for hs_job entry
 * @authors Lukas Zobal (zobal.lukas(at)gmail.com)
 * @date 12. 12. 2018
 * @license MIT, see LICENSE
 */

#include <Job.h>
#include <Dictionary.h>
#include <SqlLoader.h>


CJob::CJob(DbMap &jobMap, CSqlLoader * sqlLoader)
    :   m_sqlLoader(sqlLoader)
{
    try
    {
        this->m_id = std::stoull(jobMap["id"]);
        this->m_attack = jobMap["attack"];
        this->m_attackMode = std::stoul(jobMap["attack_mode"]);
        this->m_attackSubmode = std::stoul(jobMap["attack_submode"]);
        this->m_distributionMode = static_cast<DictDistributionMode>(std::stoul(jobMap["distribution_mode"]));
        this->m_hashType = std::stoul(jobMap["hash_type"]);
        this->m_status = std::stoul(jobMap["status"]);
        this->m_keyspace = std::stoull(jobMap["keyspace"]);
        this->m_hcKeyspace = std::stoull(jobMap["hc_keyspace"]);
        this->m_currentIndex = std::stoull(jobMap["current_index"]);
        this->m_currentIndex2 = std::stoull(jobMap["current_index_2"]);
        this->m_name = jobMap["name"];
        this->m_secondsPerWorkunit = std::stoull(jobMap["seconds_per_workunit"]);
        this->m_ruleLeft = jobMap["rule_left"];
        this->m_ruleRight = jobMap["rule_right"];
        this->m_charset1 = jobMap["charset1"];
        this->m_charset2 = jobMap["charset2"];
        this->m_charset3 = jobMap["charset3"];
        this->m_charset4 = jobMap["charset4"];
        if (!jobMap["grammar_id"].empty())
            this->m_grammar_id = std::stoull(jobMap["grammar_id"]);
        this->m_markov = jobMap["markov_hcstat"];
        this->m_markovThreshold = std::stoul(jobMap["markov_threshold"]);
        this->m_casePermute = std::stoul(jobMap["case_permute"]);
        this->m_checkDuplicates = std::stoul(jobMap["check_duplicates"]);
        this->m_minPasswordLen = std::stoul(jobMap["min_password_len"]);
        this->m_maxPasswordLen = std::stoul(jobMap["max_password_len"]);
        this->m_minElemInChain = std::stoul(jobMap["min_elem_in_chain"]);
        this->m_maxElemInChain = std::stoul(jobMap["max_elem_in_chain"]);
        this->m_optimized = std::stoul(jobMap["optimized"]);
        this->m_dictDeploymentMode = static_cast<DictDeploymentMode>(std::stoul(jobMap["dict_deployment_mode"]));
        this->m_deviceTypes = std::stoul(jobMap["device_types"]);
        this->m_workloadProfile = std::stoul(jobMap["workload_profile"]);
        this->m_slowCandidates = std::stoul(jobMap["slow_candidates"]);
        this->m_fixedWorkunitSize = std::stoul(jobMap["fixed_workunit_size"]);
        this->m_extraHcArgs = jobMap["extra_hc_args"];
        this->m_ruleApplicationMode = static_cast<RuleApplicationMode>(std::stoul(jobMap["rule_application_mode"]));
        this->m_killFlag = std::stoul(jobMap["kill"]) != 0;

        if (this->m_keyspace == 0 && this->m_id != Config::benchAllId)
        {
            Tools::printDebugJob(Config::DebugType::Error, this->m_id,
                                 "Keyspace cannot be 0, setting job to Malformed\n");
            m_sqlLoader->updateJobStatus(this->m_id, Config::JobState::JobMalformed);
        }

        /** Compute second dictionary size */
        if (this->m_attackMode == Config::AttackMode::AttackCombinator &&
            this->m_hcKeyspace != 0)
                m_combSecDictSize = this->m_keyspace / this->m_hcKeyspace;

        /** Load parameters used for adaptive planning */
        m_secondsPassed = m_sqlLoader->getSecondsPassed(this->m_id);
        m_totalPower = m_sqlLoader->getTotalPower(this->m_id);
        m_owner = m_sqlLoader->getJobOwner(this->m_id);

        /** Load workunit timeout */
        m_timeoutFactor = m_sqlLoader->getTimeoutFactor(m_owner);
        if (this->m_timeoutFactor < Config::minTimeoutFactor)
        {
            Tools::printDebugJob(Config::DebugType::Warn, this->m_id,
                                 "Found timeout_factor=%" PRIu64 ", falling back to minimum of %" PRIu64"\n",
                                 this->m_timeoutFactor, Config::minTimeoutFactor);
            this->m_timeoutFactor = Config::minTimeoutFactor;
        }

        /** Temperature threshold */
        m_hwTempAbort = m_sqlLoader->getHWTempAbort(m_owner);

        m_benchRuntimeLimit = m_sqlLoader->getBenchRuntimeLimit(m_owner);
        m_workunitStatusUpdate = m_sqlLoader->getWorkunitStatusUpdate(m_owner);
    }
    catch(std::logic_error & error)
    {
        Tools::printDebugJob(Config::DebugType::Error, this->m_id,
                             "Error converting jobMap to PtrJob: %s\n", error.what());
        exit(1);
    }
}


PtrJob CJob::create(DbMap &jobMap, CSqlLoader * sqlLoader)
{
    return PtrJob(new CJob(jobMap, sqlLoader));
}


std::string CJob::getTableName()
{
    return Config::tableNameJob;
}


void CJob::updateIndex(uint64_t newIndex)
{
    /** Local update */
    this->m_currentIndex = newIndex;

    /** Database update */
    this->m_sqlLoader->updateJobIndex(this->m_id, newIndex);
}


void CJob::updateIndex2(uint64_t newIndex2)
{
    /** Local update */
    this->m_currentIndex2 = newIndex2;

    /** Database update */
    this->m_sqlLoader->updateJobIndex2(this->m_id, newIndex2);
}


void CJob::updateStatus(Config::JobState newStatus)
{
    /** Local update */
    this->m_status = newStatus;

    /** Database update */
    this->m_sqlLoader->updateJobStatus(this->m_id, newStatus);
}


void CJob::updateStatusOfRunningJob(Config::JobState newStatus)
{
    /** Local update */
    if (this->m_status >= 10)
        this->m_status = newStatus;

    /** Database update */
    this->m_sqlLoader->updateRunningJobStatus(this->m_id, newStatus);
}


void CJob::updateStartTime()
{
    /** Database update only */
    m_sqlLoader->updateStartTimeNow(this->m_id);
}


void CJob::loadMasks(bool useNormalKeyspace)
{
    m_masks.clear();
    auto maskVec = useNormalKeyspace ? m_sqlLoader->loadJobMasksWithNormalKeyspace(this->m_id) : m_sqlLoader->loadJobMasks(this->m_id);
    for (auto & mask : maskVec)
        this->addMask(mask);
}


void CJob::loadDictionaries()
{
    m_dictionaries.clear();
    auto dictVec = m_sqlLoader->loadJobDictionaries(this->m_id);
    for (auto & dict : dictVec)
        this->addDictionary(dict);
}

void CJob::loadRules()
{
    m_rules.clear();
    auto ruleVec = m_sqlLoader->loadJobRules(this->m_id);
    for (auto & rule : ruleVec)
        this->addRule(rule);
}

bool CJob::loadHashes()
{
    m_hashes.clear();
    std::vector<std::string> hashVec = m_sqlLoader->loadJobHashes(this->m_id);

    if (hashVec.empty())
        return false;

    auto it = std::begin(hashVec);
    m_hashes.append(*it);
    ++it;

    for (auto end = std::end(hashVec); it != end; ++it)
    {
        m_hashes.append("\n");
        m_hashes.append(*it);
    }

    /** Debug output */
    Tools::printDebugJob(Config::DebugType::Log, this->m_id,
                         "Loaded hashes #: %d\n", hashVec.size());
    /** @warning c_str() wont work for binary hashes, but we don't care in debug for now */
    //Tools::printDebug("%s\n", m_hashes.c_str());

    return true;
}

uint64_t CJob::getEndIndex() const
{
    switch(getAttackMode())
    {
    case Config::AttackMode::AttackCombinator:
    case Config::AttackMode::AttackHybridDictMask:
    case Config::AttackMode::AttackHybridMaskDict:
        return getKeyspace()/getHcKeyspace();
    default:
        return getHcKeyspace();
    }
}

/**
 * @section Table attributes getters
 */

uint64_t CJob::getId() const
{
    return this->m_id;
}

uint64_t CJob::getOwner() const
{
    return this->m_owner;
}

const std::string & CJob::getAttack() const
{
    return m_attack;
}


uint32_t CJob::getAttackMode() const
{
    return m_attackMode;
}


uint32_t CJob::getAttackSubmode() const
{
    return m_attackSubmode;
}

DictDistributionMode CJob::getDistributionMode() const
{
    return m_distributionMode;
}

RuleApplicationMode CJob::getRuleApplicationMode() const
{
    return m_ruleApplicationMode;
}

DictDeploymentMode CJob::getDictDeploymentMode() const
{
    return m_dictDeploymentMode;
}

uint32_t CJob::getHashType() const
{
    return m_hashType;
}


uint32_t CJob::getStatus() const
{
    return m_status;
}


uint64_t CJob::getKeyspace() const
{
    return m_keyspace;
}


uint64_t CJob::getHcKeyspace() const
{
    return m_hcKeyspace;
}


uint64_t CJob::getCurrentIndex() const
{
    return m_currentIndex;
}


uint64_t CJob::getCurrentIndex2() const
{
    return m_currentIndex2;
}


const std::string & CJob::getName() const
{
    return m_name;
}


uint64_t CJob::getSecondsPerWorkunit() const
{
    return m_secondsPerWorkunit;
}


std::vector<Config::Ptr<CRule>> CJob::getRules() const
{
    std::vector<Config::Ptr<CRule>> result;

    for (auto & rule : m_rules)
    {
        result.push_back(rule);
    }

    return result;
}


const std::string & CJob::getRuleLeft() const
{
    return m_ruleLeft;
}


const std::string & CJob::getRuleRight() const
{
    return m_ruleRight;
}

const std::string & CJob::getGrammar() const
{
    return m_grammar;
}

uint64_t CJob::getGrammarId() const
{
    return m_grammar_id;
}

const std::string & CJob::getMarkov() const
{
    return m_markov;
}

bool CJob::getKillFlag() const
{
    return m_killFlag;
}

bool CJob::getCasePermuteFlag() const
{
    return m_casePermute;
}

bool CJob::getCheckDuplicatesFlag() const
{
    return m_checkDuplicates;
}

bool CJob::getOptimizedFlag() const
{
    return m_optimized;
}

bool CJob::getSlowCandidatesFlag() const
{
    return m_slowCandidates;
}

uint64_t CJob::getFixedWorkunitSize() const
{
    return m_fixedWorkunitSize;
}

uint64_t CJob::getBenchRuntimeLimit() const
{
    return m_benchRuntimeLimit;
}

uint64_t CJob::getWorkunitStatusUpdate() const
{
    return m_workunitStatusUpdate;
}

const std::string & CJob::getExtraHcArgs() const
{
    return m_extraHcArgs;
}

uint32_t CJob::getDeviceTypes() const {
    return m_deviceTypes;
}

uint32_t CJob::getWorkloadProfile() const
{
    return m_workloadProfile;
}

/**
 * @section Getters/Setters for other member variables
 */

std::vector<Config::Ptr<CMask>> CJob::getMasks() const
{
    return m_masks;
}


void CJob::addMask(Config::Ptr<CMask> mask)
{
    m_masks.push_back(mask);
}


std::vector<Config::Ptr<CDictionary>> CJob::getDictionaries() const
{
    return m_dictionaries;
}


std::vector<Config::Ptr<CDictionary>> CJob::getRightDictionaries() const
{
    std::vector<Config::Ptr<CDictionary>> result;

    for (auto & dict : m_dictionaries)
    {
        if (!dict->isLeft())
            result.push_back(dict);
    }

    return result;
}


void CJob::addDictionary(Config::Ptr<CDictionary> dictionary)
{
    m_dictionaries.push_back(dictionary);
}

void CJob::addRule(Config::Ptr<CRule> rule)
{
    m_rules.push_back(rule);
}

std::string CJob::getHashes() const
{
    return m_hashes;
}


uint64_t CJob::getTotalPower() const
{
    return m_totalPower;
}


uint64_t CJob::getSecondsPassed() const
{
    return m_secondsPassed;
}


uint64_t CJob::getCombSecDictSize() const
{
    return m_combSecDictSize;
}


unsigned int CJob::getTimeoutFactor() const
{
    return m_timeoutFactor;
}

unsigned int CJob::getHWTempAbort() const
{
    return m_hwTempAbort;
}


uint32_t CJob::getMarkovThreshold() const
{
    return m_markovThreshold;
}


void CJob::setGrammar(const std::string & grammar)
{
    m_grammar = grammar;
}


const std::string &CJob::getCharset1() const
{
    return m_charset1;
}


const std::string &CJob::getCharset2() const
{
    return m_charset2;
}


const std::string &CJob::getCharset3() const
{
    return m_charset3;
}


const std::string &CJob::getCharset4() const
{
    return m_charset4;
}


uint32_t CJob::getMinPasswordLen() const
{
    return m_minPasswordLen;
}


uint32_t CJob::getMaxPasswordLen() const
{
    return m_maxPasswordLen;
}


uint32_t CJob::getMinElemInChain() const
{
    return m_minElemInChain;
}


uint32_t CJob::getMaxElemInChain() const
{
    return m_maxElemInChain;
}
