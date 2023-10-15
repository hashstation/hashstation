# Makefile.am patching
 * Fix `Makefile.am` with modifications you need, save as `Makefile_hashstation.am`
 * Generate patch ```diff -u Makefile.am Makefile_hashstation.am > Makefile.am.patch```
 * Apply if need be ```patch -p0 Makefile.am Makefile.am.patch```

# Update work generator 

Build new server binaries with `sudo bash ./install_hashstation.sh -s -4`

Then, as a root run:
* `/home/boincadm/projects/hashstation/bin/stop`
* `cp ./boinc/sched/work_generator /home/boincadm/projects/hashstation/bin/`
* `/home/boincadm/projects/hashstation/bin/start`

