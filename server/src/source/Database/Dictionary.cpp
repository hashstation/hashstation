/**
 * @file Dictionary.cpp
 * @brief Source file for hs_[job_]dictionary entries
 * @authors Lukas Zobal (zobal.lukas(at)gmail.com)
 * @date 12. 12. 2018
 * @license MIT, see LICENSE
 */

#include <Dictionary.h>
#include <SqlLoader.h>


CDictionary::CDictionary(DbMap &dictMap, CSqlLoader *sqlLoader)
    :   m_sqlLoader(sqlLoader)
{
    try
    {
        this->m_id = std::stoull(dictMap["id"]);
        this->m_jobId = std::stoull(dictMap["job_id"]);
        this->m_dictionaryId = std::stoull(dictMap["dictionary_id"]);
        this->m_currentIndex = std::stoull(dictMap["current_index"]);
        this->m_currentPos = std::stoull(dictMap["current_pos"]);
        this->m_hcKeyspace = std::stoull(dictMap["keyspace"]);
        this->m_dictName = dictMap["name"];
        this->m_dictFileName = dictMap["path"];
        this->m_passwordDistribution = dictMap["password_distribution"];
        this->m_hexDict = (bool)(std::stoi(dictMap["hex_dict"]));
        this->m_isLeft = (bool)(std::stoi(dictMap["is_left"]));
    }
    catch(std::logic_error & error)
    {
        Tools::printDebugTimestamp("Error converting dictMap to PtrDictionary: %s", error.what());
        exit(1);
    }
}


PtrDictionary CDictionary::create(DbMap &dictMap, CSqlLoader *sqlLoader)
{
    return PtrDictionary(new CDictionary(dictMap, sqlLoader));
}


std::string CDictionary::getTableName()
{
    return Config::tableNameJobDictionary;
}


void CDictionary::updateIndex(uint64_t newIndex)
{
    /** Local update */
    this->m_currentIndex = newIndex;

    /** Database update */
    this->m_sqlLoader->updateDictionaryIndex(this->m_id, newIndex);
}

void CDictionary::updatePos(uint64_t newPos)
{
    /** Local update */
    this->m_currentPos = newPos;

    /** Database update */
    this->m_sqlLoader->updateDictionaryPos(this->m_id, newPos);
}


/**
 * @section Table attributes getters
 */

uint64_t CDictionary::getId() const
{
    return m_id;
}


uint64_t CDictionary::getJobId() const
{
    return m_jobId;
}


uint64_t CDictionary::getDictionaryId() const
{
    return m_dictionaryId;
}


uint64_t CDictionary::getCurrentIndex() const
{
    return m_currentIndex;
}

uint64_t CDictionary::getCurrentPos() const
{
    return m_currentPos;
}

uint64_t CDictionary::getHcKeyspace() const
{
    return m_hcKeyspace;
}


const std::string &CDictionary::getDictFileName() const
{
    return m_dictFileName;
}

const std::string &CDictionary::getDictName() const
{
    return m_dictName;
}

const std::string &CDictionary::getPasswordDistribution() const
{
    return m_passwordDistribution;
}


bool CDictionary::isLeft() const
{
    return m_isLeft;
}

bool CDictionary::isHexDict() const
{
    return m_hexDict;
}
