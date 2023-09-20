/*
 * Author : see AUTHORS
 * Licence: MIT, see LICENSE
 */

#ifndef ATTACKCRACKINGBASE_HPP
#define ATTACKCRACKINGBASE_HPP

#include "AttackBase.hpp"

#include "Directory.hpp"

/** Class representing base class for all cracking attack */
class AttackCrackingBase: public AttackBase {

    protected:

        Directory& directory_;          /**< Working directory to look for files in */

        std::string attack_submode_;    /**< Submode from TLV */

        bool external_generator_;        /**< True when attack is using external generator */

        std::vector<std::string> files_to_delete_; /**< Files to delete after attack is finished */

        /**
         * @brief   Adds all attack specific arguments
         */
        void addSpecificArguments();

        /**
         * @brief   Adds all attack hashcat-specific arguments
         */
        void addHashcatSpecificArguments();

        /**
         * @brief   Adds requred file form directory to arguments
         * @param   file_name [in] Name of the file to add
         */
        virtual std::string addRequiredFile(const std::string& file_name);

        /**
         * @brief   Adds requred file form directory to arguments
         * @param   file_name [in] Name of the file to add
         * @param   argument [in] Name of the argument to add as predecesor of
	 *	    file_name
         */
        void addOptionalFile(const std::string& file_name, const std::string& argument);

        void addRules();


    public:

        /**
         * @brief   Basic constructor
         * @param   config [in] Representation of config file
         * @param   directory [in] Working directory
         */
        AttackCrackingBase(const ConfigTask& config, Directory& directory, bool external_generator = false);

        ~AttackCrackingBase();
};

#endif // ATTACKCRACKINGBASE_HPP
