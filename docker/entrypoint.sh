#!/bin/bash

# Start the MySQL service
service mysql start

# Start the Fitcrack service
service fitcrack start

# Start Apache in the foreground
apache2ctl -D FOREGROUND