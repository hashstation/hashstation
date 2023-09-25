import os
import shutil
import pwd
import grp

def patch_script(file_path, db_host, db_name, db_user, db_pw):
    with open(file_path, 'r') as f:
        content = f.read()

    content = content.replace("DB_HOST = '.*", f"DB_HOST = '{db_host}'")
    content = content.replace("DB_NAME = '.*", f"DB_NAME = '{db_name}'")
    content = content.replace("DB_USER = '.*", f"DB_USER = '{db_user}'")
    content = content.replace("DB_PW = '.*", f"DB_PW = '{db_pw}'")

    with open(file_path, 'w') as f:
        f.write(content)

def install_daemons():
    boinc_project_dir = os.environ.get('BOINC_PROJECT_DIR')
    boinc_home = os.environ.get('BOINC_HOME')
    boinc_user = os.environ.get('BOINC_USER')
    boinc_group = os.environ.get('BOINC_GROUP')
    db_host = os.environ.get('DB_HOST')
    db_name = os.environ.get('DB_NAME')
    db_user = os.environ.get('DB_USER')
    db_pw = os.environ.get('DB_PW')

    # UID and GID for chown
    uid = pwd.getpwnam(boinc_user).pw_uid
    gid = grp.getgrnam(boinc_group).gr_gid

    # Copy server daemon binaries except for 'pcfg-manager'
    boinc_deamon_binaries = ['work_generator', 'assimilator', 'bitwise_validator', 'trickler']
    for binary in boinc_deamon_binaries:
        shutil.copy2(os.path.join('boinc/sched', binary), os.path.join(boinc_project_dir, 'bin', binary))

    # Special handling for 'pcfg-manager'
    shutil.copy2(os.path.join('backend/pcfg_manager', 'pcfg-manager'), os.path.join(boinc_project_dir, 'bin', 'pcfg-manager'))

    # Patch pcfg monitor
    pcfg_monitor = os.path.join(boinc_project_dir, 'bin', 'pcfg_monitor.py')
    patch_script(pcfg_monitor, db_host, db_name, db_user, db_pw)

    # Copy Fitcrack communication templates
    src_template_folder = 'server/templates/'
    dest_template_folder = os.path.join(boinc_project_dir, 'templates')
    shutil.copytree(src_template_folder, dest_template_folder, dirs_exist_ok = True)

    # Set permissions for BOINC user and BOINC group (recursive)
    project_dir = os.path.join(boinc_home, 'projects')
    for dirpath, dirnames, filenames in os.walk(project_dir):
        os.chown(dirpath, uid, gid)
        for filename in filenames:
            os.chown(os.path.join(dirpath, filename), uid, gid)

if __name__ == '__main__':
    install_daemons()
