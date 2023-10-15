#!/bin/bash

# Frontend and backend installer
# This file is part of Hashstation installer
# Author: Radek Hranicky (ihranicky@fit.vutbr.cz)

##################################
# Install backend prerequisities #
##################################

echo "Installing backend requirements..."
pip3 install -r backend/src/requirements.txt
echo "Done."

####################################
# Prepare Apache for configuration #
####################################

echo "Checking Apache..."
if ! [ -d $APACHE_CONFIG_DIR/sites-enabled ]; then
  echo "Virtualhost directories do not exists, creating..."
  echo "Creating: $APACHE_CONFIG_DIR/sites-available"
  echo "Creating: $APACHE_CONFIG_DIR/sites-enabled"
  mkdir $APACHE_CONFIG_DIR/sites-available
  mkdir $APACHE_CONFIG_DIR/sites-enabled
  echo "Done."

  cat $APACHE_CONFIG_FILE | grep sites-enabled >/dev/null 2>/dev/null

  if [[ $? != 0 ]]; then
    echo "Adding IncludeOptional to sites-enabled."
    echo "IncludeOptional $APACHE_CONFIG_DIR/sites-enabled/*.conf" >> $APACHE_CONFIG_FILE
    echo "Added."
  fi
fi
echo "Apache is prepared for configuration."

###################
# Configure ports #
###################

read -e -p "Enter a port for frontend to listen on (default: 80): " FRONTEND_PORT
FRONTEND_PORT=${FRONTEND_PORT:-80}


#########################
# Get frontend TCP port #
#########################

if lsof -Pi :$FRONTEND_PORT -sTCP:LISTEN -t >/dev/null ; then
  FRONTEND_PORT_FREE="N"
else
  FRONTEND_PORT_FREE="y"
fi

if [ $FRONTEND_PORT_FREE = "N" ]; then
  echo "Port $FRONTEND_PORT is already used."

  if [ $FRONTEND_PORT -eq 80 ] && [ -f "$APACHE_CONFIG_DIR/sites-available/000-default.conf" ] && [ -f "$APACHE_CONFIG_DIR/sites-enabled/000-default.conf" ]; then
    echo "Probably caused by: $APACHE_CONFIG_DIR/sites-available/000-default.conf"
    read -e -p "Replace default site? [y/N] (default: N): " REPLACE_DEFAULT
    REPLACE_DEFAULT=${REPLACE_DEFAULT:-N}

    if [ $REPLACE_DEFAULT = "y" ]; then
      rm -f $APACHE_CONFIG_DIR/sites-enabled/000-default.conf
      rm -f $APACHE_CONFIG_DIR/sites-available/000-default.conf
      FRONTEND_PORT_FREE="y"
    fi
  else
    read -e -p "Ignore and configure anyway? [y/N] (default: N) " FORCE_CONFIGURE
    FORCE_CONFIGURE=${FORCE_CONFIGURE:-N}

    if [ $FORCE_CONFIGURE = "y" ]; then
      FRONTEND_PORT_FREE="y"
    fi
  fi
fi

###########################
# Frontend Apache config #
###########################

if [ $FRONTEND_PORT_FREE = "N" ]; then
  echo "Resolve the problem or try again with another port number!"
  exit
