#!/bin/bash

# Configure and build Hashstation server
# This file is part of Hashstation installer
# Author: Radek Hranicky (ihranicky@fit.vutbr.cz)


echo "Building Hashstation server..."

(cd boinc ; git stash)
patch -p0 < installer/hashstation_changes_in_boinc.patch > /dev/null

# Copy server files to BOINC server Root
cp -f server/src/headers/*.h              boinc/sched/
cp -f server/src/headers/AttackModes/*.h  boinc/sched/
cp -f server/src/headers/Generators/*.h   boinc/sched/
cp -f server/src/headers/Database/*.h     boinc/sched/
cp -f server/src/headers/Utils/*.h     boinc/sched/
cp -f server/src/source/*.cpp             boinc/sched/
cp -f server/src/source/AttackModes/*.cpp boinc/sched/
cp -f server/src/source/Generators/*.cpp  boinc/sched/
cp -f server/src/source/Database/*.cpp    boinc/sched/
cp -f server/src/source/Utils/*.cpp    boinc/sched/
cp -f server/src/headers/protocol/*.cc    boinc/sched/
cp -f server/src/headers/protocol/*.h     boinc/sched/
cp -rf server/src/include/*               boinc/sched/

rm -f installer/.server_built 2>/dev/null

cd boinc
chmod +x _autosetup


if [ -f /opt/rh/devtoolset-7/enable ]; then
  . /opt/rh/devtoolset-7/enable
fi

./_autosetup
if [[ $? != 0 ]]; then
  echo "Error during autoconfiguration."
  exit
fi

chmod +x configure
./configure --disable-client --disable-manager
if [[ $? != 0 ]]; then
  echo "Error during configuration."
  exit
fi

make -j$COMPILER_THREADS
if [[ $? != 0 ]]; then
  echo "Error during compilation."
  exit
fi

cd ..
touch installer/.server_built
echo "Build successful."
