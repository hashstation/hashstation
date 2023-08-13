/*
 * Author : see AUTHORS
 * Licence: MIT, see LICENSE
 */

#ifndef ATTACKDICTIONARY_HPP
#define ATTACKDICTIONARY_HPP

#include "AttackCrackingBase.hpp"
#include "Dictstat.hpp"

/** Class representing hashcat's dictionary attack */
class AttackDictionary: public AttackCrackingBase {
    DictStatBuilder dsBuilder;
    protected:

        /**
         * @brief   Adds all attack specific arguments
         */
        void addSpecificArguments();

    public:

        /**
         * @brief   Basic constructor
         * @param   config [in] Representation of config file
         * @param   directory [in] Working directory
         */
        AttackDictionary(const ConfigTask& config, Directory& directory);

};
#endif // ATTACKDICTIONARY_HPP
