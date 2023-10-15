#!/bin/bash

# Make Hashstation project
# This file is part of Hashstation installer
# Author: Radek Hranicky (ihranicky@fit.vutbr.cz)

# Adding apache user to BOINC user Group
echo "Adding user $APACHE_USER to $BOINC_GROUP group..."
usermod -a -G $BOINC_GROUP $APACHE_USER

####################################
# Make project and create database #
####################################

SERVER_HOSTNAME=$(hostname)

# Replace "localhost" with "127.0.0.1"
# (as BOINC clients cannot resolve localhost)
BOINC_URL=${BOINC_URL/localhost/127\.0\.0\.1}

# Make project
echo "Making BOINC project."
./boinc/tools/make_project \
 --no_query \
 --url_base $BOINC_URL \
 --srcdir boinc \
 --user_name $BOINC_USER \
 --project_host $SERVER_HOSTNAME \
 --project_root "$BOINC_HOME/projects/$BOINC_PROJECT" \
 --db_host $DB_HOST \
 --db_name $DB_NAME \
 --db_user $DB_USER \
 --db_passwd $DB_PW \
 $BOINC_PROJECT

# Create htaccess file for PROJECT OPS
if [ -z ${OPS_LOGIN+x} ]; then
  read -e -p "Enter user name for accessing ${BOINC_URL}/${BOINC_PROJECT}_ops (default: $BOINC_USER)" OPS_LOGIN
  OPS_LOGIN=${OPS_LOGIN:-$BOINC_USER}
fi

if [ -z ${OPS_PW+x} ]; then
  read -e -p "Enter password for accessing ${BOINC_URL}/${BOINC_PROJECT}_ops (default: mypassword)" OPS_PW
  OPS_PW=${OPS_PW:-mypassword}
fi

htpasswd -cb $BOINC_PROJECT_DIR/html/ops/.htpasswd "$OPS_LOGIN" "$OPS_PW"

##################################
# Copy Hashstation apps and daemons #
##################################

# Copy server measure script
cp -f server/server_bin/measure_usage.py $BOINC_PROJECT_DIR/bin/

# Copy pcfg-monitor script
cp -f server/server_bin/pcfg_monitor.py $BOINC_PROJECT_DIR/bin/

# Copy client binaries
mkdir $BOINC_PROJECT_DIR/apps/hashstation
mkdir $BOINC_PROJECT_DIR/apps/hashstation/1
cp -Rf server/client_bin/* $BOINC_PROJECT_DIR/apps/hashstation/1/

# Install server daemons
python3 installer/install_daemons.py

# Add app app_versions
MYDIR=$(pwd)
cd $BOINC_PROJECT_DIR
sudo -u $BOINC_USER ./bin/xadd
sudo -u $BOINC_USER ./bin/update_versions --noconfirm
cd $MYDIR

#######################################
# Include BOINC HTML in Apache config #
#######################################

# Check if BOINC is included in Apache config
cat $APACHE_CONFIG_FILE | grep $PROJECT_HTTPD_CONF >/dev/null 2>/dev/null

if [[ $? != 0 ]]; then
  echo "Adding $PROJECT_HTTPD_CONF Include to $APACHE_CONFIG_FILE ..."
  echo "IncludeOptional $PROJECT_HTTPD_CONF" >> $APACHE_CONFIG_FILE
  echo "Added."
else
  echo "Reference to $PROJECT_HTTPD_CONF already included in $PROJECT_HTTPD_CONF."
fi

# Restart Apache service
service_restart $APACHE_SERVICE

#############################
# Install Hashstation database #
#############################
export MYSQL_PWD="$DB_PW"
echo "Creating Hashstation tables..."
mysql -h $DB_HOST -u $DB_USER -D"$DB_NAME" < server/sql/10_create_tables.sql
if [[ $? != 0 ]]; then
  echo "Error: Unable to create Hashstation DB tables"
  exit
fi
echo "Hashstation tables created."

echo "Creating Hashstation database triggers..."
mysql -h $DB_HOST -u $DB_USER -D"$DB_NAME" < server/sql/20_create_triggers.sql
if [[ $? != 0 ]]; then
  echo "Error: Unable to create Hashstation DB triggers"
  exit
fi
echo "Hashstation database triggers created."

echo "Inserting initial data..."
mysql -h $DB_HOST -u $DB_USER -D"$DB_NAME" < server/sql/30_insert_data.sql
if [[ $? != 0 ]]; then
  echo "Error: Unable to fill Hashstation DB with initial data"
  exit
fi
echo "Initial data inserted."

# Install startup scripts
if [ -z ${SERVICE_INSTALL+x} ]; then
  echo "Adding Hashstation as a service runs the daemons automatically on startup."
  read -e -p "Add Hashstation as a system service? [y/N] (default: y)" SERVICE_INSTALL
  SERVICE_INSTALL=${SERVICE_INSTALL:-y}
else
  SERVICE_INSTALL='y'
fi

if [ $SERVICE_INSTALL = "y" ]; then
  # Add startup script
  cp -f installer/init/hashstation /etc/init.d/hashstation
  chmod +x /etc/init.d/hashstation
  # Add runlevel symlinks
  case $DISTRO_ID in
    debian|ubuntu)
      update-rc.d hashstation defaults
    ;;
    centos|redhat|rocky)
      chkconfig --add hashstation
      chkconfig --level 2345 hashstation on
    ;;
    suse|linux)
    ;;
  esac
fi
