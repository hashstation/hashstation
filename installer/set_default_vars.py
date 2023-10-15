import os

def set_default_vars():
    installer_root = os.getcwd()

    os.environ['INSTALLER_ROOT'] = installer_root
    os.environ['BOINC_USER'] = os.getenv('BOINC_USER', 'boincadm')
    os.environ['BOINC_GROUP'] = os.getenv('BOINC_GROUP', os.environ['BOINC_USER'])
    os.environ['BOINC_HOME'] = os.getenv('BOINC_HOME', f'/home/{os.environ["BOINC_USER"]}')
    os.environ['BOINC_PROJECT'] = os.getenv('BOINC_PROJECT', 'hashstation')
    os.environ['BOINC_PROJECT_DIR'] = os.getenv('BOINC_PROJECT_DIR', f"{os.environ['BOINC_HOME']}/projects/{os.environ['BOINC_PROJECT']}")
    os.environ['PROJECT_HTTPD_CONF'] = os.getenv('PROJECT_HTTPD_CONF', f"{os.environ['BOINC_PROJECT_DIR']}/{os.environ['BOINC_PROJECT']}.httpd.conf")
    os.environ['BOINC_URL'] = os.getenv('BOINC_URL', 'http://127.0.0.1').rstrip('/')
    os.environ['APACHE_USER'] = os.getenv('APACHE_USER', os.getenv('DEFAULT_APACHE_USER'))
    os.environ['APACHE_GROUP'] = os.getenv('APACHE_GROUP', os.getenv('DEFAULT_APACHE_GROUP', os.environ['APACHE_USER']))
    os.environ['APACHE_CONFIG_DIR'] = os.getenv('APACHE_CONFIG_DIR', os.getenv('DEFAULT_APACHE_CONFIG_DIR'))
    os.environ['APACHE_CONFIG_FILE'] = os.getenv('APACHE_CONFIG_FILE', os.getenv('DEFAULT_APACHE_CONFIG_FILE'))
    os.environ['APACHE_SERVICE'] = os.getenv('APACHE_SERVICE', os.getenv('DEFAULT_APACHE_SERVICE'))
    os.environ['APACHE_DOCUMENT_ROOT'] = os.getenv('APACHE_DOCUMENT_ROOT', os.getenv('DEFAULT_APACHE_DOCUMENT_ROOT'))
    os.environ['DB_HOST'] = os.getenv('DB_HOST', 'localhost')
    os.environ['DB_NAME'] = os.getenv('DB_NAME', 'hashstation')
    os.environ['DB_USER'] = os.getenv('DB_USER', 'hashstation')
    os.environ['DB_PW'] = os.getenv('DB_PW', 'mypassword')
