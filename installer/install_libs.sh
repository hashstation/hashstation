#!/bin/bash

# Install BOINC libraries
rm -f installer/.boinc_libs_built 2>/dev/null
cd boinc
make install

if [[ $? != 0 ]]; then
  echo "Error installing BOINC libraries."
  exit
fi

cd ..
touch installer/.boinc_libs_built
echo "BOINC libraries installed."
