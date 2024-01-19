#!/bin/bash

# Hashstation server installer (main script)
# Author: see installer/AUTHORS
# License: MIT, see installer/LICENSE

# Root check
if [ "$EUID" -ne 0 ]
  then echo "Please run the installer as root."
  exit
fi

# Detect Linux distro and set distro-specific defaults
source installer/detect_distro.sh

# Get functions for sysvinit/systemd
source installer/services.sh

if [[ $1 == "-s" ]]; then
    # Set user variables (default values)
    source installer/set_default_vars.sh
    if [[ $2 == "-2" ]]; then
        python3 installer/update_daemons.py
        exit
    elif [[ $2 == "-3" ]]; then
        source installer/update_frontend_backend.sh
        exit
    elif [[ $2 == "-4" ]]; then
        source installer/migrate_db.sh
        python3 installer/update_daemons.py
        source installer/update_frontend_backend.sh
        (cd agent ; python3 update_binaries.py)
        exit
    elif [[ $2 == "-5" ]]; then
        source installer/uninstall.sh
        cleanup_project
        cleanup_db
        cleanup_frontend_backend
        cleanup_assets
        exit
    fi
else
    # Read and set user variables
    source installer/set_vars.sh
fi

# Installer menu
finished=false
while ! $finished; do
  echo "=============================================================="
  echo "Choose what to do:"
  echo "[1] Install Hashstation (default)"
  echo "[2] Update Hashstation server daemons (requires project restart)"
  echo "[3] Update Hashstation frontend and backend (requires Apache restart)"
  echo "[4] Update Hashstation system (server, frontend, backend, agents)"
  echo "[5] Remove previous installation"
  echo "[6] Exit"
  echo "=============================================================="
  read -e -p ": " OPERATION
  if [ "$OPERATION" -eq "$OPERATION" ] 2>/dev/null; then
    if [ $OPERATION -eq 1 ]; then
      finished=true
    elif [ $OPERATION -eq 2 ]; then
      python3 installer/update_daemons.py
      exit
    elif [ $OPERATION -eq 3 ]; then
      source installer/update_frontend_backend.sh
      exit
    elif [ $OPERATION -eq 4 ]; then
      source installer/migrate_db.sh
      python3 installer/update_daemons.py
      source installer/update_frontend_backend.sh
      (cd agent ; python3 update_binaries.py)
      exit
    elif [ $OPERATION -eq 5 ]; then
      source installer/uninstall.sh
      cleanup_project
      cleanup_db
      cleanup_frontend_backend
      cleanup_assets
      exit
    elif [  $OPERATION -eq 6 ]; then
      echo "Bye."
      exit
    fi
  fi
done

echo "=============================================================="
echo "The installation proceeds as follows (all steps are optional):"
echo "1) Configure and build Hashstation server"
echo "2) Install BOINC libraries"
echo "3) Install Hashstation project"
echo "4) Install Hashstation frontend and backend"
echo "5) Create directories for common assets (eg. dictionaries)"
echo "=============================================================="

########################################
# Configure and build server
########################################

if [ -f "installer/.server_built" ]; then
  read -e -p "1) Server seems to be built already. Rebuild? [y/N] (default: N): " BUILD_SERVER
  BUILD_SERVER=${BUILD_SERVER:-N}
else
  read -e -p "1) Configure and build server? [y/N] (default: y): " BUILD_SERVER
  BUILD_SERVER=${BUILD_SERVER:-y}
fi

if [ $BUILD_SERVER = "y" ]; then
  source installer/build_server.sh
fi

########################################
# Install libs
########################################
if [ -f "installer/.boinc_libs_built" ]; then
  read -e -p "2) BOINC libraries seem to be installed. Reinstall? [y/N] (default: N): " INSTALL_LIBS
  INSTALL_LIBS=${INSTALL_LIBS:-N}
else
  read -e -p "2) Install BOINC libraries [y/N] (default: y): " INSTALL_LIBS
  INSTALL_LIBS=${INSTALL_LIBS:-y}
fi

if [ $INSTALL_LIBS = "y" ]; then
  source installer/install_libs.sh
fi

