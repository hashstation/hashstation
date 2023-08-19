/**
 * @file Rule.h
 * @brief Header file for fc_[rule_]dictionary entries
 * @authors David Bolvansky
 * @license MIT, see LICENSE
 */

#ifndef WORKGENERATOR_RULE_H
#define WORKGENERATOR_RULE_H

#include <Config.h>


class CSqlLoader;
class CRule;
using PtrRule = Config::Ptr<CRule>;


class CRule {
    private:
        /**
         * @brief Private constructor, called by create() static function
         * @param dictMap [in] Map representing fc_[job_]dictionary table entries
         * @param sqlLoader [in] Pointer to SqlLoader for database updates
         */
        explicit CRule(DbMap & dictMap, CSqlLoader * sqlLoader);

    public:
        /** Default destructor */
        virtual ~CRule() = default;


        /**
         * @brief Creating instance as a shared pointer from database select
         * @param dictMap [in] Map representing fc_[rule_]dictionary table entries
         * @param sqlLoader [in] Pointer to SqlLoader for database updates
         * @return Shared pointer to fc_[rule_]dictionary entries object
         */
        static PtrRule create(DbMap & dictMap, CSqlLoader * sqlLoader);

        /**
        * @brief Get the mask SQL table name, usually fc_rule_dictionary
        * @return Mask SQL table name
        */
        static std::string getTableName();

    private:

        CSqlLoader * m_sqlLoader;         /**< SqlLoader for database updating */

        /**
         * @section Table attributes of fc_[rule_]dictionary
         */

        std::string m_name;
        std::string m_path;

    public:

        /**
         * @section Getters for table attributes
         */

        const std::string & getName() const;
        const std::string & getPath() const;
};

#endif //WORKGENERATOR_RULE_H
