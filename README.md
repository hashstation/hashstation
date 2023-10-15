# ..
..

# Changelog
See the [Changelog](CHANGELOG.md) for details.

**The installation has never been easier:** Hashstation is now available as a pre-built Docker image on Docker Hub. See [Docker install README](INSTALL-Docker.md) for details.

# Hashstation

Hashstation is a [BOINC](https://boinc.berkeley.edu)-based [hashcat](https://hashcat.net/)-powered distributed password cracking system.
It recovers passwords that protect various encrypted media like documents, archives, or disk volumes, breaks
various application passwords, as well as raw or salted cryptographic hashes.
You can use our system to crack more than [350 different algorithms](https://hashcat.net/hashcat/#features-algos) supported by hashcat.
Hashstation allows you to distribute your tasks over dozens of different GPU-equipped computing nodes with Linux, Windows OS or macOS.
For controlling your cracking network and management of jobs, you can use our friendly
[Web](https://nesfit.github.io/hashstation/#/) interface, or communicate directly with our REST API.

Any issue or feature request? Join Hashstation community [on Discord](https://discord.gg/QsQhUbZrqK).

**Table of Contents**
* [Installation](#inst)
* [Hashstation user guide](https://nesfit.github.io/hashstation/#/)
* [Operating the server](#oper)
* [How to connect new hosts](https://nesfit.github.io/hashstation/#/guide/hosts)
* [Advanced: Host-specific configuration](#hostconf)
* [Debugging](#debugging)

<a name="clone"></a>
### Clone Hashstation repository with submodules
Run ``git clone --recursive https://github.com/davidbolvansky/hashstation``


<a name="inst"></a>
## Installation
Since Hashstation 2.4.0, [Docker](INSTALL-Docker.md) is the recommended method
for deployment. Everything is shipped in a single container. It also has a native
support for SSL/TLS which is now super-easy to configure.
Nevertheless, you can still use the installer or manual install if you want.

See instructions the desired type of deployment:
* [Installation using a custom Docker build](INSTALL-Docker.md) (make your own build of Hashstation)
* [Installation using Installer](INSTALL-Installer.md) (working alternative)
* [Manual installation](INSTALL-Manual.md) (for advanced users/modders)


<a name="oper"></a>
## Operating the server

### Hashstation
The **default** login credentials to the Hashstation are:
* login: ``hashstation``
* password: ``HASHSTATION``

In the Docker-based version, those defaults can be changed by modifying the
`HASHSTATION_LOGIN` and `HASHSTATION_PW` variables in your `.env` file.

To learn how to use Hashstation, check our [Hashstation user guide](https://nesfit.github.io/hashstation/#/).

### Server daemons
Hashstation provides an init script can automatically starts all the server
daemons, and can be also used for stopping or restarting them.
In the Docker-based version, the script is automatically set up inside the
Hashstation server container. With installer-based deployement, you will be asked
whether you wish to add Hashstation as a system service.

To control the server daemons, inside your Docker container
(or on the machine where you installed Hashstation), type:
```
service hashstation [start|stop|status|restart]
```

For non-Docker systemd-based deployments, you can also use:
```
systemctl [start|stop|status|restart] hashstation
```

It is also possible to operate the server daemons manually
by logging as the BOINC user (e.g. `boincadm`), descending into the
project directory (e.g. `/home/boincadm/project/hashstation`) and running
one of the following:
* `./bin/start`
* `./bin/stop`
* `./bin/status`
* `./bin/restart`

<a name="hostconf"></a>
### Advanced: Host specific configuration
Sometimes you need to configure specific behavior for individual hosts.

Hashstation allows you to define additional **host-specific hashcat arguments**.
This gives you options to select what GPUs to use for cracking,
configure the workload profile for fine-tuning of the performance, etc.
Simply create a file `/etc/hashstation.conf` (Linux/macOS hosts) or
`C:\ProgramData\BOINC\hashstation.conf` (Windows hosts).
If the file exists and is readable for the BOINC client user, the
**Agent** subsystem will append the content of 'extra_hashcat_args' to
**hashcat's arguments**.

#### Example
```
$ echo 'extra_hashcat_args=-w 4 -d 1,2 --force' > /etc/hashstation.conf
```
Hashcat will use OpenCL devices 1 and 2. The workload profile will be set to level 4 (Nightmare).
The cracking session will be forced and all warnings ignored.

----

Hashstation also allows you to use **prestored dictionaries on hosts**, so they do not have to be transfered
from server to hosts.

#### Example
```
$ echo 'prestored_dicts_path=/etc/hashstation' > /etc/hashstation.conf
```

Hashstation client (Agent) will search for prestored dictionaries in /etc/hashstation. So for example,
if you use rockyou.txt for this job, copy rockyou.txt to /etc/hashstation. Please also ensure that
/etc/hashstation is readable for BOINC. Run:

```
$ sudo chmod -R 755 /etc/hashstation
```



<a name="debugging"></a>
### Debugging
For debugging **Docker-based** Hashstation deployments, see [this page](INSTALL-Docker.md#debugging).
For deployments with **Installer** (or manual installations), see [this page](INSTALL-Installer.md#debugging).

### Changelog
Visit [CHANGELOG](CHANGELOG.md) to see changes between different versions of Hashstation

### Upgrade to newer Hashstation version
Visit [UPGRADE](UPGRADE.md) to see how to upgrade Hashstation (must be installed directly, not a docker version) to newer version.