else
  echo "Creating frontend config: $APACHE_CONFIG_DIR/sites-available/hashstationFE.conf"

  ADD_LISTEN_DIRECTIVE="y"
  cat $APACHE_CONFIG_FILE | grep "^Listen $FRONTEND_PORT" >/dev/null
  if [[ $? = 0 ]]; then
    ADD_LISTEN_DIRECTIVE="N"
  fi
  if [ -f $APACHE_CONFIG_DIR/ports.conf ]; then
    cat $APACHE_CONFIG_DIR/ports.conf | grep "^Listen $FRONTEND_PORT" >/dev/null
    if [[ $? = 0 ]]; then
      ADD_LISTEN_DIRECTIVE="N"
    fi
  fi

  FE_CONFIG_FILE=$APACHE_CONFIG_DIR/sites-available/hashstationFE.conf
  echo "# Hashstation frontend config" > $FE_CONFIG_FILE

  if [ $ADD_LISTEN_DIRECTIVE = "y" ]; then
    echo "Listen $FRONTEND_PORT" >> $FE_CONFIG_FILE
  fi

  echo "<VirtualHost *:$FRONTEND_PORT>" >> $FE_CONFIG_FILE
  echo "  DocumentRoot $APACHE_DOCUMENT_ROOT/hashstationFE" >> $FE_CONFIG_FILE
  echo "  <Directory $APACHE_DOCUMENT_ROOT/hashstationFE/>" >> $FE_CONFIG_FILE
  echo "    Header always set X-Frame-Options \"SAMEORIGIN\"" >> $FE_CONFIG_FILE
  echo "    Header always set X-Content-Type-Options \"nosniff\"" >> $FE_CONFIG_FILE
  echo "    Header always set Permissions-Policy \"geolocation=(), microphone=(), camera=()\"" >> $FE_CONFIG_FILE
  echo "    Header always set Content-Security-Policy \"default-src *; script-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; style-src 'self' 'unsafe-inline';\"" >> $FE_CONFIG_FILE

  echo "    RewriteEngine On" >> $FE_CONFIG_FILE
  echo "    RewriteBase /" >> $FE_CONFIG_FILE
  echo "    RewriteRule ^index\.html$ - [L]" >> $FE_CONFIG_FILE
  echo "    RewriteCond %{REQUEST_FILENAME} !-f" >> $FE_CONFIG_FILE
  echo "    RewriteCond %{REQUEST_FILENAME} !-d" >> $FE_CONFIG_FILE
  echo "    RewriteRule . /index.html [L]" >> $FE_CONFIG_FILE
  echo "  </Directory>" >> $FE_CONFIG_FILE

  # Disable directory listing for assets/
  echo "  <Directory $APACHE_DOCUMENT_ROOT/hashstationFE/assets/>" >> $FE_CONFIG_FILE
  echo "    Options -Indexes" >> $FE_CONFIG_FILE
  echo "  </Directory>" >> $FE_CONFIG_FILE

  # Disable directory listing for static/
  echo "  <Directory $APACHE_DOCUMENT_ROOT/hashstationFE/static/>" >> $FE_CONFIG_FILE
  echo "    Options -Indexes" >> $FE_CONFIG_FILE
  echo "  </Directory>" >> $FE_CONFIG_FILE

  echo "</VirtualHost>" >> $FE_CONFIG_FILE

  echo "Creating a symlink: $APACHE_CONFIG_DIR/sites-enabled/hashstationFE.conf"
  ln -sf $APACHE_CONFIG_DIR/sites-available/hashstationFE.conf $APACHE_CONFIG_DIR/sites-enabled/hashstationFE.conf
  echo "Frontend Apache configuration done"
fi


###################
# Get BACKEND_URI #
###################

read -e -p "Enter Hashstation backend URI (default: ${BOINC_URL}): " BACKEND_URI
BACKEND_URI=${BACKEND_URI:-${BOINC_URL}}
BACKEND_URI=${BACKEND_URI%/}

#########################
# Get backend TCP port #
#########################

read -e -p "Enter a port for backend to listen on (default: 5000): " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-5000}

if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null ; then
  BACKEND_PORT_FREE="N"
else
  BACKEND_PORT_FREE="y"
fi

if [ $BACKEND_PORT_FREE = "N" ]; then
  echo "Port $BACKEND_PORT_FREE is already used."
  read -e -p "Ignore and configure anyway? [y/N] (default: N) " FORCE_CONFIGURE
  FORCE_CONFIGURE=${FORCE_CONFIGURE:-N}

  if [ $FORCE_CONFIGURE = "y" ]; then
    BACKEND_PORT_FREE="y"
  fi
fi

###########################
# Backend Apache config #
###########################

if [ $BACKEND_PORT_FREE = "N" ]; then
  echo "Resolve the problem or try again with another port number!"
  exit
