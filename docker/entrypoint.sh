#!/bin/bash

# Start the MySQL service
service mysql start

# Start the Hashstation service
service hashstation start

# Start Apache in the foreground
apache2ctl -D FOREGROUND