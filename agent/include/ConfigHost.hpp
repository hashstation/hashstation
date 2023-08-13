/*
 * Author : see AUTHORS
 * Licence: MIT, see LICENSE
 */


#ifndef CONFIGHOST_HPP
#define CONFIGHOST_HPP

#include <map>
#include "File.hpp"

#include "AgentUtils.hpp"

/** Class representing host configuration file */
class ConfigHost {

    private:

        std::string path_;      /**< Path to the config file */
		std::map<std::string, std::string> configuration_;
    public:
        ConfigHost(std::string config_path);
        void load();
        std::vector<std::string> getHostExtraHashcatArgs();
        std::string getPrestoredDictsPath();
};

#endif // CONFIGHOST_HPP

