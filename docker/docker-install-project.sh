#!/bin/bash

# Setup Hashstation logging directory
mkdir /var/log/hashstation
chgrp hashstation /var/log/hashstation
chmod 775 /var/log/hashstation

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
  
# Install Hashstation database
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
    echo "Error: Unable to create Hashstation DB tables"
    exit
fi
echo "Hashstation database triggers created."

echo "Inserting initial data..."
mysql -h $DB_HOST -u $DB_USER -D"$DB_NAME" < server/sql/30_insert_data.sql
if [[ $? != 0 ]]; then
    echo "Error: Unable to create Hashstation DB tables"
    exit
fi
echo "Initial data inserted."

# Install startup script
cp -f installer/init/hashstation /etc/init.d/hashstation
chmod +x /etc/init.d/hashstation

# Add runlevel symlinks
update-rc.d hashstation defaults

# Setup the default Hashstation user
chmod +x ./docker/setup_default_hashstation_user.py
./docker/setup_default_hashstation_user.py

# Set ownership and permissions
mkdir /usr/share/assets
chown -R $APACHE_USER:$APACHE_GROUP /usr/share/assets
chmod -R 777 /usr/share/assets

echo "Directories for common assets created."

# Fix permission (if needed)
chown -R $BOINC_USER:$BOINC_GROUP /home/$BOINC_USER
chmod -R 775 /home/$BOINC_USER
usermod -a -G $BOINC_GROUP $APACHE_USER # NOTE: Normally done at project creation - consider to do that somewhere else

# Configure Hashstation backend

if [ $SSL_HASHSTATION = "y" ]; then
a2enmod ssl
chown -R www-data:www-data /srv/certificates
fi

sed -i "s|<max_wus_in_progress>1</max_wus_in_progress>|<max_wus_in_progress>2</max_wus_in_progress>|g" $BOINC_PROJECT_DIR/config.xml
sed -i "s|<log_dir>.*<\/log_dir>|<log_hashstation_dir>/var/log/hashstation</log_hashstation_dir>|g" $BOINC_PROJECT_DIR/config.xml

# Fix backend URI
sed -i "s|PROJECT_USER = '.*|PROJECT_USER = '$BOINC_USER'|g" /srv/hashstation/backend/src/settings.py
sed -i "s|PROJECT_NAME = '.*|PROJECT_NAME = '$BOINC_PROJECT'|g" /srv/hashstation/backend/src/settings.py
sed -i "s|FLASK_SERVER_NAME = '.*|FLASK_SERVER_NAME = 'localhost:$BACKEND_PORT'|g" /srv/hashstation/backend/src/settings.py
sed -i "s|SQLALCHEMY_DATABASE_URI = '.*|SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://$DB_USER:$DB_PW@localhost/$DB_NAME'|g" /srv/hashstation/backend/src/settings.py
sed -i "s|BOINC_SERVER_URI = '.*|BOINC_SERVER_URI = '$BOINC_URL'|g" /srv/hashstation/backend/src/settings.py

