/**
 * @file Host.cpp
 * @brief Source file for fc_host entry
 * @authors Lukas Zobal (zobal.lukas(at)gmail.com)
 * @date 12. 12. 2018
 * @license MIT, see LICENSE
 */

#include <Host.h>
#include <SqlLoader.h>


CHost::CHost(DbMap & hostMap, CSqlLoader * sqlLoader)
    :   m_sqlLoader(sqlLoader)
{
    try
    {
        this->m_id = std::stoull(hostMap["id"]);
        this->m_boincHostId = std::stoull(hostMap["boinc_host_id"]);
        this->m_power = std::stoull(hostMap["power"]);
        this->m_jobId = std::stoull(hostMap["job_id"]);
        this->m_status = std::stoul(hostMap["status"]);
        static const std::string secondsSinceLastSeen = "seconds_since_last_seen";
        if(hostMap.count(secondsSinceLastSeen))
        {
            this->m_secondsSinceLastSeen = std::stoull(hostMap[secondsSinceLastSeen]);
        }
        else
        {
            this->m_secondsSinceLastSeen = -1;
        }
    }
    catch(std::logic_error & error)
    {
        Tools::printDebugTimestamp("Error converting hostMap to PtrHost: %s", error.what());
        exit(1);
    }
}


PtrHost CHost::create(DbMap & hostMap, CSqlLoader * sqlLoader)
{
    return PtrHost(new CHost(hostMap, sqlLoader));
}


std::string CHost::getTableName()
{
    return Config::tableNameHost;
}


void CHost::updateStatus(Config::HostState newStatus)
{
    /** Local update */
    this->m_status = newStatus;

    /** Database update */
    this->m_sqlLoader->updateHostStatus(this->m_id, newStatus);
}


/**
 * @section Table attributes getters
 */

uint64_t CHost::getId() const
{
    return m_id;
}


uint64_t CHost::getBoincHostId() const
{
    return m_boincHostId;
}


uint64_t CHost::getPower() const
{
    return m_power;
}


uint64_t CHost::getJobId() const
{
    return m_jobId;
}


uint32_t CHost::getStatus() const
{
    return m_status;
}

uint64_t CHost::getSecondsSinceLastSeen() const
{
    return m_secondsSinceLastSeen;
}

const std::string CHost::getExtraHcArgs() const
{
    return this->m_sqlLoader->getSqlString(this->m_sqlLoader->formatQuery("SELECT `extra_hc_args` FROM `%s` WHERE boinc_host_id = %" PRIu64 " LIMIT 1",
                                               Config::tableNameHostStatus.c_str(), getBoincHostId()));
}

uint32_t CHost::getDeviceTypes() const {
    return (uint32_t)(this->m_sqlLoader->getSqlNumber(this->m_sqlLoader->formatQuery("SELECT `device_types` FROM `%s` WHERE boinc_host_id = %" PRIu64 " LIMIT 1",
                                               Config::tableNameHostStatus.c_str(), getBoincHostId())));
}

uint32_t CHost::getWorkloadProfile() const
{
    return (uint32_t)(this->m_sqlLoader->getSqlNumber(this->m_sqlLoader->formatQuery("SELECT `workload_profile` FROM `%s` WHERE boinc_host_id = %" PRIu64 " LIMIT 1",
                                               Config::tableNameHostStatus.c_str(), getBoincHostId())));
}