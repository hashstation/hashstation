#!/bin/bash

# Completely purge Hashstation
# Author: Radek Hranicky (ihranicky@fit.vutbr.cz)

# Get functions for sysvinit/systemd
source installer/services.sh

echo "                                                              "
echo "=============== COMPLETE CLEANUP ================="
echo "                                                              "

###################
# Project cleanup #
###################

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


# Remove startup scripts (if exist)
if [ -f "/etc/init.d/hashstation" ]; then
  echo "Removing hashstation system service..."
  # Remove runlevel symlinks
  case $DISTRO_ID in
    debian|ubuntu)
      update-rc.d hashstation remove
    ;;
    centos|redhat)
      chkconfig --level 2345 hashstation off
      chkconfig --del hashstation
    ;;
    suse|linux)
    ;;
  esac
  # Remove startup script
  rm -f /etc/init.d/hashstation
fi

####################
# Database cleanup #
####################

DROPPED="N"

export MYSQL_PWD="$DB_PW"
echo "Dropping original database..."
mysql -h $DB_HOST -u $DB_USER -e "DROP DATABASE $DB_NAME;"
if [[ $? != 0 ]]; then
  echo "Error: Unable to drop database $DB_NAME as user $DB_USER."
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


####################
# Hashstation frontend and backend cleanup #
####################
rm -Rf $APACHE_DOCUMENT_ROOT/hashstationFE
rm -Rf $APACHE_DOCUMENT_ROOT/hashstationAPI

if [ -f $APACHE_CONFIG_DIR/sites-enabled/hashstationFE.conf ]; then
  rm -Rf $APACHE_CONFIG_DIR/sites-enabled/hashstationFE.conf
fi

if [ -f $APACHE_CONFIG_DIR/sites-enabled/hashstationAPI.conf ]; then
  rm -Rf $APACHE_CONFIG_DIR/sites-enabled/hashstationAPI.conf
fi

if [ -f $APACHE_CONFIG_DIR/sites-available/hashstationFE.conf ]; then
  rm -Rf $APACHE_CONFIG_DIR/sites-available/hashstationFE.conf
fi

if [ -f $APACHE_CONFIG_DIR/sites-available/hashstationAPI.conf ]; then
  rm -Rf $APACHE_CONFIG_DIR/sites-available/hashstationAPI.conf
fi

echo "Hashstation frontend and backend uninstalled. Restarting Apache..."
service_restart $APACHE_SERVICE


#######################
# assets cleanup #
#######################

rm -rf /usr/share/assets/charsets
rm -rf /usr/share/assets/dictionaries
rm -rf /usr/share/assets/markov
rm -rf /usr/share/assets/encrypted-files
rm -rf /usr/share/assets/masks
rm -rf /usr/share/assets/rules
rm -rf /usr/share/assets/pcfg
