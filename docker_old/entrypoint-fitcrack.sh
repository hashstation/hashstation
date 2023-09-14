#!/bin/bash
# File: entrypoint-fitcrack.sh
#
#####################################################
#   FITCRACK DISTRIBUTED PASSWORD CRACKING SYSTEM   #
#####################################################
#
# Entrypoint for docker-based Fitcrack server
# Copyright: Fitcrack Team <ihranicky@fit.vutbr.cz>
# https://fitcrack.fit.vutbr.cz/
#
# WARNING: This file should ONLY be run inside the
#          docker server container for Fitcrack.
#          DO NOT run this file on your host machine!
#

echo "============================================================"
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
echo "       (C) 2017-2023 Fitcrack team - www.fitcrack.cz        "
echo "============================================================"

##############################################
# Check if project exists. If not, create it.
if [ -d "$BOINC_PROJECT_DIR" ]; then
  echo "Project already exists."

  usermod -d /var/lib/mysql/ mysql
  # Fix MySQL socket permissions
  chmod 755 /var/run/mysqld

  service mysql start
  service apache2 start
  service fitcrack start
else # Create Fitcrack project

  # Setup Fitcrack logging directory
  chgrp fitcrack /var/log/fitcrack
  chmod 775 /var/log/fitcrack

  # Setup Apache hostname
  echo "ServerName localhost" >> $APACHE_CONFIG_FILE

  # Configure MySQL server
  usermod -d /var/lib/mysql/ mysql
  service mysql start
  mysql -e "CREATE DATABASE $DB_NAME";
  mysql -e "CREATE USER '$DB_USER'@'$DB_HOST' IDENTIFIED WITH mysql_native_password BY '$DB_PW'";
  mysql -e "GRANT ALL ON $DB_NAME.* TO '$DB_USER'@'$DB_HOST'";
  mysql -e "SET PERSIST log_bin_trust_function_creators = 1;"
  mysql -e "SET PERSIST time_zone = '+00:00';"
  mysql -e "FLUSH PRIVILEGES";

  # Fix MySQL socket permissions
  chmod 755 /var/run/mysqld

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
  htpasswd -cb $BOINC_PROJECT_DIR/html/ops/.htpasswd "$OPS_LOGIN" "$OPS_PW"

  ##################################
  # Copy Fitcrack apps and daemons #
  ##################################

  # Copy server measure script
  cp -f server/server_bin/measure_usage.py $BOINC_PROJECT_DIR/bin/

  # Copy pcfg-monitor script
  cp -f server/server_bin/pcfg_monitor.py $BOINC_PROJECT_DIR/bin/

  # Copy client binaries
  mkdir $BOINC_PROJECT_DIR/apps/fitcrack
  mkdir $BOINC_PROJECT_DIR/apps/fitcrack/1
  cp -Rf server/client_bin/* $BOINC_PROJECT_DIR/apps/fitcrack/1/

  # Install server daemons
  source installer/install_daemons.sh

  # Add app app_versions
  MYDIR=$(pwd)
  cd $BOINC_PROJECT_DIR
  sudo -u $BOINC_USER ./bin/xadd
  sudo -u $BOINC_USER ./bin/update_versions --noconfirm
  cd $MYDIR

  # Restart Apache service
  service $APACHE_SERVICE restart

  #############################
  # Install Fitcrack database #
  #############################
  export MYSQL_PWD="$DB_PW"
  echo "Creating Fitcrack tables..."
  mysql -h $DB_HOST -u $DB_USER -D"$DB_NAME" < server/sql/10_create_tables.sql
  if [[ $? != 0 ]]; then
    echo "Error: Unable to create Fitcrack DB tables"
    exit
  fi
  echo "Fitcrack tables created."

  echo "Creating Fitcrack database triggers..."
  mysql -h $DB_HOST -u $DB_USER -D"$DB_NAME" < server/sql/20_create_triggers.sql
  if [[ $? != 0 ]]; then
    echo "Error: Unable to create Fitcrack DB tables"
    exit
  fi
  echo "Fitcrack database triggers created."

  echo "Inserting initial data..."
  mysql -h $DB_HOST -u $DB_USER -D"$DB_NAME" < server/sql/30_insert_data.sql
  if [[ $? != 0 ]]; then
    echo "Error: Unable to create Fitcrack DB tables"
    exit
  fi
  echo "Initial data inserted."

  # Install startup script
  cp -f installer/init/fitcrack /etc/init.d/fitcrack
  chmod +x /etc/init.d/fitcrack

  # Add runlevel symlinks
  update-rc.d fitcrack defaults

  # Setup the default Fitcrack user
  chmod +x ./tools/./setup_default_fitcrack_user.py
  ./tools/./setup_default_fitcrack_user.py

  ##############################################
  # Install assets

  echo "Creating directories for common assets..."
  # Create assets dir (if not exists)
  if ! [ -d "/usr/share/assets" ]; then
    mkdir /usr/share/assets
  fi

  # Create default import destination
  if ! [ -d "/usr/share/assets/import" ]; then
    mkdir /usr/share/assets/import
  fi

  # Create assets subdirs
  if ! [ -d "/usr/share/assets/charsets" ]; then
    cp -R assets/charsets /usr/share/assets/
  fi

  if ! [ -d "/usr/share/assets/dictionaries" ]; then
    cp -R assets/dictionaries /usr/share/assets/
  fi

  if ! [ -d "/usr/share/assets/markov" ]; then
    cp -R assets/markov /usr/share/assets/
  fi

  if ! [ -d "/usr/share/assets/encrypted-files" ]; then
    cp -R assets/encrypted-files /usr/share/assets/
  fi

  if ! [ -d "/usr/share/assets/masks" ]; then
    cp -R assets/masks /usr/share/assets/
  fi

  if ! [ -d "/usr/share/assets/rules" ]; then
    cp -R assets/rules /usr/share/assets/
  fi

  if ! [ -d "/usr/share/assets/pcfg" ]; then
    cp assets/pcfg.tar.gz /usr/share/assets/
    cd /usr/share/assets/
    tar xzvf pcfg.tar.gz
    rm pcfg.tar.gz
    cd $INSTALLER_ROOT
  fi

  # Set ownership and permissions
  chown -R $APACHE_USER:$APACHE_GROUP /usr/share/assets
  chmod -R 777 /usr/share/assets

  echo "Directories for common assets created."

  #
  ##############################################

  # Fix permission (if eneded)
  chown -R $BOINC_USER:$BOINC_GROUP /home/$BOINC_USER
  chmod -R 775 /home/$BOINC_USER
  usermod -a -G $BOINC_GROUP $APACHE_USER # NOTE: Normally done at project creation - consider to do that somewhere else
  service apache2 stop



  ##############################################
  # Configure Fitcrack backend

  if [ $SSL_FITCRACK = "y" ]; then
    a2enmod ssl
    chown -R www-data:www-data /srv/certificates
  fi

  sed -i "s|<max_wus_in_progress>1</max_wus_in_progress>|<max_wus_in_progress>2</max_wus_in_progress>|g" $BOINC_PROJECT_DIR/config.xml
  sed -i "s|<log_dir>.*<\/log_dir>|<log_fitcrack_dir>/var/log/fitcrack</log_fitcrack_dir>|g" $BOINC_PROJECT_DIR/config.xml

  # Fix backend URI
  sed -i "s|PROJECT_USER = '.*|PROJECT_USER = '$BOINC_USER'|g" /srv/fitcrack/backend/src/settings.py
  sed -i "s|PROJECT_NAME = '.*|PROJECT_NAME = '$BOINC_PROJECT'|g" /srv/fitcrack/backend/src/settings.py
  sed -i "s|FLASK_SERVER_NAME = '.*|FLASK_SERVER_NAME = 'localhost:$BACKEND_PORT'|g" /srv/fitcrack/backend/src/settings.py
  sed -i "s|SQLALCHEMY_DATABASE_URI = '.*|SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://$DB_USER:$DB_PW@localhost/$DB_NAME'|g" /srv/fitcrack/backend/src/settings.py
  sed -i "s|BOINC_SERVER_URI = '.*|BOINC_SERVER_URI = '$BOINC_URL'|g" /srv/fitcrack/backend/src/settings.py

  # Copy it to the /var/www/html/
  cp -R /srv/fitcrack/backend/* $APACHE_DOCUMENT_ROOT/fitcrackBE/
  chown -R $APACHE_USER:$APACHE_USER $APACHE_DOCUMENT_ROOT/fitcrackBE

  # Set WSGI path
  sed -i "s|sys.path.insert(0.*|sys.path.insert(0,\"$APACHE_DOCUMENT_ROOT/fitcrackBE/src/\")|g" $APACHE_DOCUMENT_ROOT/fitcrackBE/src/wsgi.py

  # Configure Apache WSGI
  BE_CONFIG_FILE=$APACHE_CONFIG_DIR/sites-available/00-fitcrackBE.conf
  echo "# Fitcrack back-end config" > $BE_CONFIG_FILE
  echo "<VirtualHost *:$BACKEND_PORT>" >> $BE_CONFIG_FILE
  echo "  WSGIDaemonProcess fitcrack user=$APACHE_USER group=$APACHE_USER threads=5" >> $BE_CONFIG_FILE
  echo "  WSGIScriptAlias / $APACHE_DOCUMENT_ROOT/fitcrackBE/src/wsgi.py" >> $BE_CONFIG_FILE
  echo "  <Directory $APACHE_DOCUMENT_ROOT/fitcrackBE/src/>" >> $BE_CONFIG_FILE
  echo "    WSGIProcessGroup fitcrack" >> $BE_CONFIG_FILE
  echo "    WSGIApplicationGroup %{GLOBAL}" >> $BE_CONFIG_FILE
  echo "    WSGIScriptReloading On" >> $BE_CONFIG_FILE
  echo "    Require all granted" >> $BE_CONFIG_FILE
  echo "  </Directory>" >> $BE_CONFIG_FILE
  if [ $SSL_FITCRACK = "y" ]; then
    echo "  SSLEngine on" >> $BE_CONFIG_FILE
    echo "  SSLCertificateFile /srv/certificates/$SSL_CERTIFICATE_FILE" >> $BE_CONFIG_FILE
    echo "  SSLCertificateKeyFile /srv/certificates/$SSL_CERTIFICATE_KEYFILE" >> $BE_CONFIG_FILE
  fi
  echo "  ErrorLog /var/log/fitcrack/backend-error.log" >> $BE_CONFIG_FILE
  echo "  CustomLog /var/log/fitcrack/backend-access.log combined" >> $BE_CONFIG_FILE
  echo "</VirtualHost>" >> $BE_CONFIG_FILE

  echo "Creating a symlink: $APACHE_CONFIG_DIR/sites-enabled/fitcrackBE.conf"
  ln -sf $BE_CONFIG_FILE $APACHE_CONFIG_DIR/sites-enabled/00-fitcrackBE.conf
  echo "Backend-end Apache configuration done"


  ##############################################
  # Configure Fitcrack frontend

  # Copy frontend files
  echo "Installing Fitcrack frontend..."
  mkdir $APACHE_DOCUMENT_ROOT/fitcrackFE
  cp -Rf /srv/fitcrack/frontend/dist/* $APACHE_DOCUMENT_ROOT/fitcrackFE/

  # Set BACKEND_URI for window.serverAddress
  sed -i "s|http://localhost:5000|$BACKEND_URI:$BACKEND_PORT|g" $APACHE_DOCUMENT_ROOT/fitcrackFE/static/configuration.js

  # Set permissions and ownership to Apache user and group
  chmod -R 775 $APACHE_DOCUMENT_ROOT/fitcrackFE
  chown -R $APACHE_USER:$APACHE_GROUP $APACHE_DOCUMENT_ROOT/fitcrackFE
  echo "Installed to $APACHE_DOCUMENT_ROOT/fitcrackFE."

  # Remove the preinstalled default config:
  rm $APACHE_CONFIG_DIR/sites-enabled/000-default.conf

  # Create frontend Apache config
  FE_CONFIG_FILE=$APACHE_CONFIG_DIR/sites-available/01-fitcrackFE.conf
  echo "# Fitcrack frontend config" > $FE_CONFIG_FILE
  echo "<VirtualHost *:$FRONTEND_PORT>" >> $FE_CONFIG_FILE
  #echo "ServerName localhost" >> $FE_CONFIG_FILE
  echo "  DocumentRoot $APACHE_DOCUMENT_ROOT/fitcrackFE" >> $FE_CONFIG_FILE
  echo "  <Directory $APACHE_DOCUMENT_ROOT/fitcrackFE/>" >> $FE_CONFIG_FILE
  echo "    RewriteEngine On" >> $FE_CONFIG_FILE
  echo "    RewriteBase /" >> $FE_CONFIG_FILE
  echo "    RewriteRule ^index\.html$ - [L]" >> $FE_CONFIG_FILE
  echo "    RewriteCond %{REQUEST_FILENAME} !-f" >> $FE_CONFIG_FILE
  echo "    RewriteCond %{REQUEST_FILENAME} !-d" >> $FE_CONFIG_FILE
  echo "    RewriteRule . /index.html [L]" >> $FE_CONFIG_FILE
  echo "  </Directory>" >> $FE_CONFIG_FILE

  # In case BOINC uses the same port, include it here
  if [ $FRONTEND_PORT == $BOINC_PORT ]; then
    echo "  IncludeOptional $PROJECT_HTTPD_CONF" >> $FE_CONFIG_FILE
  fi

  if [ $SSL_FITCRACK = "y" ]; then
    echo "  SSLEngine on" >> $FE_CONFIG_FILE
    echo "  SSLCertificateFile /srv/certificates/$SSL_CERTIFICATE_FILE" >> $FE_CONFIG_FILE
    echo "  SSLCertificateKeyFile /srv/certificates/$SSL_CERTIFICATE_KEYFILE" >> $FE_CONFIG_FILE
  fi
  echo "</VirtualHost>" >> $FE_CONFIG_FILE

  echo "Creating a symlink: $APACHE_CONFIG_DIR/sites-enabled/fitcrackFE.conf"
  ln -sf $FE_CONFIG_FILE $APACHE_CONFIG_DIR/sites-enabled/01-fitcrackFE.conf
  echo "Front-end Apache configuration done"


  ##############################################
  # Configure BOINC sheduler and HTTP(S)

  # Create frontend Apache config
  # In case BOINC uses the same port, include it here
  if [ $FRONTEND_PORT != $BOINC_PORT ]; then
    BOINC_APACHE_CONFIG=$APACHE_CONFIG_DIR/sites-available/02-fitcrackBOINC.conf
    echo "# Fitcrack BOINC Apache config" > $BOINC_APACHE_CONFIG
    echo "<VirtualHost *:$BOINC_PORT>" >> $BOINC_APACHE_CONFIG
    echo "  IncludeOptional $PROJECT_HTTPD_CONF" >> $BOINC_APACHE_CONFIG

    if [ $SSL_BOINC = "y" ]; then
      echo "  SSLEngine on" >> $BOINC_APACHE_CONFIG
      echo "  SSLCertificateFile /srv/certificates/$SSL_CERTIFICATE_FILE" >> $BOINC_APACHE_CONFIG
      echo "  SSLCertificateKeyFile /srv/certificates/$SSL_CERTIFICATE_KEYFILE" >> $BOINC_APACHE_CONFIG
    fi
    echo "</VirtualHost>" >> $BOINC_APACHE_CONFIG


    echo "Creating a symlink: $APACHE_CONFIG_DIR/sites-enabled/fitcrackBOINC.conf"
    ln -sf $BOINC_APACHE_CONFIG $APACHE_CONFIG_DIR/sites-enabled/02-fitcrackBOINC.conf
  fi
  echo "BOINC Apache configuration done"


  ##############################################
  # Finalize Apache configuration

  # Reconfigure apache ports
  echo "Configuring ports..."
  echo "BOINC port: $BOINC_PORT"
  echo "Fitcrack backend port: $BACKEND_PORT"
  echo "Fitcrack frontend port: $FRONTEND_PORT"

  echo "Listen $BOINC_PORT" > $APACHE_CONFIG_DIR/ports.conf
  cat $APACHE_CONFIG_DIR/ports.conf | grep "Listen $BACKEND_PORT" >/dev/null
  if [[ $? != 0 ]]; then
    echo "Listen $BACKEND_PORT" >> $APACHE_CONFIG_DIR/ports.conf
  fi
  cat $APACHE_CONFIG_DIR/ports.conf | grep "Listen $FRONTEND_PORT" >/dev/null
  if [[ $? != 0 ]]; then
    echo "Listen $FRONTEND_PORT" >> $APACHE_CONFIG_DIR/ports.conf
  fi
  echo "Done"

  if [ $DYNAMIC_BACKEND_URL = "y" ]; then
    sed -i "s@serverAddress.*@serverAddress = \"$FITCRACK_PROTO://\"+window.location.hostname+\":${BACKEND_PORT}\"@g" /var/www/html/fitcrackFE/static/configuration.js
  else
    BACKEND_URL="${FITCRACK_PROTO}://${FITCRACK_HOST}:${BACKEND_PORT}"
    sed -i "s@serverAddress.*@serverAddress = \"$BACKEND_URL\"@g" /var/www/html/fitcrackFE/static/configuration.js
  fi

  # Restart Apache
  service apache2 restart
  service fitcrack start
fi

#
##############################################

sleep infinity
