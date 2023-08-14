#!/bin/bash

# Install BOINC libraries
rm -f tmp/.boinc_libs_built 2>/dev/null
cd boinc
make install

if [[ $? != 0 ]]; then
  echo "Error installing BOINC libraries."
  exit
fi

cd ..
touch tmp/.boinc_libs_built
echo "BOINC libraries installed."
