/**
 * @file AttackMask.h
 * @brief Header file for creation of Mask Attack
 * @authors Lukas Zobal (zobal.lukas(at)gmail.com)
 * @date 12. 12. 2018
 * @license MIT, see LICENSE
 */

#ifndef WORKGENERATOR_ATTACKMASK_H
#define WORKGENERATOR_ATTACKMASK_H

#include <AttackMode.h>


class CAttackMask : public AttackMode {
    public:
        /**
         * @brief Constructor for Combinator Attack
         * @param job [in] Instance of CJob which is parent of this attack instance
         * @param host [in] Instance of CHost which this attack belongs to
         * @param seconds [in] Number of seconds this instance of attack should take
         */
        CAttackMask(PtrJob job, PtrHost &host, uint64_t seconds, CSqlLoader *sqlLoader);

        /**
         * @brief Default destructor
         */
        ~CAttackMask() override = default;

        /**
         * @brief Creates BOINC workunit, adds entry to hs_workunit
         * @return True if a workunit was planned, False otherwise
         */
        bool makeWorkunit() override ;

        virtual bool requiresMasks() const override {return true;}
        virtual uint64_t getAmplifier() const override;

    private:
        /**
         * @brief Function to generate new CWorkunit for certain host for given time
         * @return True if workunit was generated successfully, False otherwise
         */
        bool generateWorkunit() override ;
};

#endif //WORKGENERATOR_ATTACKMASK_H
