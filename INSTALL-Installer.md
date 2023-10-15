# Deploying Hashstation server using installer

Note: Since Hashstation 2.4.0, [Docker](INSTALL-Docker.md) is the recommended way
of deployment. Consider using Docker.

This document describes how to install Hashstation server using installer.
It contains cookbooks for various popular Linux distros + general installation
instructions.

Table of Contents:
* [Step-by-step guide for Ubuntu 22.04 LTS](#instubu22)
* [Step-by-step guide for Debian 11](#instdeb11)
* [Step-by-step guide for CentOS Stream 9](#instcentos9)
* [Step-by-step guide for Ubuntu 20.04 LTS](#instubu20)
* [Step-by-step guide for Debian 9 / Ubuntu 18.04 LTS](#instdeb9)
* [Step-by-step guide for CentOS / RHEL 8](#instcentos8)
* [General installation instructions (for Other Linux distros)](#instgen)
* [Debugging your Hashstation server installation](#debugging)
* [Removing an existing installation](#removal)


<a name="instubu22"></a>
## Step-by-step: Install on Ubuntu 22.04 LTS

Open a **root** terminal, go to the directory with Hashstation sources and proceed as follows.

### Install prerequisities
```
apt install -y m4 make dh-autoreconf pkg-config git vim apache2 libapache2-mod-php mysql-server mysql-common libmysqlclient-dev zlib1g zlib1g-dev php php-xml php-mysql php-cli php-gd python-is-python3 python3 python3-mysqldb python3-pymysql python3-pip libapache2-mod-wsgi-py3 libssl-dev libcurl4-openssl-dev apache2-utils pkg-config libnotify-dev curl perl libcompress-raw-lzma-perl
```

### Setup the MySQL Database
Set-up the mySQL root user password and
create a database and user for Hashstation. For example:
```
systemctl start mysql
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password by 'YOURROOTPASSWORD';"
mysql -u root -p
mysql> create database hashstation;
mysql> CREATE USER 'hashstation'@'localhost' IDENTIFIED BY 'mypassword';
mysql> GRANT ALL ON hashstation.* TO 'hashstation'@'localhost';
mysql> FLUSH PRIVILEGES;
mysql> SET PERSIST log_bin_trust_function_creators = 1;
mysql> SET PERSIST time_zone = '+00:00';
mysql> exit
```

### Setup the Apache web server
```
a2enmod cgi       # enable mod CGI
a2enmod rewrite   # enable mod rewrite
a2enmod wsgi      # enable mod wsgi
a2enmod headers   # enable mod headers
systemctl restart apache2
```

### Setup BOINC server user
```
useradd -m -c "BOINC Administrator" boincadm  -s /bin/bash
passwd boincadm   # choose some password to login later
```

### Add Apache user to the boincadm group
```
usermod -a -G boincadm www-data
reboot
```

### Install Hashstation
```
./install_hashstation.sh
```

And proceed according to your preferences...

![Installer](img/insta.png)



<a name="instdeb11"></a>
## Step-by-step: Install on Debian 11

Open a **root** terminal, go to the directory with Hashstation sources and proceed as follows.

### Install and configure the MySQL server

Download the newest **mysql-apt-config** from https://dev.mysql.com/downloads/repo/apt/ and type:
```
apt install ./mysql-apt-config_*_all.deb
dpkg-reconfigure mysql-apt-config
```

Proceed with default settings:
* MySQL Server & Cluster: **mysql-8**
* MySQL Tools & Connectors: **Enabled**
* MySQL Preview Packages: **Disabled**

Finally, install the mySQL server:
```
apt install mysql-server
```
You will be prompted to choose the MySQL root user password

### Install other prerequisities
```
apt install -y m4 make dh-autoreconf pkg-config git vim apache2 libapache2-mod-php mysql-common libmysqlclient-dev zlib1g zlib1g-dev php php-xml php-mysql php-cli php-gd python-is-python3 python3 python3-mysqldb python3-pymysql python3-pip libapache2-mod-wsgi-py3 libssl-dev libcurl4-openssl-dev apache2-utils pkg-config libnotify-dev curl perl libcompress-raw-lzma-perl
```

### Setup the MySQL Database
Type `mysql -u root -p` and login with your MySQL root user password.
Then create a database and user for Hashstation. For example:
```
mysql> create database hashstation;
mysql> CREATE USER 'hashstation'@'localhost' IDENTIFIED BY 'mypassword';
mysql> GRANT ALL ON hashstation.* TO 'hashstation'@'localhost';
mysql> SET PERSIST log_bin_trust_function_creators = 1;
mysql> SET PERSIST time_zone = '+00:00';
mysql> exit
```

### Setup the Apache web server
```
a2enmod cgi       # enable mod CGI
a2enmod rewrite   # enable mod rewrite
a2enmod wsgi      # enable mod wsgi
systemctl restart apache2
```

### Setup BOINC server user
```
useradd -m -c "BOINC Administrator" boincadm  -s /bin/bash
passwd boincadm   # choose some password to login later
```

### Add Apache user to the boincadm group
```
usermod -a -G boincadm www-data
reboot
```

### Install Hashstation
```
./install_hashstation.sh
```


<a name="instcentos9"></a>
## Step-by-step: Install on CentOS Stream 9

Open a **root** terminal, go to the directory with Hashstation sources and proceed as follows.

### SELINUX
The following tutorial assumes **SELINUX** in permissive or disabled mode.
If you wish to use SELINUX enforcing mode on Hashstation server machine, you have to configure policies to allow apache access to project directory and others.
```
sed -i s/^SELINUX=.*$/SELINUX=disabled/ /etc/selinux/config
reboot
```

### Install prerequisities
Prepare the CodeReady Linux Builder:
```
dnf install -y dnf-plugins-core
dnf config-manager --set-enabled crb
```

Then install the following:
```
dnf install -y m4 gcc gcc-c++ glibc-static libstdc++-static make libtool autoconf automake git vim httpd php php-xml php-mysqlnd python3-devel python3 python3-pip python3-mod_wsgi  redhat-rpm-config python3-setuptools mariadb-server mariadb-devel pkgconfig libnotify zlib libcurl-devel openssl-libs openssl-devel initscripts
```

Install mySQL client for Python 3:
```
pip3 install mysqlclient
```

### Configure exceptions for firewalld:
```
firewall-cmd --zone=public --add-service=http --permanent
firewall-cmd --zone=public --add-service=https --permanent
firewall-cmd --zone=public --add-port=5000/tcp --permanent
firewall-cmd --reload
```

### Configure services
```
systemctl start httpd.service
systemctl enable httpd.service
systemctl start mariadb
mysql_secure_installation # Set MariaDB root password
systemctl enable mariadb.service
```

### Setup user and Database
```
useradd -m -c "BOINC Administrator" boincadm  -s /bin/bash
mysql -u root -p
mysql> create database hashstation;
mysql> GRANT ALL PRIVILEGES ON hashstation.* TO 'hashstation'@'localhost' IDENTIFIED BY 'mypassword';
```

### Add Apache user to the boincadm group
```
usermod -a -G boincadm apache
reboot
```

### Install Hashstation
```
./install_hashstation.sh
```

### Enable Hashstation service
If you installed Hashstation as a system service you may enable it:
```
/usr/lib/systemd/systemd-sysv-install enable hashstation
```
This will make Hashstation start automatically on future boots.


<a name="instubu20"></a>
## Step-by-step: Install on Ubuntu 20.04 LTS

Open a **root** terminal, go to the directory with Hashstation sources and proceed as follows.

### Install prerequisities
```
apt-get install m4 make dh-autoreconf pkg-config git vim apache2 libapache2-mod-php mysql-server mysql-common libmysqlclient-dev zlibc zlib1g zlib1g-dev php php-xml php-mysql php-cli php-gd python-is-python3 python3 python3-mysqldb python3-pymysql python3-pip libapache2-mod-wsgi-py3 libssl-dev libcurl4-openssl-dev apache2-utils pkg-config libnotify-dev curl perl libcompress-raw-lzma-perl

mysql_secure_installation # Set MySQL root password

a2enmod cgi       # enable mod CGI
a2enmod rewrite   # enable mod rewrite
a2enmod wsgi      # enable mod wsgi
systemctl restart apache2
```
### Setup user and Database
```
useradd -m -c "BOINC Administrator" boincadm  -s /bin/bash
mysql -u root -p
mysql> create database hashstation;
mysql> CREATE USER 'hashstation'@'localhost' IDENTIFIED BY 'mypassword';
mysql> GRANT ALL ON hashstation.* TO 'hashstation'@'localhost';
mysql> SET PERSIST log_bin_trust_function_creators = 1;
mysql> SET PERSIST time_zone = '+00:00';
mysql> exit
```

### Add Apache user to the boincadm group
```
usermod -a -G boincadm www-data
reboot
```

### Install Hashstation
```
./install_hashstation.sh
```


<a name="instdeb9"></a>
## Step-by-step: Install on Debian 9 / Ubuntu 18.04 LTS

Open a **root** terminal, go to the directory with Hashstation sources and proceed as follows.

### Install prerequisities
```
apt-get install m4 make dh-autoreconf pkg-config git vim apache2 libapache2-mod-php mysql-server mysql-common libmysqlclient-dev zlibc zlib1g zlib1g-dev php php-xml php-mysql php-cli php-gd python python python3 python-mysqldb python3-pymysql python3-pip libapache2-mod-wsgi-py3 libssl-dev libcurl4-openssl-dev apache2-utils libboost1.62-all-dev pkg-config libnotify-dev curl perl libcompress-raw-lzma-perl

mysql_secure_installation # Set MySQL root password

a2enmod cgi       # enable mod CGI
a2enmod rewrite   # enable mod rewrite
a2enmod wsgi      # enable mod wsgi
systemctl restart apache2
```
### Setup user and Database
```
useradd -m -c "BOINC Administrator" boincadm  -s /bin/bash
mysql -u root -p
mysql> create database hashstation;
mysql> GRANT ALL PRIVILEGES ON hashstation.* TO 'hashstation'@'localhost' IDENTIFIED BY 'mypassword';
```

### Add Apache user to the boincadm group
```
usermod -a -G boincadm www-data
reboot
```

### Install Hashstation
```
./install_hashstation.sh
```


<a name="instcentos8"></a>
## Step-by-step: Install on CentOS/RHEL 8

Open a **root** terminal, go to the directory with Hashstation sources and proceed as follows.

### SELINUX
The following tutorial assumes **SELINUX** in permissive or disabled mode.
If you wish to use SELINUX enforcing mode on Hashstation server machine, you have to configure policies to allow apache access to project directory and others.
```
sed -i s/^SELINUX=.*$/SELINUX=disabled/ /etc/selinux/config
reboot
```

### Install prerequisities
```
yum install -y dnf-plugins-core
```

On CentOS 8, type:
```
yum config-manager --set-enabled powertools
```

On RHEL 8, type:
```
subscription-manager repos --enable codeready-builder-for-rhel-8-x86_64-rpms
```

Then:
```
yum install -y m4 gcc gcc-c++ glibc-static libstdc++-static make libtool autoconf automake git vim httpd php php-xml php-mysqlnd python3-devel python3 python3-pip python3-mod_wsgi  redhat-rpm-config python3-setuptools mariadb-server mariadb-devel pkgconfig libnotify zlib libcurl-devel openssl-libs openssl-devel

pip3 install mysqlclient

alternatives --set python /usr/bin/python3
```

### Configure exceptions for firewalld:
```
firewall-cmd --zone=public --add-service=http --permanent
firewall-cmd --zone=public --add-service=https --permanent
firewall-cmd --zone=public --add-port=5000/tcp --permanent
firewall-cmd --reload
```

### Configure services
```
systemctl start httpd.service
systemctl enable httpd.service
systemctl start mariadb
mysql_secure_installation # Set MariaDB root password
systemctl enable mariadb.service
```

### Setup user and Database
```
useradd -m -c "BOINC Administrator" boincadm  -s /bin/bash
mysql -u root -p
mysql> create database hashstation;
mysql> GRANT ALL PRIVILEGES ON hashstation.* TO 'hashstation'@'localhost' IDENTIFIED BY 'mypassword';
```

### Add Apache user to the boincadm group
```
usermod -a -G boincadm apache
reboot
```

### Install Hashstation
```
./install_hashstation.sh
```

### Enable Hashstation service
If you installed Hashstation as a system service you may enable it:
```
/usr/lib/systemd/systemd-sysv-install enable hashstation
```
This will make Hashstation start automatically on future boots.


<a name="instgen"></a>
## General installation instructions (Linux-wide)

### Software prerequisities
* make (3.79+)
* m4 (1.4+)
* libtool (1.5+)
* autoconf (2.58+)
* automake (1.8+)
* GCC (6.3.0+)
* pkg-config (0.15+)
* Perl + libcompress with LZMA
* Python 3
* pip for Python 3
* MySQL (4.0.9+) or MariaDB (10.0+)
* libnotify-dev
* Apache with the following modules:
  * PHP (5+) with XML and MySQL modules
  * CGI
  * WSGI
  * rewrite
* PHP5 with cli support and the GD and MySQL modules
* OpenSSL (0.98+)
* Curl
* Gtest (only if you intend to build the tests in `server/src/tests`)

### Installation
Create a user for running BOINC server
```
useradd -m -c "BOINC Administrator" boincadm  -s /bin/bash
```
Create a MySQL database and user account for Hashstation
```
mysql -u root -p
mysql> create database hashstation;
mysql> GRANT ALL PRIVILEGES ON hashstation.* TO 'hashstation'@'localhost' IDENTIFIED BY 'mypassword';
```
As root, run the Hashstation installer:
```
./install_hashstation.sh
```


<a name="removal"></a>
## Removing an existing installation

As root, use the Hashstation installer:
```
./install_hashstation.sh
```
In the main installer menu, select **Remove existing installation**,
after that, select `y` for the parts of the Hashstation server
that you want to remove.


<a name="debugging"></a>
## Debugging
Many of reported issues were caused by improper network configuration.
To debug connectivity issues, check the configuration of your Apache
web server. Look if the server is listening on the correct ports:
5000 for WebAdmin backend, and 80 for WebAdmin frontend and BOINC scheduler
(for non-HTTPS deployments). You can also use tools like
`netstat` to check which services are listening on what ports.

For debugging WebAdmin, you should
first check if the backend is running, e.g.: `http://localhost:5000`.
You can also check the frontend configuration file `http://localhost/static/configuration.js`
if it is connecting to the proper address. By default, backend's hostname is taken
from you browser URL hostname. If the backend is malfunctioning, you can
check your Apache error log, e.g. `/var/log/apache2/error.log` to see
what's wrong.

For debugging BOINC server, check if the hostname, protocol and ports are set properly
on both server and client machines. With default settings, BOINC clients should
connect to the project server at `http://127.0.0.1/hashstation`. In case of connectivity issues,
check that the hostname/IP are correct. Also, see if all daemons are running
on the WebAdmin: System - **Server monitor** page.
For debugging your daemons (Generator, Assimilator, etc.), you can check
logs in your BOINC project directory, e.g. `/home/boincadm/projects/hashstation/logs`
to see what's wrong.
Configuration of the BOINC server is located in the `config.xml` file in your
BOINC project directory, e.g. `/home/boincadm/projects/hashstation/config.xml`.
Here, you can configure many parameters like the DB username and password, or what
daemons and tasks should run when Hashstation is started.
Nevertheless, changing URL base in parameters like `master_url` is not enough to convince
your hosts to use a different link. Changing the hostname/IP URL on-the-fly is not
a simple task, as the URLs are hardcoded inside the BOINC database
tables (e.g. app, versions).
