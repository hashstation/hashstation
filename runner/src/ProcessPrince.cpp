/*
* Author : Dávid Bolvanský
* Licence: MIT, see LICENSE
*/

#include "ProcessPrince.hpp"

ProcessBase* ProcessPrince::create(const std::vector<std::string>& arguments ,Directory& directory) {
  File executable;
  #ifdef PROCESSLINUX_HPP
  directory.findVersionedFile("prince", "bin", executable);
  executable.setExecutableMode();
  return new ProcessLinux(executable.getRelativePath(), arguments, true);
  #elif defined (PROCESSWINDOWS_HPP)
  directory.findVersionedFile("prince", "exe", executable);
  return new ProcessWindows(executable.getRelativePath(), arguments, true);
  #else
  #error "No viable Process implementation. This is caused by your target platfrom. Supported platforms are __linux__, _WIN32."
  #endif
}