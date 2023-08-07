/*
 * Author : see AUTHORS
 * Licence: MIT, see LICENSE
 */

#ifndef ATTACKBENCHMARK_HPP 
#define ATTACKBENCHMARK_HPP

#include "ConfigTask.hpp"
#include "Directory.hpp"

#include <algorithm>
#include <string>
#include <sstream>

static const int DICT_GEN_TIME_LIMIT = 5;

/** Class representing hashcat's attack benchmark */
template <typename BaseAttack>
class AttackBenchmark: public BaseAttack {

protected:

	/**
		* @brief   Function adding all atttack specific arguments
		*/
	void addSpecificArguments();

	virtual std::string addRequiredFile(const std::string &file_name);
	//no limits for benchmark
	virtual void addGeneratorLimitingArgument(const std::string&) {}
	virtual void addGeneratorLimitingRequiredFile(const std::string&) {}

public: 

	/**
		* @brief   Basic constructor
		* @param   config [in] Representation of config file
		*/
	AttackBenchmark(const ConfigTask& config, Directory &directory);

};

template <typename BaseAttack>
AttackBenchmark<BaseAttack>::AttackBenchmark(const ConfigTask& config, Directory &directory) : BaseAttack(config, directory) {
  
}

template <typename BaseAttack>
void AttackBenchmark<BaseAttack>::addSpecificArguments() {
	BaseAttack::addSpecificArguments();
  	this->addArgument("--runtime");
	// Slow hashes or attacks with generators may need more time to stabilize and report correct speed.
	this->addArgument("30");
}

template <typename BaseAttack>
std::string
AttackBenchmark<BaseAttack>::addRequiredFile(const std::string &file_name) {
        return BaseAttack::addRequiredFile(file_name);
}

#endif // ATTACKBENCHMARK_HPP
