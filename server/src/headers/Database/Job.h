/**
 * @file Job.h
 * @brief Header file for hs_job entry
 * @authors Lukas Zobal (zobal.lukas(at)gmail.com)
 * @date 12. 12. 2018
 * @license MIT, see LICENSE
 */

#ifndef WORKGENERATOR_JOB_H
#define WORKGENERATOR_JOB_H

#include <Config.h>


class CSqlLoader;
class CJob;
class CMask;
class CDictionary;
class CRule;
using PtrJob = Config::Ptr<CJob>;

enum DictDeploymentMode { send, use_prestored };
enum DeviceType { host_default, cpu , gpu };
enum DictDistributionMode { fragmentation_on_server, fragmentation_on_client };
enum RuleApplicationMode { in_series, dot_product };                

class CJob {
    private:
        /**
         * @brief Private constructor, called by create() static function
         * @param jobMap [in] Map representing hs_job table entry
         * @param sqlLoader [in] Pointer to SqlLoader for database updates
         */
        explicit CJob(DbMap & jobMap, CSqlLoader * sqlLoader);

    public:
        /** Default destructor */
        virtual ~CJob() = default;

        /**
         * @brief Creating instance as a shared pointer from database select
         * @param hostMap [in] Map representing hs_job table entry
         * @param sqlLoader [in] Pointer to SqlLoader for database updates
         * @return Shared pointer to hs_job entry object
         */
        static PtrJob create(DbMap &jobMap, CSqlLoader * sqlLoader);

        /**
         * @brief Get the job SQL table name, usually hs_job
         * @return Job SQL table name
         */
        static std::string getTableName();

        /**
         * @brief Updates index of this job object and database entry
         * @param newIndex [in] New mask current index
         */
        virtual void updateIndex(uint64_t newIndex);

        /**
         * @brief Updates index 2 of this job object and database entry
         * @param newIndex [in] New mask current index 2
         */
        virtual void updateIndex2(uint64_t newIndex2);

        /**
         * @brief Updates status of this job object and database entry
         * @param newIndex [in] New job status
         */
        void updateStatus(Config::JobState newStatus);

        /**
         * @brief Updates status of running job, otherwise, does nothing
         * @param newIndex [in] New job status, original status must be >= 10
         */
        void updateStatusOfRunningJob(Config::JobState newStatus);

        /**
         * @brief Updates start time of job database entry to now, only if it is NULL
         */
        void updateStartTime();

        /**
         * @brief Loads all non-exhausted mask database entries for this job to job vector m_masks
         * @param useNormalKeyspace [in] If true, will use keyspace instead of hc keyspace to determine exhaustion
         */
        void loadMasks(bool useNormalKeyspace);

        /**
         * @brief Loads all non-exhausted dictionary database entries for this job to job vector m_dictionaries
         */
        void loadDictionaries();

        void loadRules();

        /**
         * @brief Loads all non-cracked hash database entries fot his job to job string m_hashes
         * @return True if any hashes were loaded, False otherwise
         */
        bool loadHashes();

        /**
         * @brief Get the index at which the job is finished
         */
        uint64_t getEndIndex() const;

    private:

        CSqlLoader * m_sqlLoader;         /**< SqlLoader for database updating */

        /**
         * @section Table attributes of hs_job
         */

        uint64_t    m_id;
        uint64_t    m_owner;
        std::string m_attack;
        uint32_t    m_attackMode;
        uint32_t    m_attackSubmode;
        DictDistributionMode m_distributionMode;
        uint32_t    m_hashType;
        uint32_t    m_status;
        uint64_t    m_keyspace;
        uint64_t    m_hcKeyspace;
        uint64_t    m_currentIndex;
        uint64_t    m_currentIndex2;
        std::string m_name;
        uint64_t    m_secondsPerWorkunit;
        std::string m_ruleLeft;
        std::string m_ruleRight;
        std::string m_charset1;
        std::string m_charset2;
        std::string m_charset3;
        std::string m_charset4;
        std::string m_grammar;
        uint64_t    m_grammar_id;
        std::string m_markov;
        uint32_t m_markovThreshold;
        bool m_casePermute;
        bool m_checkDuplicates;
        uint32_t m_minPasswordLen;
        uint32_t m_maxPasswordLen;
        uint32_t m_minElemInChain;
        uint32_t m_maxElemInChain;
        bool m_optimized;
        uint32_t m_deviceTypes;
        uint32_t m_workloadProfile;
        DictDeploymentMode m_dictDeploymentMode;
        bool m_slowCandidates;
        std::string m_extraHcArgs;
        uint64_t m_fixedWorkunitSize;
        RuleApplicationMode m_ruleApplicationMode;
        bool m_killFlag;

