#!/bin/bash

# Make assets directory tree
# This file is part of Fitcrack installer
# Author: Radek Hranicky (ihranicky@fit.vutbr.cz)

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
  #cp -R assets/pcfg /usr/share/assets/
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