# Copy it to the /var/www/html/
mkdir $APACHE_DOCUMENT_ROOT/hashstationBE/
cp -R /srv/hashstation/backend/* $APACHE_DOCUMENT_ROOT/hashstationBE/
chown -R $APACHE_USER:$APACHE_USER $APACHE_DOCUMENT_ROOT/hashstationBE

# Set WSGI path
sed -i "s|sys.path.insert(0.*|sys.path.insert(0,\"$APACHE_DOCUMENT_ROOT/hashstationBE/src/\")|g" $APACHE_DOCUMENT_ROOT/hashstationBE/src/wsgi.py

# Configure Apache WSGI
BE_CONFIG_FILE=$APACHE_CONFIG_DIR/sites-available/00-hashstationBE.conf
echo "# Hashstation back-end config" > $BE_CONFIG_FILE
echo "<VirtualHost *:$BACKEND_PORT>" >> $BE_CONFIG_FILE
echo "  WSGIDaemonProcess hashstation user=$APACHE_USER group=$APACHE_USER threads=5" >> $BE_CONFIG_FILE
echo "  WSGIScriptAlias / $APACHE_DOCUMENT_ROOT/hashstationBE/src/wsgi.py" >> $BE_CONFIG_FILE
echo "  <Directory $APACHE_DOCUMENT_ROOT/hashstationBE/src/>" >> $BE_CONFIG_FILE
echo "    WSGIProcessGroup hashstation" >> $BE_CONFIG_FILE
echo "    WSGIApplicationGroup %{GLOBAL}" >> $BE_CONFIG_FILE
echo "    WSGIScriptReloading On" >> $BE_CONFIG_FILE
echo "    Require all granted" >> $BE_CONFIG_FILE
echo "  </Directory>" >> $BE_CONFIG_FILE
if [ $SSL_HASHSTATION = "y" ]; then
    echo "  SSLEngine on" >> $BE_CONFIG_FILE
    echo "  SSLCertificateFile /srv/hashstation/docker/certificates/$SSL_CERTIFICATE_FILE" >> $BE_CONFIG_FILE
    echo "  SSLCertificateKeyFile /srv/hashstation/docker/certificates/$SSL_CERTIFICATE_KEYFILE" >> $BE_CONFIG_FILE
fi
echo "  ErrorLog /var/log/hashstation/backend-error.log" >> $BE_CONFIG_FILE
echo "  CustomLog /var/log/hashstation/backend-access.log combined" >> $BE_CONFIG_FILE
echo "</VirtualHost>" >> $BE_CONFIG_FILE

echo "Creating a symlink: $APACHE_CONFIG_DIR/sites-enabled/hashstationBE.conf"
ln -sf $BE_CONFIG_FILE $APACHE_CONFIG_DIR/sites-enabled/00-hashstationBE.conf
echo "Backend-end Apache configuration done"

# Configure Hashstation frontend
echo "Installing Hashstation frontend..."
mkdir $APACHE_DOCUMENT_ROOT/hashstationFE
cp -Rf /srv/hashstation/frontend/dist/* $APACHE_DOCUMENT_ROOT/hashstationFE/

# Set BACKEND_URI for window.serverAddress
sed -i "s|http://localhost:5000|$BACKEND_URI:$BACKEND_PORT|g" $APACHE_DOCUMENT_ROOT/hashstationFE/static/configuration.js

# Set permissions and ownership to Apache user and group
chmod -R 775 $APACHE_DOCUMENT_ROOT/hashstationFE
chown -R $APACHE_USER:$APACHE_GROUP $APACHE_DOCUMENT_ROOT/hashstationFE
echo "Installed to $APACHE_DOCUMENT_ROOT/hashstationFE."

# Remove the preinstalled default config:
rm $APACHE_CONFIG_DIR/sites-enabled/000-default.conf

# Create frontend Apache config
FE_CONFIG_FILE=$APACHE_CONFIG_DIR/sites-available/01-hashstationFE.conf
echo "# Hashstation frontend config" > $FE_CONFIG_FILE
echo "<VirtualHost *:$FRONTEND_PORT>" >> $FE_CONFIG_FILE
#echo "ServerName localhost" >> $FE_CONFIG_FILE
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

# In case BOINC uses the same port, include it here
if [ $FRONTEND_PORT == $BOINC_PORT ]; then
    echo "  IncludeOptional $PROJECT_HTTPD_CONF" >> $FE_CONFIG_FILE
fi

if [ $SSL_HASHSTATION = "y" ]; then
    echo "  SSLEngine on" >> $FE_CONFIG_FILE
    echo "  SSLCertificateFile /srv/hashstation/docker/certificates/$SSL_CERTIFICATE_FILE" >> $FE_CONFIG_FILE
    echo "  SSLCertificateKeyFile /srv/hashstation/docker/certificates/$SSL_CERTIFICATE_KEYFILE" >> $FE_CONFIG_FILE
fi

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
ln -sf $FE_CONFIG_FILE $APACHE_CONFIG_DIR/sites-enabled/01-hashstationFE.conf
echo "Front-end Apache configuration done"

  # Configure BOINC sheduler and HTTP(S)

# Create frontend Apache config
# In case BOINC uses the same port, include it here
if [ $FRONTEND_PORT != $BOINC_PORT ]; then
    BOINC_APACHE_CONFIG=$APACHE_CONFIG_DIR/sites-available/02-hashstationBOINC.conf
    echo "# Hashstation BOINC Apache config" > $BOINC_APACHE_CONFIG
    echo "<VirtualHost *:$BOINC_PORT>" >> $BOINC_APACHE_CONFIG
    echo "  IncludeOptional $PROJECT_HTTPD_CONF" >> $BOINC_APACHE_CONFIG

    if [ $SSL_BOINC = "y" ]; then
        echo "  SSLEngine on" >> $BOINC_APACHE_CONFIG
        echo "  SSLCertificateFile /srv/hashstation/docker/certificates/$SSL_CERTIFICATE_FILE" >> $BOINC_APACHE_CONFIG
        echo "  SSLCertificateKeyFile /srv/hashstation/docker/certificates/$SSL_CERTIFICATE_KEYFILE" >> $BOINC_APACHE_CONFIG
    fi
    echo "</VirtualHost>" >> $BOINC_APACHE_CONFIG


    echo "Creating a symlink: $APACHE_CONFIG_DIR/sites-enabled/hashstationBOINC.conf"
    ln -sf $BOINC_APACHE_CONFIG $APACHE_CONFIG_DIR/sites-enabled/02-hashstationBOINC.conf
fi
echo "BOINC Apache configuration done"

# Reconfigure apache ports
echo "Configuring ports..."
echo "BOINC port: $BOINC_PORT"
echo "Hashstation backend port: $BACKEND_PORT"
echo "Hashstation frontend port: $FRONTEND_PORT"

echo "Listen $BOINC_PORT" > $APACHE_CONFIG_DIR/ports.conf
cat $APACHE_CONFIG_DIR/ports.conf | grep "Listen $BACKEND_PORT" >/dev/null
if [[ $? != 0 ]]; then
    echo "Listen $BACKEND_PORT" >> $APACHE_CONFIG_DIR/ports.conf
fi
    cat $APACHE_CONFIG_DIR/ports.conf | grep "Listen $FRONTEND_PORT" >/dev/null
if [[ $? != 0 ]]; then
    echo "Listen $FRONTEND_PORT" >> $APACHE_CONFIG_DIR/ports.conf
fi

if [ $DYNAMIC_BACKEND_URL = "y" ]; then
    sed -i "s@serverAddress.*@serverAddress = \"$HASHSTATION_PROTO://\"+window.location.hostname+\":${BACKEND_PORT}\"@g" /var/www/html/hashstationFE/static/configuration.js
else
    BACKEND_URL="${HASHSTATION_PROTO}://${HASHSTATION_HOST}:${BACKEND_PORT}"
    sed -i "s@serverAddress.*@serverAddress = \"$BACKEND_URL\"@g" /var/www/html/hashstationFE/static/configuration.js
fi

echo "Done"