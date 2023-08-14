#!/bin/bash

# Fitcrack server installer (main script)
# Author: see installer/AUTHORS
# License: MIT, see installer/LICENSE

echo "                                                            "
echo "███████╗██╗████████╗ ██████╗██████╗  █████╗  ██████╗██╗  ██╗"
echo "██╔════╝██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝"
echo "█████╗  ██║   ██║   ██║     ██████╔╝███████║██║     █████╔╝ "
echo "██╔══╝  ██║   ██║   ██║     ██╔══██╗██╔══██║██║     ██╔═██╗ "
echo "██║     ██║   ██║   ╚██████╗██║  ██║██║  ██║╚██████╗██║  ██╗"
echo "╚═╝     ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝"
echo "           Distributed password cracking system             "
echo "                  * powered by hashcat *                    "
echo "                                                            "
echo "          (C) 2017-2023 Fitcrack team - www.fitcrack.cz          "
echo "============================================================"

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
        source installer/update_daemons.sh
        exit
    elif [[ $2 == "-3" ]]; then
        source installer/update_frontend_backend.sh
        exit
    elif [[ $2 == "-4" ]]; then
        source installer/migrate_db.sh
        source installer/update_daemons.sh
        source installer/update_frontend_backend.sh
        (cd agent ; python3 update_binaries.py)
        exit
    elif [[ $2 == "-5" ]]; then
        source installer/uninstall.sh
        cleanup_project
        cleanup_db
        cleant_frontend_backend
        cleanup_collections
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
  echo "[1] Install Fitcrack (default)"
  echo "[2] Update Fitcrack server daemons (requires project restart)"
  echo "[3] Update Fitcrack frontend and backend (requires Apache restart)"
  echo "[4] Update Fitcrack system (server, frontend, backend, agents)"
  echo "[5] Remove previous installation"
  echo "[6] Exit"
  echo "=============================================================="
  read -e -p ": " OPERATION
  if [ "$OPERATION" -eq "$OPERATION" ] 2>/dev/null; then
    if [ $OPERATION -eq 1 ]; then
      finished=true
    elif [ $OPERATION -eq 2 ]; then
      source installer/update_daemons.sh
      exit
    elif [ $OPERATION -eq 3 ]; then
      source installer/update_frontend_backend.sh
      exit
    elif [ $OPERATION -eq 4 ]; then
      source installer/migrate_db.sh
      source installer/update_daemons.sh
      source installer/update_frontend_backend.sh
      (cd agent ; python3 update_binaries.py)
      exit
    elif [ $OPERATION -eq 5 ]; then
      source installer/uninstall.sh
      cleanup_project
      cleanup_db
      cleant_frontend_backend
      cleanup_collections
      exit
    elif [  $OPERATION -eq 6 ]; then
      echo "Bye."
      exit
    fi
  fi
done

echo "=============================================================="
echo "The installation proceeds as follows (all steps are optional):"
echo "1) Configure and build Fitcrack server"
echo "2) Install BOINC libraries"
echo "3) Install Fitcrack project"
echo "4) Install Fitcrack frontend and backend"
echo "5) Create directories for common collections (eg. dictionaries)"
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
  read -e -p "3) Fitcrack project seems to be installed already. Reinstall? [y/N] (default: N): " INSTALL_PROJECT
  INSTALL_PROJECT=${INSTALL_PROJECT:-N}
  if [ $INSTALL_PROJECT = "y" ]; then
    source installer/uninstall.sh
    cleanup_project
    cleanup_db
  fi
else
  read -e -p "3) Install Fitcrack project? [y/N] (default: y): " INSTALL_PROJECT
  INSTALL_PROJECT=${INSTALL_PROJECT:-y}
fi

if [ $INSTALL_PROJECT = "y" ]; then
  source installer/install_project.sh
fi

########################################
# Install Fitcrack
########################################
if [ -d "$APACHE_DOCUMENT_ROOT/fitcrackFE" ]; then
  read -e -p "3) Fitcrack frontend and backend seems to be installed already. Reinstall? [y/N] (default: N): " INSTALL_FITCRACK
  INSTALL_FITCRACK=${INSTALL_FITCRACK:-N}
  if [ $INSTALL_FITCRACK = "y" ]; then
    source installer/uninstall.sh
    cleant_frontend_backend
  fi
else
  read -e -p "3) Install Fitcrack frontend and backend? [y/N] (default: y): " INSTALL_FITCRACK
  INSTALL_FITCRACK=${INSTALL_FITCRACK:-y}
fi

if [ $INSTALL_FITCRACK = "y" ]; then
  source installer/install_frontend_backend.sh
fi


########################################
# Install common collections
########################################
if [ -d "/usr/share/collections/dictionaries" ]; then
  read -e -p "3) Common collections directories seem to exist already. Reinstall? [y/N] (default: N): " INSTALL_COLLECTIONS
  INSTALL_COLLECTIONS=${INSTALL_COLLECTIONS:-N}
  if [ $INSTALL_COLLECTIONS = "y" ]; then
    source installer/uninstall.sh
    cleanup_collections
  fi
else
  read -e -p "3) Create directories for common collections? [y/N] (default: y): " INSTALL_COLLECTIONS
  INSTALL_COLLECTIONS=${INSTALL_COLLECTIONS:-y}
fi

if [ $INSTALL_COLLECTIONS = "y" ]; then
  source installer/install_collections.sh
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
echo "| The default Fitcrack credentials are:                    |"
echo "|  * user: fitcrack                                        |"
echo "|  * password: FITCRACK                                    |"
echo "+----------------------------------------------------------+"

read -e -p "Do you want to START the Fitcrack server? [y/N] (default: y)" START_SERVER
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
  read -e -p "Attach this host to Fitcrack BOINC project? [y/N] (default: N)" FITCRACK_BOINC_ATTACH
  FITCRACK_BOINC_ATTACH=${FITCRACK_BOINC_ATTACH:-N}
  if [ $FITCRACK_BOINC_ATTACH = "y" ]; then
    python3 installer/boinc_connect.py --url ${BOINC_URL}/${BOINC_PROJECT}
    if [[ $? == 0 ]]; then
      echo "Successfully attached."
    else
      echo "Unable to attach."
    fi
  fi
fi

echo " *** All done *** "
