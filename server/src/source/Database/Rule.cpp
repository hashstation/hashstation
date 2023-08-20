/**
 * @file Rule.cpp
 * @brief Source file for fc_[rule_]dictionary entries
 * @authors David Bolvansky
 * @license MIT, see LICENSE
 */

#include <Rule.h>
#include <SqlLoader.h>


CRule::CRule(DbMap &dictMap, CSqlLoader *sqlLoader)
    :   m_sqlLoader(sqlLoader)
{
    try
    {
        this->m_name = dictMap["name"];
        this->m_path = dictMap["path"];
        this->m_count = std::stoull(dictMap["count"]);
    }
    catch(std::logic_error & error)
    {
        Tools::printDebugTimestamp("Error converting dictMap to PtrRule: %s", error.what());
        exit(1);
    }
}


PtrRule CRule::create(DbMap &dictMap, CSqlLoader *sqlLoader)
{
    return PtrRule(new CRule(dictMap, sqlLoader));
}


std::string CRule::getTableName()
{
    return Config::tableNameJobRule;
}

const std::string &CRule::getName() const
{
    return m_name;
}


const std::string &CRule::getPath() const
{
    return m_path;
}


uint64_t CRule::getCount() const
{
    return m_count;
}