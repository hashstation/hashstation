import os
import shutil
import subprocess

HASHSTATION_BASE_DIR = os.environ.get('BOINC_PROJECT_DIR', '/home/boincadm/projects/hashstation')
HASHSTATION_APPS_DIR = HASHSTATION_BASE_DIR + "/apps/hashstation/"


def change_agent_ver(filename, old, new):
    with open(filename, 'r') as file:
        filedata = file.read()

    filedata = filedata.replace("agent" + str(old), "agent" + str(new))

    with open(filename, 'w') as file:
        file.write(filedata)


if os.geteuid() != 0:
    print("Run as root.")
    exit(1)

files = os.listdir(HASHSTATION_APPS_DIR)
if len(files) == 0:
    print("No base binaries")
    exit(1)

last_ver = 1
try:
    last_ver = int(sorted(files, key=int)[-1])
except:
    print("Bad last version")
    exit(1)

print("Old version: %d, new version: %d" % (last_ver, last_ver + 1))

shutil.copytree(HASHSTATION_APPS_DIR + str(last_ver),
                HASHSTATION_APPS_DIR + str(last_ver + 1))

print("Created dir:", HASHSTATION_APPS_DIR + str(last_ver + 1))

change_agent_ver(HASHSTATION_APPS_DIR + str(last_ver + 1) +
                  "/windows_x86_64/version.xml", last_ver, last_ver + 1)
change_agent_ver(HASHSTATION_APPS_DIR + str(last_ver + 1) +
                  "/x86_64-pc-linux-gnu/version.xml", last_ver, last_ver + 1)

subprocess.run(["make", "clean"], stdout=subprocess.DEVNULL)
print("Building new linux binary")
subprocess.run(["make", "linux", "-j4"], stdout=subprocess.DEVNULL)
shutil.copy("./bin/agent.bin", HASHSTATION_APPS_DIR + str(last_ver + 1) +
            "/x86_64-pc-linux-gnu/agent" + str(last_ver + 1) + ".bin")
os.remove(HASHSTATION_APPS_DIR + str(last_ver + 1) +
          "/x86_64-pc-linux-gnu/agent" + str(last_ver) + ".bin")

subprocess.run(["make", "clean"], stdout=subprocess.DEVNULL)
print("Building new windows binary")
subprocess.run(["make", "windows", "-j4"], stdout=subprocess.DEVNULL)
shutil.copy("./bin/agent.exe", HASHSTATION_APPS_DIR + str(last_ver + 1) +
            "/windows_x86_64/agent" + str(last_ver + 1) + ".exe")
os.remove(HASHSTATION_APPS_DIR + str(last_ver + 1) +
          "/windows_x86_64/agent" + str(last_ver) + ".exe")

os.chdir(HASHSTATION_BASE_DIR)
subprocess.run(["perl", "./bin/update_versions", "--noconfirm"])

print("Binaries were successfully updated!")
