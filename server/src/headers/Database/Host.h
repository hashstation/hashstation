/**
 * @file Host.h
 * @brief Header file for hs_host entry
 * @authors Lukas Zobal (zobal.lukas(at)gmail.com)
 * @date 12. 12. 2018
 * @license MIT, see LICENSE
 */

#ifndef WORKGENERATOR_HOST_H
#define WORKGENERATOR_HOST_H

#include <Config.h>


class CSqlLoader;
class CHost;
using PtrHost = Config::Ptr<CHost>;


class CHost {
    private:
        /**
         * @brief Private constructor, called by create() static function
         * @param hostMap [in] Map representing hs_host table entry
         * @param sqlLoader [in] Pointer to SqlLoader for database updates
         */
        explicit CHost(DbMap & hostMap, CSqlLoader * sqlLoader);

    public:
        /** Default destructor */
        ~CHost() = default;

        /**
         * @brief Creating instance as a shared pointer from database select
         * @param hostMap [in] Map representing hs_host table entry
         * @param sqlLoader [in] Pointer to SqlLoader for database updates
         * @return Shared pointer to hs_host entry object
         */
        static PtrHost create(DbMap & hostMap, CSqlLoader * sqlLoader);

        /**
         * @brief Get the host SQL table name, usually hs_host
         * @return Host SQL table name
         */
        static std::string getTableName();

        /**
         * @brief Updates member variable and hs_host table
         * @param newStatus [in] New status for this host
         */
        void updateStatus(Config::HostState newStatus);

    private:

        CSqlLoader * m_sqlLoader;       /**< SqlLoader for database updating */

        /**
         * @section Table attributes of hs_host
         */

        uint64_t m_id;
        uint64_t m_boincHostId;
        uint64_t m_power;
        uint64_t m_jobId;
        uint32_t m_status;
        uint64_t m_secondsSinceLastSeen;

    public:

        /**
         * @section Getters for table attributes
         */

        uint64_t getId() const;
        uint64_t getBoincHostId() const;
        uint64_t getPower() const;
        uint64_t getJobId() const;
        uint32_t getStatus() const;
        const std::string getExtraHcArgs() const;
        uint32_t getDeviceTypes() const;
        uint32_t getWorkloadProfile() const;
        ///Get the seconds since the host was seen last
        uint64_t getSecondsSinceLastSeen() const;
};

#endif //WORKGENERATOR_HOST_H