else
  echo "Creating backend config: $APACHE_CONFIG_DIR/sites-available/hashstationBE.conf"

  ADD_LISTEN_DIRECTIVE="y"
  cat $APACHE_CONFIG_FILE | grep "^Listen $BACKEND_PORT" >/dev/null
  if [[ $? = 0 ]]; then
    ADD_LISTEN_DIRECTIVE="N"
  fi
  if [ -f $APACHE_CONFIG_DIR/ports.conf ]; then
    cat $APACHE_CONFIG_DIR/ports.conf | grep "^Listen $BACKEND_PORT" >/dev/null
    if [[ $? = 0 ]]; then
      ADD_LISTEN_DIRECTIVE="N"
    fi
  fi

  BE_CONFIG_FILE=$APACHE_CONFIG_DIR/sites-available/hashstationBE.conf
  echo "# Hashstation backend config" > $BE_CONFIG_FILE

  if [ $ADD_LISTEN_DIRECTIVE = "y" ]; then
    echo "Listen $BACKEND_PORT" >> $BE_CONFIG_FILE
  fi

  echo "<VirtualHost *:$BACKEND_PORT>" >> $BE_CONFIG_FILE
  echo "  WSGIDaemonProcess hashstation user=$APACHE_USER group=$APACHE_USER threads=5" >> $BE_CONFIG_FILE
  echo "  WSGIScriptAlias / $APACHE_DOCUMENT_ROOT/hashstationBE/src/wsgi.py" >> $BE_CONFIG_FILE
  echo "  WSGIPassAuthorization On" >> $BE_CONFIG_FILE
  echo "  <Directory $APACHE_DOCUMENT_ROOT/hashstationBE/src/>" >> $BE_CONFIG_FILE
  echo "    WSGIProcessGroup hashstation" >> $BE_CONFIG_FILE
  echo "    WSGIApplicationGroup %{GLOBAL}" >> $BE_CONFIG_FILE
  echo "    WSGIScriptReloading On" >> $BE_CONFIG_FILE
  echo "    Require all granted" >> $BE_CONFIG_FILE
  echo "  </Directory>" >> $BE_CONFIG_FILE
  echo "</VirtualHost>" >> $BE_CONFIG_FILE

  echo "Creating a symlink: $APACHE_CONFIG_DIR/sites-enabled/hashstationBE.conf"
  ln -sf $APACHE_CONFIG_DIR/sites-available/hashstationBE.conf $APACHE_CONFIG_DIR/sites-enabled/hashstationBE.conf
  echo "Frontend Apache configuration done"
fi

##########################################################
# Install Hashstation frontend (hashstationFE) files #
##########################################################

if [ -d "$APACHE_DOCUMENT_ROOT/hashstationFE" ]; then
  echo "Frontend already seems to be installed in $APACHE_DOCUMENT_ROOT/hashstationFE."
  read -e -p "Reinstall frontend? [y/N] (default: N): " REINSTALL_FRONTEND
  REINSTALL_FRONTEND=${REINSTALL_FRONTEND:-N}
  if [ $REINSTALL_FRONTEND = "y" ]; then
    rm -Rf $APACHE_DOCUMENT_ROOT/hashstationFE
    INSTALL_FRONTEND="y"
  else
    INSTALL_FRONTEND="N"
  fi
else
  INSTALL_FRONTEND="y"
fi

