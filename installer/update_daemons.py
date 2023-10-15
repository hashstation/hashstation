import os
import subprocess
from getpass import getpass

def update_daemons():
    print(" " * 58)
    print("=" * 12 + " Hashstation server daemons update " + "=" * 12)
    print(" " * 58)

    print("You chose to update Hashstation server daemons.")
    print("We recommend to first stop the ongoing cracking jobs.")
    print(" ")
    print("This process will:")
    print(" - Rebuild and update the following server daemons:")
    print("   * Generator")
    print("   * Assimilator")
    print("   * Validator")
    print("   * Trickler")
    print(" ")
    print("The database and project settings will be untouched.")
    print("However, the project will have to be restarted.")

    build_server = input("Do you wish to continue? [y/N] (default: y): ") or "y"

    if build_server.lower() == "y":
        boinc_project_dir = os.environ.get('BOINC_PROJECT_DIR')
        boinc_user = os.environ.get('BOINC_USER')

        if not boinc_project_dir or not boinc_user:
            print("Please set the BOINC_PROJECT_DIR and BOINC_USER environment variables.")
            return

        print("Stopping Hashstation server...")
        subprocess.run(f"sudo -u {boinc_user} ./bin/stop", shell=True, cwd=boinc_project_dir)

        print("Rebuilding Hashstation server...")
        subprocess.run("./installer/build_server.sh", shell=True)

        print("Reinstalling Hashstation daemons...")
        subprocess.run("./installer/install_daemons.py", shell=True)

        print("Starting Hashstation server...")
        subprocess.run(f"sudo -u {boinc_user} ./bin/start", shell=True, cwd=boinc_project_dir)

        print("Server daemons updated and started.")

    print("All done.")

if __name__ == "__main__":
    update_daemons()
