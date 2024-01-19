#!/bin/bash

# Remove previous installation
# This file is part of Hashstation installer
# Author: Radek Hranicky (ihranicky@fit.vutbr.cz)

echo "                                                              "
echo "=============== REMOVE PREVIOUS INSTALLATION ================="
echo "                                                              "

###################
# Project cleanup #
###################
function cleanup_project {
if [ -d "$BOINC_PROJECT_DIR" ]; then
  read -e -p "Remove project $BOINC_PROJECT_DIR ? [y/N] (default: N): " DELETE_PROJECT_DIR
  DELETE_PROJECT_DIR=${DELETE_PROJECT_DIR:-N}

  if [ $DELETE_PROJECT_DIR = "y" ]; then
    read -e -p "All data will be lost! Are you sure? [y/N] (default: N): " CONFIRMED
    CONFIRMED=${CONFIRMED:-N}

    if [ $CONFIRMED = "y" ]; then
      rm -rf $BOINC_PROJECT_DIR
      echo "Project directory deleted."

      if ! [ -z "$PROJECT_HTTPD_CONF" ]; then
        echo "Removing BOINC references from $APACHE_CONFIG_FILE ..."

        sed -i "s|IncludeOptional $PROJECT_HTTPD_CONF.*||g" $APACHE_CONFIG_FILE 2>/dev/null

        if [[ $? != 0 ]]; then
          echo "Failed to remove."
        else
          echo "Removed."
        fi
      fi
      echo "Project removed. Restarting Apache..."
      service_restart $APACHE_SERVICE
    fi
  fi

  # Remove startup scripts (if exist)
  if [ -f "/etc/init.d/hashstation" ]; then
    echo "Removing hashstation system service..."
    # Remove runlevel symlinks
    case $DISTRO_ID in
      debian|ubuntu)
        update-rc.d hashstation remove
      ;;
      centos|redhat|rocky)
        chkconfig --level 2345 hashstation off
        chkconfig --del hashstation
      ;;
      suse|linux)
      ;;
    esac
    # Remove startup script
    rm -f /etc/init.d/hashstation
  fi
fi
}

####################
# Database cleanup #
####################
function cleanup_db {
read -e -p "Delete database $DB_NAME at $DB_HOST ? [y/N] (default: N): " DELETE_DB
DELETE_DB=${DELETE_DB:-N}
DB_ROOT_CLEANUP="N"
DROPPED="N"

if [ $DELETE_DB = "y" ]; then
  read -e -p "All data will be lost! Are you sure? [y/N] (default: N): " CONFIRMED
  CONFIRMED=${CONFIRMED:-N}

  if [ $CONFIRMED = "y" ]; then
    # Drop project database
    export MYSQL_PWD="$DB_PW"
    echo "Dropping original database..."
    mysql -h $DB_HOST -u $DB_USER -e "DROP DATABASE $DB_NAME;"
    if [[ $? != 0 ]]; then
      echo "Error: Unable to drop database $DB_NAME as user $DB_USER."
      read -e -p "Try again as database root? [y/N] (default: N): " DB_ROOT_CLEANUP
      DB_ROOT_CLEANUP=${DB_ROOT_CLEANUP:-N}
    else
      echo "Original database dropped."
      DROPPED="y"
    fi

    if [ $DROPPED = "y" ]; then
      echo "Creating an empty database..."
      mysql -h $DB_HOST -u $DB_USER -e "CREATE DATABASE $DB_NAME;"
      if [[ $? != 0 ]]; then
        echo "Error: Unable to create empty database $DB_HOST as user $DB_USER."
        echo "Try manually as root."
        exit
      else
        echo "Empty database created."
      fi
    fi
  fi
fi

if [ $DB_ROOT_CLEANUP = "y" ]; then
    read -e -p "Enter database root password: " DB_ROOT_PW;
    export MYSQL_PWD="$DB_ROOT_PW"
    echo "Dropping original database..."
    mysql -h $DB_HOST -u root -e "DROP DATABASE $DB_NAME;"
    if [[ $? != 0 ]]; then
      echo "Error: Unable to drop database $DB_NAME as root. Is the password correct?"
      exit
    else
      echo "Original database dropped."
    fi

    echo "Creating an empty database..."
    mysql -h $DB_HOST -u root -e "CREATE DATABASE $DB_NAME;"
    if [[ $? != 0 ]]; then
      echo "Error: Unable to drop database $DB_NAME as root. Is the password correct?"
      exit
    else
      echo "Empty database created."
    fi
fi
}

####################
# Hashstation frontend and backend cleanup #
####################

function cleanup_frontend_backend {
read -e -p "Uninstall Hashstation frontend and backend ? [y/N] (default: N): " UNINSTALL_HASHSTATION
UNINSTALL_HASHSTATION=${UNINSTALL_HASHSTATION:-N}

if [ $UNINSTALL_HASHSTATION = "y" ]; then
  rm -Rf $APACHE_DOCUMENT_ROOT/hashstationFE
  rm -Rf $APACHE_DOCUMENT_ROOT/hashstationBE

  if [ -f $APACHE_CONFIG_DIR/sites-enabled/hashstationFE.conf ]; then
    rm -Rf $APACHE_CONFIG_DIR/sites-enabled/hashstationFE.conf
  fi

  if [ -f $APACHE_CONFIG_DIR/sites-enabled/hashstationBE.conf ]; then
    rm -Rf $APACHE_CONFIG_DIR/sites-enabled/hashstationBE.conf
  fi

  if [ -f $APACHE_CONFIG_DIR/sites-available/hashstationFE.conf ]; then
    rm -Rf $APACHE_CONFIG_DIR/sites-available/hashstationFE.conf
  fi

  if [ -f $APACHE_CONFIG_DIR/sites-available/hashstationBE.conf ]; then
    rm -Rf $APACHE_CONFIG_DIR/sites-available/hashstationBE.conf
  fi

  echo "Hashstation frontend and backend uninstalled. Restarting Apache..."
  service_restart $APACHE_SERVICE
fi
}

#######################
# Assets cleanup #
#######################

function cleanup_assets {
read -e -p "Remove common assets (dictionaries, etc.) ? [y/N] (default: N): " REMOVE_ASSETS
REMOVE_ASSETS=${REMOVE_ASSETS:-N}

if [ $REMOVE_ASSETS = "y" ]; then
  rm -rf /usr/share/assets/charsets
  rm -rf /usr/share/assets/dictionaries
  rm -rf /usr/share/assets/markov
  rm -rf /usr/share/assets/encrypted-files
  rm -rf /usr/share/assets/masks
  rm -rf /usr/share/assets/rules
  rm -rf /usr/share/assets/pcfg
fi
}