# Install frontend
if [ $INSTALL_FRONTEND = "y" ]; then
  echo "Installing Hashstation frontend..."
  mkdir $APACHE_DOCUMENT_ROOT/hashstationFE
  cp -Rf frontend/dist/* $APACHE_DOCUMENT_ROOT/hashstationFE/

  # Set BACKEND_URI for window.serverAddress
  sed -i "s|http://localhost:5000|$BACKEND_URI:$BACKEND_PORT|g" $APACHE_DOCUMENT_ROOT/hashstationFE/static/configuration.js

  # Set permissions and ownership to Apache user and group
  chmod -R 775 $APACHE_DOCUMENT_ROOT/hashstationFE
  chown -R $APACHE_USER:$APACHE_GROUP $APACHE_DOCUMENT_ROOT/hashstationFE

  echo "Installed to $APACHE_DOCUMENT_ROOT/hashstationFE."
fi

#########################################################
# Install Hashstation backend (hashstationBE) file #
#########################################################

if [ -d "$APACHE_DOCUMENT_ROOT/hashstationBE" ]; then
  echo "Backend already seems to be installed in $APACHE_DOCUMENT_ROOT/hashstationBE."
  read -e -p "Reinstall backend? [y/N] (default: N): " REINSTALL_BACKEND
  REINSTALL_BACKEND=${REINSTALL_BACKEND:-N}
  if [ $REINSTALL_BACKEND = "y" ]; then
    rm -Rf $APACHE_DOCUMENT_ROOT/hashstationBE
    INSTALL_BACKEND="y"
  else
    INSTALL_BACKEND="N"
  fi
else
  INSTALL_BACKEND="y"
fi

# Install frontend
if [ $INSTALL_BACKEND = "y" ]; then
  echo "Building hashcat-utils"
  cd backend/hashcat-utils/src
  make -j$COMPILER_THREADS hcstat2gen.bin
  cd ..
  mkdir -p bin
  cp src/*.bin bin/
  cd $INSTALLER_ROOT

  echo "Building pwd-dist tool"
  cd backend/pwd_dist
  make -j$COMPILER_THREADS
  cd $INSTALLER_ROOT

  echo "Installing Hashstation backend..."


  mkdir $APACHE_DOCUMENT_ROOT/hashstationBE
  cp -Rf backend/* $APACHE_DOCUMENT_ROOT/hashstationBE/

  # Set permissions and ownership to Apache user and group
  chmod -R 775 $APACHE_DOCUMENT_ROOT/hashstationBE
  chown -R $APACHE_USER:$APACHE_GROUP $APACHE_DOCUMENT_ROOT/hashstationBE

  echo "Installed to $APACHE_DOCUMENT_ROOT/hashstationBE."
fi

sed -i "s|http://localhost:5000|$BACKEND_URI:$BACKEND_PORT|g" $BOINC_PROJECT_DIR/bin/measure_usage.py

#######################
# Configure frontend #
#######################

echo "Configuring frontend..."
# Set port to backend
sed -i "s|http://localhost:5000|$BACKEND_URI:$BACKEND_PORT|g" $APACHE_DOCUMENT_ROOT/hashstationFE/static/configuration.js
echo "Done."

#######################
# Configure backend #
#######################

echo "Configuring backend..."

read -e -p "Exposed to the internet? Do you wish to disable token signin and install HTTPS manually? [y/N] (default: N) " EXPOSED_INTERNET
EXPOSED_INTERNET=${EXPOSED_INTERNET:-N}
if [ $EXPOSED_INTERNET = "y" ]; then
  sed -i "s|ALLOW_TOKEN_SIGNIN = .*|ALLOW_TOKEN_SIGNIN = False|g" $APACHE_DOCUMENT_ROOT/hashstationBE/src/settings.py
fi

# Set credentials
sed -i "s|PROJECT_USER = '.*|PROJECT_USER = '$BOINC_USER'|g" $APACHE_DOCUMENT_ROOT/hashstationBE/src/settings.py
sed -i "s|PROJECT_NAME = '.*|PROJECT_NAME = '$BOINC_PROJECT'|g" $APACHE_DOCUMENT_ROOT/hashstationBE/src/settings.py
sed -i "s|FLASK_SERVER_NAME = '.*|FLASK_SERVER_NAME = 'localhost:$BACKEND_PORT'|g" $APACHE_DOCUMENT_ROOT/hashstationBE/src/settings.py
sed -i "s|SQLALCHEMY_DATABASE_URI = '.*|SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://$DB_USER:$DB_PW@$DB_HOST/$DB_NAME'|g" $APACHE_DOCUMENT_ROOT/hashstationBE/src/settings.py
sed -i "s|BOINC_SERVER_URI = '.*|BOINC_SERVER_URI = '$BOINC_URL'|g" $APACHE_DOCUMENT_ROOT/hashstationBE/src/settings.py

# Set port to backend
sed -i "s|sys.path.insert(0.*|sys.path.insert(0,\"$APACHE_DOCUMENT_ROOT/hashstationBE/src/\")|g" $APACHE_DOCUMENT_ROOT/hashstationBE/src/wsgi.py
echo "Done."

##################
# Restart Apache #
##################

echo "Hashstation frontend and backend installed. Restarting Apache..."
service_restart $APACHE_SERVICE
echo "Done."