########################################
# Install project
########################################
if [ -d "$BOINC_PROJECT_DIR" ]; then
  read -e -p "3) Hashstation project seems to be installed already. Reinstall? [y/N] (default: N): " INSTALL_PROJECT
  INSTALL_PROJECT=${INSTALL_PROJECT:-N}
  if [ $INSTALL_PROJECT = "y" ]; then
    source installer/uninstall.sh
    cleanup_project
    cleanup_db
  fi
else
  read -e -p "3) Install Hashstation project? [y/N] (default: y): " INSTALL_PROJECT
  INSTALL_PROJECT=${INSTALL_PROJECT:-y}
fi

if [ $INSTALL_PROJECT = "y" ]; then
  source installer/install_project.sh
fi

########################################
# Install Hashstation
########################################
if [ -d "$APACHE_DOCUMENT_ROOT/hashstationFE" ]; then
  read -e -p "3) Hashstation frontend and backend seems to be installed already. Reinstall? [y/N] (default: N): " INSTALL_HASHSTATION
  INSTALL_HASHSTATION=${INSTALL_HASHSTATION:-N}
  if [ $INSTALL_HASHSTATION = "y" ]; then
    source installer/uninstall.sh
    cleanup_frontend_backend
  fi
else
  read -e -p "3) Install Hashstation frontend and backend? [y/N] (default: y): " INSTALL_HASHSTATION
  INSTALL_HASHSTATION=${INSTALL_HASHSTATION:-y}
fi

if [ $INSTALL_HASHSTATION = "y" ]; then
  source installer/install_frontend_backend.sh
fi


########################################
# Install common assets
########################################
if [ -d "/usr/share/assets/dictionaries" ]; then
  read -e -p "3) Common assets directories seem to exist already. Reinstall? [y/N] (default: N): " INSTALL_COLLECTIONS
  INSTALL_COLLECTIONS=${INSTALL_COLLECTIONS:-N}
  if [ $INSTALL_COLLECTIONS = "y" ]; then
    source installer/uninstall.sh
    cleanup_assets
  fi
else
  read -e -p "3) Create directories for common assets? [y/N] (default: y): " INSTALL_COLLECTIONS
  INSTALL_COLLECTIONS=${INSTALL_COLLECTIONS:-y}
fi

if [ $INSTALL_COLLECTIONS = "y" ]; then
  source installer/install_assets.sh
fi

########################################

read -e -p "Enter the number of workunits per hosts (default: 2): " MAX_WUS_IN_PROGRESS
MAX_WUS_IN_PROGRESS=${MAX_WUS_IN_PROGRESS:-2}
sed -i "s|<max_wus_in_progress>1</max_wus_in_progress>|<max_wus_in_progress>$MAX_WUS_IN_PROGRESS</max_wus_in_progress>|g" $BOINC_PROJECT_DIR/config.xml

########################################

echo "+----------------------------------------------------------+"
echo "|                  INSTALLATION COMPLETED                  |"
echo "|          Have fun and a lot of cracked hashes...         |"
echo "+----------------------------------------------------------+"
echo "| The default Hashstation credentials are:                    |"
echo "|  * user: hashstation                                        |"
echo "|  * password: HASHSTATION                                    |"
echo "+----------------------------------------------------------+"

read -e -p "Do you want to START the Hashstation server? [y/N] (default: y)" START_SERVER
START_SERVER=${START_SERVER:-y}

if [ $START_SERVER = "y" ]; then
  MYDIR=$(pwd)
  cd $BOINC_PROJECT_DIR
  sudo -u $BOINC_USER ./bin/stop
  sudo -u $BOINC_USER ./bin/start
  cd $MYDIR
else
  echo "You can start the project later as $BOINC_USER by typing:"
  echo " cd $BOINC_PROJECT_DIR"
  echo " sudo -u $BOINC_USER ./bin/start"
fi

if [ -x "$(command -v boinccmd)" ]; then
  read -e -p "Attach this host to Hashstation BOINC project? [y/N] (default: N)" HASHSTATION_BOINC_ATTACH
  HASHSTATION_BOINC_ATTACH=${HASHSTATION_BOINC_ATTACH:-N}
  if [ $HASHSTATION_BOINC_ATTACH = "y" ]; then
    python3 installer/boinc_connect.py --url ${BOINC_URL}/${BOINC_PROJECT}
    if [[ $? == 0 ]]; then
      echo "Successfully attached."
    else
      echo "Unable to attach."
    fi
  fi
fi

echo " *** All done *** "
