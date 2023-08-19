#!/bin/bash

# Update Fitcrack frontend and backend 
# This file is part of Fitcrack installer
# Author: Radek Hranicky (ihranicky@fit.vutbr.cz)

echo "                                                          "
echo "=============== Update Fitcrack frontend and backend ================="
echo "                                                          "

###################################################
# Update Fitcrack frontend (fitcrackFE) #
###################################################

INSTALL_FRONTEND="N"
if [ -d "$APACHE_DOCUMENT_ROOT/fitcrackFE" ]; then
  echo "Fitcrack frontend is installed in $APACHE_DOCUMENT_ROOT/fitcrackFE."
  read -e -p "Update frontend? [y/N] (default: y): " UPDATE_FRONTEND
  UPDATE_FRONTEND=${UPDATE_FRONTEND:-y}

  if [ $UPDATE_FRONTEND = "y" ]; then
    # Backup original frontend config
    BACKEND_URI=`cat $APACHE_DOCUMENT_ROOT/fitcrackFE/static/configuration.js | grep "serverAddress" | cut -d"\"" -f2`

    # Delete old frontend
    rm -Rf $APACHE_DOCUMENT_ROOT/fitcrackFE
    INSTALL_FRONTEND="y"
  fi
else
  echo "Unable to find Fitcrack frontend installation."
  exit
fi

# Install frontend
if [ $INSTALL_FRONTEND = "y" ]; then
  echo "Updating Fitcrack frontend..."
  mkdir $APACHE_DOCUMENT_ROOT/fitcrackFE
  cp -Rf frontend/dist/* $APACHE_DOCUMENT_ROOT/fitcrackFE/

  # Set permissions and ownership to Apache user and group
  chmod -R 775 $APACHE_DOCUMENT_ROOT/fitcrackFE
  chown -R $APACHE_USER:$APACHE_GROUP $APACHE_DOCUMENT_ROOT/fitcrackFE

  echo "frontend files updated."
  echo "Configuring updated frontend..."

  # Set port to backend
  sed -i "s|http://localhost:5000|$BACKEND_URI|g" $APACHE_DOCUMENT_ROOT/fitcrackFE/static/configuration.js
  echo "Done."

  echo "Updated frontend in $APACHE_DOCUMENT_ROOT/fitcrackFE."
fi


###################################################
# Update Fitcrack backend (fitcrackBE) #
###################################################

INSTALL_BACKEND="N"
if [ -d "$APACHE_DOCUMENT_ROOT/fitcrackBE" ]; then
  echo "Fitcrack backend is installed in $APACHE_DOCUMENT_ROOT/fitcrackBE."
  read -e -p "Update backend? [y/N] (default: y): " UPDATE_BACKEND
  UPDATE_BACKEND=${UPDATE_BACKEND:-y}
  if [ $UPDATE_BACKEND = "y" ]; then
    rm -Rf $APACHE_DOCUMENT_ROOT/fitcrackBE
    INSTALL_BACKEND="y"
  fi
else
  echo "Unable to find Fitcrack backend installation."
  exit
fi

# Install backend
if [ $INSTALL_BACKEND = "y" ]; then
  echo "Building hashcat-utils"
  cd backend/hashcat-utils/src
  make
  cd ..
  mkdir -p bin
  cp src/*.bin bin/
  cd $INSTALLER_ROOT

  echo "Building xtohashcat tools"
  cd backend/xtohashcat/scripts/
  make -j$COMPILER_THREADS
  cd $INSTALLER_ROOT

  echo "Building pwd-dist tool"
  cd backend/pwd_dist
  make -j$COMPILER_THREADS
  cd $INSTALLER_ROOT

  echo "Installing backend requirements..."
  pip3 install -r backend/src/requirements.txt

  echo "Updating Fitcrack backend..."
  mkdir $APACHE_DOCUMENT_ROOT/fitcrackBE
  cp -Rf backend/* $APACHE_DOCUMENT_ROOT/fitcrackBE/

  rm -f backend/xtohashcat/scripts/zip2john
  rm -f backend/xtohashcat/scripts/rar2john

  # Set permissions and ownership to Apache user and group
  chmod -R 775 $APACHE_DOCUMENT_ROOT/fitcrackBE
  chown -R $APACHE_USER:$APACHE_GROUP $APACHE_DOCUMENT_ROOT/fitcrackBE

  echo "Backend files updated in $APACHE_DOCUMENT_ROOT/fitcrackBE."

  echo "Configuring updated backend..."
  # Set credentials
  sed -i "s|PROJECT_USER = '.*|PROJECT_USER = '$BOINC_USER'|g" $APACHE_DOCUMENT_ROOT/fitcrackBE/src/settings.py
  sed -i "s|PROJECT_NAME = '.*|PROJECT_NAME = '$BOINC_PROJECT'|g" $APACHE_DOCUMENT_ROOT/fitcrackBE/src/settings.py
  sed -i "s|FLASK_SERVER_NAME = '.*|FLASK_SERVER_NAME = 'localhost:$BACKEND_PORT'|g" $APACHE_DOCUMENT_ROOT/fitcrackBE/src/settings.py
  sed -i "s|SQLALCHEMY_DATABASE_URI = '.*|SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://$DB_USER:$DB_PW@$DB_HOST/$DB_NAME'|g" $APACHE_DOCUMENT_ROOT/fitcrackBE/src/settings.py
  sed -i "s|BOINC_SERVER_URI = '.*|BOINC_SERVER_URI = '$BOINC_URL'|g" $APACHE_DOCUMENT_ROOT/fitcrackBE/src/settings.py

  # Set port to backend
  sed -i "s|sys.path.insert(0.*|sys.path.insert(0,\"$APACHE_DOCUMENT_ROOT/fitcrackBE/src/\")|g" $APACHE_DOCUMENT_ROOT/fitcrackBE/src/wsgi.py
  echo "Done."
fi

##################
# Restart Apache #
##################

echo "Fitcrack update of frontend and backend done. Restarting Apache..."
service_restart $APACHE_SERVICE
echo "Done."