        /**
         * @section Other member variables
         */

        uint64_t m_combSecDictSize;      /**< Size of second dictionary in Combinator attack */
    protected:
        std::vector<Config::Ptr<CMask>> m_masks;    /**< Vector of non-exhausted masks for mask attack */
        std::vector<Config::Ptr<CDictionary>> m_dictionaries;  /**< Vector of non-exhausted dictionaries */
        std::vector<Config::Ptr<CRule>> m_rules; /**< Vector of rules */
    private:
        std::string m_hashes;            /**< job hash(es) denoted by newlines */

        uint64_t m_totalPower;           /**< Sum of host power for this job */
        uint64_t m_secondsPassed;        /**< Seconds from time_start to now() */
        unsigned int m_timeoutFactor;    /**< Timeout for workunits, factor of time for a single workunit */
        unsigned int m_hwTempAbort;      /**< Temperature threshold to stop cracking */
        uint64_t m_benchRuntimeLimit;    /**< Runtime limit for benchmarking */
        uint64_t m_workunitStatusUpdate; /**< Workunit status update frequency */
    public:

        /**
         * @section Getters for table attributes
         */

        uint64_t getId() const;
        uint64_t getOwner() const;
        const std::string &getAttack() const;
        uint32_t getAttackMode() const;
        uint32_t getAttackSubmode() const;
        DictDistributionMode getDistributionMode() const;
        uint32_t getHashType() const;
        uint32_t getStatus() const;
        uint64_t getKeyspace() const;
        uint64_t getHcKeyspace() const;
        uint64_t getCurrentIndex() const;
        uint64_t getCurrentIndex2() const;
        const std::string & getName() const;
        uint64_t getSecondsPerWorkunit() const;
        const std::string & getRuleLeft() const;
        const std::string & getRuleRight() const;
        const std::string & getCharset1() const;
        const std::string & getCharset2() const;
        const std::string & getCharset3() const;
        const std::string & getCharset4() const;
        uint64_t getGrammarId() const;
        const std::string & getMarkov() const;
        uint32_t getMarkovThreshold() const;
        bool getCasePermuteFlag() const;
        bool getCheckDuplicatesFlag() const;
        uint32_t getMinPasswordLen() const;
        uint32_t getMaxPasswordLen() const;
        uint32_t getMinElemInChain() const;
        uint32_t getMaxElemInChain() const;
        bool getOptimizedFlag() const;
        bool getSlowCandidatesFlag() const;
        uint32_t getDeviceTypes() const;
        uint32_t getWorkloadProfile() const;
        uint64_t getFixedWorkunitSize() const;
        const std::string & getExtraHcArgs() const;
        DictDeploymentMode getDictDeploymentMode() const;
        RuleApplicationMode getRuleApplicationMode() const;
        bool getKillFlag() const;


        uint64_t getBenchRuntimeLimit() const;
        uint64_t getWorkunitStatusUpdate() const;
        void setGrammar(const std::string & grammar);

    /**
     * @section Getters/Setters for other member variables
     */

        virtual std::vector<Config::Ptr<CMask>> getMasks() const;
        void addMask(Config::Ptr<CMask> mask);

        virtual std::vector<Config::Ptr<CDictionary>> getDictionaries() const;
        virtual std::vector<Config::Ptr<CDictionary>> getRightDictionaries() const;
        virtual std::vector<Config::Ptr<CRule>> getRules() const;
        void addDictionary(Config::Ptr<CDictionary> dictionary);
        void addRule(Config::Ptr<CRule> rule);

        std::string getHashes() const;

        uint64_t getTotalPower() const;
        uint64_t getSecondsPassed() const;
        uint64_t getCombSecDictSize() const;
        unsigned int getTimeoutFactor() const;
        unsigned int getHWTempAbort() const;

        const std::string & getGrammar() const;
};

#endif //WORKGENERATOR_JOB_H
